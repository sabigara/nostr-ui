"use client";

import Feed from "@/app/Feed";
import { useAccount } from "@/app/useAccount";
import { useHandleMessages } from "@/app/useHandleMessages";
import { pubKeysFromContacts } from "@/lib/nostr/event/selectors";
import RelayPanel from "@/lib/nostr/relay/RelayPanel";
import { eventKind } from "@/lib/nostr/types";
import { useNostrSubscription } from "@/lib/nostr/useNostrSubscription";
import clsx from "clsx";
import styles from "./page.module.css";

export default function Home() {
  const account = useAccount();
  useHandleMessages();
  const events = useNostrSubscription({
    filters: [
      {
        authors: [account?.pubkey!],
        kinds: [eventKind.Contacts],
      },
    ],
    enabled: !!account?.pubkey,
  });
  const following = events ? pubKeysFromContacts(events) : [];

  return (
    <main className={clsx(styles.main, "stack")}>
      <RelayPanel maxRelays={3} />
      <Feed authors={following} />
    </main>
  );
}
