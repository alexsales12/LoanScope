export function calcSchedule(principal, annualRate, payment) {
  // Amortization calculator.
  // dollars to cents
  let principalCents = principal * 100;
  let paymentCents = payment * 100;
  // yearly rate to monthly
  let monthlyRate = annualRate / 100 / 12;

  let balance = principalCents;
  let month = 0;

  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  // holds every month's row
  const schedule = [];

  const firstInterest = Math.round(balance * monthlyRate);
  // payment too low = never paid off
  if (paymentCents <= firstInterest) {
    return {
      error:
        "Payment is too low to cover interest therefore loan will never be paid",
    };
  }
  // one month per loop, max 1200
  while (balance > 0 && month < 1200) {
    const interest = Math.round(balance * monthlyRate);
    let principalPaid = paymentCents - interest;
    let monthlyPayment = paymentCents;
    // last payment is smaller
    if (balance + interest < monthlyPayment) {
      monthlyPayment = balance + interest;
      principalPaid = monthlyPayment - interest;
    }
    balance = balance - principalPaid;
    month = month + 1;
    cumulativeInterest = cumulativeInterest + interest;
    cumulativePrincipal = cumulativePrincipal + principalPaid;
    schedule.push({
      month,
      interest,
      balance,
      monthlyPayment,
      principalPaid,
      cumulativeInterest,
      cumulativePrincipal,
    });
  }
  // over 100 years warning
  let warning = null;
  if (balance > 0) {
    warning = "Loan will not be paid off until more than a 100 years";
  }
  let payoffDate = null;
  if (balance === 0) {
    payoffDate = new Date();
    payoffDate.setDate(1);
    payoffDate.setMonth(payoffDate.getMonth() + month);
  }

  return {
    schedule,
    month,
    totalInterest: cumulativeInterest,
    totalPrincipal: cumulativePrincipal,
    warning,
    payoffDate,
  };
}
