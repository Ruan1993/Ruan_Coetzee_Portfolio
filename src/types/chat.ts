export type ChatRole = 'user' | 'model';

export interface ChatHistoryItem {
  role: ChatRole;
  parts: readonly [{ text: string }];
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

export interface ChatRequest {
  query: string;
  context: string;
  history: readonly ChatHistoryItem[];
  botName: 'Blop';
  businessName: "Ruan Coetzee's Portfolio";
}
