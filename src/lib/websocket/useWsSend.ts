import { useWs } from "@/lib/websocket/store";
import { useWsEventHandlers } from "@/lib/websocket/useWsEventHandlers";
import React from "react";

type Options = {
  cacheKey?: string;
  staleSec?: number;
};

export function useWsSend<T>(data: T, { cacheKey, staleSec }: Options = {}) {
  const ws = useWs();
  const cacheKeyRef = React.useRef<string | null>(null);
  const lastSentRef = React.useRef<number | null>(null);

  const isStale = React.useCallback(() => {
    if (!staleSec) return false;
    return (
      !!lastSentRef.current &&
      Date.now() - lastSentRef.current > staleSec * 1000
    );
  }, [staleSec]);

  const send = React.useCallback(() => {
    if (!data) return;
    // TODO: more efficient and reliable way to compare values
    const serialized = JSON.stringify(data);
    const isSameMsg = cacheKeyRef.current === (cacheKey ?? serialized);
    if (!ws || (isSameMsg && !isStale())) return;
    ws.send(serialized);
    cacheKeyRef.current = cacheKey ?? serialized;
    lastSentRef.current = Date.now();
  }, [data, isStale, cacheKey, ws]);

  React.useEffect(() => {
    send();
  }, [data, isStale, send]);

  useWsEventHandlers({
    onOpen() {
      send();
    },
  });

  return { send };
}
