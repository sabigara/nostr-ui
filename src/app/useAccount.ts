import { db } from "@/lib/storage/indexedDB";
import { useQuery } from "@tanstack/react-query";

export function useAccount() {
  const { data } = useQuery(["account"], () => {
    return db.account.toCollection().first();
  });
  return data;
}
