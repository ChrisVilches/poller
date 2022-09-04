export interface Notifiable {
  notify(title: string, content: string, url?: string): void;
}
