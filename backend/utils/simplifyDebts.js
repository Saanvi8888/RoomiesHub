// function simplifyDebts(balances){
//     const creditors = []
//     const debitors = []

//     for(let userId in balances){
//         let amount = balances[userId]
//         if(amount>0){
//             creditors.push({userId:userId,amount:amount});
//         }else if(amount<0){
//             debitors.push({userId:userId,amount:-amount});
//         }
//     }

//     let transactions=[];

//     while(creditors.length>0 && debitors.length>0){
//         creditors.sort(function(a,b){
//             return b.amount-a.amount;
//         })
//         debitors.sort(function(a,b){
//             return b.amount-a.amount;
//         })

//         let creditor = creditors[0];
//         let debitor = debitors[0];

//         let settled = Math.min(creditor.amount,debitor.amount);

//         transactions.push({
//             from:debitor.userId,
//             to:creditor.userId,
//             amount:parseFloat(settled.toFixed(2)),
//         })

//         creditor.amount = creditor.amount - settled;
//         debitor.amount = debitor.amount - settled;

//         if(creditor.amount<0.01){
//             creditors.shift();
//         }
//         if(debitor.amount<0.01){
//             debitors.shift();
//         }
//     }
//     return transactions;
// }

// module.exports = simplifyDebts;

module.exports = function simplifyDebts(expenses) {
  const debts = {};
  const users = {};

  for (const expense of expenses) {
    const creditor = expense.paidBy;
    const creditorId = creditor._id.toString();

    users[creditorId] = {
      id: creditorId,
      name: creditor.name,
    };

    for (const share of expense.shares) {
      const debtor = share.user;
      const debtorId = debtor._id.toString();

      users[debtorId] = {
        id: debtorId,
        name: debtor.name,
      };

      if (debtorId === creditorId) continue;

      const key = `${debtorId}-${creditorId}`;
      debts[key] = (debts[key] || 0) + share.amount;
    }
  }

  const settlements = [];
  const visited = new Set();

  for (const key in debts) {
    if (visited.has(key)) continue;

    const [from, to] = key.split("-");
    const reverseKey = `${to}-${from}`;

    const forwardAmount = debts[key] || 0;
    const reverseAmount = debts[reverseKey] || 0;

    const netAmount = forwardAmount - reverseAmount;

    visited.add(key);
    visited.add(reverseKey);

    if (Math.abs(netAmount) < 0.01) continue;

    settlements.push({
      from: netAmount > 0 ? users[from] : users[to],
      to: netAmount > 0 ? users[to] : users[from],
      amount: Number(Math.abs(netAmount).toFixed(2)),
    });
  }

  return settlements;
};