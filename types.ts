
export type MessageSender = "user" | "bot";

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'work' | 'personal' | 'important';
}

export interface CalendarState {
  events: CalendarEvent[];
  selectedDate: Date;
}
