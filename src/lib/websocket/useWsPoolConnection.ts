import { atomWsPoolRegistry } from "@/lib/websocket/store";
import { useAtom } from "jotai";
import React from "react";

type Options = {
  log?: boolean;
};

export const useWsPoolConnection = (
  url: string,
  { log = false }: Options = {}
) => {
  const [registry, setRegistry] = useAtom(atomWsPoolRegistry);
  const [readyState, setReadyState] = React.useState<number>();

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
    if (!url) return;
    const ws = new WebSocket(url);
    ws.addEventListener("open", () => {
      setRegistry((curr) => ({ ...curr, [url]: ws }));
      info("Connected:", url);
    });
    ws.addEventListener("message", (e) => {
      info("Msg:", JSON.parse(e.data));
    });
    ws.addEventListener("error", (e) => {
      error("Error:", e);
    });
    ws.addEventListener("close", (e) => {
      setRegistry((curr) => {
        const { url, ...rest } = curr;
        return rest;
      });
      info("Disconnected:", url);
    });
    const watchReadyState = () => {
      setReadyState(ws.readyState);
    };
    // TODO: too fast?
    const interval = window.setInterval(watchReadyState, 200);

    return () => {
      ws.close();
      window.clearInterval(interval);
    };
  }, [error, info, setRegistry, url]);

  return { ws: registry[url], readyState };
};
