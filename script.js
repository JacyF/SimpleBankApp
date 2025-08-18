'use strict';

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jacinto Francisco',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-12-01T10:17:24.185Z',
    '2025-06-08T14:11:59.604Z',
    '2025-07-27T17:01:17.194Z',
    '2025-08-11T23:36:17.929Z',
    '2025-08-15T10:51:36.790Z',
  ],

  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Anush Tumanyan',
  movements: [20000, -200, 12500, -300, -1000, 50, 400, -460],
  interestRate: 1.2, // %
  pin: 2222,

  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2025-05-01T10:17:24.185Z',
    '2025-06-08T14:11:59.604Z',
    '2025-07-27T17:01:17.194Z',
    '2025-07-11T23:36:17.929Z',
    '2025-08-15T10:51:36.790Z',
  ],

  currency: 'AMD',
  locale: 'hy-AM',
};

const account3 = {
  owner: 'Jessica Davis',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2025-06-25T18:49:59.371Z',
    '2025-07-26T12:01:20.894Z',
  ],

  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Developer Demo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 4444,

  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2025-01-25T14:18:46.235Z',
    '2025-02-05T16:33:06.386Z',
    '2025-04-10T14:43:26.374Z',
    '2025-06-25T18:49:59.371Z',
    '2025-07-26T12:01:20.894Z',
  ],

  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

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


// FUNCTIONALITIES

// FORMAT DATES
const formatMovementDate = function (date, locale) {

  const calDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calDaysPassed(new Date(), date)

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date)
  }
}

// FORMATING CURRENCY
const formatCur = function (value, locale, currency) {

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

// DISPLAY MOVEMENTS
const displayMovements = function (acc, sort = false) {

  containerMovements.innerHTML = '';

  const combinedMovDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i)
  }))

  if (sort) combinedMovDates.sort((a, b) => a.movement - b.movement);

  combinedMovDates.forEach(function (obj, i) {
    const {
      movement,
      movementDate
    } = obj
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

// DISPLAY BALANCE
const calDisplaytBalance = function (acc) {

  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);;
}

// DISPLAY SUMMARY
const calDisplaySummary = function (acc) {

  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  const outcomes = Math.abs(acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0));
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).filter((int, i, arr) => {
    return int >= 1;
  }).reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  labelSumOut.textContent = formatCur(outcomes, acc.locale, acc.currency);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

// CREATE USERNAME
const createUserNames = function (accts) {
  accts.forEach(acc => {
    acc.userName = acc.owner.toLowerCase().split(" ").map(letter => letter[0]).join("");
  })
}
createUserNames(accounts)

// UPDATE UI
const updateUI = function (acc) {

  // DISPLAY MOVEMENTS
  displayMovements(acc);

  // DISPLAY BALANCE
  calDisplaytBalance(acc);

  // DISPLAY SUMMARY
  calDisplaySummary(acc);
}

// STARTLOGOUT TIMER
const startLogoutTimer = function () {
  const tick = function () {
    const min = `${Math.trunc(time/60)}`.padStart(2, 0);
    const sec = `${Math.trunc(time%60)}`.padStart(2, 0);

    // print the remain time in each call
    labelTimer.textContent = `${min}:${sec}`;

    // clear and ;logout
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to your bank account get started`;
    }

    // decrease timer
    time--;
  }

  // SET TIME TO 10 MIN
  let time = 600;

  // CALL TIMER EVERY SECOND
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
}

// EVENTS HANDLER
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // PREVENT FORM FROM RELOAD
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentAccount?.pin === Number((inputLoginPin.value))) {

    // DISPLAY UI AND MESSAGGE
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`
    containerApp.style.opacity = 1;

    // ADDING DATES
    // INTL DATES FORMATING
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    }
    // const locale = navigator.language;

    labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale, options).format(now)

    // CLEAR INPUTS
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // TIMER
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // UPDATE UI
    updateUI(currentAccount);
  }
})

// TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {

  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value)

  console.log(amount, receiverAcc);

  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount && receiverAcc?.userName !== currentAccount.userName) {

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // ADD NEW TO DATE TO TRASNFER AND LOAN
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // UPDATE UI
    updateUI(currentAccount);
  }

  // CLEAR INPUTS
  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  // reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
})

// RRQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount >= 0 && currentAccount.movements.some(mov => mov >= mov * 0.1)) {
    // add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI 
      updateUI(currentAccount)
    }, 2500)

    // clean input
    inputLoanAmount.value = '';
  }

  // reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
})

// CLOSE AN ACCOUNT
btnClose.addEventListener('click', function (e) {

  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin) {

    const index = accounts.findIndex(function () {
      acc => acc.userName === currentAccount.userName
    })

    // DELETE ACCOUNT
    accounts.splice(index, 1);

    // LOGOUT USER
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';

  labelWelcome.textContent = `Log in to your bank account get started`;
})

// SORTING MOVEMENTS
let sorted = false
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})