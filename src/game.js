class MixOrMatch {
  constructor(totalTime, cards) {
      this.cardsArray = cards;
      this.totalTime = totalTime;
      this.cardToCheck = null;
      this.matchedCards = [];
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

  flipCard(card) {
    if(this.canFlipCard(card)) {
      card.classList.add('click');

        if(this.cardToCheck) {
            this.checkForCardMatch(card);
        } else {
            this.cardToCheck = card;
        }
    }
  }
  checkForCardMatch(card) {
    if(this.getCardType(card) === this.getCardType(this.cardToCheck))
        this.cardMatch(card, this.cardToCheck);
    else 
        this.cardMismatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.remove('click');
    card2.classList.remove('click');
    card1.classList.add('matched');
    card2.classList.add('matched');
  }
  cardMismatch(card1, card2) {
    card1.classList.remove('click');
    card2.classList.remove('click');
  }

  getCardType(card) {
    return card.getElementsByClassName('card-value')[0].id;
  }

  canFlipCard(card) {
    return !this.matchedCards.includes(card) && card !== this.cardToCheck;
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
          game.flipCard(card);
      });
  });
}