import "./App.css";
import { useState } from "react";

function App() {
  const [principal, setPrincipal] = useState(10000);
  const [annualRate, setAnnualRate] = useState(6);
  const [payment, setPayment] = useState(200);
  let principalError = null;
  if (principal < 1 || principal > 100000000) {
    principalError = "Principal must be between $1 and $100,000,000";
  }
  let annualRateError = null;
  if (annualRate < 0 || annualRate > 40) {
    annualRateError = "Annual Rate must be between 0% and 40%";
  }
  let paymentError = null;
  if (payment < 1 || payment > 1000000) {
    paymentError = "Payment must be between $1 and $1,000,000";
  }

  return (
    <>
      <h1>LoanScope</h1>

      <label>Principal ($)</label>
      <input
        type="number"
        value={principal}
        onChange={(event) => setPrincipal(Number(event.target.value))}
      />
      <input
        type="range"
        value={principal}
        min={1}
        max={100000000}
        onChange={(event) => setPrincipal(Number(event.target.value))}
      />
      <p>Principal: {principal}</p>
      {principalError && <p>{principalError}</p>}

      <label>Annual Rate (%)</label>
      <input
        type="number"
        value={annualRate}
        step={0.01}
        onChange={(event) => setAnnualRate(Number(event.target.value))}
      />
      <input
        type="range"
        value={annualRate}
        min={0}
        max={40}
        step={0.01}
        onChange={(event) => setAnnualRate(Number(event.target.value))}
      />
      <p>AnnualRate: {annualRate}</p>
      {annualRateError && <p>{annualRateError}</p>}

      <label>Payment ($)</label>
      <input
        type="number"
        value={payment}
        onChange={(event) => setPayment(Number(event.target.value))}
      />
      <input
        type="range"
        value={payment}
        min={1}
        max={1000000}
        onChange={(event) => setPayment(Number(event.target.value))}
      />
      <p>Payment: {payment}</p>
      {paymentError && <p>{paymentError}</p>}
    </>
  );
}

export default App;
