import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "./models/user.model";
import LobbyModel from "./models/lobby.model";

type User = {
  username: string;
  password: string;
};

const resolvers = {
  Query: {
    getAllUsers: async () => {
      return await UserModel.find();
    },
    lobbies: async () => {
      try {
        const lobbies = await LobbyModel.find().populate("owner");
        return lobbies;
      } catch (error) {
        throw new Error("Failed to retrieve lobbies");
      }
    },
  },
  Mutation: {
    createUser: async (_: any, { username, password }: User) => {
      try {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
          throw new Error("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ username, password: hashedPassword });

        const savedUser = await newUser.save();

        return savedUser;
      } catch (error) {
        throw new Error("Error creating user");
      }
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
    createLobby: async (_: any, { name, maxPlayers }: any, context: any) => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = context.req.headers.authorization || "";
      if (!token) {
        throw new Error("Authentication required");
      }

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET) as any;

        const newLobby = new LobbyModel({
          name,
          maxPlayers,
          owner: user.userId,
        });

        const savedLobby = await newLobby.save();
        await savedLobby.populate("owner");

        return savedLobby;
      } catch (error) {
        throw new Error("Authentication required");
      }
    },
  },
};

export default resolvers;
