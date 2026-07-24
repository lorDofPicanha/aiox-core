import { smokeBridgeEnv } from '../src/lib/env-smoke.js';

const report = smokeBridgeEnv();

console.log(JSON.stringify(report, null, 2));

