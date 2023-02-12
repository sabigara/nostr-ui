import type { NostrEvent, Metadata } from "@/lib/nostr/types";
import { atom } from "jotai";

export const atomMetadata = atom<
  | (Omit<NostrEvent, "content"> & {
      content: Metadata;
    })[]
>([]);
export const atomNotes = atom<NostrEvent[]>([]);
export const atomContacts = atom<NostrEvent[]>([]);

export const atomNotesSorted = atom((get) =>
  get(atomNotes).sort((a, b) => b.created_at - a.created_at)
);

export const atomFollowingAuthors = atom((get) =>
  get(atomContacts).flatMap((contact) =>
    contact.tags.filter((t) => t[0] === "p").map((t) => t[1])
  )
);
