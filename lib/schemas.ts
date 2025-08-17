export type HeartbeatInput = { source?: string; ts?: number };
export function parseHeartbeat(input: any) {
  return {
    source: typeof input?.source === "string" ? input.source : "unknown",
    ts: typeof input?.ts === "number" ? input.ts : Date.now(),
  };
}

export type ValidatorInput = { token?: string };
export function parseValidator(input: any) {
  return { token: typeof input?.token === "string" ? input.token : "" };
}
