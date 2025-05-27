let count = 1000;
let money = 1000;
let trust = 0;
let processor = 0;
let memory = 0;
let credit = 0;
// processeur augmente vitesse de calcul, des opérations
// mémoire augmente le nombre de opérations qu'ont peut faire au total
// confiance fait rien pour l'instant


let perClick = 1;
let perSecond = 0;
let totalProduced = 0;
let totalMoneyEarned = 0;
let totalWireUsed = 0;
let totalWireBought = 0;
let totalSold = 0;
let sellPrice = 1;
let sellers = 0;
let wire = 1000;
let wireBuyer = 0; // Nombre d'acheteurs de fil automatiques
let operations = 0;
let maxOperations = 1000;
let OperationIncrement = 1
let cheatEnabled = false; // Active ou désactive les boutons de triche


const countEl = document.getElementById('count');
const moneyEl = document.getElementById('money');
const perClickEl = document.getElementById('perClick');
const perSecondEl = document.getElementById('perSecond');
const paperclipImg = document.getElementById('paperclipImg');
const sellBtn = document.getElementById('sellBtn');
const wireEl = document.getElementById('wire');
const wireBuyersEl = document.getElementById('wireBuyers');
const trustEl = document.getElementById('trustDisplayer');
const processorEl = document.getElementById('processorDisplayer');
const memoryEl = document.getElementById('memoryDisplayer');
const operationsDoneEl = document.getElementById('operationsDoneDisplayer');


// Fonction pour démarrer la musique automatiquement
function startBackgroundMusic() {
  const audio = document.getElementById('background-audio');

  // Essayer de jouer la musique immédiatement
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      console.log('Musique démarrée automatiquement');
    }).catch(() => {
      // Si l'autoplay est bloqué, on écoute le premier clic/interaction
      console.log('Autoplay bloqué, attente de la première interaction');

      const startOnInteraction = () => {
        audio.play();
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
      };

      document.addEventListener('click', startOnInteraction);
      document.addEventListener('keydown', startOnInteraction);
    });
  }
}

const shop = {
  worker: { cost: 20, rate: 1, owned: 0, button: document.getElementById('buy-worker'), costEl: document.getElementById('cost-worker'), rateEl: document.getElementById('rate-worker') },
  machine: { cost: 200, rate: 5, owned: 0, button: document.getElementById('buy-machine'), costEl: document.getElementById('cost-machine'), rateEl: document.getElementById('rate-machine') },
  seller: { cost: 30, owned: 0, button: document.getElementById('buy-seller'), costEl: document.getElementById('cost-seller') },
  wire: { cost: 50, owned: 0, button: document.getElementById('buy-wire'), costEl: document.getElementById('cost-wire') },
  wireBuyer: { cost: 500, owned: 0, button: null, costEl: null } // Sera initialisé après
};

