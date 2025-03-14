"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { User } from "@/types";
import { eq } from "drizzle-orm";

export const getUserById = async (
  id: string,
): Promise<{
  success: boolean;
  data?: User;
  message?: string;
}> => {
  try {
    const user = (
      await db.select().from(users).where(eq(users.id, id)).limit(1)
    )[0] as User;

    if (!user)
      return {
        success: false,
        message: "User not found!",
      };

    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching users: ", error);
    return {
      success: false,
      message: "Error fetching user",
    };
  }
};
