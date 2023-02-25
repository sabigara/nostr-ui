import { NostrEvent } from "@/lib/nostr/types";

export type Account = {
  pubKey: string;
  signEvent: (event: NostrEvent) => Promise<NostrEvent>;
};
