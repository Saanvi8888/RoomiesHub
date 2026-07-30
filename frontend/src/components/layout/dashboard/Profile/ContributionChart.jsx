import { useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useExpense } from "../../../../context/ExpenseContext";
import { useInventory } from "../../../../context/InventoryContext";
import { useNotes } from "../../../../context/NoteContext";
import { useReminder } from "../../../../context/ReminderContext";

export default function ContributionChart() {
  const { user } = useAuth();
  const { expenses = [] } = useExpense();
  const { items = [] } = useInventory();
  const { notes = [] } = useNotes();
  const {reminders= []} = useReminder();
  const contributions = useMemo(() => {
    if (!user?.id) {
      return [
        { label: "Expenses", value: 0, count: 0 },
        { label: "Inventory", value: 0, count: 0 },
        { label: "Notes", value: 0, count: 0 },
      ];
    }
    const userExpenseCount = expenses.filter((expense) =>
        expense.paidBy?._id === user.id
    ).length;

    const userInventoryCount = items.filter((item) => {
      const addedById =item?.addedBy?._id 
      return addedById === user.id;
    }).length;

    const userNotesCount = notes.filter((note) => {
      const noteUserId =note?.createdBy?._id 
      return noteUserId === user.id;
    }).length;

    const userReminderCount = reminders.filter((reminder)=>{
        const reminderUserId = reminder?.createdBy?._id
        return reminderUserId === user.id;
    }).length

    const expensePercentage =expenses.length>0?Math.round((userExpenseCount / expenses.length) * 100):0;
    const inventoryPercentage =items.length > 0? Math.round((userInventoryCount / items.length) * 100):0;
    const notesPercentage =notes.length > 0? Math.round((userNotesCount / notes.length) * 100):0;
    const reminderPercentage =reminders.length > 0? Math.round((userReminderCount / reminders.length) * 100):0;
    return [
        {
            label: "Expenses",
            value: expensePercentage,
            count: userExpenseCount,
            color: "bg-[#7F77DD]", 
        },
        {
            label: "Inventory",
            value: inventoryPercentage,
            count: userInventoryCount,
            color: "bg-emerald-500", // Green
        },
        {
            label: "Notes",
            value: notesPercentage,
            count: userNotesCount,
            color: "bg-amber-500", // Orange
        },
        {
            label: "Reminders",
            value: reminderPercentage,
            count: userReminderCount,
            color: "bg-yellow-500", // Orange
        },
    ];
  }, [user, expenses, items, notes,reminders]);

  return (
    <div className="rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">
          Contribution Profile
        </h2>

      </div>

      <div className="space-y-6">
        {contributions.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium text-white">
                  {item.label}
                </p>

                <p className="text-xs text-white/40">
                  {item.count} contribution
                </p>
              </div>

              <span className="text-sm font-semibold text-white">
                {item.value}%
              </span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full  rounded-full transition-all duration-700 ${item.color}`}
                style={{width: `${item.value}%`,}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}