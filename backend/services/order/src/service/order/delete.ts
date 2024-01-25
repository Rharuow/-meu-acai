import { kafka } from "@libs/kafka";
import { orderInMemory, ordersInMemory } from "@libs/memory-cache";
import { deleteOrderRepository } from "@repositories/orders";

const consumer = kafka.consumer({
  groupId: "deleteOrder",
});

export const deleteOrderService = async () => {
  let orderId: string;
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "deletingOrder" });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          orderId = String(message.value);
          await deleteOrderRepository(orderId);
        } catch (error) {
          console.error("DELETE Error processing message:", error);
        }
      },
    });
    orderInMemory.clear();
    ordersInMemory.clear();
  } catch (err) {
    console.error("DELETE Error to delete service order  =", err);
    throw new Error("Error to delete service order = " + err.message);
  }
};
