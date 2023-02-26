import Dialog from "@/components/Dialog";
import RelayPanel from "@/lib/nostr/relay/RelayPanel";
import { IconButton } from "@camome/core/IconButton";
import React from "react";
import { IconAffiliate } from "@tabler/icons-react";

import styles from "./RelayPanelDialog.module.scss";
import { useAtomValue } from "jotai";
import { atomWsPool } from "@/lib/websocket/store";

export default function RelayPanelDialog() {
  const [open, setOpen] = React.useState(false);
  const pool = useAtomValue(atomWsPool);
  return (
    <>
      <IconButton
        aria-label="Open relay panel"
        onClick={() => setOpen(true)}
        variant="ghost"
        size="sm"
        className={styles.button}
      >
        <span className={styles.count}>{pool.openCount}</span>
        <IconAffiliate size="sm" />
      </IconButton>
      <Dialog title="Relays" open={open} setOpen={setOpen} unmount={false}>
        <RelayPanel className={styles.content} />
      </Dialog>
    </>
  );
}
