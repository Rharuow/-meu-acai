import { kafka } from "@libs/kafka";
import { orderInMemory, ordersInMemory } from "@libs/memory-cache";
import { updateOrderRepository } from "@repositories/orders";

const consumer = kafka.consumer({
  groupId: "updateOrder",
});

export const updateOrderService = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "updatingOrder" });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { id, fields } = JSON.parse(String(message.value));

          await updateOrderRepository(id, fields);
        } catch (error) {
          console.error("UPDATE Error processing message:", error);
        }
      },
    });
    orderInMemory.clear();
    ordersInMemory.clear();
  } catch (err) {
    console.error("UPDATE Error to update service order  =", err);
    throw new Error("Error to update service order = " + err.message);
  }
};
