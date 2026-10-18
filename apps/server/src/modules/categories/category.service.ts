import { db } from "../../db/db";
import { categories as categoryTable } from "../../db/schemas";

export const getAllCategories = async () => {
  const categories = await db.select().from(categoryTable);
  return categories;
};
