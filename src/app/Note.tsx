import { Avatar } from "@camome/core/Avatar";
import { selectMetadataContent } from "@/lib/nostr/event/selectors";
import { eventKind } from "@/lib/nostr/types";
import { useNostrSubscription } from "@/lib/nostr/useNostrSubscription";
import styles from "./Note.module.scss";

type Props = { content: string; author: string };

export default function Note({ content, author }: Props) {
  const events = useNostrSubscription({
    filters: [
      {
        authors: [author],
        kinds: [eventKind.Metadata],
        limit: 20,
      },
    ],
  });
  const meta = events?.length ? selectMetadataContent(events) : undefined;

  return (
    <article className={styles.container}>
      <div className={styles.left}>
        <Avatar src={meta?.picture} alt={`Avatar of ${meta?.name}`} size="sm" />
      </div>
      <div className={styles.right}>
        <div className={styles.header}>
          <span className={styles.name}>{meta?.name}</span>
        </div>
        <div className={styles.content}>{content}</div>
      </div>
    </article>
  );
}
