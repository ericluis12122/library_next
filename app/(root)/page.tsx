import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { getLatestBooks } from "@/lib/actions/book";

const Home = async () => {
  const latestBooks = (await getLatestBooks()).data ?? [];

  return (
    <>
      <BookOverview {...latestBooks[0]} />

      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
