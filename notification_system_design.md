# Stage 1

The solution fetches notifications from the provided API using the given bearer token and then assigns a priority score to each notification. The score combines a fixed type weight and a recency boost so that newer notifications rank higher.

Type weights:
- `Placement = 3`
- `Result = 2`
- `Event = 1`

For recency, the script reads `timestamp` or `createdAt`, converts it to milliseconds, and gives newer items a slightly better score than older ones. After scoring all notifications, it sorts them in descending order and prints the top 10 results to the console.

This keeps the implementation simple while still producing a priority inbox based on category importance and freshness.
