import { connect } from 'amqplib';

export let channel: any, connection: any;
export const CHANNEL_NAME = 'task_queue';

export async function connectRabbitmq(retrys = 5, delay = 5000): Promise<void> {
  while (retrys > 0) {
    try {
      connection = await connect(process.env.RABBITMQ_URI ?? 'amqp://localhost');
      channel = await connection.createChannel();
      await channel.assertQueue(CHANNEL_NAME);
      console.log('Rabbitmq connected :)');
      break;
    } catch (error: unknown) {
      console.error('Error connecting to RabbitMQ:', error);
      retrys--;

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
