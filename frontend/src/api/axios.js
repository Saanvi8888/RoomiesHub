import axios from "axios"

const API = axios.create({
    baseURL:import.meta.env.VITE_API_URL ,
    withCredentials:true,
    headers: {
        "Content-Type":"application/json",
    }
})

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API error:", error.response?.data || error.message);
        return Promise.reject(error)
        
    }
)

export const authAPI = {
  register: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
  logout: () => API.post("/auth/logout"),
  googleLogin: (data) => API.post("/auth/google",data),
};
export const houseAPI = {
  createHouse: (data) => API.post("/house/create", data),
  joinHouse: (data) => API.post("/house/join", data),
  getHouse: (houseId) => API.get(`/house/${houseId}`),
  getAllHouses: () => API.get("/house/all"),
  deleteHouse: (houseId) => API.delete(`/house/${houseId}`),
};

export const activityAPI = {
  getActivities: (houseId) =>API.get(`/activity/${houseId}`),
};

export const expenseAPI = {
  getExpenses: (houseId) => API.get(`/expense/${houseId}`),
  addExpense: (houseId,expenseData) =>API.post(`/expense/${houseId}`,expenseData),
  updateExpense: (expenseId,updatedData) => API.put(`/expense/${expenseId}`,updatedData),
  getBalances: (houseId) =>API.get( `/expense/${houseId}/balances`),
  getSettlements: (houseId) =>API.get( `/expense/${houseId}/settlements`),
  deleteExpense: (expenseId) => API.delete(`/expense/${expenseId}`),
};
export const inventoryAPI = {
  getItems: (houseId) =>API.get(`/inventory/${houseId}`),
  addItem: (houseId, itemData) =>API.post(`/inventory/${houseId}`, itemData),
  updateItem: (itemId, updatedData) =>API.put(`/inventory/${itemId}`, updatedData),
  increaseQuantity: (itemId) =>API.patch(`/inventory/${itemId}/increase`),
  decreaseQuantity: (itemId) =>API.patch(`/inventory/${itemId}/decrease`),
  deleteItem: (itemId) =>API.delete(`/inventory/${itemId}`),
};
export const notesAPI = {
  createNote: (houseId,noteData) =>API.post(`/notes/${houseId}`,noteData),
  getNotes: (houseId) =>API.get(`/notes/${houseId}`),
  updateNote: (noteId, updatedData) =>API.put(`/notes/${noteId}`, updatedData),
  deleteNote: (noteId) =>API.delete(`/notes/${noteId}`),
};

export const reminderAPI = {
   createReminder: (houseId, reminderData) =>API.post(`/reminders/${houseId}`,reminderData),
   getRemindersByDate: (houseId, date) =>API.get( `/reminders/${houseId}?date=${date}`),
   completeReminder: (reminderId) =>API.patch(`/reminders/${reminderId}/complete`),
   deleteReminder: (reminderId) =>API.delete(`/reminders/${reminderId}`),
   getMonthReminders: (houseId,month,year) =>API.get(`/reminders/month/${houseId}?month=${month}&year=${year}`),
};

export const notificationAPI  = {
  getNotifications: (houseId) => API.get(`notifications/${houseId}`),
  markAsRead: (notificationId)=>API.patch(`notifications/${notificationId}/read`),
  markAllAsRead: (houseId) => API.patch(`notifications/${houseId}/read-all`),
}

export const aiAPI = {
  ask: (data, config)=>API.post("/ai/ask", data, config),
};
export default API;