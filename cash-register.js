// VARIABLES
const SELLABLE_ITEMS = {
  apple: 0.60,
  banana: 0.20,
  crisps: 0.55,
  drink: 1.80,
  energybar: 0.99,
  feta: 2.59
};

let cashInDrawer = [["hundred", 100, 0], ["twenty", 20, 0], ["ten", 10, 0], ["five", 5, 0], ["dollar", 1, 0], ["quarter", 0.25, 0], ["dime", 0.10, 0], ["nickel", 0.05, 0], ["penny", 0.01, 0]];
let basket = [];
let basketValue = 0;



// FUNCTIONS
function setCashInDrawer(type) {
  cashInDrawer.map(coin => coin[2] = setCashValue(coin, type));
  renderCashInDrawer();
}

function setCashValue(coin, type) {
  // Randomly set the cash value
  if (type === "auto") {
    const MULTIPLIER =
        coin[1] > 10 ?
          Math.floor(Math.random()*4) :
        coin[1] > 0.10 ? 
          Math.floor(Math.random()*40) : Math.floor(Math.random()*100);
    return (document.getElementById(`${coin[0]}-container`).children[0].innerHTML*MULTIPLIER).toFixed(2);
  
  } else {
    // Manually set the cash value
    return parseFloat(window.prompt(`Please set the value of ${coin[0]}:`)).toFixed(2);
  }
}

function setTotalCash() {
  return cashInDrawer.map(value => parseFloat(value[2])).reduce((a, b) => a + b).toFixed(2);
}

function renderCashInDrawer() {
  cashInDrawer.map(coin => document.getElementById(`${coin[0]}-value`).innerHTML = coin[2]);
  document.getElementById("total-cash-value").innerHTML = setTotalCash();
}

function addToBasket() {
  basket.push([this.id, SELLABLE_ITEMS[this.id]]);
  updateBasket();
}

function updateBasket() {
  basketValue = basket.map(item => item[1]).reduce((a, b) => a + b).toFixed(2);
  document.getElementById("price-value").innerHTML = basketValue;
}

function resetBasket() {
  basket = [];
  basketValue = "0.00";
  document.getElementById("price-value").innerHTML = basketValue;
}

function calculateChange(payment) {
  return payment - basketValue;
}



function runPayment() {
  const PAYMENT = parseFloat(document.getElementById("payment-input-value").value || this.innerHTML);
  const CHANGE = calculateChange(PAYMENT).toFixed(2);
  const RESULT = {
    change: [],
    status: ""
  }
  
  if (basket.length >= 0) { //Exchange >= for > when uploading!
    renderCashDisplays(PAYMENT, CHANGE);
    const FINAL_CHANGE = determineCoins(CHANGE, RESULT);
    determineResultStatus(RESULT, FINAL_CHANGE);
    updateCashInDrawer(RESULT);
  } else {
    alert("BASKET_EMPTY");
    return;
  }
  
  openSummaryDisplay();
}



function renderCashDisplays(payment, change) {
  document.getElementById("payment-value").innerHTML = payment.toFixed(2);
  document.getElementById("change-due-value").innerHTML = change;
}

function determineCoins(change, result) {
  // Never forget about shallow/deep copying with slice()!
  const COINS = cashInDrawer.filter(coin => coin[1] <= change).map(x => Object.assign([], x));
  return COINS.reduce((change, coin) => checkChange(change, coin, 0, result), change);
}

function checkChange(change, coin, counter, result) {
  if (change <= 0 || change === undefined) {
    return "0.00";
  } else if (change > 0) {
    return subtractCoins(change, coin, counter, result);
  }
}

function subtractCoins(change, coin, counter, result) {
  if (coin[2] > 0 && change >= coin[1]) {
    change = (change - coin[1]).toFixed(2);
    coin[2] = (coin[2] - coin[1]).toFixed(2);
    counter++;
    return subtractCoins(change, coin, counter, result);
  } else {
    result.change.push([coin[0], counter, coin[2]]);
    return change;
  }
}

function determineResultStatus(result, finalChange) {
  result.status = setTotalCash() == 0 ? "CLOSED" :
    finalChange === "0.00" ? "OPEN" : "INSUFFICIENT_FUNDS";
  renderStatus(result);
}

function updateCashInDrawer(result) {
  if (result.status === "OPEN") {
    result.change.map(coin => updateCoinValue(coin));
    renderCashInDrawer();
  } else {
    alert(result.status);
  }
}

function updateCoinValue(coin) {
  cashInDrawer.map(function (item) {
    return item[2] = item.includes(coin[0]) ? coin[2] : item[2];
  });
}

function renderStatus(result) {
  document.getElementById("status").innerHTML = result.status;
}

function openSummaryDisplay() {
  document.getElementById("summary-display").style.display = "grid";
}

function nextCustomer() {
  resetBasket();
  document.getElementById("summary-display").style.display = "none";
}



// EVENT LISTENERS
window.onload = function() {
  setCashInDrawer("auto");
    
  document.getElementById("set-cash").addEventListener("click", () => setCashInDrawer()); // Don't forget to remove the anonymous function and "auto" to make this a manual cash-count.
  [...document.getElementsByClassName("item")].map(item => item.addEventListener("click", addToBasket));
  [...document.getElementsByClassName("pay-button")].map(button => button.addEventListener("click", runPayment));
  document.getElementById("next-customer-button").addEventListener("click", nextCustomer);
}

