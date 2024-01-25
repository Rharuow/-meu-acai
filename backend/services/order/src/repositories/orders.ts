import { CreateOrderRequest } from "@/protoBufferTypes/CreateOrderRequest";
import { IOrderDocument, OrderModel } from "@models/order";
import { ListOrderRequest__Output } from "@/protoBufferTypes/ListOrderRequest";
import { createQuery } from "./utils/queryBuilder";

export const createOrderRepository = async (order: CreateOrderRequest) => {
  try {
    return await OrderModel.create(order);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateOrderRepository = async (
  id: string,
  fields: Omit<IOrderDocument, "userId">
) => {
  try {
    return await OrderModel.updateOne({ _id: id }, { $set: fields });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteOrderRepository = async (id: string) => {
  try {
    return await OrderModel.deleteOne({ id });
  } catch (error) {
    throw new Error(error);
  }
};

export const listOrderRepository = async ({
  page,
  perPage,
  orderBy,
  filter,
}: ListOrderRequest__Output) => {
  // Calculate the skip value based on the page and perPage values
  const skip = (page - 1) * perPage;
  const [fieldOrderBy, order] = orderBy.split(":");
  try {
    // console.log("page = ", page);
    // console.log("perPage = ", perPage);
    // console.log("orderBy = ", orderBy);
    // console.log("filter = ", filter);
    const [orders, totalOrders] = await Promise.all([
      OrderModel.find(
        filter ? createQuery({ filterFields: filter.split(",") }) : {}
      )
        .skip(skip)
        .limit(perPage)
        .sort({
          [fieldOrderBy]: order === "asc" ? 1 : -1,
        }),
      OrderModel.countDocuments(
        filter && createQuery({ filterFields: filter.split(",") })
      ),
    ]);

    const totalPages = Math.ceil(totalOrders / perPage);

    return {
      orders,
      totalPages,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const getOrderRepository = async (id: string) => {
  try {
    return await OrderModel.findById(id).exec();
  } catch (error) {
    throw new Error(error);
  }
};
