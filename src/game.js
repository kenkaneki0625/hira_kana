class MixOrMatch {
  constructor(totalTime, cards) {
      this.cardsArray = cards;
      this.totalTime = totalTime;
  }

  startGame() {
    this.shuffleCards(this.cardsArray);
  }
  shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
      for (let i = cardsArray.length - 1; i > 0; i--) {
          let randIndex = Math.floor(Math.random() * (i + 1));
          cardsArray[randIndex].style.order = i;
          cardsArray[i].style.order = randIndex;
      }
  }
}

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new MixOrMatch(100, cards);
  game.startGame();

  cards.forEach(card => {
      card.addEventListener('click', () => {
          console.log(card)
      });
  });
}