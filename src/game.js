class AudioController {
  constructor() {
      this.bgMusic = new Audio('https://docs.google.com/uc?export=open&id=1zho15hWWdkZ4Wt7EjgKFE3gClX5LWhqH');
      this.flipSound = new Audio('https://docs.google.com/uc?export=open&id=1weOTktFZj07HoEXoGmZ3P9Z-bNRzjeNj');
      this.matchSound = new Audio('https://docs.google.com/uc?export=open&id=108koo0UoE1FKJj-FHmx6LmyBnjA0-8w8');
      this.victorySound = new Audio('https://docs.google.com/uc?export=open&id=1iz2s9qFW1croSnxvnXIYeoxGz47m6Y6n');
      this.gameOverSound = new Audio('https://docs.google.com/uc?export=open&id=10H0_nF6jwXMse-MNuC2clmHsIue7i8qa');
      this.bgMusic.volume = 0.5;
      this.bgMusic.loop = true;
  }
  startMusic() {
      this.bgMusic.play();
  }
  stopMusic() {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
  }
  flip() {
      this.flipSound.play();
  }
  match() {
      this.matchSound.play();
  }
  victory() {
      this.stopMusic();
      this.victorySound.play();
  }
  gameOver() {
      this.stopMusic();
      this.gameOverSound.play();
  }
}
class MixOrMatch {
  constructor(totalTime, cards) {
      this.cardsArray = cards;
      this.totalTime = totalTime;
      this.cardToCheck = null;
      this.matchedCards = [];
      this.timeRemaining = totalTime;
      this.timer = document.getElementById('time-remaining')
      this.ticker = document.getElementById('card-clicks');
      this.audioController = new AudioController();  
  }
  startGame() {
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;
    setTimeout(() => {
      this.audioController.startMusic();
        this.shuffleCards(this.cardsArray);
        this.countdown = this.startCountdown();
        this.busy = false;
    }, 500)
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;    
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
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
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
    this.audioController.match();
    if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
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

  hideCards() {
    this.cardsArray.forEach(card => {
        card.classList.remove('matched');
        card.classList.remove('click');
    });
  
  }
  startCountdown() {
    return setInterval(() => {
        this.timeRemaining--;
        this.timer.innerText = this.timeRemaining;
        if(this.timeRemaining === 0)
            this.gameOver();
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countdown);
    this.audioController.gameOver();
    document.getElementById('end-overlay').classList.add('visible');
  }
  victory() {
    clearInterval(this.countdown);
    this.audioController.victory();
    document.getElementById('victory-overlay').classList.add('visible');
}
}

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName('overlay '));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new MixOrMatch(200, cards);

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        game.startGame();
    });
  });

  cards.forEach(card => {
      card.addEventListener('click', () => {
          game.flipCard(card);
      });
  });
}