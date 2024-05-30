import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "./models/user.model.js";
import LobbyModel from "./models/lobby.model.js";
import GameManager from "../api/gamemanager/gameManager.js";

const resolvers = {
  Query: {
    getAllUsers: async () => {
      return await UserModel.find();
    },
    lobbies: async () => {
      try {
        const lobbies = await LobbyModel.find({
          "game.status": { $in: ["waiting", "started"] },
        })
          .populate("owner")
          .populate("players.user");
        return lobbies;
      } catch (error) {
        throw new Error("Failed to retrieve lobbies");
      }
    },
    lobby: async (_, { lobbyId }) => {
      try {
        const lobby = await LobbyModel.findById(lobbyId)
          .populate("owner")
          .populate("players.user");
        return lobby;
      } catch (error) {
        throw new Error("Failed to retrieve lobby");
      }
    },
    historicGames: async () => {
      try {
        const lobbies = await LobbyModel.find({
          "game.status": "ended",
        })
          .limit(50)
          .sort({ endedAt: -1 })
          .populate("owner")
          .populate("players.user");
        return lobbies;
      } catch (error) {
        throw new Error("Failed to retrieve historic games");
      }
    },
  },
  Mutation: {
    createUser: async (_, { username, password }) => {
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
    login: async (_, { username, password }) => {
      // Find the user by username
      const user = await UserModel.findOne({ username }).select("+password");

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
    createLobby: async (_, { name, maxPlayers }, context) => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = context.req.headers.authorization || "";
      if (!token) {
        throw new Error("Authentication required");
      }

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user.userId) {
          throw new Error("User not found");
        }

        const newLobby = new LobbyModel({
          name,
          maxPlayers,
          owner: user.userId,
        });

        const savedLobby = await newLobby.save();
        await savedLobby.populate("owner");

        const { io } = context;
        io.to("main").emit("lobbyCreated", savedLobby);

        setTimeout(async () => {
          const lobby = await LobbyModel.findById(savedLobby.id);
          if (lobby.game.status === "waiting") {
            await LobbyModel.findByIdAndDelete(savedLobby.id);

            const lobbies = await LobbyModel.find({
              "game.status": { $in: ["waiting", "started"] },
            })
              .populate("owner")
              .populate("players.user");
            io.to("main").emit("lobbyDeleted", lobbies);
            io.to(savedLobby.id).emit("lobbyDeleted");
          }
        }, 60 * 1000);

        return savedLobby;
      } catch (error) {
        throw new Error("Authentication required");
      }
    },
    joinLobby: async (_, { lobbyId }, context) => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = context.req.headers.authorization || "";
      if (!token) {
        throw new Error("Authentication required");
      }

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const lobby = await LobbyModel.findById(lobbyId);

        if (!lobby) {
          throw new Error("Lobby not found");
        }

        if (lobby.players.length >= lobby.maxPlayers) {
          throw new Error("Lobby is full");
        }

        const isUserInLobby = lobby.players.some(
          (player) => player.user?.toString() === user.userId.toString()
        );

        if (isUserInLobby) {
          await lobby.populate("owner");
          await lobby.populate("players.user");
          return lobby;
        }

        lobby.players.push({ user: user.userId, score: 0 });
        await lobby.save();

        await lobby.populate("owner");
        await lobby.populate("players.user");

        const { io } = context;
        io.to(lobbyId).emit("lobbyUpdated", lobby);
        io.emit("lobbiesUpdated", lobby);

        return lobby;
      } catch (error) {
        throw new Error("Authentication required");
      }
    },
    startGame: async (_, { lobbyId }, context) => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = context.req.headers.authorization || "";
      if (!token) {
        throw new Error("Authentication required");
      }

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const lobby = await LobbyModel.findById(lobbyId);

        if (!lobby) {
          throw new Error("Lobby not found");
        }

        if (lobby.owner.toString() !== user.userId) {
          throw new Error("Only the lobby owner can start the game");
        }

        const game = new GameManager(lobby, context.io);
        game.startGame();

        return lobby;
      } catch (error) {
        throw new Error("Authentication required");
      }
    },
    submitAnswer: async (_, { lobbyId, score }, context) => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = context.req.headers.authorization;
      if (!token) {
        throw new Error("Authentication required");
      }

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user.userId) {
          throw new Error("User not found");
        }

        const lobby = await LobbyModel.findById(lobbyId);

        if (!lobby) {
          throw new Error("Lobby not found");
        }

        const player = lobby.players.find(
          (player) => player.user?.toString() === user.userId
        );

        if (!player) {
          throw new Error("Player not found in lobby");
        }

        player.score += score;
        await lobby.save();
        await lobby.populate("owner");
        await lobby.populate("players.user");

        const { io } = context;
        io.to(lobbyId).emit("lobbyUpdated", lobby);

        return lobby;
      } catch (error) {
        throw new Error("Authentication required");
      }
    },
  },
};

export default resolvers;
