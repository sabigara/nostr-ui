import { Metadata, NostrEvent } from "@/lib/nostr/types";

export function flattenPubKeysFromContacts(events: NostrEvent[]): string[] {
  return events.flatMap((e) =>
    e.tags.filter((t) => t[0] === "p").map((t) => t[1])
  );
}

export function selectMetadataContent(events: NostrEvent[]) {
  if (events.length === 0) return null;
  const first = events[0];
  return JSON.parse(first.content) as Metadata;
}
