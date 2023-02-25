import { useWsPool } from "@/lib/websocket/store";
import React from "react";

type Options = {
  onOpen?: (e: Event) => void;
  onClose?: (e: CloseEvent) => void;
  onMessage?: (msg: MessageEvent) => void;
  onError?: (e: Event) => void;
};

export function useWsEventHandlers({
  onOpen,
  onClose,
  onMessage,
  onError,
}: Options) {
  const pool = useWsPool();

  React.useEffect(() => {
    const handleOpen = (e: Event) => onOpen?.(e);
    const handleClose = (e: CloseEvent) => onClose?.(e);
    const handleMessage = (e: MessageEvent) => onMessage?.(e);
    const handleError = (e: Event) => onError?.(e);

    if (onOpen) pool?.addEventListener("open", handleOpen);
    if (onClose) pool?.addEventListener("close", handleClose);
    if (onMessage) pool?.addEventListener("message", handleMessage);
    if (onError) pool?.addEventListener("error", handleError);
    return () => {
      if (onOpen) pool?.removeEventListener("open", handleOpen);
      if (onClose) pool?.removeEventListener("close", handleClose);
      if (onMessage) pool?.removeEventListener("message", handleMessage);
      if (onError) pool?.removeEventListener("error", handleError);
    };
  }, [onClose, onError, onMessage, onOpen, pool]);
}
