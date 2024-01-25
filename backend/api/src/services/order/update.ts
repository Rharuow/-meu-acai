import { kafka } from "@libs/kafka";
import { KafkaJSConnectionError } from "kafkajs";
import { Request, Response } from "express";
import { GetOrderResponse__Output } from "@/protoBufferTypes/GetOrderResponse";

const producer = kafka.producer({ allowAutoTopicCreation: true });

export const producerUpdateServiceOrder = async (
  req: Request<
    { id: string },
    {},
    Omit<
      GetOrderResponse__Output,
      "creams" | "extras" | "id" | "toppings" | "userId"
    >,
    {}
  >,
  res: Response
) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "updatingOrder",
      messages: [
        { value: JSON.stringify({ id: req.params.id, fields: req.body }) },
      ],
    });

    await producer.disconnect();
    return res.status(204).send("Order updated successfully");
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
