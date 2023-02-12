"use client";

import Feed from "@/app/Feed";
import { atomFollowingAuthors } from "@/app/store";
import { useHandleMessages } from "@/app/useHandleMessages";
import { useLoginUser } from "@/app/useLoginUser";
import { useWsConnection } from "@/lib/websocket/useWsConnection";
import { TextInput } from "@camome/core/TextInput";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import React from "react";
import styles from "./page.module.css";

export default function Home() {
  const [pubKey, setPubKey] = React.useState("");
  const following = useAtomValue(atomFollowingAuthors);

  useWsConnection("wss://relay.damus.io", { log: true });
  useHandleMessages();
  useLoginUser(pubKey);

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
