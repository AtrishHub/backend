export class MessageDto {
  messages: { role: 'user' | 'assistant'; content: string }[];
  sessionId: string;
}