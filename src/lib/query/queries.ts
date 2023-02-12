import { fetchNostrEvents } from "@/lib/nostr/event/fetchNostrEvents";
import { makeMessageReq } from "@/lib/nostr/message";
import { eventKind } from "@/lib/nostr/types";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";

// TODO: support limit
export const queries = createQueryKeyStore({
  keys: {
    all: {
      queryKey: null,
      queryFn: async () => {
        const pubKey = await window.nostr?.getPublicKey();
        return {
          public: pubKey ?? null,
        };
      },
    },
  },
  metadata: {
    authors: (ws: WebSocket, authors: string[]) => ({
      queryKey: [ws, authors],
      queryFn: () =>
        fetchNostrEvents(
          ws,
          makeMessageReq({ kinds: [eventKind.Metadata], authors, limit: 5 })
        ),
    }),
  },
  notes: {
    authors: (ws: WebSocket, authors: string[]) => ({
      queryKey: [ws, authors],
      queryFn: () =>
        fetchNostrEvents(
          ws,
          makeMessageReq({
            kinds: [eventKind.Note],
            authors,
            limit: 10,
            since: Math.floor(Date.now() / 1000) - 60 * 60,
          })
        ),
    }),
  },
  contacts: {
    authors: (ws: WebSocket, authors: string[]) => ({
      queryKey: [ws, authors],
      queryFn: () =>
        fetchNostrEvents(
          ws,
          makeMessageReq({ kinds: [eventKind.Contacts], authors, limit: 5 })
        ),
    }),
  },
});
