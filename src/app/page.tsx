"use client";

import Feed from "@/app/Feed";
import { flattenPubKeysFromContacts } from "@/lib/nostr/event/selectors";
import { queries } from "@/lib/query/queries";
import { useWs } from "@/lib/websocket/store";
import { useWsConnection } from "@/lib/websocket/useWsConnection";
import { TextInput } from "@camome/core/TextInput";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import styles from "./page.module.css";

export default function Home() {
  const [pubKey, setPubKey] = React.useState("");
  const ws = useWs();
  const { data } = useQuery({
    ...queries.contacts.authors(ws!, [pubKey]),
    enabled: !!ws && !!pubKey,
  });
  const following = data ? flattenPubKeysFromContacts(data) : [];

  useWsConnection("wss://relay.snort.social", { log: true });

  return (
    <main className={clsx(styles.main, "stack")}>
      <TextInput
        label="Pub key"
        onChange={(e) => void setPubKey(e.target.value)}
        fill
      />
      <Feed authors={following} limit={25} className={styles.feed} />
    </main>
  );
}
