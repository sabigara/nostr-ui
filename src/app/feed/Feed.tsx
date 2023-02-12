"use client";

import React from "react";
import clsx from "clsx";
import { Button } from "@camome/core/Button";
import { Textarea } from "@camome/core/Textarea";
import { useForm } from "react-hook-form";
import { useNostrSubscription } from "@/lib/nostr/useNostrSubscription";
import { eventKind } from "@/lib/nostr/types";

import styles from "./Feed.module.scss";
import { useAtomValue } from "jotai";
import { notesAtom } from "@/app/store";

type Props = unknown;

type FormValues = {
  pubKeys: string;
};

export default function Feed(props: Props) {
  const notes = useAtomValue(notesAtom);
  const { handleSubmit, register } = useForm<FormValues>();
  const [pubKeys, setPubKeys] = React.useState("");

  useNostrSubscription({
    authors: pubKeys.split("\n"),
    kinds: [eventKind.Note],
    limit: 10,
  });

  return (
    <main className={clsx(styles.container, "stack")}>
      <form
        onSubmit={handleSubmit(({ pubKeys }) => {
          setPubKeys(pubKeys);
        })}
        className="stack"
      >
        <Textarea label="IDs" {...register("pubKeys")} />
        <Button type="submit">Subscribe</Button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </main>
  );
}
