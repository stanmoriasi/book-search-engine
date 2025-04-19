import { gql } from "@apollo/client";

export const ADD_USER = gql`
	mutation AddUser($user: AddUserInput!) {
		addUser(user: $user) {
			token
			user {
				_id
				username
				email
				bookCount
				savedBooks {
					bookId
					authors
					title
					description
					image
					link
				}
			}
		}
	}
`;

export const LOGIN_USER = gql`
	mutation Login($user: LoginInput!) {
		login(user: $user) {
			token
			user {
				_id
				username
				email
				bookCount
				savedBooks {
					bookId
					authors
					title
					description
					image
					link
				}
			}
		}
	}
`;

export const SAVE_BOOK = gql`
	mutation SaveBook($book: BookInput!) {
		saveBook(book: $book) {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				title
				authors
				description
				image
				link
			}
		}
	}
`;

export const REMOVE_BOOK = gql`
	mutation RemoveBook($book: DeleteBookInput!) {
		removeBook(book: $book) {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				title
				authors
				description
				image
				link
			}
		}
	}
`;
