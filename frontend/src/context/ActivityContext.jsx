import {createContext,useContext,useRef,useState,useCallback} from "react";

import { activityAPI } from "../api/axios";

const ActivityContext =createContext();

export const ActivityProvider = ({children,}) => {
  const [activities, setActivities] =useState([]);
  const [loading, setLoading] =useState(false);
  const controllerRef = useRef(null);
  // const getActivities = async (houseId) => {
  //   try {
  //     setLoading(true);
  //     const { data } =await activityAPI.getActivities(houseId);
  //     setActivities(data);
  //     return data;
  //   } catch (error) {
  //     console.log(error.response?.data?.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const getActivities = useCallback(async (houseId) => {
  if (!houseId) return;

  if (controllerRef.current) {
    controllerRef.current.abort();
  }

  const controller = new AbortController();
  controllerRef.current = controller;

  try {
    setLoading(true);

    const { data } = await activityAPI.getActivities(
      houseId,
      {
        signal: controller.signal,
      }
    );

    setActivities(data);
    return data;
  } catch (error) {
    if (
      error.name === "CanceledError" ||
      error.name === "AbortError"
    ) {
      return;
    }

    console.log(error.response?.data?.message);
  } finally {
    if (controllerRef.current === controller) {
      setLoading(false);
    }
  }
}, []);

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