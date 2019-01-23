const DENOMINATIONS = ["hundred", "twenty", "ten", "five", "dollar", "quarter", "dime", "nickel", "penny"];
// const DENOMINATIONS = [["hundred", 100], ["twenty", 20], ["ten", 10], ["five", 5], ["dollar", 1], ["quarter", 0.25], ["dime", 0.10], ["nickel", 0.05], ["penny", 0.01]];
const SELLABLE_ITEMS = {
  apple: 0.60,
  banana: 0.20,
  crisps: 0.55,
  drink: 1.80,
  energybar: 0.99,
  feta: 2.59
};

let cashInDrawer = [];
let basket = [];
let basketValue = 0;
let result = {
  status: "",
  change: []
}

function setCashInDrawer() {
  cashInDrawer = DENOMINATIONS.map(index => [index, parseFloat(setCashValue(index)).toFixed(2)]);
  console.log(cashInDrawer)
  renderCashInDrawer();
}

function setCashValue(index) {
  // Auto set the cash value
  return document.getElementById(`${index}-container`).children[0].innerHTML;
  // Manually set the cash value
  // return window.prompt(`Please set the value of ${index}:`);
}

function setTotalCash() {
  return cashInDrawer.map(x => parseFloat(x[1])).reduce((a, b) => a + b).toFixed(2);
}

function renderCashInDrawer() {
  cashInDrawer.map(coin =>
    document.getElementById(`${coin[0]}-value`).innerHTML = coin[1]);
  document.getElementById("total-cash-value").innerHTML = setTotalCash();
}

function addToBasket() {
  basket.push([this.id, SELLABLE_ITEMS[this.id]]);
  updateBasket();
}

function updateBasket() {
  basketValue = basket.map(x => x[1]).reduce((a, b) => a + b).toFixed(2);
  document.getElementById("price-value").innerHTML = basketValue;
}

function runPayment() {
  const PAYMENT = parseFloat(document.getElementById("payment-input-value").value || this.innerHTML);
  
  if (doesPaymentSuffice(PAYMENT)) {
    renderCashDisplays(PAYMENT);
    checkCoinAvailability(PAYMENT);
  }  
}

function doesPaymentSuffice(payment) {
  return payment >= basketValue;
}

function calculateChange(payment) {
  return payment - basketValue;
}

function renderCashDisplays(payment) {
  document.getElementById("payment-value").innerHTML = payment.toFixed(2);
  document.getElementById("change-due-value").innerHTML = calculateChange(payment).toFixed(2);
}

function checkCoinAvailability(payment) {
  let coins = cashInDrawer.filter(coin => coin[1] <= calculateChange(payment)).map(coin => coin[1]);
  console.log(coins);
  
  
  // console.log(result.change);
}



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
//         //Push either the total coinValue needed or else the total cidValue available onto change and remove from due
//         if (coinValue <= cidValue) {
//           result.change.push([coin[0], coinValue]);
//           due -= coinValue;
//         } else {
//           result.change.push([coin[0], (Math.floor(cidValue / coin[1])) * coin[1]]);
//           due -= cidValue;
//         }
//         //Due to weird maths, must keep on fixing to 2 decimals
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
