import { prismaClient } from "@libs/prisma";
import { ROLE } from "@prisma/client";

export const getRoleByName = async ({ name }: { name: ROLE }) => {
  try {
    return await prismaClient.role.findFirst({ where: { name } });
  } catch (error) {
    console.error("Error to get role by name = ", error);
    throw new Error(error);
  }
};

export const createRole = async ({ name }: { name: ROLE }) => {
  try {
    return await prismaClient.role.create({ data: { name } });
  } catch (error) {
    console.error("Error to create role = ", error);
    throw new Error(error);
  }
};
