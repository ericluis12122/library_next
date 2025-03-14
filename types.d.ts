export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

export type BookCreateParams = Omit<
  Book,
  "id" | "availableCopies" | "isLoanedBook"
>;

export interface BorrowBookParams {
  bookId: string;
  userId: string;
}

export interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

export interface User {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}
