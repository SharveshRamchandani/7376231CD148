export type NotificationType = "Event" | "Result" | "Placement";

export type NotificationFilter = "All" | NotificationType;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  timestampMs: number;
  raw: Record<string, unknown>;
}
