import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import {GET_ME} from '../utils/graphql/queries'
import { REMOVE_BOOK } from '../utils/graphql/mutations';
import Auth from '../utils/auth';
import { useMutation, useQuery } from '@apollo/client';
import { User } from '../models/User';

const SavedBooks = () => {
  const [userData, setUserData] = useState<User>({
    _id: '',
    username: '',
    email: '',
    bookCount: 0,
    savedBooks: [],
  });

    const { loading, data } = useQuery(GET_ME);
     const [removeBook, { error }] = useMutation
      (REMOVE_BOOK, {
        refetchQueries: [
          GET_ME,
          'me'
        ]
      });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        setUserData(data?.me);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [data]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { book: {bookId} },
      });

      setUserData(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData?.username ? (
            <h1>Viewing {userData?.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedBooks?.length
            ? `Viewing ${userData?.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.savedBooks?.map((book) => {
            return (
              <Col md='4' key={book?.bookId} >
                <Card border='dark'>
                  {book?.image ? (
                    <Card.Img
                      src={book?.image}
                      alt={`The cover for ${book?.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book?.title}</Card.Title>
                    <p className='small'>Authors: {book?.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book?.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
