'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate); // looping over 2 arrays at the same time using the index
    const displayDate = formatMovementDate(date, acc.locale); // internationalized date already here because of the function

    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  // function
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log user out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started!';
      containerApp.style.opacity = 0;
    }

    // Decrease 1 second
    time--;
    // putting it in the bottom, if block will execute only when it actually really reaches 0
  };
  // Set time
  let time = 120;

  // Call the timer every second to print the time
  tick(); // execute immediately, no waiting for 1 second
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer; // timer needs to be defined globally, so that it can persist between users and be accessed by many functions

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    // const locale = navigator.language; // getting user's locale according to the web

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now); // intl api which formats the date

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // start time
    if (timer) clearInterval(timer); // clearing an existing timer from previous user
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // reset timer when user does an activity
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // reset timer when user does an activity
      // put inside this block so it executes when the condition is true
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500); // there are some seconds passed before the loan is added
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// LECTURE 181
// converting & checking numbers
// // numbers are stored in binary format and presented in floating point even though written as integer
// console.log(23 === 23.0);

// // no precise scientific or financial calculations in JS

// // converting
// console.log(+'23'); // + will automatically do type coercion (turn into a number)

// // parsing
// console.log(Number.parseInt('30px', 10)); // for parsing to work, it needs to start with numbers
// console.log(Number.parseFloat('2.5rem'));

// console.log(Number.isNaN(20)); // checking is it not-a-number, but not recommended

// // use isFinite
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(20 / 0));
// console.log(Number.isFinite(+'20X'));

// LECTURE 182
// math and rounding
// // square root
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// // cubic root
// console.log(8 ** (1 / 3));

// // max & min
// console.log(Math.max(5, 18, '23', 11, 2));
// console.log(Math.min(5, 18, '23', 11, 2));

// // constants (for ex : PI)
// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// // random
// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;
// console.log(randomInt(10, 20));

// // rounding integers (removing the decimal part)
// console.log(Math.trunc(23.3));

// // actual rounding
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// // ceil & floor
// console.log(Math.ceil(23.9));
// console.log(Math.floor(23.9));

// // ceil, floor, trunc works the other way around for negative numbers
// // floor is better and does type coercion into string

// // rounding decimals
// console.log((2.7).toFixed(0)); // return a string not a number
// console.log((2.7).toFixed(3)); // number inside () after to fixed is the number of 0s

// LECTURE 183
// remainder operator
// console.log(5 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// LECTURE 184
// numeric separators
// const diameter = 287_460_000_000; // separating using underscore
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// // we can only place _ between numbets
// // const PI = 3._1415
// // console.log(PI);

// // converting strings with underscores wont work as expected
// console.log(Number('230_000')); // returns NaN
// console.log(Number.parseInt('230_000')); // only returns 230

// to parse correctly dont use underscore

// LECTURE 185
// bigInt
// console.log(2 ** 53 - 1); // biggest number JS can represent
// console.log(Number.MAX_SAFE_INTEGER);

// // a new primitive is added -> bigInt -> can store bigger numbers
// console.log(48524038442307409174104710741902471n); // n turns it into a bigInt

// console.log(BigInt(48524038442307409174104710741902471)); // but the value might be different because JS still has to represent it intrnally

// // operations -> symbols still work the same
// console.log(10000n + 10000n);
// console.log(
//   48524038442307409174104710741902471n * 58524038442307409174104710741902471n
// );

// cannot be mixed with other type of numbers
// const huge = 48524038442307409174104710741902471n;
// const num = 23;
// // console.log(huge * num); // wont work
// console.log(huge * BigInt(num));

// // exception for comparison & logical operators?
// console.log(huge > num);
// console.log(20n === 20); // returns false because of a different data type
// console.log(20n == 20); // true because it does type coercion

// // another exception for string concat
// console.log(huge + ' is REALLY BIG'); // bigInt becomes string

// // math functions does not work for bigInt?

// // divisions
// console.log(10n / 3n); // will simply return the closest bigInt, cuts the decimal part

// LECTURE 186
// creating dates

// // create a date
// const now = new Date();
// console.log(now); // returns the recent time

// console.log(new Date('Thu Aug 21 2025 20:01:03'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// // creating manually
// // year, month (its zero based, so 10 is actually November), date, hour, minute, second
// console.log(new Date(2037, 10, 19, 15, 23, 5));

// // JS will auto correct
// console.log(new Date(2037, 10, 33, 15, 23, 5));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); // skipping to 3 days

// // methods
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString()); // standard format
// console.log(future.getTime()); // time passed since that date

// console.log(new Date(2142231780000)); // reverse of getTime

// console.log(Date.now()); // Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC)

// future.setFullYear(2040);
// console.log(future); // setting the month and date but in a different year? performs auto correction too

// LECTURE 189
// date operations
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(Number(future)); // timestamp in milliseconds

// const calDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); // turns milli into seconds, seconds into minutes, minutes into hours, hours into days
// const days1 = calDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(days1);

// LECTURE 190
// internationalization API
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
// http://www.lingoes.net/en/translator/langcode.htm

// LECTURE 191
// Internationalizing Numbers (Intl)
const num = 3884764.23;

const options = {
  style: 'unit', // other style includes currency and percent
  unit: 'mile-per-hour', // other units includes celcius
  currency: 'EUR', // currency needs to be defined
  // useGrouping: false,
};

console.log('US : ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany : ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria : ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  'Browser : ',
  new Intl.NumberFormat(navigator.language, options).format(num)
);

// LECTURE 192
// setTimeout & setInterval
// setTimeout -> executing code after a certain time

// receives callback function and time in milliseconds
// It registers the callback function with the timer service in the browser/Node.js
// The timer starts counting down in the background
// Important: The callback is not executed immediately, only scheduled
setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  'olives',
  'spinach'
);

// Since the setTimeout just scheduled the callback, execution moves straight to this line
console.log('Waiting...');

// setTimeout is asynchronous
// When you call it, JavaScript doesn’t pause to wait for the timer
// Instead, it delegates the waiting to the browser (or Node.js environment)
// Meanwhile, JS continues running the rest of your code

const ingredients = ['olives', 'ham'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer); // clearing the timer

// setInterval
// running a function every 5 seconds or some time
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 3000);
