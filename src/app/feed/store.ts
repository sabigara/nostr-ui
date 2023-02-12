import { Note } from "@/lib/nostr/types";
import { atom, useAtom } from "jotai";

export const notesAtom = atom<Note[]>([]);
