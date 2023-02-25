import { defaultRelays } from "@/lib/nostr/relay/defaultRelays";
import RelayConnector from "@/lib/nostr/relay/RelayConnector";

type Props = {
  maxRelays?: number;
};

export default function RelayPanel({ maxRelays = 5 }: Props) {
  return (
    <section>
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
