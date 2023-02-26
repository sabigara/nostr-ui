import { Filter, NostrEvent } from "@/lib/nostr/types";
import { Collection } from "dexie";
import { db } from "@/lib/storage/indexedDB";

// TODO: support only single filter
export async function queryEventsFromStorage(...filters: Filter[]) {
  const kinds = filters.flatMap((f) => f.kinds ?? []);
  const authors = filters.flatMap((f) => f.authors ?? []);
  const ids = filters.flatMap((f) => f.ids ?? []);
  const since = filters[0].since;
  const until = filters[0].until;

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
  query = query.filter(
    (e) => (since ?? 0) <= e.created_at && e.created_at <= (until ?? Infinity)
  );
  return (await query.sortBy("created_at")).reverse();
}

export type QueryCache = {
  key: string;
  fetchedAt: number;
};
