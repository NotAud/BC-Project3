import QUESTION_JSON from "../../util/questions.json";

type PlayerScore = {
  id: string;
  score: number;
};

type Question = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

const questions: Question[] = QUESTION_JSON as unknown as Question[];

const MAX_ROUNDS = 10;
const ROUND_TIME = 5;

export default class GameManager {
  id: string;
  scores: PlayerScore[];
  round: number = 0;
  socket: any;

  constructor(lobbyId: string, players: any[], socket: any) {
    this.id = lobbyId;
    this.socket = socket;

    this.scores = [];
    players.forEach((player) => {
      this.scores.push({
        id: player.toString(),
        score: 0,
      });
    });
  }

  async startGame() {
    this.emitToPlayers("gameStarted");
    this.generateQuestion();

    let currentTime = new Date().getTime();
    const interval = setInterval(() => {
      const elapsedTime = new Date().getTime() - currentTime;
      if (elapsedTime >= ROUND_TIME * 1000) {
        this.emitToPlayers("roundEnded", this.scores);

        currentTime = new Date().getTime();
        this.round++;
        if (this.round === MAX_ROUNDS) {
          this.emitToPlayers("gameEnded", this.scores);
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
    console.log(questions);
    this.emitToPlayers("question", question);
  }

  emitToPlayers(event: string, data?: any) {
    this.socket.to(this.id).emit(event, data);
  }
}
