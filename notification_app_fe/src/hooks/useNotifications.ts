import { useEffect, useState } from "react";
import { fetchNotifications, sortByRecency } from "../services/notifications";
import { NotificationItem } from "../types";

interface UseNotificationsResult {
  notifications: NotificationItem[];
  loading: boolean;
  error: string;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        setLoading(true);
        setError("");
        const items = await fetchNotifications();

        if (!isMounted) {
          return;
        }

        setNotifications(sortByRecency(items));
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load notifications.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return { notifications, loading, error };
}
