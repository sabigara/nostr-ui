import { notesAtom } from "@/app/feed/store";
import { makeMessageClose, makeMessageReq } from "@/lib/nostr/message";
import { Filter } from "@/lib/nostr/types";
import { useWs } from "@/lib/websocket/store";
import { useWsEventHandlers } from "@/lib/websocket/useWsEventHandlers";
import { useWsSend } from "@/lib/websocket/useWsSend";
import { useAtom } from "jotai";
import uniqBy from "lodash.uniqby";
import React from "react";

type Params = {
  filters: Filter[];
  enabled?: boolean;
  // onEvent:
};

// TODO: support resources other than note
export function useNostrEvent({ filters, enabled = true }: Params) {
  const [notes, setNotes] = useAtom(notesAtom);
  const ws = useWs();
  const req = makeMessageReq(...filters);

  useWsEventHandlers({
    onMessage(msg) {
      const data = JSON.parse(msg.data);
      if (data[0] === "EVENT") {
        setNotes((curr) =>
          uniqBy([...curr, data[2]], (item) => item.id).sort(
            (a, b) => b.created_at - a.created_at
          )
        );
      }
    },
  });

  useWsSend(enabled ? req : null);

  const close = React.useCallback(() => {
    // TODO: make sure message is sent
    if (ws) {
      ws.send(JSON.stringify(makeMessageClose(req[1])));
    }
  }, [req, ws]);

  return { close, notes };
}
