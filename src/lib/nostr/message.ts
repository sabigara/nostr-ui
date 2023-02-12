import { Filter, MessageClose, MessageReq } from "@/lib/nostr/types";
import hash from "object-hash";

export function makeMessageReq(...filter: Filter[]): MessageReq {
  return ["REQ", hash(filter), ...filter];
}

export function makeMessageClose(subscriptionId: string): MessageClose {
  return ["CLOSE", subscriptionId];
}
