import { selectMetadataContent } from "@/lib/nostr/event/selectors";
import { queries } from "@/lib/query/queries";
import { useWs } from "@/lib/websocket/store";
import { Avatar } from "@camome/core/Avatar";
import { useQuery } from "@tanstack/react-query";
import styles from "./Note.module.scss";

type Props = { content: string; author: string };

export default function Note({ content, author }: Props) {
  const ws = useWs();
  const { data } = useQuery({
    ...queries.metadata.authors(ws!, [author]),
    enabled: !!ws,
  });
  const meta = data ? selectMetadataContent(data) : undefined;
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
