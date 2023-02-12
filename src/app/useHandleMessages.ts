import { contactsAtom, notesAtom } from "@/app/store";
import { eventKind } from "@/lib/nostr/types";
import { useNostrMessages } from "@/lib/nostr/useNostrMessages";
import { useSetAtom } from "jotai";
import uniqBy from "lodash.uniqby";

export function useHandleMessages() {
  const setNotes = useSetAtom(notesAtom);
  const setContacts = useSetAtom(contactsAtom);

  useNostrMessages({
    onEvent(e) {
      switch (e.kind) {
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
