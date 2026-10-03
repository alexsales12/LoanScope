# LoanScope

LoanScope is a web app that shows how a loan's total payoff time and total interest change as you adjust the principal, interest rate, and monthly payment.

## Tech Stack

- **Frontend:** React (Vite), Recharts
- **Backend:** Node.js, Express
- **Calculator:** standalone JavaScript module in calculator/

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)

## How to Run

1. Clone the repository:

```
   git clone https://github.com/alexsales12/LoanScope.git
   cd LoanScope
```

2. Start the backend:

```
   cd server
   npm install
   node index.js
```

3. In a second terminal start the frontend from the LoanScope folder:

```
   cd client
   npm install
   npm run dev
```

4. Open the link shown in the terminal.

Both the backend and frontend need to be running at the same time.

## Project Structure

- calculator/ – amortization math
- server/ – Express API that validates inputs and returns the schedule
- client/ – React frontend

## Features

- Linked number boxes and sliders for principal, annual rate, and payment
- Live recalculation
- Input validation
- Loan term, payoff date, and total interest
- Balance chart with hover tooltip and click box optional cumulative interest line
- Month by month schedule table divded into pages
- CSV export button of the full schedule
- Share button that copies link of current principal, annual rate , and payment
