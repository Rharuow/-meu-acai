export type Params = {
  page: number;
  perPage: number;
  orderBy: string;
  filter?: string;
  customFilter?: {};
};

type Operator =
  | string
  | boolean
  | { $regex: RegExp }
  | { $gt: number }
  | { $gte: number }
  | { $lt: number }
  | { $lte: number };

type WhereType = {
  [key: string]: Operator;
};

const parseValue = (operator: string, value: string): Operator => {
  if (operator === "like") {
    return { $regex: new RegExp(value, "i") };
  } else if (operator === "true") {
    return true;
  } else if (operator === "false") {
    return false;
  } else if (operator === "gt") {
    return { $gt: Number(value) };
  } else if (operator === "gte") {
    return { $gte: Number(value) };
  } else if (operator === "lt") {
    return { $lt: Number(value) };
  } else if (operator === "lte") {
    return { $lte: Number(value) };
  } else {
    return value;
  }
};

export const createQuery = ({ filterFields }: { filterFields: string[] }) => {
  const where: WhereType = {};
  if (filterFields)
    filterFields.forEach((filter) => {
      const [key, operator, value] = filter.split(":");
      where[key] = parseValue(operator, value);
    });

  return where;
};
