import { randomUUID } from 'node:crypto';

export function getTraceId(request) {
  const incoming = request?.headers?.['x-trace-id'];
  return typeof incoming === 'string' && incoming.length <= 128 ? incoming : randomUUID();
}
export function logEvent(event, fields = {}) {
  const payload = { ts:new Date().toISOString(), event, ...fields };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  return payload;
}
export function withTrace(response, traceId) { response.setHeader('x-trace-id', traceId); }