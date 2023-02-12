import { useWs } from "@/lib/websocket/store";
import React from "react";

type Options = {
  onOpen?: (e: Event, ws: WebSocket) => void;
  onClose?: (e: CloseEvent, ws: WebSocket) => void;
  onMessage?: (msg: MessageEvent, ws: WebSocket) => void;
  onError?: (e: Event, ws: WebSocket) => void;
};

export function useWsEventHandlers({
  onOpen,
  onClose,
  onMessage,
  onError,
}: Options) {
  const ws = useWs();

  React.useEffect(() => {
    const handleOpen = (e: Event) => onOpen?.(e, ws!);
    const handleClose = (e: CloseEvent) => onClose?.(e, ws!);
    const handleMessage = (e: MessageEvent) => onMessage?.(e, ws!);
    const handleError = (e: Event) => onError?.(e, ws!);

    if (onOpen) ws?.addEventListener("open", handleOpen);
    if (onClose) ws?.addEventListener("close", handleClose);
    if (onMessage) ws?.addEventListener("message", handleMessage);
    if (onError) ws?.addEventListener("error", handleError);
    return () => {
      if (onOpen) ws?.removeEventListener("open", handleOpen);
      if (onClose) ws?.removeEventListener("close", handleClose);
      if (onMessage) ws?.removeEventListener("message", handleMessage);
      if (onError) ws?.removeEventListener("error", handleError);
    };
  }, [onClose, onError, onMessage, onOpen, ws]);
}
