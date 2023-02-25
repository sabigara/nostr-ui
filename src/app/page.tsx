"use client";

import Feed from "@/app/Feed";
import { useHandleMessages } from "@/app/useHandleMessages";
import { pubKeysFromContacts } from "@/lib/nostr/event/selectors";
import RelayPanel from "@/lib/nostr/relay/RelayPanel";
import { eventKind } from "@/lib/nostr/types";
import { useNostrSubscription } from "@/lib/nostr/useNostrSubscription";
import { TextInput } from "@camome/core/TextInput";
import clsx from "clsx";
import React from "react";
import styles from "./page.module.css";

export default function Home() {
  const [pubKey, setPubKey] = React.useState("");
  useHandleMessages();
  const events = useNostrSubscription({
    filters: [
      {
        authors: [pubKey],
        kinds: [eventKind.Contacts],
      },
    ],
    enabled: !!pubKey,
  });
  const following = events ? pubKeysFromContacts(events) : [];

  return (
    <main className={clsx(styles.main, "stack")}>
      <RelayPanel maxRelays={3} />
      <TextInput
        label="Pub key"
        fill
        onChange={(e) => void setPubKey(e.target.value)}
        value={pubKey}
      />
      <Feed authors={following} className={styles.feed} />
    </main>
  );
}
