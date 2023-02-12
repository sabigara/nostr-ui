import { NostrEvent } from "@/lib/nostr/types";

declare global {
  interface Window {
    nostr?: {
      getPublicKey: () => Promise<string>;
      signEvent: (event: NostrEvent) => Promise<NostrEvent>;
      // TODO: add optional methods: https://github.com/nostr-protocol/nips/blob/master/07.md
    };
  }
}
