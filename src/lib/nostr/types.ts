export const messageTypesToRelay = ["EVENT", "REQ", "CLOSE", "AUTH"] as const;
export const messageTypesToClient = [
  "EVENT",
  "NOTICE",
  "EOSE",
  "OK",
  "AUTH",
] as const;
export type MessageTypeToRelay = typeof messageTypesToRelay[number];
export type MessageTypeToClient = typeof messageTypesToClient[number];

type Message<
  Type extends MessageTypeToRelay | MessageTypeToClient,
  Rest extends Array<any>
> = [Type, ...Rest];

// TODO: I want to pass `Rest` like: Message<"REQ", string, ...Filter[]>
export type MessageReq = Message<"REQ", [string, ...Filter[]]>;
export type MessageClose = Message<"CLOSE", [string]>;

export const eventKind = {
  Metadata: 0,
  Note: 1,
  RecommendRelay: 2,
  Contacts: 3,
  EncryptedDirectMessage: 4,
  EventDeletion: 5,
  Reaction: 7,
  ChannelCreation: 40,
  ChannelMetadata: 41,
  ChannelMessage: 42,
  ChannelHideMessage: 43,
  ChannelMuteUser: 44,
} as const;

export type EventKind = keyof typeof eventKind;
export type EventKindNum = typeof eventKind[EventKind];

export type Note = {
  id: string;
  pubkey: string;
  created_at: number;
  kind: EventKindNum;
  content: string;
  sig: string;
};

export type Filter = {
  ids?: string[];
  kinds?: EventKindNum[];
  authors?: string[];
  since?: number;
  until?: number;
  limit?: number;
  "#e"?: string[];
  "#p"?: string[];
};
