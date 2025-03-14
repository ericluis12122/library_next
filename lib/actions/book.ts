"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { Book, BorrowBookParams } from "@/types";
import dayjs from "dayjs";

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

export const borrowBook = async ({ bookId, userId }: BorrowBookParams) => {
  try {
    const [book] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book || book.availableCopies < 1) {
      return { success: false, message: "Book is not available for borrowing" };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db
      .insert(borrowRecords)
      .values({ bookId, userId, dueDate });

    console.log(`Book -> ${bookId} borrowed to user -> ${userId}`);

    await db
      .update(books)
      .set({ availableCopies: book.availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "An error occurred while borrowing he book",
    };
  }
};
