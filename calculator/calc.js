export function calcSchedule(principal, annualRate, payment) {
  let principalCents = principal * 100;
  let paymentCents = payment * 100;
  let monthlyRate = annualRate / 100 / 12;

  let balance = principalCents;
  let month = 0;

  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  const schedule = [];

  const firstInterest = Math.round(balance * monthlyRate);
  if (paymentCents <= firstInterest) {
    return {
      error:
        "Payment is too low to cover interest therefore loan will never be paid",
    };
  }

  while (balance > 0 && month < 1200) {
    const interest = Math.round(balance * monthlyRate);
    let principalPaid = paymentCents - interest;
    let monthlyPayment = paymentCents;

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
