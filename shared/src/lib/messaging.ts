import { v4 } from 'uuid';
import * as amqp from 'amqplib';

export async function sendMessage<TRequest, TResponse>(
  exchange: string,
  queue: string,
  routingKey: string,
  requestContent: TRequest = {} as TRequest
): Promise<TResponse> {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'direct', { durable: true });

  const replyQueue = await channel.assertQueue('', { exclusive: true });
  const correlationId = v4();

  const responsePromise = new Promise<TResponse>((resolve) => {
    channel.consume(
      replyQueue.queue,
      async (msg) => {
        if (
          msg &&
          msg.properties &&
          msg.properties.correlationId === correlationId
        ) {
          resolve(JSON.parse(msg.content.toString()) as TResponse);
        }
      },
      { noAck: true }
    );
  });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestContent)), {
    correlationId: correlationId,
    replyTo: replyQueue.queue,
  });

  const response = await responsePromise;

  await channel.deleteQueue(replyQueue.queue);
  await channel.close();
  await connection.close();

  return response;
}

export async function receiveMessage<TRequest, TResponse>(
  exchange: string,
  queue: string,
  routingKey: string,
  processRPCRequest: (
    requestContent: TRequest
  ) => Promise<TResponse> | TResponse
): Promise<void> {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'direct', { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(
    queue,
    async (message) => {
      if (message.content) {
        const requestContent = JSON.parse(
          message.content.toString()
        ) as TRequest;
        const response = await processRPCRequest(requestContent);
        channel.sendToQueue(
          message.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: message.properties.correlationId,
          }
        );
        channel.ack(message);
      }
    },
    { noAck: false }
  );
}
