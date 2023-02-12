"use client";

import Feed from "@/app/Feed";
import { flattenPubKeysFromContacts } from "@/lib/nostr/event/selectors";
import { queries } from "@/lib/query/queries";
import { useWs } from "@/lib/websocket/store";
import { useWsConnection } from "@/lib/websocket/useWsConnection";
import { TextInput } from "@camome/core/TextInput";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import styles from "./page.module.css";

export default function Home() {
  const { data: keys } = useQuery({
    ...queries.keys.all,
  });
  const ws = useWs();
  const { data } = useQuery({
    ...queries.contacts.authors(ws!, [keys!.public!]),
    enabled: !!ws && !!keys?.public,
  });
  const following = data ? flattenPubKeysFromContacts(data) : [];

  useWsConnection("wss://relay.snort.social", { log: true });

  return (
    <main className={clsx(styles.main, "stack")}>
      <TextInput label="Pub key" value={keys?.public ?? ""} readOnly fill />
      <Feed authors={following} limit={25} className={styles.feed} />
    </main>
  );
}
