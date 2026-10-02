import express from "express";
import cors from "cors";
import { calcSchedule } from "../calculator/calc.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.json({ message: "Server is running" });
});
app.post("/api/schedule", (request, response) => {
  const principal = request.body.principal;
  const annualRate = request.body.annualRate;
  const payment = request.body.payment;

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualRate) ||
    !Number.isFinite(payment)
  ) {
    return response.status(400).json({ error: "Input must be a valid number" });
  }
  if (principal < 1 || principal > 100000000) {
    return response
      .status(400)
      .json({ error: "Principal amount must be between 1 and 100,000,000" });
  }
  if (annualRate < 0 || annualRate > 40) {
    return response
      .status(400)
      .json({ error: "Annual Rate amount must be between 0 and 40" });
  }
  if (payment < 1) {
    return response
      .status(400)
      .json({ error: "Payment amount must be at least 1" });
  }

  const result = calcSchedule(principal, annualRate, payment);
  if (result.error) {
    return response.status(400).json(result);
  }
  response.json(result);
});
app.listen(3000, () => {
  console.log("started");
});
