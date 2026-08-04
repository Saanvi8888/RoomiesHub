import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Plus,Trash2,CheckCircle2,CalendarDays,Clock3} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReminder } from "../../../context/ReminderContext";
import ReminderModal from "./ReminderModal";

export default function Reminder() {
  const { houseId } = useParams();
  const {reminders,loading,selectedDate,setSelectedDate,fetchReminders,createReminder,completeReminder,removeReminder}=useReminder();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("12:00");

  const formatDateOnly = (date) => {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    if (!selectedDate || !houseId) return;
    fetchReminders(houseId, formatDateOnly(selectedDate));
  }, [selectedDate, houseId]);

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    const [hours, minutes] = time.split(":");
    const dueDate = new Date(selectedDate);
    dueDate.setHours(hours);
    dueDate.setMinutes(minutes);

    await createReminder(houseId, {
      title,
      description,
      dueDate: dueDate.toISOString(),
      assignedTo: [],
    });

    await fetchReminders(houseId, formatDateOnly(selectedDate));
    setTitle("");
    setDescription("");
    setTime("12:00");
    setShowModal(false);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Reminders
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            Schedule and manage household tasks
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#4034c6] hover:bg-[#240d8b] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
        >
          <Plus size={16} />
          Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-wider text-white/40 font-semibold">
              Calendar
            </h2>

            <span className="text-xs text-white/40">
              Select a date
            </span>
          </div>

          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="text-white"
              styles={{
                months: { width: "100%" },
                month: { width: "100%" },
                caption: {
                  color: "white",
                  marginBottom: "20px",
                  fontSize: "18px",
                  fontWeight: "600",
                  textAlign: "center",
                },
                head_cell: {
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                  fontWeight: "500",
                  width: "44px",
                },
                day: {
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  fontSize: "14px",
                },
                day_selected: {
                  backgroundColor: "#7F77DD",
                  color: "white",
                },
                day_today: {
                  backgroundColor: "#2a2538",
                  color: "#a89ef5",
                },
                day_outside: {
                  color: "rgba(255,255,255,0.2)",
                },
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-white/40 font-semibold">
            Day Tasks
          </h2>

          {loading ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
              Loading...
            </div>
          ) : reminders.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
              No reminders for this day
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.03]"
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {reminder.title}
                      </h3>

                      <p className="text-sm text-white/40 mt-1">
                        {reminder.description}
                      </p>

                      <div className="flex gap-3 mt-3 text-xs text-white/40">
                        <div className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          {formatDate(reminder.dueDate)}
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock3 size={12} />
                          {formatTime(reminder.dueDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!reminder.isCompleted && (
                        <button
                          onClick={async () => {
                            await completeReminder(reminder._id);
                            await fetchReminders(
                              houseId,
                              formatDateOnly(selectedDate)
                            );
                          }}
                          className="p-2 rounded-lg bg-white/10 text-emerald-400"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          await removeReminder(reminder._id);
                          await fetchReminders(
                            houseId,
                            formatDateOnly(selectedDate)
                          );
                        }}
                        className="p-2 rounded-lg bg-white/10 text-rose-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReminderModal
        showModal={showModal}
        setShowModal={setShowModal}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        time={time}
        setTime={setTime}
        onSubmit={handleCreateReminder}
      />
    </div>
  );
}