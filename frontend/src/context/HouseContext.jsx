import React, {createContext,useContext,useEffect,useState} from "react";
import { houseAPI } from "../api/axios";
import { useAuth } from "./AuthContext";

const HouseContext = createContext();

export const HouseProvider = ({ children }) => {
  const [houses, setHouses] = useState([]);
  const [currentHouse, setCurrentHouse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [houseLoaded,setHouseLoaded] = useState(false);
  useEffect(() => {
    if (user) {
      getAllHouses();
    }
  }, [user]);

  const getAllHouses = async () => {
    try {
      setLoading(true);
      const { data } = await houseAPI.getAllHouses();
      setHouses(data);
      return data; 
    } catch (error) {
      console.log(error.response?.data?.message);
      throw error;
    } finally {
      setLoading(false);
      setHouseLoaded(true);
    }
  };
  const getHouse = async (houseId) => {
    try {
      setLoading(true);
      const { data } = await houseAPI.getHouse(houseId);
      setCurrentHouse(data);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const createHouse = async (name) => {
    try {
      setLoading(true);
      const { data } = await houseAPI.createHouse({ name });
      setCurrentHouse(data);
      setHouses((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const joinHouse = async (inviteCode) => {
    try {
      setLoading(true);
      const { data } = await houseAPI.joinHouse({inviteCode});
      setCurrentHouse(data.house);
      return data.house;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHouse = async (houseId) => {
    try {
      setLoading(true);
      await houseAPI.deleteHouse(houseId);
      setHouses((prev) => prev.filter((house) => house._id !== houseId));
      if (currentHouse?._id === houseId) {
        setCurrentHouse(null);
      }
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HouseContext.Provider
      value={{
        houses,
        houseLoaded,
        currentHouse,
        loading,
        getAllHouses,
        getHouse,
        createHouse,
        joinHouse,
        deleteHouse,
        setCurrentHouse,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};

export const useHouse = () => {
  const context = useContext(HouseContext);

  if (!context) {
    throw new Error(
      "useHouse must be used within HouseProvider"
    );
  }

  return context;
};

export default HouseContext;