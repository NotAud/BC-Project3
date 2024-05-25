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
    lobby: async (_: any, { lobbyId }: any) => {
      try {
        const lobby = await LobbyModel.findById(lobbyId)
          .populate("owner")
          .populate("players");
        return lobby;
      } catch (error) {
        throw new Error("Failed to retrieve lobby");
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

        const emittedLobby = {
          id: savedLobby._id.toString(),
          name: savedLobby.name,
          maxPlayers: savedLobby.maxPlayers,
          owner: savedLobby.owner,
        };

        const { io } = context;
        io.to("main").emit("lobbyCreated", emittedLobby);

        return emittedLobby;
      } catch (error) {
        throw new Error("Authentication required");
      }
    },
    joinLobby: async (_: any, { lobbyId }: any, context: any) => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = context.req.headers.authorization || "";
      if (!token) {
        throw new Error("Authentication required");
      }

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET) as any;
        const lobby = await LobbyModel.findById(lobbyId);

        if (!lobby) {
          throw new Error("Lobby not found");
        }

        if (lobby.players.length >= lobby.maxPlayers) {
          throw new Error("Lobby is full");
        }

        const isUserInLobby = lobby.players.some(
          (player) => player.toString() === user.userId
        );

        if (isUserInLobby) {
          await lobby.populate("owner");
          await lobby.populate("players");
          return lobby;
        }

        lobby.players.push(user.userId);
        await lobby.save();

        await lobby.populate("owner");
        await lobby.populate("players");

        const { io } = context;
        const emittedLobby = {
          id: lobby._id.toString(),
          name: lobby.name,
          maxPlayers: lobby.maxPlayers,
          owner: lobby.owner,
          players: lobby.players,
        };
        io.to(lobbyId).emit("lobbyUpdated", emittedLobby);

        return emittedLobby;
      } catch (error) {
        console.log(error);
        throw new Error("Authentication required");
      }
    },
  },
};

export default resolvers;
