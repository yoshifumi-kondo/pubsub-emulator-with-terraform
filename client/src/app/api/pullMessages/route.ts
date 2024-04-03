import { pubsub } from "@/lib/pubsub";
import type { Message } from "@google-cloud/pubsub";

export async function POST(request: Request) {
  const { topicNameOrId, subscriptionName } = await request.json();
  const messages: string[] = [];

  try {
    const topic = await pubsub.topic(topicNameOrId);
    console.log(`Topic ${topic.name} created.`);

    const subscription = pubsub.subscription(subscriptionName);

    const messageHandler = (message: Message) => {
      console.log("Received message:", message.data.toString());
      messages.push(message.data.toString());
      message.ack();
    };
    const errorHandler = (error: Error) => {
      console.error("Received error:", error);
    };
    subscription.on("message", messageHandler);
    subscription.on("error", errorHandler);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    subscription.removeListener("message", messageHandler);
    subscription.removeListener("error", errorHandler);

    return new Response(JSON.stringify({ messages }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error pulling messages:", error);
    return new Response(JSON.stringify({ error: "Failed to pull messages" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
