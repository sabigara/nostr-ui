export type WsPool = {
  send: (data: Parameters<WebSocket["send"]>[0]) => void;
  addEventListener: WebSocket["addEventListener"];
  removeEventListener: WebSocket["removeEventListener"];
  registry: Record<string, WebSocket>;
  count: number;
  get: (url: string) => WebSocket | undefined;
};
