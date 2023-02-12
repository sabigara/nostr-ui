import { NostrEvent } from "@/lib/nostr/types";
import { atom } from "jotai";

export const notesAtom = atom<NostrEvent[]>([]);
export const contactsAtom = atom<NostrEvent[]>([]);
