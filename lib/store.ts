type Heartbeat = { ts: number; source: string };
let _hb: Heartbeat | null = null;

export function setHeartbeat(hb: Heartbeat) {
  _hb = hb;
}

export function getHeartbeat() {
  return _hb;
}
