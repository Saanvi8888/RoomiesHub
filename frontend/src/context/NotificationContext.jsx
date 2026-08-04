import React, {createContext,useContext,useState} from "react";
import { notificationAPI } from "../api/axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (houseId) => {
    try {
      setLoading(true);
      const { data } =await notificationAPI.getNotifications(houseId);
      setNotifications(data);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setLoading(true);
      const { data } =await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>prev.map((notification) =>
          notification._id === notificationId? data: notification
        ));
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async (houseId) => {
    try {
      setLoading(true);
      await notificationAPI.markAllAsRead(houseId);
      setNotifications((prev) =>prev.map((notification) => ({
          ...notification,read: true,}))
      );
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within NotificationProvider"
    );
  }

  return context;
};

export default NotificationContext;