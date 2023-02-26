"use client";

import Note from "@/app/Note";
import clsx from "clsx";

import styles from "./Feed.module.scss";
import { useNostrSubscription } from "@/lib/nostr/useNostrSubscription";
import { eventKind } from "@/lib/nostr/types";

type Props = {
  authors: string[];
  className?: string;
};

const since = Math.floor(Date.now() / 1000) - 60 * 60;

export default function Feed({ authors, className }: Props) {
  const notes = useNostrSubscription({
    filters: [
      {
        authors,
        kinds: [eventKind.Note],
        limit: 20,
        since,
      },
    ],
    unsubscribeOnEose: false,
    staleSeconds: 0, // always newly subscribe
    enabled: !!authors.length,
  });

  return (
    <ul className={clsx(styles.list, className)}>
      {/* TODO: should sort inside queryFn? */}
      {notes?.map((note) => (
        <Note note={note} key={note.id} />
      ))}
    </ul>
  );
}
