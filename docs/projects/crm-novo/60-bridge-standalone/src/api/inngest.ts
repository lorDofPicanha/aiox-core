import { serve } from 'inngest/next';
import { inngest } from '../client.js';
import {
  tocksLeadQualifiedBridge,
  bretdaLeadQualifiedBridge,
} from '../functions/lead-qualified-bridge.js';
import {
  tocksDealWonBridge,
  bretdaDealWonBridge,
} from '../functions/deal-won-bridge.js';
import { dlqReplay } from '../functions/dlq-replay.js';

/**
 * Webhook handler que Inngest chama pra executar functions.
 * Deploy: /api/inngest (Next.js App Router).
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    tocksLeadQualifiedBridge,
    bretdaLeadQualifiedBridge,
    tocksDealWonBridge,
    bretdaDealWonBridge,
    dlqReplay,
  ],
});
