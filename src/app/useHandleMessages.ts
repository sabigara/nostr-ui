import { atomContacts, atomMetadata, atomNotes } from "@/app/store";
import { eventKind, Metadata } from "@/lib/nostr/types";
import { useNostrMessages } from "@/lib/nostr/useNostrMessages";
import { useSetAtom } from "jotai";
import uniqBy from "lodash.uniqby";

export function useHandleMessages() {
  const setMetadata = useSetAtom(atomMetadata);
  const setNotes = useSetAtom(atomNotes);
  const setContacts = useSetAtom(atomContacts);

  useNostrMessages({
    onEvent(e) {
      switch (e.kind) {
        case eventKind.Metadata: {
          setMetadata((curr) =>
            uniqBy(
              [...curr, { ...e, content: JSON.parse(e.content) as Metadata }],
              (item) => item.id
            )
          );
          break;
        }
        case eventKind.Note: {
          setNotes((curr) => uniqBy([...curr, e], (item) => item.id));
          break;
        }
        case eventKind.Contacts: {
          setContacts((curr) => uniqBy([...curr, e], (item) => item.id));
          break;
        }
        default:
          break;
      }
    },
    onNotice(errorMsg) {
      console.error(errorMsg);
    },
  });
}
