import { connect } from "amqplib";

export let channel: any, connection: any;
export const CHANNEL_NAME = "task_queue";

type TaskEvent =
  | { event: "task_created"; data: { id: string; title: string } };

async function handleEvent(evt: TaskEvent): Promise<void> {
  switch (evt.event) {
    case "task_created":
      // TODO: send email / push / persist notification
      console.log(`[notify] task created: ${evt.data.title} (${evt.data.id})`);
      break;
    default:
      console.warn("[notify] unknown event:", evt);
  }
}

export async function consumeMessages(retries = 5, delay = 5000): Promise<void> {
  while (retries > 0) {
    try {
      connection = await connect(process.env.RABBITMQ_URI ?? "amqp://localhost");
      channel = await connection.createChannel();
      await channel.assertQueue(CHANNEL_NAME, { durable: true });
      console.log("Rabbitmq connected, waiting for messages...");

      channel.consume(CHANNEL_NAME, async (msg: any) => {
        if (!msg) return;
        try {
          const evt = JSON.parse(msg.content.toString()) as TaskEvent;
          await handleEvent(evt);
          channel.ack(msg);
        } catch (err) {
          console.error("[notify] handler failed:", err);
          channel.nack(msg, false, false); // drop poison message
        }
      });
      return;
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      retries--;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
