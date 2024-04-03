FROM google/cloud-sdk:464.0.0

# Install the PubSub emulator component using apt-get
RUN apt-get update && apt-get install -y google-cloud-cli-pubsub-emulator

ENV PUBSUB_EMULATOR_HOST=0.0.0.0:8085

EXPOSE 8085

CMD ["sh", "-c", "gcloud config set project emulator-project && gcloud beta emulators pubsub start --host-port=0.0.0.0:8085"]
