export interface NewUser {
  username: string | null;
  email: string | null;
  password: string | null;
}
export interface ExistingUser {
  email: string | null;
  password: string | null;
}
export interface User {
  _id: string;
  username: string;
  email: string;
  bookCount: number;
  savedBooks: Array<{
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
  }>;
}


