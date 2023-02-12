"use client";

import clsx from "clsx";
import { useNostrSubscription } from "@/lib/nostr/useNostrSubscription";
import { eventKind } from "@/lib/nostr/types";

import styles from "./Feed.module.scss";
import { useAtomValue } from "jotai";
import { atomNotesSorted } from "@/app/store";

type Props = {
  authors: string[];
  limit?: number;
  className?: string;
};

export default function Feed({ authors, limit = 10, className }: Props) {
  const notes = useAtomValue(atomNotesSorted);

  useNostrSubscription({
    kinds: [eventKind.Note],
    authors,
    limit,
  });

  return (
    <ul className={className}>
      {notes.map((note) => (
        <li key={note.id}>{note.content}</li>
      ))}
    </ul>
  );
}
