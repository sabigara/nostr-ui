import { handleMessageEvent, makeMessageClose } from "@/lib/nostr/message";
import { MessageReq, NostrEvent } from "@/lib/nostr/types";

export function fetchNostrEvents(
  ws: WebSocket,
  req: MessageReq
): Promise<NostrEvent[]> {
  return new Promise<NostrEvent[]>((resolve, reject) => {
    const results: NostrEvent[] = [];
    const subscriptionId = req[1];
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
    ws.send(JSON.stringify(req));
  });
}
