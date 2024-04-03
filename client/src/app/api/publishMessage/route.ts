import { pubsub } from "@/lib/pubsub";

export async function POST(request: Request) {
  const { topicName, message } = await request.json();
  try {
    const topic = pubsub.topic(topicName);
    const messageId = await topic.publishMessage({
      data: Buffer.from(message),
    });
    return new Response(JSON.stringify({ messageId }), { status: 200 });
  } catch (error) {
    console.error("Error publishing message:", error);
    return new Response(
      JSON.stringify({ error: "Failed to publish message" }),
      { status: 500 }
    );
  }
}
