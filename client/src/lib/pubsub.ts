import { PubSub } from "@google-cloud/pubsub";

export const pubsub = new PubSub({
  projectId: "emulator-project",
  apiEndpoint: "localhost:8085",
});
