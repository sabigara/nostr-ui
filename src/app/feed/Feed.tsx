"use client";

import React from "react";
import { Button } from "@camome/core/Button";
import { Textarea } from "@camome/core/Textarea";
import { useForm } from "react-hook-form";
import { useNostrEvent } from "@/lib/nostr/useNostrEvent";
import { eventKind } from "@/lib/nostr/types";

import styles from "./Feed.module.scss";

type Props = unknown;

type FormValues = {
  pubKeys: string;
};

export default function Feed(props: Props) {
  const { handleSubmit, register } = useForm<FormValues>();
  const [pubKeys, setPubKeys] = React.useState("");
  const { notes } = useNostrEvent({
    filters: [
      {
        authors: pubKeys.split("\n"),
        kinds: [eventKind.Note],
        limit: 10,
      },
    ],
  });

  return (
    <main className={styles.container}>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
      <form
        onSubmit={handleSubmit(({ pubKeys }) => {
          setPubKeys(pubKeys);
        })}
      >
        <Textarea label="IDs" {...register("pubKeys")} />
        <Button type="submit">Subscribe</Button>
      </form>
    </main>
  );
}
