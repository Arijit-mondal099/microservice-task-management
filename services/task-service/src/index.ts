import "dotenv/config";
import http from "node:http";
import { app } from "./app";
import { connectToDatabase } from "./lib/dbConnection";
import { connectRabbitmq } from "./lib/rabbitmq";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;

async function startServer() {
  const server = http.createServer(app);
  server.listen(PORT, async () => {
    await connectToDatabase();
    await connectRabbitmq();
    console.log(`Task service running on port ${PORT}...`);
    console.log(`http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
