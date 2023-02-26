import { Avatar } from "@camome/core/Avatar";
import { selectMetadataContent } from "@/lib/nostr/event/selectors";
import { eventKind, NostrEvent } from "@/lib/nostr/types";
import { useNostrSubscription } from "@/lib/nostr/useNostrSubscription";

import styles from "./Note.module.scss";
import { formatDistanceShort } from "@/lib/time";

type Props = { note: NostrEvent };

export default function Note({ note }: Props) {
  const events = useNostrSubscription({
    filters: [
      {
        authors: [note.pubkey],
        kinds: [eventKind.Metadata],
        limit: 20,
      },
    ],
  });
  const meta = events?.length ? selectMetadataContent(events) : undefined;
  const formattedTime = formatDistanceShort(note.created_at * 1000);

  return (
    <article className={styles.container}>
      <div className={styles.left}>
        <Avatar src={meta?.picture} alt={`Avatar of ${meta?.name}`} size="sm" />
      </div>
      <div className={styles.right}>
        <div className={styles.header}>
          <span className={styles.displayName}>{meta?.display_name}</span>
          <span className={styles.name}>@{meta?.name}</span>
          <time
            dateTime={new Date(note.created_at).toISOString()}
            className={styles.time}
          >
            {formattedTime}
          </time>
        </div>
        <div className={styles.content}>{note.content}</div>
      </div>
    </article>
  );
}
