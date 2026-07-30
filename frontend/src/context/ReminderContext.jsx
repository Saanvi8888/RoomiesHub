import {
   createContext,
   useContext,
   useState,
   useRef,
} from "react";

import { reminderAPI } from "../api/axios";

const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
   const [reminders, setReminders] = useState([]);
   const [loading, setLoading] = useState(false);
   const [selectedDate, setSelectedDate] = useState(new Date());
   const requestIdRef = useRef(0);

   const fetchReminders = async (houseId, date) => {
      const requestId = ++requestIdRef.current;

      try {
         setLoading(true);

         const normalizedDate = new Date(date)
            .toISOString()
            .split("T")[0];

         const res = await reminderAPI.getRemindersByDate(
            houseId,
            normalizedDate
         );
         if (requestId !== requestIdRef.current) return;

         setReminders(res.data || []);

      } catch (error) {
         console.log("fetchReminders error:", error);
      } finally {
         if (requestId === requestIdRef.current) {
            setLoading(false);
         }
      }
   };


const createReminder = async (houseId, reminderData) => {
   try {
      const res = await reminderAPI.createReminder(
         houseId,
         reminderData
      );

      setReminders((prev) => [...prev, res.data]);

      return res.data;
   } catch (error) {
      console.log(error);
   }
};

  const completeReminder = async (reminderId) => {
   try {
      const res = await reminderAPI.completeReminder(reminderId);

      setReminders((prev) =>
         prev.map((r) => (r._id === reminderId ? res.data : r))
      );
   } catch (error) {
      console.log(error);
   }
};


   const removeReminder = async (reminderId) => {
   try {
      await reminderAPI.deleteReminder(reminderId);

      setReminders((prev) =>
         prev.filter((r) => r._id !== reminderId)
      );
   } catch (error) {
      console.log(error);
   }
};

   return (
      <ReminderContext.Provider
         value={{
            reminders,
            loading,
            selectedDate,
            setSelectedDate,
            fetchReminders,
            createReminder,
            completeReminder,
            removeReminder,
         }}
      >
         {children}
      </ReminderContext.Provider>
   );
};

export const useReminder = () => useContext(ReminderContext);