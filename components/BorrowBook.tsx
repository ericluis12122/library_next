"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  bookId: string;
  userId: string;
  isBorrowingPosible: { ok: boolean; message: string };
}

const BorrowBook = ({
  bookId,
  userId,
  isBorrowingPosible: { ok, message },
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);
  const handleBorrow = async () => {
    if (!ok) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

      return;
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({ bookId, userId });

      if (result.success) {
        toast({
          title: "Success",
          description: "Book borrowed successfully",
        });

        router.push("/my_profile");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while borrowing the book",
        variant: "destructive",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <>
      <Button
        className="book-overview_btn"
        onClick={handleBorrow}
        disabled={borrowing}
      >
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
          {borrowing ? "Borrowing ..." : "Borrow Book"}
        </p>
      </Button>
    </>
  );
};

export default BorrowBook;
