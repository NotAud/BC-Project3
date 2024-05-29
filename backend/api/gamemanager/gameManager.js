import QUESTION_JSON from "../../util/questions.json" assert { type: "json" };
import LobbyModel from "../../database/models/lobby.model.js";

const questions = QUESTION_JSON;

const MAX_ROUNDS = 10;
const ROUND_TIME = 10;

export default class GameManager {
  lobby;
  round = 0;
  socket;

  constructor(lobby, socket) {
    this.lobby = lobby;
    this.socket = socket;
  }

  async startRound() {
    const question = await this.generateQuestion();
    console.log(question);

    this.lobby.game.currentRound = this.round;
    this.lobby.game.roundTimestamp = new Date().getTime();
    this.lobby.game.currentQuestion = question;
    await this.lobby.save();

    this.emitToPlayers("roundStarted", this.lobby);
  }

  async startGame() {
    this.lobby.game.status = "started";
    await this.lobby.save();

    await this.lobby.populate("owner");
    await this.lobby.populate("players.user");

    this.emitToPlayers("gameStarted", this.lobby);
    this.startRound();

    let currentTime = new Date().getTime();
    const interval = setInterval(async () => {
      console.log(this.lobby.game.roundTime);
      const elapsedTime = new Date().getTime() - currentTime;
      if (elapsedTime >= this.lobby.game.roundTime * 1000) {
        this.lobby = await LobbyModel.findById(this.lobby.id)
          .populate("owner")
          .populate("players.user");

        currentTime = new Date().getTime();
        this.round++;
        if (this.round === MAX_ROUNDS) {
          this.lobby.game.status = "ended";
          await this.lobby.save();

          this.emitToPlayers("gameEnded", this.lobby);
          clearInterval(interval);

          return;
        }

        this.startRound();
      }
    }, 1000);
  }

  async generateQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    return question;
  }

  emitToPlayers(event, data) {
    this.socket.to(this.lobby.id).emit(event, data);
  }
}
