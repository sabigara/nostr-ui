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

export default function Feed({ authors, className }: Props) {
  const notes = useNostrSubscription({
    filters: [
      {
        authors,
        kinds: [eventKind.Note],
        limit: 20,
      },
    ],
    unsubscribeOnEose: false,
    staleSeconds: 0,
    enabled: !!authors.length,
  });

  return (
    <ul className={clsx(styles.list, className)}>
      {/* TODO: should sort inside queryFn? */}
      {notes?.map((note) => (
        <Note author={note.pubkey} content={note.content} key={note.id} />
      ))}
    </ul>
  );
}
