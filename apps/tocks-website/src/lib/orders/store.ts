/**
 * OrderStore — persistência de pedidos.
 *
 * ⚠️ IMPL ATUAL = arquivo JSON (`.data/orders.json`) — SÓ PARA DEV/SANDBOX.
 *    Funciona no `next dev`, mas NÃO em serverless (filesystem efêmero/read-only).
 *
 * PRODUÇÃO: implementar `SupabaseOrderStore` (mesma interface) e trocar em
 *    `getOrderStore()`. Schema sugerido:
 *      create table orders (
 *        id text primary key,
 *        product_slug text not null,
 *        product_name text not null,
 *        amount numeric not null,
 *        status text not null default 'pending',
 *        mp_payment_id text,
 *        mp_preference_id text,
 *        created_at timestamptz not null default now(),
 *        updated_at timestamptz not null default now()
 *      );
 *    A idempotência do webhook depende deste store (baixa keyed por order id).
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import type { Order, OrderStatus } from './types'

export interface OrderStore {
  create(input: { productSlug: string; productName: string; amount: number }): Promise<Order>
  getById(id: string): Promise<Order | null>
  setCheckout(id: string, checkoutId: string): Promise<void>
  updateStatus(id: string, status: OrderStatus, paymentId: string): Promise<Order | null>
}

const DATA_DIR = path.join(process.cwd(), '.data')
const DATA_FILE = path.join(DATA_DIR, 'orders.json')

async function readAll(): Promise<Record<string, Order>> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(raw) as Record<string, Order>
  } catch {
    return {}
  }
}

async function writeAll(orders: Record<string, Order>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8')
}

class FileOrderStore implements OrderStore {
  async create(input: { productSlug: string; productName: string; amount: number }): Promise<Order> {
    const now = new Date().toISOString()
    const order: Order = {
      id: crypto.randomUUID(),
      productSlug: input.productSlug,
      productName: input.productName,
      amount: input.amount,
      status: 'pending',
      paymentId: null,
      checkoutId: null,
      createdAt: now,
      updatedAt: now,
    }
    const orders = await readAll()
    orders[order.id] = order
    await writeAll(orders)
    return order
  }

  async getById(id: string): Promise<Order | null> {
    const orders = await readAll()
    return orders[id] ?? null
  }

  async setCheckout(id: string, checkoutId: string): Promise<void> {
    const orders = await readAll()
    const order = orders[id]
    if (!order) return
    order.checkoutId = checkoutId
    order.updatedAt = new Date().toISOString()
    await writeAll(orders)
  }

  async updateStatus(id: string, status: OrderStatus, paymentId: string): Promise<Order | null> {
    const orders = await readAll()
    const order = orders[id]
    if (!order) return null
    order.status = status
    order.paymentId = paymentId
    order.updatedAt = new Date().toISOString()
    await writeAll(orders)
    return order
  }
}

let store: OrderStore | null = null

export function getOrderStore(): OrderStore {
  // TODO(prod): if (process.env.SUPABASE_URL) return new SupabaseOrderStore()
  if (!store) store = new FileOrderStore()
  return store
}
