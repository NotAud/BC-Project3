import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "./models/user.model";

type User = {
  username: string;
  password: string;
};

const resolvers = {
  Query: {
    getAllUsers: async () => {
      return await UserModel.find();
    },
  },
  Mutation: {
    createUser: async (_: any, { username, password }: User) => {
      const newUser = new UserModel({ username, password });
      return await newUser.save();
    },
    login: async (_: any, { username, password }: User) => {
      // Find the user by username
      const user = await UserModel.findOne({ username });

      if (!user) {
        throw new Error("User not found");
      }

      // Compare the provided password with the stored password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      // Generate a token (e.g., using JWT)
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      return { token, user };
    },
  },
};

export default resolvers;
