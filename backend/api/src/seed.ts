import { createRole, getRoleByName } from "@repositories/role";
import { getUserByNameAndPassword } from "@repositories/user";
import { createAdmin } from "@repositories/user/admin";

export const createDefaultAdmin = async () => {
  const hasUserDefault = await getUserByNameAndPassword({
    name: process.env.DEFAULT_ADMIN_NAME,
    password: process.env.DEFAULT_ADMIN_PASSWORD,
  });
  if (hasUserDefault) return;
  const roleId = (await getRoleByName({ name: "ADMIN" })).id;
  try {
    await createAdmin({
      name: process.env.DEFAULT_ADMIN_NAME,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
      email: process.env.DEFAULT_ADMIN_EMAIL,
      roleId,
    });
  } catch (error) {
    console.error("ERROR TO SEED DEFAULT ADMIN = ", error);
    throw new Error(error);
  }
};

export const createRolesDefault = async () => {
  try {
    const [adminRole, clientRole, memberRole] = await Promise.all([
      getRoleByName({ name: "ADMIN" }),
      getRoleByName({ name: "CLIENT" }),
      getRoleByName({ name: "MEMBER" }),
    ]);
    if (adminRole && clientRole && memberRole) return;
    await Promise.all([
      !adminRole && createRole({ name: "ADMIN" }),
      !clientRole && createRole({ name: "CLIENT" }),
      !memberRole && createRole({ name: "MEMBER" }),
    ]);
  } catch (error) {
    console.error("ERROR TO SEED DEFAULT ROLES = ", error);
    throw new Error(error);
  }
};
