import { eventKind } from "@/lib/nostr/types";
import { useNostrSubscription } from "@/lib/nostr/useNostrSubscription";

export function useLoginUser(pubKey: string) {
  useNostrSubscription({
    kinds: [eventKind.Metadata, eventKind.Contacts],
    authors: pubKey ? [pubKey] : [],
    limit: 50,
  });
}
