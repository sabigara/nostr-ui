import { makeMessageClose, makeMessageReq } from "@/lib/nostr/message";
import { Filter, MessageTypeToClient } from "@/lib/nostr/types";
import { useWsPool } from "@/lib/websocket/store";
import objectHash from "object-hash";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { queryEventsFromStorage } from "@/lib/nostr/event/storage";
import { db } from "@/lib/storage/indexedDB";

const dedupeSet = new Set<string>();

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
  const events = useLiveQuery(() => {
    const parsed = JSON.parse(serialized);
    return queryEventsFromStorage(...parsed);
  }, [serialized]);

  React.useEffect(() => {
    if (!enabled || pool.count === 0 || dedupeSet.has(hash)) return;

    const parsed = JSON.parse(serialized);
    const req = makeMessageReq(undefined, ...parsed);
    dedupeSet.add(hash);

    let subscribing = false;

    db.queryCache.get(hash).then((cache) => {
      if (
        staleSeconds &&
        cache?.fetchedAt &&
        Date.now() - cache?.fetchedAt <= staleSeconds * 1000
      ) {
        console.log("Sub [cache-hit]:", req[2]);
        return;
      }
      console.log("Sub [cache-miss]:", req[2]);
      pool.send(JSON.stringify(req));
      subscribing = true;
    });

    const unsubscribe = () => {
      dedupeSet.delete(hash);
      if (subscribing) {
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
            key: hash,
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
      pool.removeEventListener("message", handleMessage);
      unsubscribe();
    };
  }, [serialized, pool, hash, unsubscribeOnEose, staleSeconds, enabled]);

  return events;
}
