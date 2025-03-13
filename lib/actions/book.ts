"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { Book } from "@/types";

export const getLatestBooks = async (): Promise<{
  success: boolean;
  data?: Book[];
  message?: string;
}> => {
  try {
    const booksList = (await db
      .select()
      .from(books)
      .limit(10)
      .orderBy(desc(books.createdAt))) as Book[];

    return { success: true, data: booksList };
  } catch (error) {
    console.error("Error fetching books: ", error);
    return {
      success: false,
      message: "Error fetching books",
    };
  }
};

export const getBookById = async (
  id: string,
): Promise<{
  success: boolean;
  data?: Book;
  message?: string;
}> => {
  try {
    const book = (
      await db.select().from(books).where(eq(books.id, id)).limit(1)
    )[0] as Book;

    return { success: true, data: book };
  } catch (error) {
    console.error("Error fetching books: ", error);
    return {
      success: false,
      message: "Error fetching book",
    };
  }
};
