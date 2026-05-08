import { NotificationFilter, NotificationItem, NotificationType } from "../types";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaGFydmVzaC5jZDIzQGJpdHNhdGh5LmFjLmluIiwiZXhwIjoxNzc4MjMxOTk3LCJpYXQiOjE3NzgyMzEwOTcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI2ZmYzYTIzZi01ZmU0LTQwMjMtOWVlNy0wOGQ5MjJiM2ExYjgiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzaGFydmVzaCBzIHJhbWNoYW5kYW5pIiwic3ViIjoiOTdkODA4MWItMTRkNi00YTFmLTkxMWEtOWNmOWZlZjZlMTJiIn0sImVtYWlsIjoic2hhcnZlc2guY2QyM0BiaXRzYXRoeS5hYy5pbiIsIm5hbWUiOiJzaGFydmVzaCBzIHJhbWNoYW5kYW5pIiwicm9sbE5vIjoiNzM3NjIzMWNkMTQ4IiwiYWNjZXNzQ29kZSI6InVLYUpmbSIsImNsaWVudElEIjoiOTdkODA4MWItMTRkNi00YTFmLTkxMWEtOWNmOWZlZjZlMTJiIiwiY2xpZW50U2VjcmV0IjoicFpiaEVIRlJuZHZVdVBKayJ9.UEBCh6Ntg86BkaEX5zTFi3SAQ4bN4CIPwdDQZZcGIGg";

const PRIORITY_ORDER: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function readString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function readBoolean(
  record: Record<string, unknown>,
  keys: string[],
  fallback = false,
): boolean {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      if (value.toLowerCase() === "true") {
        return true;
      }
      if (value.toLowerCase() === "false") {
        return false;
      }
    }
  }

  return fallback;
}

function normalizeType(value: string): NotificationType {
  const lowered = value.toLowerCase();
  if (lowered === "placement") {
    return "Placement";
  }
  if (lowered === "result") {
    return "Result";
  }
  return "Event";
}

function normalizeNotification(entry: unknown, index: number): NotificationItem {
  const record = asRecord(entry);
  const type = normalizeType(
    readString(record, ["type", "notification_type", "category"]) || "Event",
  );
  const timestamp =
    readString(record, [
      "timestamp",
      "createdAt",
      "created_at",
      "date",
      "datetime",
    ]) || new Date(0).toISOString();
  const title =
    readString(record, ["title", "subject", "heading"]) || `${type} notification`;
  const message =
    readString(record, ["message", "body", "description", "content"]) ||
    "No message provided.";
  const id =
    readString(record, ["id", "_id", "notificationId"]) || `${type}-${index}`;

  return {
    id,
    title,
    message,
    type,
    read: readBoolean(record, ["read", "isRead", "is_read"], false),
    timestamp,
    timestampMs: Number.isNaN(new Date(timestamp).getTime())
      ? 0
      : new Date(timestamp).getTime(),
    raw: record,
  };
}

function extractNotifications(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = asRecord(payload);
  const candidates = [
    record.notifications,
    record.data,
    record.items,
    record.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch notifications.");
  }

  const payload = (await response.json()) as unknown;
  return extractNotifications(payload).map((entry, index) =>
    normalizeNotification(entry, index),
  );
}

export function filterNotifications(
  notifications: NotificationItem[],
  filter: NotificationFilter,
): NotificationItem[] {
  if (filter === "All") {
    return notifications;
  }

  return notifications.filter((notification) => notification.type === filter);
}

export function sortByPriority(notifications: NotificationItem[]): NotificationItem[] {
  return [...notifications].sort((left, right) => {
    const priorityGap = PRIORITY_ORDER[right.type] - PRIORITY_ORDER[left.type];
    if (priorityGap !== 0) {
      return priorityGap;
    }

    return right.timestampMs - left.timestampMs;
  });
}

export function sortByRecency(notifications: NotificationItem[]): NotificationItem[] {
  return [...notifications].sort(
    (left, right) => right.timestampMs - left.timestampMs,
  );
}
