import mongoose from "mongoose";

const lobbySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  players: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
  maxPlayers: {
    type: Number,
    required: true,
  },
  gameStatus: {
    type: String,
    enum: ["waiting", "started", "ended"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

lobbySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

lobbySchema.set("toJSON", {
  virtuals: true,
});

const Lobby = mongoose.model("Lobby", lobbySchema);

export default Lobby;
