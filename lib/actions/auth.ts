"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { AuthCredentials } from "@/types";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export const signUp = async ({
  fullName,
  email,
  password,
  universityId,
  universityCard,
}: AuthCredentials) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0)
    return { success: false, error: "User Already exists" };

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
      universityId,
      universityCard,
    });

    console.log(`New user registered: ${email}`);

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.error("Sign Up error: ", error);
    return { success: false, error: "Sign Up error" };
  }
};

export const signInWithCredentials = async ({
  email,
  password,
}: Pick<AuthCredentials, "email" | "password">) => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) return { success: false, error: result.error };

    console.log(`User has login: ${email}`);

    return { success: true };
  } catch (error) {
    console.error("Sign In error: ", error);
    return { success: false, error: "Sign In error" };
  }
};
