import {
  handleMessageEvent,
  makeMessageClose,
  makeMessageReq,
} from "@/lib/nostr/message";
import { Filter, MessageReq, NostrEvent } from "@/lib/nostr/types";
import { uid } from "@/lib/uid";
import { WsPool } from "@/lib/websocket/types";
import uniqBy from "lodash.uniqby";

export function fetchNostrEventsSingleRelay(
  ws: WebSocket,
  ...filters: Filter[]
): Promise<NostrEvent[]> {
  return new Promise<NostrEvent[]>((resolve, reject) => {
    const results: NostrEvent[] = [];
    const subscriptionId = ws.url + "-" + uid();
    const cleanup = () => {
      ws.send(JSON.stringify(makeMessageClose(subscriptionId)));
      ws.removeEventListener("message", handleMessage);
    };
    const handleMessage = (msg: MessageEvent) => {
      handleMessageEvent(msg, {
        onEvent(e, subId) {
          if (subId !== subscriptionId) return;
          results.push(e);
        },
        onEose(subId) {
          if (subId !== subscriptionId) return;
          cleanup();
          resolve(results);
        },
        onNotice(errorMsg, subId) {
          if (subId !== subscriptionId) return;
          cleanup();
          reject(errorMsg);
        },
      });
    };
    ws.addEventListener("message", handleMessage);
    ws.send(JSON.stringify(makeMessageReq(subscriptionId, ...filters)));
  });
}

export async function fetchNostrEvents(
  pool: WsPool,
  ...filters: Filter[]
): Promise<NostrEvent[]> {
  const resp = await Promise.all(
    Object.values(pool.registry).map((ws) =>
      fetchNostrEventsSingleRelay(ws, ...filters)
    )
  );
  return uniqBy(resp.flat(), (e) => e.id);
}
