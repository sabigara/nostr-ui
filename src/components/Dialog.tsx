import { Dialog as HeadlessDialog } from "@headlessui/react";
import React from "react";

import { Dialog as CamomeDialog, dialogClassNames } from "@camome/core/Dialog";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: React.ReactNode;
  unmount?: boolean;
  children?: React.ReactNode;
};

export default function Dialog({
  open,
  setOpen,
  title,
  unmount,
  children,
}: Props) {
  return (
    <HeadlessDialog
      as="div"
      open={open}
      onClose={setOpen}
      className={dialogClassNames.container}
      unmount={unmount}
    >
      <div className={dialogClassNames.backdrop} />
      <div className={dialogClassNames.panelWrapper}>
        <HeadlessDialog.Panel className={dialogClassNames.panel}>
          <CamomeDialog.Close onClick={() => setOpen(false)} />
          <HeadlessDialog.Title className={dialogClassNames.title}>
            {title}
          </HeadlessDialog.Title>
          <div className={dialogClassNames.content}>{children}</div>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
}
