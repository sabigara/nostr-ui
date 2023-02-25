import Dexie from "dexie";
import { type NostrEvent } from "@/lib/nostr/types";
import { type QueryCache } from "@/lib/nostr/event/storage";
import { type PersistedAccount } from "@/lib/account/types";

class NostrUI extends Dexie {
  account!: Dexie.Table<PersistedAccount, string>;
  events!: Dexie.Table<NostrEvent, string>;
  queryCache!: Dexie.Table<QueryCache, string>;

  constructor() {
    super("NostrUI");
    this.version(1).stores({
      account: "pubkey",
      events: "id, pubkey, created_at, kind, content, sig, tags",
      queryCache: "key, fetchedAt",
    });
  }
}

export const db = new NostrUI();
