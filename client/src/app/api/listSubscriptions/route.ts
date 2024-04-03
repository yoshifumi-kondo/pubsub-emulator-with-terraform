import { pubsub } from "@/lib/pubsub";

export async function GET() {
  try {
    const [subscriptions] = await pubsub.getSubscriptions();
    const subscriptionNames = subscriptions.map((subscription) =>
      subscription.name.split("/").pop()
    );
    return new Response(JSON.stringify({ subscriptions: subscriptionNames }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch subscriptions" }),
      { status: 500 }
    );
  }
}
