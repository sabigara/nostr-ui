import { makeMessageClose, makeMessageReq } from "@/lib/nostr/message";
import { Filter, MessageTypeToClient } from "@/lib/nostr/types";
import { useWsPool } from "@/lib/websocket/store";
import objectHash from "object-hash";
import React from "react";
import { queryEventsFromStorage } from "@/lib/nostr/event/storage";
import { db } from "@/lib/storage/indexedDB";
import { useQuery } from "@tanstack/react-query";

const dedupeSet = new Set<string>();
const subscriptions = new Set<string>();

type Params = {
  filters: Filter[];
  unsubscribeOnEose?: boolean;
  staleSeconds?: number;
  enabled?: boolean;
};

export function useNostrSubscription({
  filters,
  unsubscribeOnEose = true,
  staleSeconds = 60 * 60 * 24, // Defaults to a day
  enabled = true,
}: Params) {
  const pool = useWsPool();
  const hash = objectHash(filters);
  const serialized = JSON.stringify(filters);
  const { data } = useQuery(["events", filters], () => {
    return queryEventsFromStorage(...filters);
  });
  const timeout = React.useRef<number>();

  React.useEffect(() => {
    // Fix identity
    const __hash = hash;

    if (!enabled || pool.count === 0 || dedupeSet.has(__hash)) return;

    const parsed = JSON.parse(serialized);
    const req = makeMessageReq(undefined, ...parsed);
    dedupeSet.add(hash);

    const subscribe = async () => {
      const cache = await db.queryCache.get(__hash);
      if (
        staleSeconds &&
        cache?.fetchedAt &&
        Date.now() - cache?.fetchedAt <= staleSeconds * 1000
      ) {
        console.log("Sub [cache-hit]:", req[2]);
        return;
      }

      const limit = 8;
      const intervalMs = 5000;
      if (subscriptions.size >= limit) {
        console.log(
          `Concurrent sub limit (${limit}) – retrying in ${intervalMs} ms`
        );
        timeout.current = window.setTimeout(subscribe, intervalMs);
        return;
      }

      console.log("Sub [cache-miss]:", req[2]);
      pool.send(JSON.stringify(req));
      subscriptions.add(__hash);
    };

    subscribe();

    const unsubscribe = () => {
      dedupeSet.delete(__hash);
      if (subscriptions.has(__hash)) {
        subscriptions.delete(__hash);
        console.log("Unsub:", req[2]);
        pool.send(JSON.stringify(makeMessageClose(req[1])));
      }
    };

    // TODO: is this correct?
    let eoseCount = 0;
    const handleMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if ((data[0] as MessageTypeToClient) === "EOSE" && data[1] === req[1]) {
        eoseCount++;
        if (eoseCount >= pool.count) {
          db.queryCache.put({
            key: __hash,
            fetchedAt: Date.now(),
          });
          if (unsubscribeOnEose) {
            unsubscribe();
          }
        }
      }
    };

    pool.addEventListener("message", handleMessage);

    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
      pool.removeEventListener("message", handleMessage);
      unsubscribe();
    };
  }, [serialized, pool, hash, unsubscribeOnEose, staleSeconds, enabled]);

  return data;
}
