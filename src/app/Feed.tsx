"use client";

import { queries } from "@/lib/query/queries";
import { useQuery } from "@tanstack/react-query";
import { useWs } from "@/lib/websocket/store";
import Note from "@/app/Note";
import clsx from "clsx";

import styles from "./Feed.module.scss";

type Props = {
  authors: string[];
  limit?: number;
  className?: string;
};

export default function Feed({ authors, limit = 10, className }: Props) {
  const ws = useWs();
  const { data: notes } = useQuery({
    ...queries.notes.authors(ws!, authors),
    enabled: !!ws,
  });

  return (
    <ul className={clsx(styles.list, className)}>
      {notes?.map((note) => (
        <Note author={note.pubkey} content={note.content} key={note.id} />
      ))}
    </ul>
  );
}
