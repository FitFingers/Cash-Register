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
  cashInDrawer.map(coin => renderCoin(coin));
  document.getElementById("total-cash-value").innerHTML = setTotalCash();
  renderStatus({status: "OPEN"});
  openTill();
}

function renderCoin(coin) {
  document.getElementById(`${coin[0]}-value`).innerHTML = coin[2];
  if (coin[2] === "0.00") {
    document.getElementById(`${coin[0]}-container`).classList.add("empty-cash");
  } else {
    document.getElementById(`${coin[0]}-container`).classList.remove("empty-cash");
  }
}

function addToBasket() {
  basket.push([this.id, SELLABLE_ITEMS[this.id]]);
  updateBasket();
}

function getBasketValue() {
  return basket.map(item => item[1]).reduce((a, b) => a + b).toFixed(2);
}

function updateBasket() {
  basketValue = getBasketValue();
  document.getElementById("price-value").innerHTML = basketValue;
}

function resetBasket() {
  basket = [];
  basketValue = "0.00";
  removeItems("list-item");
  removeItems("list-total");
  document.getElementById("price-value").innerHTML = basketValue;
}

function removeItems(className) {
  [...document.getElementsByClassName(className)].map(item => item.parentNode.removeChild(item));
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
  
  if (basket.length > 0 && CHANGE > 0) {
    renderCashDisplays(PAYMENT, CHANGE);
    const FINAL_CHANGE = determineCoins(CHANGE, RESULT);
    updateCashInDrawer(RESULT, FINAL_CHANGE);
    determineResultStatus(RESULT, FINAL_CHANGE);
    renderStatus(RESULT);
    
  } else if (basket.length <= 0) {
    alert("BASKET_EMPTY");
    return;
  } else if (CHANGE <= 0) {
    alert("INSUFFICIENT_PAYMENT");
    return;
  }
  
  if (RESULT.status !== "INSUFFICIENT_FUNDS") {
    createSummaryItem(RESULT.status, "li");
    createSummaryItem(basketValue, "li");
    createSummaryItem(PAYMENT, "li");
    createSummaryItem(CHANGE, "li");
    sortChangeArray(RESULT.change);
    openSummaryDisplay();
  }
}

function sortChangeArray(array) {
  return array.map(coin => createSummaryItem(`[${coin[0]} x${coin[1]}]`, "li"))
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

function updateCashInDrawer(result, finalChange) {
  if (finalChange <= 0) {
    result.change.map(coin => updateCoinValue(coin));
    renderCashInDrawer();
  }
}

function updateCoinValue(coin) {
  cashInDrawer.map(function (item) {
    return item[2] = item.includes(coin[0]) ? coin[2] : item[2];
  });
}

function determineResultStatus(result, finalChange) {
  result.status = setTotalCash() == 0 ? "CLOSED" :
    finalChange === "0.00" ? "OPEN" : "INSUFFICIENT_FUNDS";
}

function renderStatus(result) {
  document.getElementById("status").innerHTML = result.status;
  if (result.status === "INSUFFICIENT_FUNDS") {
    alert("INSUFFICIENT_FUNDS");
  } else if(result.status === "CLOSED") {
    closeTill();
  }
}

function closeTill() {
  [...document.getElementsByClassName("pay-button")].map(item => item.classList.add("empty-cash"));
  document.getElementById("button-blocker").style.display = "block";
  document.getElementById("set-cash").style.background = "green";
}

function openTill() {
  [...document.getElementsByClassName("pay-button")].map(item => item.classList.remove("empty-cash"));
  document.getElementById("button-blocker").style.display = "none";
  document.getElementById("set-cash").style.background = "gray";
}

function openSummaryDisplay() {
  basket.map(item => convertBasketToList(item));
  convertBasketTotal();
  document.getElementById("sale-summary-display").style.display = "grid";
}

// Could probably make this function multi-use
function convertBasketToList(item) {
  const NEW_ITEM = document.createElement("li");
  const NEW_PRICE = document.createElement("li");
  const ITEM_CONTENT = document.createTextNode(item[0]);
  const PRICE_CONTENT = document.createTextNode(item[1].toFixed(2));
  NEW_ITEM.appendChild(ITEM_CONTENT);
  NEW_PRICE.appendChild(PRICE_CONTENT);
  NEW_ITEM.classList.add("list-item");
  NEW_PRICE.classList.add("list-item");
  renderBasketList(NEW_ITEM, NEW_PRICE);
}

function convertBasketTotal() {
  const NEW_TOTAL = document.createElement("li");
  const NEW_VALUE = document.createElement("li");
  const TOTAL_TEXT = document.createTextNode("TOTAL:");
  const TOTAL_VALUE = document.createTextNode(getBasketValue());
  NEW_TOTAL.appendChild(TOTAL_TEXT);
  NEW_VALUE.appendChild(TOTAL_VALUE);
  NEW_TOTAL.classList.add("list-total");
  NEW_VALUE.classList.add("list-total");
  renderBasketList(NEW_TOTAL, NEW_VALUE);
}

function renderBasketList(item, price) {
  document.getElementById("receipt-goods").appendChild(item);
  document.getElementById("receipt-price").appendChild(price);
}

function createSummaryItem(item, element) {
  const NEW_ITEM = document.createElement(element);
  const NEW_VALUE = document.createTextNode(item);
  NEW_ITEM.appendChild(NEW_VALUE);
  NEW_ITEM.classList.add("list-item");
  renderSummaryItem(NEW_ITEM);
}

function renderSummaryItem(item) {
  document.getElementById("summary-detail").appendChild(item);
}

function nextCustomer() {
  resetBasket();
  renderCashDisplays(0, "0.00");
  document.getElementById("sale-summary-display").style.display = "none";
}



// EVENT LISTENERS
window.onload = function() {
  setCashInDrawer("auto");
    
  document.getElementById("set-cash").addEventListener("click", () => setCashInDrawer()); // Don't forget to remove the anonymous function and "auto" to make this a manual cash-count.
  [...document.getElementsByClassName("item")].map(item => item.addEventListener("click", addToBasket));
  [...document.getElementsByClassName("pay-button")].map(button => button.addEventListener("click", runPayment));
  document.getElementById("next-customer-button").addEventListener("click", nextCustomer);
}

