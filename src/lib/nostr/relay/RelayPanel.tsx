import RelayConnector from "@/lib/nostr/relay/RelayConnector";

type Props = {
  maxRelays?: number;
};

export default function RelayPanel({ maxRelays = 10 }: Props) {
  return (
    <section>
      <ul className="stack">
        {Array.from(Array(maxRelays).keys()).map((key) => (
          <li key={key}>
            <RelayConnector />
          </li>
        ))}
      </ul>
    </section>
  );
}