function formatNumber(n) {
  const symbols = ['', 'K', 'M', 'B', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Décillion', 'Undécillion', 'Duodécillion', 'Tredécillion', 'Quattordécillion'];
  let i = 0;

  while (n >= 1000 && i < symbols.length - 1) {
    n /= 1000;
    i++;
  }
  const str = Number.isInteger(n) ? n.toString() : n.toFixed(1);

  return str + (symbols[i] ? ' ' + symbols[i] : '');
}

// Fonction qui actualise les données 
function updateDisplay() {
  countEl.textContent = formatNumber(count);
  moneyEl.textContent = formatNumber(money);
  perSecondEl.textContent = formatNumber(perSecond);
  wireEl.textContent = formatNumber(wire);
  trustEl.textContent = formatNumber(trust);
  processorEl.textContent = formatNumber(processor);
  memoryEl.textContent = formatNumber(memory);

  sellBtn.disabled = count < 1;
  for (const key in shop) {
    const item = shop[key];
    if (item.costEl) item.costEl.textContent = formatNumber(item.cost);
    if (item.button) item.button.disabled = money < item.cost;
  }
  sellBtn.textContent = `Vendre 1 trombone pour $${sellPrice}`;
  if (totalProduced >= 10000 && document.getElementById("upgradePanel").style.display === "none") {
    document.getElementById("upgradePanel").style.display = "block";
  }
}

// Fonction pour vérifier si le prix de vente doit être mis à jour
function checkPriceUpgrade() {
  if (totalProduced >= 10_000) sellPrice = 10;
  else if (totalProduced >= 5_000) sellPrice = 5;
  else if (totalProduced >= 1_000) sellPrice = 2;
}

// On clique sur l'image du trombone
paperclipImg.addEventListener('click', (e) => {
  if (wire > 0) {
    count += perClick;
    totalProduced += perClick;
    wire -= 1;

    // Animation du trombone principal
    paperclipImg.style.transform = 'scale(1.1)';
    setTimeout(() => {
      paperclipImg.style.transform = 'scale(1)';
    }, 100);

    // Créer un trombone qui tombe
    const fallingClip = document.createElement('img');
    fallingClip.src = paperclipImg.src;
    fallingClip.className = 'falling-paperclip';

    // Position aléatoire sur toute la largeur de l'écran
    fallingClip.style.left = Math.random() * (window.innerWidth-50) + 'px';
    fallingClip.style.top = (window.innerHeight-50) + 'px'; // Commence en bas de l'écran


    document.body.appendChild(fallingClip);

    // Supprimer l'élément après l'animation
    setTimeout(() => {
      if (fallingClip.parentNode) {
        fallingClip.parentNode.removeChild(fallingClip);
      }
    }, 2000);
  }

  checkPriceUpgrade();
  updateDisplay();
});

// L'utilisateur vend un trombone
sellBtn.addEventListener('click', () => {
  if (count >= 1) {
    count--;
    money += sellPrice;
    updateDisplay();
  }
});

shop.worker.button.addEventListener('click', () => purchase('worker'));
shop.machine.button.addEventListener('click', () => purchase('machine'));
shop.seller.button.addEventListener('click', () => purchase('seller'));
shop.wire.button.addEventListener('click', () => purchase('wire'));

// Fonction pour acheter un élément
function purchase(key) {
  const item = shop[key];
  if (money >= item.cost) {
    money -= item.cost;
    item.owned++;
    if (key === 'seller') {
      sellers++;
    } else if (key === 'wire') {
      wire += 1000;
    } else if (key === 'wireBuyer') {
      wireBuyer++;
    } else {
      perSecond += item.rate;
    }
    // le cout du fil de fer augmente de 10%
    if (key === 'wire') {
      item.cost = Math.ceil(item.cost * 1.1);
    } else if (key === 'wireBuyer') {
      item.cost = Math.ceil(item.cost * 1.2); // Augmentation plus importante pour l'acheteur automatique
    } else {
      item.cost = Math.ceil(item.cost * 1.15);
    }
    updateDisplay();
  }
}

// Mise à jour du nombre de trombones toutes les secondes
setInterval(() => {

  wire -= perSecond;
  if (wire <= 0) {

    wire = 0;
  } else {
    totalProduced += perSecond;
    count += perSecond;
  }

  checkPriceUpgrade();
  updateDisplay();
}, 1000);

// Vente automatique des trombones
setInterval(() => {
  const toSell = Math.min(sellers, count);
  count -= toSell;
  money += toSell * sellPrice;
  updateDisplay();
}, 1000);

// Achat automatique de fil de fer
setInterval(() => {
  // Chaque acheteur automatique achète du fil si on a assez d'argent et si le fil est bas
  if (wireBuyer > 0 && wire < 500 && money >= shop.wire.cost) {
    const purchasesToMake = Math.min(wireBuyer, Math.floor(money / shop.wire.cost));
    for (let i = 0; i < purchasesToMake; i++) {
      if (money >= shop.wire.cost) {
        money -= shop.wire.cost;
        wire += 100;
        // Le coût augmente à chaque achat automatique aussi
        shop.wire.cost = Math.ceil(shop.wire.cost * 1.1);
      }
    }
    updateDisplay();
  }
}, 1000); // Vérifie toutes les 1 secondes

// Mise à jour du nombre d'opérations toutes les secondes
setInterval(() => {
  incrementOperations();
}, 1000);

// Créer le bouton d'achat automatique de fil de fer après que la page soit chargée
window.addEventListener('DOMContentLoaded', () => {
  // Trouver le conteneur de la boutique
  const shopContainer = document.querySelector('.shop');

  // Créer l'élément pour l'acheteur automatique de fil
  
  const wireBuyerItem = document.createElement('div');
  wireBuyerItem.className = 'item';
  wireBuyerItem.innerHTML = `
    <div>Acheteur Auto</div>
    <div>Coût : <span id="cost-wireBuyer">500</span> €</div>
    <div>Achète du fil automatiquement</div>
    <button id="buy-wireBuyer">Acheter</button>
  `;

  // Ajouter à la boutique
  shopContainer.appendChild(wireBuyerItem);

  // Mettre à jour les références dans l'objet shop
  shop.wireBuyer.button = document.getElementById('buy-wireBuyer');
  shop.wireBuyer.costEl = document.getElementById('cost-wireBuyer');

  // Ajouter l'événement click
  shop.wireBuyer.button.addEventListener('click', () => purchase('wireBuyer'));

  // Démarrer la musique automatiquement
  startBackgroundMusic();
  
  // Mettre à jour l'affichage initial
  updateDisplay();
});

// Fonction de triche pour ajouter des trombones et de l'argent
if (cheatEnabled) {
  count = 10000000;
  totalProduced = count;
  const cheatContainer = document.createElement('div');
  cheatContainer.style.marginTop = '20px';

  const addClipsBtn = document.createElement('button');
  addClipsBtn.textContent = 'x100 trombones';
  addClipsBtn.style.marginRight = '10px';
  addClipsBtn.onclick = () => {
    count *= 100;
    totalProduced += count;
    checkPriceUpgrade();
    updateDisplay();
  };

  const addMoneyBtn = document.createElement('button');
  addMoneyBtn.textContent = 'x100 argent';
  addMoneyBtn.onclick = () => {
    money *= 100;
    updateDisplay();
  };

  cheatContainer.appendChild(addClipsBtn);
  cheatContainer.appendChild(addMoneyBtn);
  document.body.appendChild(cheatContainer);
}

updateDisplay();

// Animation du texte défilant
const tickerText = document.getElementById('tickerText');
const messages = [
  "Vos trombones envahissent le marché local...",
  "Un grand PDG parle de vos trombones à la télévision !",
  "Nouvelle mode : les colliers en trombones.",
  "Votre usine tourne à plein régime.",
  "Les gens achètent des trombones pour Noël.",
  "Exportation de trombones vers Mars en préparation.",
  "Les actions des trombones explosent en bourse !",
  "Vos trombones se vendent comme des petits pains.",

];
function startTicker() {
  let index = 0;
  function nextMessage() {
    tickerText.textContent = messages[index];
    tickerText.style.transition = 'none';
    tickerText.style.transform = 'translateX(100%)';

    // petit délai pour que la position soit prise en compte
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tickerText.style.transition = 'transform 20s linear';
        tickerText.style.transform = 'translateX(-100%)';
      });
    });

    index = (index + 1) % messages.length;
  }

  tickerText.addEventListener('transitionend', nextMessage);
  nextMessage();
}
startTicker();

