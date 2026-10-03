import "./App.css";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
// get value from url, default if bad
function readParam(name, defaultValue, min, max) {
  const params = new URLSearchParams(window.location.search);
  const value = Number(params.get(name));
  if (
    params.get(name) === null ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    return defaultValue;
  }
  return value;
}

function App() {
  const [principal, setPrincipal] = useState(() =>
    readParam("principal", 10000, 1, 100000000),
  );
  const [annualRate, setAnnualRate] = useState(() =>
    readParam("rate", 6, 0, 40),
  );
  const [payment, setPayment] = useState(() =>
    readParam("payment", 200, 1, 1000000),
  );
  const [result, setResult] = useState(null);
  const [delay, setDelay] = useState(300);
  const [showInterest, setShowInterest] = useState(false);
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(false);

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
  // fetch schedule when inputs change
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
          setPage(0);
        });
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [principal, annualRate, payment, delay]);
  let chartData = [];
  let pageRow = [];
  let totalPages = 0;
  // skip if any input is bad
  if (result && !result.error) {
    chartData = result.schedule.map((row) => ({
      month: row.month,
      balance: row.balance / 100,
      cumulativeInterest: row.cumulativeInterest / 100,
    }));
    pageRow = result.schedule.slice(page * 12, page * 12 + 12);
    totalPages = Math.ceil(result.schedule.length / 12);
  }
  // download csv
  function exportCSV() {
    // build csv text
    const header = "Month,Payment,Principal,Interest,Balance";
    const lines = result.schedule.map((row) =>
      [
        row.month,
        (row.monthlyPayment / 100).toFixed(2),
        (row.principalPaid / 100).toFixed(2),
        (row.interest / 100).toFixed(2),
        (row.balance / 100).toFixed(2),
      ].join(","),
    );

    const csv = [header, ...lines].join("\n");
    // make file and download it
    const csvFile = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(csvFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = "loan-schedule.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  // copy share link
  function shareLink() {
    const url = `${window.location.origin}${window.location.pathname}?principal=${principal}&rate=${annualRate}&payment=${payment}`;
    navigator.clipboard.writeText(url).then(() => setCopied(true));
  }

  return (
    <>
      <h1>LoanScope</h1>
      <p>
        **Disclaimer** this is not financial advice this is just an estimate.
        This may not match your lender's amortization terms.
      </p>

      <label htmlFor="principal">Principal ($)</label>
      <input
        id="principal"
        type="number"
        value={principal}
        onChange={(event) => {
          setDelay(300);
          setPrincipal(Number(event.target.value));
        }}
      />
      <input
        type="range"
        aria-label="Principal Slider"
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

      <label htmlFor="annualRate">Annual Rate (%)</label>
      <input
        id="annualRate"
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
        aria-label="Annual Rate Slider"
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

      <label htmlFor="payment">Payment ($)</label>
      <input
        id="payment"
        type="number"
        value={payment}
        onChange={(event) => {
          setDelay(300);
          setPayment(Number(event.target.value));
        }}
      />
      <input
        type="range"
        aria-label="Payment Slider"
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

      <button onClick={shareLink}>Share</button>
      {copied && <span> Link copied!</span>}

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
      <label>
        <input
          type="checkbox"
          checked={showInterest}
          onChange={(event) => setShowInterest(event.target.checked)}
        />
        Show cumulative interest
      </label>
      {result && !result.error && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" />
            <Tooltip></Tooltip>
            <YAxis />
            <Line dataKey="balance" stroke="#005eff" dot={false} />
            {showInterest && (
              <Line dataKey="cumulativeInterest" stroke="#ff0000" dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
      {result && !result.error && (
        <details>
          <summary>Schedule</summary>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {pageRow.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>
                    {(row.monthlyPayment / 100).toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td>
                    {(row.principalPaid / 100).toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td>
                    {(row.interest / 100).toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td>
                    {(row.balance / 100).toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page === 0}>
              Previous
            </button>
            <span>
              {" "}
              Page {page + 1} of {totalPages}{" "}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
            >
              Next
            </button>
          </div>
          <button onClick={exportCSV}>Export CSV</button>
        </details>
      )}
    </>
  );
}

export default App;
