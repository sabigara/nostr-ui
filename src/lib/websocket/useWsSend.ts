import { useWs } from "@/lib/websocket/store";
import { useWsEventHandlers } from "@/lib/websocket/useWsEventHandlers";
import React from "react";

export function useWsSend<T>(data: T) {
  const ws = useWs();
  const [sent, setSent] = React.useState<string | null>(null);
  const sentRef = React.useRef<string | null>(null);

  const send = React.useCallback(() => {
    if (!data) return;
    // TODO: more efficient and reliable way to compare values
    const serialized = JSON.stringify(data);
    if (!ws || sentRef.current === serialized) return;
    ws.send(serialized);
    setSent(serialized);
    sentRef.current = serialized;
  }, [data, ws]);

  React.useEffect(() => {
    send();
  }, [data, send]);

  useWsEventHandlers({
    onOpen() {
      send();
    },
  });

  return { send, sent };
}
