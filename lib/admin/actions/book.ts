"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { BookCreateParams } from "@/types";

export const createBook = async (params: BookCreateParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({ ...params, availableCopies: params.totalCopies })
      .returning();

    console.log(`New book created: ${params.title}`);

    return { success: true, data: JSON.parse(JSON.stringify(newBook[0])) };
  } catch (error) {
    console.error("Error creating book: ", error);
    return { success: false, error: "Error creating book" };
  }
};
