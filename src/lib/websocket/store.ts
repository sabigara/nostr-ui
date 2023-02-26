import { WsPool } from "@/lib/websocket/types";
import { useAtomValue, atom } from "jotai";

export const atomWsPoolRegistry = atom<WsPool["registry"]>({});

export const atomWsPool = atom<WsPool>((get) => ({
  send: async (data) => {
    Object.values(get(atomWsPoolRegistry)).forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  },
  addEventListener: (name: any, cb: any) => {
    Object.values(get(atomWsPoolRegistry)).map(
      (ws) => void ws.addEventListener(name, cb)
    );
  },
  removeEventListener: (name: any, cb: any) => {
    Object.values(get(atomWsPoolRegistry)).map(
      (ws) => void ws.removeEventListener(name, cb)
    );
  },
  registry: get(atomWsPoolRegistry),
  count: Object.keys(get(atomWsPoolRegistry)).length,
  openCount: Object.values(get(atomWsPoolRegistry)).filter(
    (ws) => ws.readyState === WebSocket.OPEN
  ).length,
  get: () => undefined,
}));
export const useWsPool = () => useAtomValue(atomWsPool);
