import { MessageTypeToClient, NostrEvent } from "@/lib/nostr/types";
import { useWsEventHandlers } from "@/lib/websocket/useWsEventHandlers";

type Params = {
  onEvent?: (e: NostrEvent) => void;
  onNotice?: (errorMsg: string) => void;
  onEose?: (subscriptionId: string) => void;
};

export function useNostrMessages({ onEvent, onNotice, onEose }: Params) {
  useWsEventHandlers({
    onMessage(msg) {
      // TODO: validate
      const data = JSON.parse(msg.data);
      switch (data[0] as MessageTypeToClient) {
        case "EVENT": {
          onEvent?.(data[2] as NostrEvent);
          break;
        }
        case "NOTICE": {
          onNotice?.(data[1] as string);
          break;
        }
        case "EOSE": {
          onEose?.(data[1]);
          break;
        }
        case "OK":
        case "AUTH": {
          break;
        }
      }
    },
  });
}
