import { db } from "@/lib/storage/indexedDB";
import { eventKind, Metadata } from "@/lib/nostr/types";
import { useNostrMessages } from "@/lib/nostr/useNostrMessages";

export function useHandleMessages() {
  useNostrMessages({
    onEvent(e) {
      switch (e.kind) {
        case eventKind.Metadata:
        case eventKind.Note:
        case eventKind.Contacts:
          db.events.put(e);
          break;
        default:
          break;
      }
    },
    onNotice(errorMsg) {
      console.error(errorMsg);
    },
  });
}
