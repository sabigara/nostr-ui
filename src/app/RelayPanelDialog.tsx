import Dialog from "@/components/Dialog";
import RelayPanel from "@/lib/nostr/relay/RelayPanel";
import { IconButton } from "@camome/core/IconButton";
import React from "react";
import { IconAffiliate } from "@tabler/icons-react";

import styles from "./RelayPanelDialog.module.scss";

export default function RelayPanelDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <IconButton
        aria-label="Open relay panel"
        onClick={() => setOpen(true)}
        variant="ghost"
        size="sm"
      >
        <IconAffiliate size="sm" />
      </IconButton>
      <Dialog title="Relays" open={open} setOpen={setOpen} unmount={false}>
        <RelayPanel className={styles.content} />
      </Dialog>
    </>
  );
}
