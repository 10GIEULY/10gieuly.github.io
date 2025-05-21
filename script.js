let count = 0;
let money = 0;
let trust = 0;
let perClick = 1;
let perSecond = 0;
let totalProduced = 0;
let sellPrice = 1;
let sellers = 0;
let wire = 1000;
let cheatEnabled = true; // Active ou désactive les boutons de triche

const countEl = document.getElementById('count');
const moneyEl = document.getElementById('money');
const perClickEl = document.getElementById('perClick');
const perSecondEl = document.getElementById('perSecond');
const paperclipImg = document.getElementById('paperclipImg');
const sellBtn = document.getElementById('sellBtn');
const wireEl = document.getElementById('wire');

const shop = {
  worker: { cost: 20, rate: 1, owned: 0, button: document.getElementById('buy-worker'), costEl: document.getElementById('cost-worker'), rateEl: document.getElementById('rate-worker') },
  machine: { cost: 200, rate: 5, owned: 0, button: document.getElementById('buy-machine'), costEl: document.getElementById('cost-machine'), rateEl: document.getElementById('rate-machine') },
  seller: { cost: 30, owned: 0, button: document.getElementById('buy-seller'), costEl: document.getElementById('cost-seller') },
  wire: { cost: 50, owned: 0, button: document.getElementById('buy-wire'), costEl: document.getElementById('cost-wire') }

};

function formatNumber(n) {
  if (n >= 1_000_000_000_000) return (n / 1_000_000_000_000).toFixed(1) + ' T';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + ' K';
  return n;
}

function updateDisplay() {
  countEl.textContent = formatNumber(count);
  moneyEl.textContent = formatNumber(money);
  perSecondEl.textContent = formatNumber(perSecond);
  wireEl.textContent = formatNumber(wire);
  
  sellBtn.disabled = count < 1;
  for (const key in shop) {
    const item = shop[key];
    if (item.costEl) item.costEl.textContent = formatNumber(item.cost);
    item.button.disabled = money < item.cost;
  }
  sellBtn.textContent = `Vendre 1 trombone pour $${sellPrice}`;
}

function checkPriceUpgrade() {
  if (totalProduced >= 10_000) sellPrice = 10;
  else if (totalProduced >= 5_000) sellPrice = 5;
  else if (totalProduced >= 1_000) sellPrice = 2;
}

// On clique sur l'image du trombone
paperclipImg.addEventListener('click', () => {
  if (wire > 0) {
    count += perClick;
    totalProduced += perClick;
    wire -= 1;
    // on fait une petite animation
    paperclipImg.style.transform = 'scale(1.1)';
    setTimeout(() => {
      paperclipImg.style.transform = 'scale(1)';
    }, 100);
  }
  
  // On retire du fil de fer (wire)
  
  checkPriceUpgrade();
  updateDisplay();
});

// On vend des trombones
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
shop.wire.button.addEventListener('click', () => purchase('wire'))

function purchase(key) {
  const item = shop[key];
  if (money >= item.cost) {
    money -= item.cost;
    item.owned++;
    if (key === 'seller') {
      sellers++;
    } else if (key === 'wire') {

      wire += 1000;
    } else {
      perSecond += item.rate;
    }
    // le cout du fil de fer augmente de 10%
    if (key === 'wire') {
      item.cost = Math.ceil(item.cost * 1.1);
    } else {
      item.cost = Math.ceil(item.cost * 1.15);
    }
    updateDisplay();
  }
}

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

setInterval(() => {
  const toSell = Math.min(sellers, count);
  count -= toSell;
  money += toSell * sellPrice;
  updateDisplay();
}, 1000);


if (cheatEnabled) {
  const cheatContainer = document.createElement('div');
  cheatContainer.style.marginTop = '20px';

  const addClipsBtn = document.createElement('button');
  addClipsBtn.textContent = '+1000 trombones';
  addClipsBtn.style.marginRight = '10px';
  addClipsBtn.onclick = () => {
    count += 1000;
    totalProduced += 1000;
    checkPriceUpgrade();
    updateDisplay();
  };

  const addMoneyBtn = document.createElement('button');
  addMoneyBtn.textContent = '+1000 $';
  addMoneyBtn.onclick = () => {
    money += 100000;
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
