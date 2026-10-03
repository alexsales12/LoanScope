import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [principal, setPrincipal] = useState(10000);
  const [annualRate, setAnnualRate] = useState(6);
  const [payment, setPayment] = useState(200);
  const [result, setResult] = useState(null);
  const [delay, setDelay] = useState(300);

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

  useEffect(() => {
    if (principalError || annualRateError || paymentError) {
      return;
    }
    const timer = setTimeout(() => {
      fetch("http://localhost:3000/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ principal, annualRate, payment }),
      })
        .then((response) => response.json())
        .then((data) => {
          setResult(data);
        });
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [principal, annualRate, payment, delay]);

  return (
    <>
      <h1>LoanScope</h1>

      <label>Principal ($)</label>
      <input
        type="number"
        value={principal}
        onChange={(event) => {
          setDelay(300);
          setPrincipal(Number(event.target.value));
        }}
      />
      <input
        type="range"
        value={principal}
        min={1}
        max={100000000}
        onChange={(event) => {
          setDelay(0);
          setPrincipal(Number(event.target.value));
        }}
      />
      <p>Principal: {principal}</p>
      {principalError && <p>{principalError}</p>}

      <label>Annual Rate (%)</label>
      <input
        type="number"
        value={annualRate}
        step={0.01}
        onChange={(event) => {
          setDelay(300);
          setAnnualRate(Number(event.target.value));
        }}
      />
      <input
        type="range"
        value={annualRate}
        min={0}
        max={40}
        step={0.01}
        onChange={(event) => {
          setDelay(0);
          setAnnualRate(Number(event.target.value));
        }}
      />
      <p>AnnualRate: {annualRate}</p>
      {annualRateError && <p>{annualRateError}</p>}

      <label>Payment ($)</label>
      <input
        type="number"
        value={payment}
        onChange={(event) => {
          setDelay(300);
          setPayment(Number(event.target.value));
        }}
      />
      <input
        type="range"
        value={payment}
        min={1}
        max={1000000}
        onChange={(event) => {
          setDelay(0);
          setPayment(Number(event.target.value));
        }}
      />
      <p>Payment: {payment}</p>
      {paymentError && <p>{paymentError}</p>}

      {result && result.error && <p>{result.error}</p>}
      {result && result.warning && <p>{result.warning}</p>}
      {result && !result.error && (
        <p>
          {Math.floor(result.month / 12)} Years and {result.month % 12} Months
        </p>
      )}
      {result && !result.error && (
        <p>
          Total Interest:{" "}
          {(result.totalInterest / 100).toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
          })}
        </p>
      )}
      {result && !result.error && result.payoffDate && (
        <p>
          Payoff Date:{" "}
          {new Date(result.payoffDate).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
    </>
  );
}

export default App;
