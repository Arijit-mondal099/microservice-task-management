import "dotenv/config";
import { app } from "./app";
import { consumeMessages } from "./lib/rabbitmq";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4002;

app.listen(PORT, async () => {
  console.log(`Notification service running on port ${PORT}`);
  await consumeMessages();
  console.log(`http://localhost:${PORT}`);
});
