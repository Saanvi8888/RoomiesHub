import {createContext,useContext,useState,} from "react";

import { activityAPI } from "../api/axios";

const ActivityContext =createContext();

export const ActivityProvider = ({children,}) => {
  const [activities, setActivities] =useState([]);

  const [loading, setLoading] =useState(false);

  const getActivities = async (houseId) => {
    try {
      setLoading(true);
      const { data } =await activityAPI.getActivities(houseId);
      setActivities(data);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        loading,
        getActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context =useContext(ActivityContext);

  if (!context) {
    throw new Error(
      "useActivity must be used within ActivityProvider"
    );
  }

  return context;
};