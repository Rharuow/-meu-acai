import { kafka } from "@libs/kafka";
import { KafkaJSConnectionError } from "kafkajs";
import { Request, Response } from "express";

const producer = kafka.producer({ allowAutoTopicCreation: true });

export const producerDeleteServiceOrder = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response
) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "deletingOrder",
      messages: [{ value: req.params.id }],
    });

    await producer.disconnect();
    return res.status(204).send("Order deleted successfully");
  } catch (error) {
    console.error("Error producing message:", error);
    if (error instanceof KafkaJSConnectionError) {
      // Handle Kafka errors
      // Handle specific error types as needed
      return res.status(500).send("Kafka Not Connected" + error.message);
      // Handle other Kafka errors or provide a generic response
    } else {
      // Handle other errors or provide a generic response
      return res.status(500).send("Internal Server Error");
    }
  }
};
