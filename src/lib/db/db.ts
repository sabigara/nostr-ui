import Dexie from "dexie";
import { type NostrEvent } from "@/lib/nostr/types";
import { type QueryCache } from "@/lib/db/queries";

class NostrUI extends Dexie {
  events!: Dexie.Table<NostrEvent, string>;
  cache!: Dexie.Table<QueryCache, string>;

  constructor() {
    super("NostrUI");
    this.version(1).stores({
      events: "id, pubkey, created_at, kind, content, sig, tags",
      cache: "id, fetchedAt",
    });
  }
}

export const db = new NostrUI();
