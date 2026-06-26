// Bretda 3D configurator scene controller.
// Vanilla Three.js r162 — ported from the prototype arquiteto.html.
// Framework-agnostic so React only has to mount a canvas and call methods.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { TABLE_MODELS, type TableModel } from "@/lib/configurador/tables";

type MaterialClass = "tecido" | "madeira" | "metal" | "outro";

export interface SceneCallbacks {
  onModelChange?: (label: string, category: TableModel["category"]) => void;
  onLoadingChange?: (loading: boolean, text?: string) => void;
  onToast?: (msg: string) => void;
  onMaterialSelected?: (name: string | null, cls: MaterialClass | null, applied: string) => void;
}

const DRACO_DECODER =
  "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/libs/draco/";
const HDRI_URL =
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/paul_lobe_haus_1k.hdr";
const STORAGE_KEY = "bretda_mat_classifications";

export class ConfiguradorScene {
  private readonly canvas: HTMLCanvasElement;
  private readonly container: HTMLElement;
  private readonly callbacks: SceneCallbacks;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private orbitControls!: OrbitControls;
  private transformControls!: TransformControls;
  private gridHelper!: THREE.GridHelper;

  private tableGroup: THREE.Group | null = null;
  private currentModel = "opal";
  private moveMode = false;
  private customizeMode = false;
  private gridVisible = true;

  private envTexture: THREE.Texture | null = null;
  private testEnvActive = false;
  private envLoading = false;

  private selectedMesh: THREE.Mesh | null = null;
  private selectedMaterial: THREE.MeshStandardMaterial | null = null;
  private originalEmissive: THREE.Color | null = null;

  private materialClassifications: Record<string, Record<string, MaterialClass>> = {};
  private readonly textureCache = new Map<string, THREE.Texture>();
  private readonly modelCache = new Map<string, THREE.Group>();

  private readonly gltfLoader: GLTFLoader;
  private readonly dracoLoader: DRACOLoader;
  private readonly textureLoader = new THREE.TextureLoader();

  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private pointerDownPos: { x: number; y: number } | null = null;

