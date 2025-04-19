import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { signToken, AuthenticationError } from "../services/auth.js";
interface AddUserArgs {
	user: {
		username: string;
		email: string;
		password: string;
	}
}
interface LoginUserArgs {
   user: {
	email: string;
    password: string;
   }
}
interface SaveBookArgs {
	book: { 
		bookId: string;
		title: string;
		authors: string[];
		description: string;
		image: string;
		link: string;
	};
}

interface DeleteBookArgs {
	book: { 
		bookId: string;
	};
}

const resolvers = {
	Query: {
		me: async (_parent: any, _args: any, context: any) => {
			if (context.user) {
				return await User.findById(context.user._id);
			}
			throw new AuthenticationError("Could not authenticate user.");
		}
	},

	Mutation: {
		addUser: async (_parent: any, { user: newUser }: AddUserArgs) => {
			const hashedPassword = await bcrypt.hash(newUser.password, 10);
			const user = await User.create({
			  email: newUser.email,
			  username: newUser.username,
			  password: hashedPassword,
			});
			const token = signToken(user.username, user.email, user._id);
			return { token, user };
		  },

		login: async (_parent: any, { user }: LoginUserArgs) => {
			const existingUser = await User.findOne({ email: user.email });
			if (!existingUser) {
				throw new AuthenticationError("User does not exist.");
			}

			const isMatch = await existingUser.isCorrectPassword(user.password);

			if (!isMatch) {
				throw new AuthenticationError("Incorrect password.");
			}

			const token = signToken(existingUser.username, existingUser.email, existingUser._id);

			return { token, user: existingUser };
		},

		saveBook: async (_parent: any, { book }: SaveBookArgs, context: any) => {
			if (!context.user) throw new AuthenticationError("You must be logged in to save a book.");

			const user = await User.findById(context.user._id);
			if (user && user.savedBooks.some((b: any) => b.bookId === book.bookId)) {
				throw new Error("Book is already saved.");
			}

			try {
				const updatedUser = await User.findByIdAndUpdate(
					context.user._id,
					{ $addToSet: { savedBooks: book } },
					{ new: true, runValidators: true }
				);
				return updatedUser;
			} catch (error: unknown) {
				throw new Error(`Failed to save book: ${error}`);
			}
		},

		removeBook: async (_parent: any, { book }: DeleteBookArgs, context: any) => {
			if (!context.user) throw new AuthenticationError("You must be logged in to remove a book.");

			try {
				const user = await User.findById(context.user._id);
				if (!user) {
					throw new AuthenticationError("User not found.");
				}
				const bookExists = user.savedBooks.some((b: any) => b.bookId === book.bookId);
				if (!bookExists) {
					throw new Error("Book does not exist.");
				}
	
				const updatedUser = await User.findByIdAndUpdate(
					context.user._id,
					{ $pull: { savedBooks: { bookId: book.bookId } } },
					{ new: true }
				);
				return updatedUser;
			} catch (error: unknown) {
				throw new Error(`Failed to remove book: ${error}`);
			}
		}
	}
};

export default resolvers;
