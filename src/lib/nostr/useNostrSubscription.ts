import { makeMessageClose, makeMessageReq } from "@/lib/nostr/message";
import { Filter } from "@/lib/nostr/types";
import { useWs } from "@/lib/websocket/store";
import React from "react";

export function useNostrSubscription(...filters: Filter[]) {
  const ws = useWs();
  const serialized = JSON.stringify(filters);

  React.useEffect(() => {
    const parsed = JSON.parse(serialized);
    const req = makeMessageReq(...parsed);
    console.log("Subscribe:", req[2]);
    ws?.send(JSON.stringify(req));

    return () => {
      console.log("Unsubscribe:", req[2]);
      ws?.send(JSON.stringify(makeMessageClose(req[1])));
    };
  }, [serialized, ws]);
}
