import { type NostrEvent } from "@/lib/nostr/types";

export type Account = {
  pubkey: string;
  signEvent?: (event: NostrEvent) => Promise<NostrEvent>;
};

export type PersistedAccount = Pick<Account, "pubkey">;
