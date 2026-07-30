exports.detectIntent = (question) => {
  const q = question.toLowerCase();

  if (
    q.includes("owe") ||
    q.includes("owes") ||
    q.includes("balance") ||
    q.includes("settlement") ||
    q.includes("pay back") ||
    q.includes("due")
  ) {
    return "BALANCES";
  }

  if (
    q.includes("top contributor") ||
    q.includes("contribute most") ||
    q.includes("paid most") ||
    q.includes("spent most") ||
    q.includes("highest spender") ||
    q.includes("most expenses")
  ) {
    return "TOP_CONTRIBUTOR";
  }

  if (
    q.includes("spend") ||
    q.includes("spent") ||
    q.includes("expense") ||
    q.includes("expenses") ||
    q.includes("cost") ||
    q.includes("monthly spending") ||
    q.includes("report")
  ) {
    return "SPENDING";
  }

  if (
    q.includes("low stock") ||
    q.includes("running out") ||
    q.includes("need to buy") ||
    q.includes("buy") ||
    q.includes("grocery") ||
    q.includes("inventory") ||
    q.includes("stock")
  ) {
    return "LOW_STOCK";
  }

  if (
    q.includes("summary") ||
    q.includes("overview") ||
    q.includes("activity") ||
    q.includes("house status") ||
    q.includes("what happened") ||
    q.includes("dashboard")
  ) {
    return "SUMMARY";
  }

  return "GENERAL";
};