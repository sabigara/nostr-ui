import { useAccount } from "@/app/useAccount";
import { db } from "@/lib/storage/indexedDB";
import { Button } from "@camome/core/Button";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default function LogInScreen({ children }: Props) {
  const account = useAccount();

  const handleLogin = async () => {
    const pubkey = await window.nostr?.getPublicKey();
    if (!pubkey) {
      console.error("Can't get pubkey");
      return;
    }
    db.account.put({
      pubkey,
    });
  };

  return account ? (
    <>{children}</>
  ) : (
    <div>
      <Button onClick={handleLogin}>Login with Extension</Button>
    </div>
  );
}
