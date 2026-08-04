const { detectIntent } = require("./intentDetector");

const { calculateSettlements } = require("./analytics/balanceAnalytics");
const {getMonthlySpending,getTopContributor,} = require("./analytics/expenseAnalytics");
const {getLowStockItems} = require("./analytics/inventoryAnalytics");
const {getHouseSummary} = require("./analytics/housesummaryAnalytics");
const { askGemini } = require("./geminiService");

function buildBackendResponse(intent, data, userName) {
  switch (intent) {
    case "TOP_CONTRIBUTOR":
      return data? `${data.topContributor} is the top contributor with ₹${data.amount}.`:"No contributor data found.";
    case "SPENDING":
      return data? `Total monthly spending is ₹${data.totalSpent}.`:"No spending data found.";
    case "LOW_STOCK":
      return data?.length? `Low stock items: ${data.map((item) => item.name).join(", ")}`:"No low stock items.";
    case "BALANCES":
      if (!data?.length) {
        return "No outstanding balances.";
      }
      return data.map((settlement) =>
          `${settlement.from.name} owes ${settlement.to.name} ₹${settlement.amount}`
        ).join("\n");
    case "SUMMARY":
      if (!data) {
        return "No house summary available.";
      }
      return `House Summary
        Total Spent: Rs.${data.totalSpent || 0}
        Total Expenses: ${data.expenseCount || 0}
        Low Stock Items: ${data.inventoryCount || 0}
        Total Notes: ${data.noteCount || 0}
        Total Reminders: ${data.reminderCount || 0}
      `.trim();
    default:
      return "No matching house data found.";
  }
}

exports.answerQuestion = async (question,houseId,userName) => {
  const intent = detectIntent(question);
  
  let data;
  switch (intent) {
    case "BALANCES":
      data = await calculateSettlements(houseId);
      break;

    case "TOP_CONTRIBUTOR":
      data = await getTopContributor(houseId);
      break;

    case "LOW_STOCK":
      data = await getLowStockItems(houseId);
      break;

    case "SPENDING":
      data = await getMonthlySpending(houseId);
      break;

    case "SUMMARY":
      data = await getHouseSummary(houseId);
      break;

    default:
      data = {
        message: "No matching house data found.",
      };
  }

  const NON_AI_INTENTS = [
    "BALANCES",
    "TOP_CONTRIBUTOR",
    "LOW_STOCK",
    "SPENDING",
  ];
  if (intent === "GENERAL") {
    const prompt = `
  You are RoomiesHub AI Assistant.

  Current User: ${userName}

  Question:
  ${question}

  Answer briefly. If the question is unrelated to house management,
  say that you can help with expenses, balances, inventory and summaries.
  `;

    try {
      return await askGemini(prompt);
    } catch {
      return "I can help with balances, spending, inventory and house summaries.";
    }
  }
  if (NON_AI_INTENTS.includes(intent)) {
    return buildBackendResponse(
      intent,
      data,
      userName
    );
  }

  const prompt = `
You are RoomiesHub AI Assistant.

Current User: ${userName}

Use ONLY the provided house data.

Intent:
${intent}

House Data:
${JSON.stringify(data, null, 2)}

Question:
${question}

Rules:
- Never ask for the user's name.
- The current user is ${userName}.
- If the question contains "me", "my", "mine", or "I", assume it refers to ${userName}.
- Use only the supplied data.
- Do not invent information.
- Keep the response concise and helpful.
`;

  try {
    return await askGemini(prompt);
  } catch (err) {
    console.log(
      "Gemini unavailable. Using backend fallback."
    );

    return buildBackendResponse(
      intent,
      data,
      userName
    );
  }
};