// L'utilisateur gagne un point dans une catégorie (confiance, puissance ou mémoires)
function gainPoint(cat) {
  // cat vaut soit confiance, puissance ou mémoires
  if (cat === 'confiance') {
    trust++;
  } else if (cat === 'puissance') {
    processor++;
  } else if (cat === 'mémoires') {
    memory++;
  }

  updateDisplay();
}

// On incrémente le nombre d'opérations
function incrementOperations() {
  operations+= OperationIncrement;
  if (operations >= maxOperations) {
    document.getElementById("upgradePanel").style.display = "none";
  }
  operationsDoneEl.textContent = formatNumber(operations);
}

// On sauvegarde la partie toutes les 5 secondes
function saveGame() {
  const saveData = {
    count,
    money,
    perClick,
    perSecond,
    totalProduced,
    shop: {
      worker: shop.worker.owned,
      machine: shop.machine.owned,
      seller: shop.seller ? shop.seller.owned : 0
    }
  };
  localStorage.setItem('paperclipSave', JSON.stringify(saveData));
}
setInterval(saveGame, 5000);

// On charge la partie au démarrage
function loadGame() {
  const save = localStorage.getItem('paperclipSave');
  if (save) {
    const data = JSON.parse(save);
    count = data.count;
    money = data.money;
    perClick = data.perClick;
    perSecond = data.perSecond;
    totalProduced = data.totalProduced;

    shop.worker.owned = data.shop.worker;
    shop.machine.owned = data.shop.machine;
    if (shop.seller) shop.seller.owned = data.shop.seller;

    // remettre à jour les coûts en fonction des possédés
    for (let i = 0; i < shop.worker.owned; i++) {
      shop.worker.cost = Math.ceil(shop.worker.cost * 1.15);
      perSecond += shop.worker.rate;
    }
    for (let i = 0; i < shop.machine.owned; i++) {
      shop.machine.cost = Math.ceil(shop.machine.cost * 1.15);
      perSecond += shop.machine.rate;
    }
    if (shop.seller) {
      for (let i = 0; i < shop.seller.owned; i++) {
        shop.seller.cost = Math.ceil(shop.seller.cost * 1.15);
        // Ajoute ici les effets de tes vendeurs si besoin
      }
    }
  }
}
loadGame();
