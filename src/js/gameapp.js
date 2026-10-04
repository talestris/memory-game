import { el } from "./dom";
import { openModal } from "./modal";
import { getLeaders, saveResult } from "./storage";

export class GameApp {
  constructor() {
    this.images = [
      "bat.webp",
      "book.webp",
      "cat.webp",
      "cauldron.webp",
      "ghost.webp",
      "magical_ball.webp",
      "mummy.webp",
      "pumpkin.webp",
    ];

    this.cards = [];
    this.phase = "IDLE";
    this.firstCard = null;
    this.secondCard = null;
    this.movesCount = 0;
    this.matchedPairs = 0;
    this.timeoutId = 0;

    this.dom = {
      movesCounter: null,
      pairsCounter: null,
      grid: null,
    };
  }

  init() {
    const header = el(
      "header",
      { className: "game-header" },
      el("button", {
        className: "btn btn-new-game",
        textContent: "New Game",
        onClick: () => this.startNewGame(),
      }),
      el("button", {
        className: "btn btn-leaderboard",
        textContent: "Leaders",
        onClick: () => this.openLeaderboardModal(),
      }),
    );

    this.dom.movesCounter = el("span", {
      className: "counter-value",
      textContent: "0",
    });
    this.dom.pairsCounter = el("span", {
      className: "counter-value",
      textContent: "0 of 8",
    });

    const infoPanel = el(
      "div",
      { className: "game-info" },
      el("div", { className: "info-item" }, "Moves: ", this.dom.movesCounter),
      el(
        "div",
        { className: "info-item" },
        "Matching pairs",
        this.dom.pairsCounter,
      ),
    );

    this.dom.grid = el("div", { className: "game-grid" });

    const appContainer = el(
      "div",
      { className: appContainer },
      header,
      infoPanel,
      this.dom.grid,
    );

    document.body.appendChild(appContainer);

    this.startNewGame();
  }

  startNewGame() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.movesCount = 0;
    this.matchedPairs = 0;
    this.phase = "IDLE";
    this.firstCard = null;
    this.secondCard = null;

    this.dom.movesCounter.textContent = String(this.movesCount);
    this.dom.pairsCounter.textContent = `${this.matchedPairs} of 8`;

    const doubledCards = [];
    this.images.forEach((img, idImage) => {
      const cardData1 = {
        index: idImage * 2,
        idImage,
        image: img,
        isOpen: false,
        isMatched: false,
      };
      const cardData2 = {
        index: idImage * 2 + 1,
        idImage,
        image: img,
        isOpen: false,
        isMatched: false,
      };
      doubledCards.push(cardData1, cardData2);
    });

    this.cards = this.shuffle(doubledCards);

    this.renderBoard();
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  renderBoard() {
    this.dom.grid.replaceChildren();

    this.cards.forEach((cardData) => {
      const cardFront = el(
        "div",
        { className: "card-front" },
        el("img", { src: `/images/${cardData.image}`, alt: "card image" }),
      );

      const cardBack = el("div", { className: "card-back" });

      const cardElement = el(
        "div",
        {
          className: "game-card",
          onClick: () => this.handleCardClick(cardData, cardElement),
        },
        cardFront,
        cardBack,
      );

      if (cardData.isOpen || cardData.isMatched) {
        cardElement.classList.add("flipped");
      }

      this.dom.grid.appendChild(cardElement);
    });
  }

  handleCardClick(cardData, cardElement) {
    if (this.phase === "LOCK" || this.phase === "GAME_OVER") return;

    if (cardData.isOpen || cardData.isMatched) return;

    if (this.phase === "IDLE") {
      this.firstCard = cardData;
      this.firstCard.isOpen = true;
      cardElement.classList.add("flipped");
      this.phase = "FIRST_SELECTED";
    } else if (this.phase === "FIRST_SELECTED") {
      this.secondCard = cardData;
      this.secondCard.isOpen = true;
      cardElement.classList.add("flipped");
      this.movesCount++;
      this.dom.movesCounter.textContent = String(this.movesCount);
      this.phase = "SECOND_SELECTED";
      this.checkMatch();
    }
  }

  checkMatch() {
    const isMatch = this.firstCard.idImage === this.secondCard.idImage;

    if (isMatch) {
      this.firstCard.isMatched = true;
      this.secondCard.isMatched = true;
      this.matchedPairs++;
      this.dom.pairsCounter.textContent = `${this.matchedPairs} of 8`;

      if (this.matchedPairs === 8) {
        this.phase = "GAME_OVER";
        saveResult(this.movesCount);
        this.openVictoryModal();
      } else {
        this.phase = "IDLE";
      }
      this.firstCard = null;
      this.secondCard = null;
    } else {
      this.phase = "LOCK";
      this.timeoutId = setTimeout(() => {
        this.firstCard.isOpen = false;
        this.secondCard.isOpen = false;
        this.renderBoard();

        this.firstCard = null;
        this.secondCard = null;
        this.timeoutId = null;
        this.phase = "IDLE";
      }, 1200);
    }
  }

  openVictoryModal() {
    let closeModalFunc;

    const modalContent = el(
      "div",
      { className: "victory-modal" },
      el("h2", { className: "modal-title", textContent: "Congrats, you won!" }),
      el(
        "p",
        { className: "modal-text" },
        "You found all the pairs in ",
        el("strong", {}, String(this.movesCount)),
        " moves.",
      ),
      el(
        "div",
        { className: "modal-actions" },
        el("button", {
          className: "btn btn-primary",
          textContent: "New game",
          onClick: () => {
            closeModalFunc();
            this.startNewGame();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          textContent: "Close",
          onClick: () => closeModalFunc(),
        }),
      ),
    );

    closeModalFunc = openModal(modalContent);
  }

  openLeaderboardModal() {
    const leaders = getLeaders();

    let contentToDisplay;

    if (leaders.length === 0) {
      contentToDisplay = el("p", {
        className: "modal-text no-results",
        textContent: "There are not results here yet, be the first!",
      });
    } else {
      const tableRows = leaders.map((item, index) => {
        return el(
          "tr",
          { className: "table-row" },
          el("td", { className: "cell-place" }, `${index + 1}`),
          el("td", { className: "cell-moves" }, `${item.moves}`),
          el("td", { className: "cell-date" }, `${item.date}`),
        );
      });

      contentToDisplay = el(
        "table",
        { className: "leaderboard-table" },
        el(
          "thead",
          {},
          el(
            "tr",
            {},
            el("th", {}, "Place"),
            el("th", {}, "Moves"),
            el("th", {}, "Date"),
          ),
        ),
        el("tbody", {}, ...tableRows),
      );
    }
    let closeModalFunc;

    const modalContent = el(
      "div",
      { className: "leaderboard-modal" },
      el("h2", { className: "modal-title", textContent: "🏆 LeaderBoard" }),
      contentToDisplay,
      el(
        "div",
        { className: "modal-actions" },
        el("button", {
          className: "btn btn-secondary",
          textContent: "Close",
          onClick: () => closeModalFunc(),
        }),
      ),
    );
    closeModalFunc = openModal(modalContent);
  }
}
