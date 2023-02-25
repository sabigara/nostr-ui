import { Metadata, NostrEvent } from "@/lib/nostr/types";

export function pubKeysFromContacts(events: NostrEvent[]): string[] {
  const latest = events.reduce<NostrEvent | null>(
    (acc, cur) => (cur.created_at > (acc?.created_at ?? 0) ? cur : acc),
    null
  );
  return latest?.tags.filter((t) => t[0] === "p").map((t) => t[1]) ?? [];
}

export function selectMetadataContent(events: NostrEvent[]) {
  if (events.length === 0) return null;
  const first = events[0];
  return JSON.parse(first.content) as Metadata;
}

export function sortedEvents(events: NostrEvent[]): NostrEvent[] {
  return [...events.sort((a, b) => b.created_at - a.created_at)];
}
