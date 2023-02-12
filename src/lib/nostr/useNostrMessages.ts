import { MessageTypeToClient, NostrEvent } from "@/lib/nostr/types";
import { useWsEventHandlers } from "@/lib/websocket/useWsEventHandlers";

type Params = {
  onEvent?: (e: NostrEvent) => void;
  onNotice?: (errorMsg: string) => void;
  onEose?: () => void;
};

export function useNostrMessages({ onEvent, onNotice, onEose }: Params) {
  useWsEventHandlers({
    onMessage(msg) {
      // TODO: validate
      const data = JSON.parse(msg.data);
      switch (data[0] as MessageTypeToClient) {
        case "EVENT": {
          onEvent?.(data[2] as NostrEvent);
        }
        case "NOTICE": {
          onNotice?.(data[1] as string);
        }
        case "EOSE": {
          onEose?.();
        }
        case "OK":
        case "AUTH": {
          break;
        }
      }
    },
  });
}
