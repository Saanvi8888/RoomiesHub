import { useState } from 'react'
import { AuthProvider,useAuth } from './context/AuthContext'
import { HouseProvider,useHouse } from './context/HouseContext';
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
// import Houses from './pages/Houses';
import { ActivityProvider } from './context/ActivityContext';
import DashboardLayout from './components/layout/dashboard/DashboardLayout';
import DashboardHome from './components/layout/dashboard/DashboardHome';
import Expenses from './components/layout/expenses/Expenses';
import { ExpenseProvider } from './context/ExpenseContext';
import Inventory from './components/layout/inventory/Inventory';
import { InventoryProvider } from './context/InventoryContext';
import Notes from './components/layout/notes/Notes';
import { NoteProvider } from './context/NoteContext';
import { ReminderProvider } from './context/ReminderContext';
import Reminder from './components/layout/reminder/Reminder';
import Profile from './components/layout/dashboard/Profile/ProfileCard';
import { AIProvider } from './context/AIContext';
import { NotificationProvider } from './context/NotificationContext';
const Protected = ({children}) => {
  const {user} = useAuth();
  return user? children:<Navigate to="/login" replace />
}
const HomeRedirect = () => {
  const { user } = useAuth();
  const {houses,houseLoaded,loading: houseLoading} = useHouse();
  if (!user) {
    return <Landing />;
  }

  if (!houseLoaded || houseLoading) {
    return (
      <div className="min-h-screen bg-[#1a1c1c] flex items-center justify-center text-white">
        Loading your house...
      </div>
    );
  }
  if (houses.length > 0) {
    return (
      <Navigate
        to={`/house/${houses[0]._id}/dashboard`}
        replace
      />
    );
  }

  return <Navigate to="/welcome" replace />;
};
const App = () => {
  return (
  <BrowserRouter>
    <AuthProvider>
    <ActivityProvider>
    <HouseProvider>
    <ExpenseProvider>
    <InventoryProvider>
    <NoteProvider>
    <ReminderProvider>
    <NotificationProvider>
    <AIProvider>
      <Routes>
      
        {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        {/* <Route path="/houses" element={<Houses />} /> */}
        <Route path="/house/:houseId/dashboard" element={<DashboardLayout />}>
          <Route
            index
            element={<DashboardHome />}
          />
          <Route
            path='expenses'
            element={<Expenses />}
          />
          <Route
            path='inventory'
            element={<Inventory />}
          />
          <Route path="notes" element={<Notes/>} />
          <Route path="reminders" element={<Reminder/>} />
          <Route path="settings" element={<Profile/>} />
        </Route>
      </Routes>
      </AIProvider>
      </NotificationProvider>
      </ReminderProvider>
      </NoteProvider>
      </InventoryProvider>
      </ExpenseProvider>
      </HouseProvider>
      </ActivityProvider>
    </AuthProvider>
  </BrowserRouter>
  )
}
export default App