  private rafId = 0;
  private readonly resizeObserver: ResizeObserver;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement, callbacks: SceneCallbacks = {}) {
    this.canvas = canvas;
    const parent = canvas.parentElement;
    if (!parent) throw new Error("ConfiguradorScene: canvas must have a parent element");
    this.container = parent;
    this.callbacks = callbacks;

    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(DRACO_DECODER);
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.loadClassifications();
    this.initScene();
    this.setupInteraction();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);
    this.animate();
  }

  // ---------- INIT ----------
  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x3e3f38);
    this.scene.fog = new THREE.Fog(0x3e3f38, 15, 30);

    const w = this.container.clientWidth || 800;
    const h = this.container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(3, 2.5, 3);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0x404040, 0x111111, 0.4);
    this.scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(5, 8, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 2048;
    dir.shadow.mapSize.height = 2048;
    dir.shadow.camera.near = 0.5;
    dir.shadow.camera.far = 25;
    dir.shadow.camera.left = -5;
    dir.shadow.camera.right = 5;
    dir.shadow.camera.top = 5;
    dir.shadow.camera.bottom = -5;
    dir.shadow.bias = -0.0001;
    this.scene.add(dir);

    const fill = new THREE.DirectionalLight(0x8888aa, 0.3);
    fill.position.set(-3, 4, -3);
    this.scene.add(fill);

    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = "groundPlane";
    this.scene.add(ground);

    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x4a4b44,
      roughness: 0.9,
      metalness: 0,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.002;
    floor.receiveShadow = true;
    floor.name = "visibleFloor";
    this.scene.add(floor);

    this.gridHelper = new THREE.GridHelper(10, 20, 0x333333, 0x222222);
    this.gridHelper.position.y = 0.001;
    this.scene.add(this.gridHelper);

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.minDistance = 1.5;
    this.orbitControls.maxDistance = 15;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.orbitControls.target.set(0, 0.5, 0);

    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.setMode("translate");
    this.transformControls.showY = false;
    this.transformControls.setSize(0.8);
    const tcHelper = (this.transformControls as unknown as { getHelper?: () => THREE.Object3D }).getHelper?.() ?? (this.transformControls as unknown as THREE.Object3D);
    this.scene.add(tcHelper);

    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.orbitControls.enabled = !event.value;
    });

    this.buildTable("opal");
  }

  private animate = (): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private handleResize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  // ---------- MODEL LOADING ----------
  private disposeGroup(group: THREE.Group): void {
    group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry?.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      }
    });
  }

  buildTable(modelKey: string): void {
    const model = TABLE_MODELS[modelKey];
    if (!model) return;

    if (this.tableGroup) {
      this.transformControls.detach();
      this.disposeGroup(this.tableGroup);
      this.scene.remove(this.tableGroup);
      this.tableGroup = null;
    }

    this.callbacks.onLoadingChange?.(true, `Carregando ${model.label}...`);

    const setup = (sceneObj: THREE.Group): void => {
      this.tableGroup = sceneObj;
      this.tableGroup.name = "bretdaTable";
      this.tableGroup.rotation.x = -Math.PI / 2; // SketchUp Z-up -> Three Y-up

      this.tableGroup.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      this.tableGroup.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(this.tableGroup);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.0 / maxDim;
      this.tableGroup.scale.setScalar(scale);
      this.tableGroup.updateMatrixWorld(true);

      box.setFromObject(this.tableGroup);
      box.getCenter(center);
      this.tableGroup.position.sub(center);
      this.tableGroup.position.y = 0;

      this.scene.add(this.tableGroup);
      this.currentModel = modelKey;

      if (this.moveMode) this.transformControls.attach(this.tableGroup);

      const tableBox = new THREE.Box3().setFromObject(this.tableGroup);
      const tableSize = new THREE.Vector3();
      const tableCenter = new THREE.Vector3();
      tableBox.getSize(tableSize);
      tableBox.getCenter(tableCenter);
      const maxTableDim = Math.max(tableSize.x, tableSize.y, tableSize.z);
      const camDist = maxTableDim * 2.2;
      this.camera.position.set(camDist * 0.7, camDist * 0.5, camDist * 0.7);
      this.orbitControls.target.copy(tableCenter);
      this.orbitControls.update();

      this.callbacks.onLoadingChange?.(false);
      this.callbacks.onModelChange?.(model.label, model.category);
    };

    const cached = this.modelCache.get(modelKey);
    if (cached) {
      setup(cached.clone(true) as THREE.Group);
      return;
    }

    this.gltfLoader.load(
      model.glb,
      (gltf) => {
        this.modelCache.set(modelKey, gltf.scene.clone(true) as THREE.Group);
        setup(gltf.scene as THREE.Group);
      },
      (progress) => {
        if (progress.total > 0) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          this.callbacks.onLoadingChange?.(true, `Carregando ${model.label}... ${pct}%`);
        }
      },
      (error) => {
        this.callbacks.onLoadingChange?.(false);
        this.callbacks.onToast?.(`Erro ao carregar modelo ${model.label}`);
        console.error("GLB load error:", error);
      }
    );
  }

  // ---------- CLASSIFICATIONS (localStorage) ----------
  private loadClassifications(): void {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) this.materialClassifications = JSON.parse(raw);
    } catch {
      this.materialClassifications = {};
    }
  }

  private saveClassifications(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.materialClassifications));
    } catch {
      /* quota — ignore */
    }
  }

  private getClassification(mat: THREE.Material): MaterialClass | null {
    const modelCls = this.materialClassifications[this.currentModel];
    return modelCls?.[mat.uuid] ?? null;
  }

  private setMatClassification(mat: THREE.Material, cls: MaterialClass): void {
    if (!this.materialClassifications[this.currentModel]) {
      this.materialClassifications[this.currentModel] = {};
    }
    this.materialClassifications[this.currentModel][mat.uuid] = cls;
    this.saveClassifications();
  }

  private getMaterialsByClass(cls: MaterialClass): THREE.MeshStandardMaterial[] {
    const mats: THREE.MeshStandardMaterial[] = [];
    if (!this.tableGroup) return mats;
    const modelCls = this.materialClassifications[this.currentModel] ?? {};
    this.tableGroup.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (modelCls[m.uuid] === cls) mats.push(m);
      }
    });
    return mats;
  }

  // ---------- TEXTURE APPLICATION ----------
  private applyTexture(
    material: THREE.MeshStandardMaterial,
    imagePath: string,
    repeat: number,
    fallbackColor?: number
  ): void {
    const cached = this.textureCache.get(imagePath);
    if (cached) {
      const tex = cached.clone();
      tex.needsUpdate = true;
      material.map = tex;
      material.color.setHex(0xffffff);
      material.needsUpdate = true;
      return;
    }

    this.textureLoader.load(
      imagePath,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeat, repeat);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        this.textureCache.set(imagePath, texture);
        material.map = texture;
        material.color.setHex(0xffffff);
        material.needsUpdate = true;
      },
      undefined,
      () => {
        if (fallbackColor !== undefined) {
          material.color.setHex(fallbackColor);
          material.needsUpdate = true;
        }
        console.warn("Textura nao carregou:", imagePath);
      }
    );
  }

  applyFabric(texture: string, fallbackColor: number, label: string): void {
    if (!this.tableGroup) return;
    if (this.customizeMode && this.selectedMaterial) {
      this.applyTexture(this.selectedMaterial, texture, 4, fallbackColor);
      this.setMatClassification(this.selectedMaterial, "tecido");
      this.emitSelection();
      this.callbacks.onToast?.(`${label} aplicado no material selecionado`);
      return;
    }
    const mats = this.getMaterialsByClass("tecido");
    if (mats.length > 0) {
      mats.forEach((m) => this.applyTexture(m, texture, 4, fallbackColor));
      this.callbacks.onToast?.(`${label} aplicado em ${mats.length} superficie(s) de tecido`);
    } else {
      this.callbacks.onToast?.("Use Personalizar para selecionar a regiao do tecido");
    }
  }

  applyWood(texture: string, fallbackColor: number, label: string): void {
    if (!this.tableGroup) return;
    if (this.customizeMode && this.selectedMaterial) {
      this.applyTexture(this.selectedMaterial, texture, 2, fallbackColor);
      this.setMatClassification(this.selectedMaterial, "madeira");
      this.emitSelection();
      this.callbacks.onToast?.(`${label} aplicado no material selecionado`);
      return;
    }
    const mats = this.getMaterialsByClass("madeira");
    if (mats.length > 0) {
      mats.forEach((m) => this.applyTexture(m, texture, 2, fallbackColor));
      this.callbacks.onToast?.(`${label} aplicado em ${mats.length} superficie(s) de madeira`);
    } else {
      this.callbacks.onToast?.("Use Personalizar para selecionar a regiao da madeira");
    }
  }

  applyMetal(texture: string, label: string): void {
    if (!this.tableGroup) return;
    if (this.customizeMode && this.selectedMaterial) {
      this.applyTexture(this.selectedMaterial, texture, 2);
      this.selectedMaterial.metalness = 0.6;
      this.selectedMaterial.roughness = 0.3;
      this.selectedMaterial.needsUpdate = true;
      this.setMatClassification(this.selectedMaterial, "metal");
      this.emitSelection();
      this.callbacks.onToast?.(`${label} aplicado no material selecionado`);
      return;
    }
    const mats = this.getMaterialsByClass("metal");
    if (mats.length > 0) {
      mats.forEach((m) => {
        this.applyTexture(m, texture, 2);
        m.metalness = 0.6;
        m.roughness = 0.3;
        m.needsUpdate = true;
      });
      this.callbacks.onToast?.(`${label} aplicado em ${mats.length} superficie(s) de metal`);
    } else {
      this.callbacks.onToast?.("Use Personalizar para selecionar a regiao de metal");
    }
  }

  // ---------- SELECTION (raycast) ----------
  private setupInteraction(): void {
    const dom = this.renderer.domElement;
    dom.addEventListener("pointerdown", (e) => {
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });
    dom.addEventListener("pointerup", (e) => {
      const dp = this.pointerDownPos;
      if (!dp) return;
      if (Math.abs(e.clientX - dp.x) > 5 || Math.abs(e.clientY - dp.y) > 5) return;

      const rect = dom.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);

      if (this.customizeMode && this.tableGroup) {
        const meshes: THREE.Mesh[] = [];
        this.tableGroup.traverse((c) => {
          const m = c as THREE.Mesh;
          if (m.isMesh) meshes.push(m);
        });
        const hits = this.raycaster.intersectObjects(meshes, false);
        if (hits.length > 0) this.selectMaterialOnMesh(hits[0].object as THREE.Mesh);
      }
    });
  }

  private deselectMaterial(): void {
    if (this.selectedMaterial && this.originalEmissive) {
      this.selectedMaterial.emissive.copy(this.originalEmissive);
      this.selectedMaterial.emissiveIntensity = 0;
      this.selectedMaterial.needsUpdate = true;
    }
    this.selectedMaterial = null;
    this.selectedMesh = null;
    this.originalEmissive = null;
  }

  private selectMaterialOnMesh(mesh: THREE.Mesh): void {
    this.deselectMaterial();
    this.selectedMesh = mesh;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    this.selectedMaterial = mat;
    if (mat.emissive) {
      this.originalEmissive = mat.emissive.clone();
      mat.emissive.setHex(0xfef7f2);
      mat.emissiveIntensity = 0.15;
      mat.needsUpdate = true;
    }
    this.emitSelection();
  }

  private emitSelection(): void {
    if (!this.selectedMaterial || !this.selectedMesh) {
      this.callbacks.onMaterialSelected?.(null, null, "Nenhum");
      return;
    }
    const name = this.selectedMaterial.name || `Material ${this.selectedMesh.name}` || "Sem nome";
    const cls = this.getClassification(this.selectedMaterial);
    const applied = this.selectedMaterial.map ? "Textura aplicada" : "Cor original";
    this.callbacks.onMaterialSelected?.(name, cls, applied);
  }

  classifySelection(cls: MaterialClass): void {
    if (!this.selectedMaterial) return;
    this.setMatClassification(this.selectedMaterial, cls);
    this.emitSelection();
    this.callbacks.onToast?.(`Material classificado como ${cls.toUpperCase()}`);
  }

  // ---------- TOOLBAR ACTIONS ----------
  resetCamera(): void {
    this.camera.position.set(3, 2.5, 3);
    this.orbitControls.target.set(0, 0.5, 0);
    this.orbitControls.update();
  }

  toggleGrid(): boolean {
    this.gridVisible = !this.gridVisible;
    this.gridHelper.visible = this.gridVisible;
    return this.gridVisible;
  }

  toggleMoveMode(): boolean {
    this.moveMode = !this.moveMode;
    if (this.moveMode) {
      if (this.customizeMode) this.toggleCustomizeMode();
      if (this.tableGroup) this.transformControls.attach(this.tableGroup);
    } else {
      this.transformControls.detach();
    }
    return this.moveMode;
  }

  toggleCustomizeMode(): boolean {
    this.customizeMode = !this.customizeMode;
    if (this.customizeMode) {
      if (this.moveMode) {
        this.moveMode = false;
        this.transformControls.detach();
      }
    } else {
      this.deselectMaterial();
      this.emitSelection();
    }
    return this.customizeMode;
  }

  toggleTestEnvironment(): void {
    if (this.envLoading) return;

    if (this.testEnvActive) {
      this.scene.background = new THREE.Color(0x3e3f38);
      this.scene.environment = null;
      this.scene.fog = new THREE.Fog(0x3e3f38, 15, 30);
      this.envTexture?.dispose();
      this.envTexture = null;
      const floor = this.scene.getObjectByName("visibleFloor");
      if (floor) floor.visible = true;
      this.gridHelper.visible = true;
      this.gridVisible = true;
      this.testEnvActive = false;
      this.callbacks.onToast?.("Ambiente removido");
      return;
    }

    this.envLoading = true;
    this.callbacks.onLoadingChange?.(true, "Carregando ambiente de teste...");
    this.envTexture?.dispose();

    const rgbe = new RGBELoader();
    rgbe.load(
      HDRI_URL,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.background = texture;
        this.scene.environment = texture;
        this.scene.fog = null;
        const floor = this.scene.getObjectByName("visibleFloor");
        if (floor) floor.visible = false;
        this.gridHelper.visible = false;
        this.gridVisible = false;
        this.envTexture = texture;
        this.testEnvActive = true;
        this.envLoading = false;
        this.callbacks.onLoadingChange?.(false);
        this.callbacks.onToast?.("Ambiente carregado — hall arquitetonico");
      },
      (progress) => {
        if (progress.total > 0) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          this.callbacks.onLoadingChange?.(true, `Carregando ambiente... ${pct}%`);
        }
      },
      (error) => {
        this.envLoading = false;
        this.callbacks.onLoadingChange?.(false);
        this.callbacks.onToast?.("Erro ao carregar ambiente. Tente novamente.");
        console.error("HDRI load error:", error);
      }
    );
  }

  exportScreenshot(filename = "bretda-configurador.png"): void {
    this.renderer.render(this.scene, this.camera);
    const dataUrl = this.renderer.domElement.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  // ---------- CLEANUP ----------
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.transformControls.detach();
    this.transformControls.dispose();
    this.orbitControls.dispose();
    this.dracoLoader.dispose();
    this.textureCache.forEach((t) => t.dispose());
    this.textureCache.clear();
    this.modelCache.clear();
    if (this.tableGroup) this.disposeGroup(this.tableGroup);
    this.envTexture?.dispose();
    this.renderer.dispose();
  }
}
