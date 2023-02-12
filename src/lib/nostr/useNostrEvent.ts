import { makeMessageClose, makeMessageReq } from "@/lib/nostr/message";
import { Filter, MessageTypeToClient } from "@/lib/nostr/types";
import { useWs } from "@/lib/websocket/store";
import { useWsEventHandlers } from "@/lib/websocket/useWsEventHandlers";
import objectHash from "object-hash";
import React from "react";

type Params = {
  filters: Filter[];
};

// TODO: support resources other than note
export function useNostrSubscription({ filters }: Params) {
  const cacheKeyRef = React.useRef<string | null>(null);
  const ws = useWs();

  React.useEffect(() => {
    const cacheKey = objectHash(filters);
    if (cacheKey === cacheKeyRef.current) return;
    const req = makeMessageReq(...filters);
    console.log("Subscribe:", req[2]);
    ws?.send(JSON.stringify(req));
    cacheKeyRef.current = cacheKey;
    return () => {
      console.log("Unsubscribe:", req[2]);
      ws?.send(JSON.stringify(makeMessageClose(req[1])));
    };
  }, [filters, ws]);
}
