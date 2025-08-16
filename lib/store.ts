type HB = { module: "FOOT"|"QUIZ"|"TENNIS"|"WFL"|"SUP"|"TENL"|"EJP", verified: boolean, freshnessSec: number, timeDriftMs: number, ts: string };
type State = { heartbeat: Record<string, HB>, tickets: any[], validations: any[] };
const g = globalThis as any; if (!g.__SHIRA_STORE__) g.__SHIRA_STORE__ = { heartbeat: {}, tickets: [], validations: [] } as State;
export function pushHeartbeat(hb: HB) { g.__SHIRA_STORE__.heartbeat[hb.module] = hb; }
export function getHeartbeats(): State["heartbeat"] { return g.__SHIRA_STORE__.heartbeat; }
export function pushTicket(t: any) { g.__SHIRA_STORE__.tickets.push(t); }
export function getTickets(): any[] { return g.__SHIRA_STORE__.tickets.slice(-50); }
export function pushValidation(v: any) { g.__SHIRA_STORE__.validations.push(v); }
export function getValidations(): any[] { return g.__SHIRA_STORE__.validations.slice(-50); }
