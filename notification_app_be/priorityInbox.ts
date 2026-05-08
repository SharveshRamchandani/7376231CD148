type NotificationType = "Placement" | "Result" | "Event" | string;

interface InboxNotification {
  id?: string;
  type?: NotificationType;
  message?: string;
  title?: string;
  timestamp?: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface ScoredNotification {
  notification: InboxNotification;
  score: number;
  baseScore: number;
  recencyScore: number;
  timestampMs: number;
}

const NOTIFICATIONS_URL =
  "http://4.224.186.213/evaluation-service/notifications";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaGFydmVzaC5jZDIzQGJpdHNhdGh5LmFjLmluIiwiZXhwIjoxNzc4MjM1NzU0LCJpYXQiOjE3NzgyMzQ4NTQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI3ZDc2MGUyZC0xZWYyLTRmMDQtOGViYS1iNzAwZDZjNmU0ZWUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzaGFydmVzaCBzIHJhbWNoYW5kYW5pIiwic3ViIjoiOTdkODA4MWItMTRkNi00YTFmLTkxMWEtOWNmOWZlZjZlMTJiIn0sImVtYWlsIjoic2hhcnZlc2guY2QyM0BiaXRzYXRoeS5hYy5pbiIsIm5hbWUiOiJzaGFydmVzaCBzIHJhbWNoYW5kYW5pIiwicm9sbE5vIjoiNzM3NjIzMWNkMTQ4IiwiYWNjZXNzQ29kZSI6InVLYUpmbSIsImNsaWVudElEIjoiOTdkODA4MWItMTRkNi00YTFmLTkxMWEtOWNmOWZlZjZlMTJiIiwiY2xpZW50U2VjcmV0IjoicFpiaEVIRlJuZHZVdVBKayJ9.40C5lYA9fwirj_Z6GIANn_SZORuxnoZ8T-11w2biWSo";

const TYPE_SCORES: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getBaseScore(type?: NotificationType): number {
  if (!type) {
    return 0;
  }

  return TYPE_SCORES[type] ?? 0;
}

function getTimestampMs(notification: InboxNotification): number {
  const rawTimestamp = notification.timestamp ?? notification.createdAt;
  if (!rawTimestamp) {
    return 0;
  }

  const parsed = new Date(rawTimestamp).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getRecencyScore(timestampMs: number, newestTimestampMs: number): number {
  if (timestampMs === 0 || newestTimestampMs === 0) {
    return 0;
  }

  const diffMinutes = Math.max(
    0,
    Math.floor((newestTimestampMs - timestampMs) / (1000 * 60)),
  );

  return 1 / (1 + diffMinutes);
}

function scoreNotifications(
  notifications: InboxNotification[],
): ScoredNotification[] {
  const newestTimestampMs = notifications.reduce((latest, notification) => {
    return Math.max(latest, getTimestampMs(notification));
  }, 0);

  return notifications.map((notification) => {
    const timestampMs = getTimestampMs(notification);
    const baseScore = getBaseScore(notification.type);
    const recencyScore = getRecencyScore(timestampMs, newestTimestampMs);

    return {
      notification,
      score: baseScore + recencyScore,
      baseScore,
      recencyScore,
      timestampMs,
    };
  });
}

async function fetchNotifications(): Promise<InboxNotification[]> {
  const response = await fetch(NOTIFICATIONS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch notifications: ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as unknown;

  if (Array.isArray(payload)) {
    return payload as InboxNotification[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "notifications" in payload &&
    Array.isArray((payload as { notifications?: unknown }).notifications)
  ) {
    return (payload as { notifications: InboxNotification[] }).notifications;
  }

  throw new Error("Unexpected notifications response format.");
}

async function main(): Promise<void> {
  const notifications = await fetchNotifications();
  const topNotifications = scoreNotifications(notifications)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.timestampMs - left.timestampMs;
    })
    .slice(0, 10);

  console.log("Top 10 notifications:");
  console.log(JSON.stringify(topNotifications, null, 2));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error("Unable to build priority inbox:", message);
  process.exit(1);
});
