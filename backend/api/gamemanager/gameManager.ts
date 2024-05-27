import QUESTION_JSON from "../../util/questions.json";
import LobbyModel from "../../database/models/lobby.model";

type Question = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

const questions: Question[] = QUESTION_JSON as unknown as Question[];

const MAX_ROUNDS = 1;
const ROUND_TIME = 5;

export default class GameManager {
  lobby: any;
  round: number = 0;
  socket: any;

  constructor(lobby: any, socket: any) {
    this.lobby = lobby;
    this.socket = socket;
  }

  async startGame() {
    this.lobby.gameStatus = "started";
    await this.lobby.save();

    await this.lobby.populate("owner");
    await this.lobby.populate("players.user");

    this.emitToPlayers("gameStarted", this.lobby);
    this.generateQuestion();

    let currentTime = new Date().getTime();
    const interval = setInterval(async () => {
      const elapsedTime = new Date().getTime() - currentTime;
      if (elapsedTime >= ROUND_TIME * 1000) {
        this.lobby = await LobbyModel.findById(this.lobby.id)
          .populate("owner")
          .populate("players.user");

        this.emitToPlayers("roundEnded", this.lobby);

        currentTime = new Date().getTime();
        this.round++;
        if (this.round === MAX_ROUNDS) {
          this.lobby.gameStatus = "ended";
          await this.lobby.save();

          this.emitToPlayers("gameEnded", this.lobby);
          clearInterval(interval);

          return;
        }

        this.generateQuestion();
      }
    }, 1000);
  }

  async generateQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    this.emitToPlayers("question", question);
  }

  emitToPlayers(event: string, data?: any) {
    this.socket.to(this.lobby.id).emit(event, data);
  }
}
