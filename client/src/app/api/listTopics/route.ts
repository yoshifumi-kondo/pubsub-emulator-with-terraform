import { pubsub } from "@/lib/pubsub";

export async function GET() {
  try {
    const [topics] = await pubsub.getTopics();
    const topicNames = topics.map((topic) => topic.name.split("/").pop());
    return new Response(JSON.stringify({ topics: topicNames }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch topics" }), {
      status: 500,
    });
  }
}
