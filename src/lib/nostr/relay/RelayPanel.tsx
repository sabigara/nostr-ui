import { defaultRelays } from "@/lib/nostr/relay/defaultRelays";
import RelayConnector from "@/lib/nostr/relay/RelayConnector";

type Props = {
  maxRelays?: number;
  className?: string;
};

export default function RelayPanel({ maxRelays = 5, className }: Props) {
  return (
    <section className={className}>
      <ul className="stack">
        {defaultRelays.slice(0, maxRelays).map((url) => (
          <li key={url}>
            <RelayConnector defaultUrl={url} />
          </li>
        ))}
      </ul>
    </section>
  );
}
