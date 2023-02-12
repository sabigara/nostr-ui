import {
  Filter,
  MessageClose,
  MessageReq,
  MessageTypeToClient,
  NostrEvent,
} from "@/lib/nostr/types";
import { uid } from "@/lib/uid";

export function makeMessageReq(...filter: Filter[]): MessageReq {
  return ["REQ", uid(), ...filter];
}

export function makeMessageClose(subscriptionId: string): MessageClose {
  return ["CLOSE", subscriptionId];
}

export function handleMessageEvent(
  msg: MessageEvent,
  {
    onEvent,
    onNotice,
    onEose,
  }: {
    onEvent?: (e: NostrEvent, subscriptionId: string) => void;
    onNotice?: (errorMsg: string, subscriptionId: string) => void;
    onEose?: (subscriptionId: string) => void;
  }
) {
  const data = JSON.parse(msg.data);
  const subscriptionId = data[1];
  switch (data[0] as MessageTypeToClient) {
    case "EVENT": {
      onEvent?.(data[2] as NostrEvent, subscriptionId);
      break;
    }
    case "NOTICE": {
      onNotice?.(data[1] as string, subscriptionId);
      break;
    }
    case "EOSE": {
      onEose?.(subscriptionId);
      break;
    }
    case "OK":
    case "AUTH": {
      break;
    }
  }
}
