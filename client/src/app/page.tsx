"use client";
import { useState, useEffect } from "react";

interface Topic {
  name: string;
}

interface Subscription {
  name: string;
  topic: string;
}

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState("");
  const [messageToPublish, setMessageToPublish] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    fetchTopics();
    fetchSubscriptions();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/listTopics");
      const data = await response.json();
      setTopics(data.topics.map((name: string) => ({ name })));
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/listSubscriptions");
      const data = await response.json();
      setSubscriptions(
        data.subscriptions.map((name: string) => ({
          name,
          topic: "",
        }))
      );
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const publishMessage = async () => {
    try {
      const response = await fetch("/api/publishMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName: selectedTopic,
          message: messageToPublish,
        }),
      });
      const data = await response.json();
      console.log(data);
      setMessageToPublish("");
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  };

  const pullMessages = async () => {
    try {
      const response = await fetch("/api/pullMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicNameOrId: selectedTopic,
          subscriptionName: selectedSubscription,
        }),
      });
      const data = await response.json();
      setReceivedMessages(data.messages);
    } catch (error) {
      console.error("Error pulling messages:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className=" mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Pub/Sub Emulator</h1>
            </div>
            <div className="divide-y divide-gray-20">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label
                    htmlFor="topic"
                    className="text-sm font-medium text-gray-500"
                  >
                    Select or create a topic
                  </label>
                  <select
                    id="topic"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a topic</option>
                    {topics.map((topic) => (
                      <option key={topic.name} value={topic.name}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="subscription"
                    className="text-sm font-medium text-gray-500"
                  >
                    Select or create a subscription
                  </label>
                  <select
                    id="subscription"
                    value={selectedSubscription}
                    onChange={(e) => setSelectedSubscription(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a subscription</option>
                    {subscriptions.map((subscription) => (
                      <option key={subscription.name} value={subscription.name}>
                        {subscription.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-8">
                <h2 className="text-lg font-medium">Publish Message</h2>
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    value={messageToPublish}
                    onChange={(e) => setMessageToPublish(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    placeholder="Enter message"
                  />
                  <button
                    type="button"
                    onClick={publishMessage}
                    className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Publish
                  </button>
                </div>
              </div>
              <div className="mt-8">
                <h2 className="text-lg font-medium">Received Messages</h2>
                <button
                  type="button"
                  onClick={pullMessages}
                  className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Pull Messages
                </button>
                <ul className="mt-4 space-y-2">
                  {receivedMessages.map((message) => (
                    <li key={message} className="bg-gray-100 p-2 rounded">
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
