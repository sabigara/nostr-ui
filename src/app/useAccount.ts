import { db } from "@/lib/storage/indexedDB";
import { useLiveQuery } from "dexie-react-hooks";

export function useAccount() {
  const account = useLiveQuery(() => {
    return db.account.toCollection().first();
  });
  return account;
}
