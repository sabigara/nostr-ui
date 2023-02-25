import { Filter, NostrEvent } from "@/lib/nostr/types";
import { Collection } from "dexie";
import { db } from "./db";

export async function nostrFiltersToDbQuery(...filters: Filter[]) {
  const kinds = filters.flatMap((f) => f.kinds ?? []);
  const authors = filters.flatMap((f) => f.authors ?? []);
  const ids = filters.flatMap((f) => f.ids ?? []);

  // TODO: OR or AND?
  let query: Collection<NostrEvent, string> = db.events.toCollection();

  if (kinds.length) {
    query = query.filter((e) =>
      filters.flatMap((f) => f.kinds ?? []).includes(e.kind)
    );
  }
  if (authors.length) {
    query = query.filter((e) =>
      filters.flatMap((f) => f.authors).includes(e.pubkey)
    );
  }
  if (ids.length) {
    query = query.filter((e) => ids.includes(e.id));
  }
  return (await query.sortBy("created_at")).reverse();
}

export type QueryCache = {
  id: string;
  fetchedAt: number;
};
