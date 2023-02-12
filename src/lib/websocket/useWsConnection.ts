import { wsAtom } from "@/lib/websocket/store";
import { useSetAtom } from "jotai";
import React from "react";

type Options = {
  log?: boolean;
};

export const useWsConnection = (url: string, { log = false }: Options = {}) => {
  const setWs = useSetAtom(wsAtom);
  const info = React.useCallback(
    (...args: any[]) => {
      if (log) console.log(...args);
    },
    [log]
  );
  const error = React.useCallback(
    (...args: any[]) => {
      if (log) console.log(...args);
    },
    [log]
  );

  React.useEffect(() => {
    const ws = new WebSocket(url);
    ws.addEventListener("open", (e: Event) => {
      setWs(ws);
      info("Connected to:", url);
    });
    ws.addEventListener("message", (e) => {
      info("Got message:", JSON.parse(e.data));
    });
    ws.addEventListener("error", (e) => {
      error("Error:", e);
    });
    ws.addEventListener("close", (e) => {
      setWs(null);
      info("Disconnected from:", url);
    });

    return () => {
      ws.close();
    };
  }, [error, info, setWs, url]);
};
