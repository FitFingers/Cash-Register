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
function setCashInDrawer() {
  cashInDrawer.map(index => index[2] = setCashValue(index));
  renderCashInDrawer();
}

function setCashValue(index) {
  // Auto set the cash value
  const MULTIPLIER =
        index[1] > 10 ?
          Math.floor(Math.random()*3) :
        index[1] > 0.10 ? 
          Math.floor(Math.random()*40) : Math.floor(Math.random()*100);

  return (document.getElementById(`${index[0]}-container`).children[0].innerHTML*MULTIPLIER).toFixed(2);
  
  // Manually set the cash value
  // return parseFloat(window.prompt(`Please set the value of ${index}:`)).toFixed(2);
}

function setTotalCash() {
  return cashInDrawer.map(value => parseFloat(value[2])).reduce((a, b) => a + b).toFixed(2);
}

function renderCashInDrawer() {
  cashInDrawer.map(item => document.getElementById(`${item[0]}-value`).innerHTML = item[2]);
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
  
  if (CHANGE >= 0) {
    renderCashDisplays(PAYMENT, CHANGE);
    const FINAL_CHANGE = determineCoins(CHANGE, RESULT);
    determineResultStatus(RESULT, FINAL_CHANGE);
    updateCashInDrawer(RESULT);
  }
}

function updateCashInDrawer(result) {
  if (result.status === "OPEN") {
    result.change.map(coin => updateCoinValue(coin));
    renderCashInDrawer();
  }
}

function updateCoinValue(coin) {
  cashInDrawer.map(function (item) {
    return item[2] = item.includes(coin[0]) ? coin[2] : item[2];
  });
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
    return 0;
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
  result.status = finalChange === 0 ? "OPEN" : "INSUFFICIENT_FUNDS";
}



// EVENT LISTENERS
window.onload = function() {
  setCashInDrawer();
    
  document.getElementById("set-cash").addEventListener("click", setCashInDrawer);
  [...document.getElementsByClassName("item")].map(item => item.addEventListener("click", addToBasket));
  [...document.getElementsByClassName("pay-button")].map(button => button.addEventListener("click", runPayment));
}


// END OF NEW CODE
// START OF OLD CODE


// function checkCashRegister(price, cash, cid) {
//   //Variable declaration - due is change due, TOTAL_CASH_IN_DRAWER is total cash in drawer (parsed for math ops)
//   let due = parseFloat((cash - price).toFixed(2));
//   const TOTAL_CASH_IN_DRAWER = parseFloat(cid.map(coin => coin[1]).reduce((a, b) => a + b).toFixed(2));

//   //The result object to be returned is created
//   let result = {
//     status: "",
//     change: []
//   };

//   //A coin array with the value of each coin. Could have been added to cid as cid[0][0] etc.
//   //Reversed to start ops with largest denomination.
//   const COINS = [
//     ["PENNY", 0.01],
//     ["NICKEL", 0.05],
//     ["DIME", 0.1],
//     ["QUARTER", 0.25],
//     ["ONE", 1],
//     ["FIVE", 5],
//     ["TEN", 10],
//     ["TWENTY", 20],
//     ["ONE HUNDRED", 100]
//   ].reverse();


//   //End operations here if cid isn't enough to give change or if the cid is equal to change due, close the till.
//   if (TOTAL_CASH_IN_DRAWER < due) {
//     result.status = "INSUFFICIENT_FUNDS";
//   } else if (TOTAL_CASH_IN_DRAWER === due) {
//     result.status = "CLOSED";
//     result.change = cid;
//   } else {
//     result.status = "OPEN";
//     if (due == 0) {
//       return result
//     }

//     //This is admittedly very messy...
//     //Filter the COINS array to only use coins that are equal to or less than the change due, and for each coin...
//     COINS.filter(coin => coin[1] <= due).map(coin => {
//       //... use these variables: num of coins needed; coinValue is total value in said coin; cidValue is value of that coin available
//       //Perhaps dividing cid earlier by COINS would be easier to compute?
//       let num = Math.floor(due / coin[1]);
//       let coinValue = coin[1] * num;
//       let cidValue = cid.filter(item => item.indexOf(coin[0]) >= 0)[0][1];

//       //Only perform this function if num of coins required isn't 0
//       if (num !== 0) {
//         if (coinValue <= cidValue) {
//           result.change.push([coin[0], coinValue]);
//           due -= coinValue;
//         } else {
//           result.change.push([coin[0], (Math.floor(cidValue / coin[1])) * coin[1]]);
//           due -= cidValue;
//         }
//         due = due.toFixed(2);
//       }
//     });

//     //Finally, if change available is less than due (z.B. there are not enough of a required type of coin) then throw an error
//     if (result.change.map(x => x[1]).reduce((a, b) => a + b) < due) {
//       result.status = "INSUFFICIENT_FUNDS";
//       result.change = [];
//     }
//   }

//   return result;
// }


// //CHANGE COINS HERE
// console.time("One");
// console.log(JSON.stringify(checkCashRegister(19.39, 20,
//   [
//     ["PENNY", 0.02],
//     ["NICKEL", 0.1],
//     ["DIME", 0.10],
//     ["QUARTER", 0.50],
//     ["ONE", 1],
//     ["FIVE", 0],
//     ["TEN", 0],
//     ["TWENTY", 20],
//     ["ONE HUNDRED", 0]
//   ]
// )));
// console.timeEnd("One");
