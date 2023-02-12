import { Filter, MessageClose, MessageReq } from "@/lib/nostr/types";
import { uid } from "@/lib/uid";

export function makeMessageReq(...filter: Filter[]): MessageReq {
  return ["REQ", uid(), ...filter];
}

export function makeMessageClose(subscriptionId: string): MessageClose {
  return ["CLOSE", subscriptionId];
}
