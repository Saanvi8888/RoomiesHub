import {createContext,useContext,useState} from "react";
import { inventoryAPI } from "../api/axios";

const InventoryContext =createContext();

export const InventoryProvider = ({children}) => {

  const [items, setItems] =useState([]);
  const [loading, setLoading] =useState(false);

  const getItems = async (houseId) => {
    try {
      if (!houseId) return;
      setLoading(true);
      const { data } = await inventoryAPI.getItems(houseId);
      setItems(data);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (houseId, itemData) => {
    try {
      if (!houseId) return;
      setLoading(true);
      const { data } = await inventoryAPI.addItem(houseId, itemData);
      setItems((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId,updatedData) => {
    try {
      setLoading(true);
      const { data } =await inventoryAPI.updateItem(itemId,updatedData);
      setItems((prev) =>prev.map((item) =>item._id === itemId? data: item));
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      setLoading(true);
      await inventoryAPI.deleteItem(itemId);
      setItems((prev) =>prev.filter((item) =>item._id !== itemId));
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity =async (itemId) => {
      try {
        const { data } =await inventoryAPI.increaseQuantity(itemId);
        setItems((prev) =>prev.map((item) =>item._id === itemId? data: item));
        return data;
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };

  const decreaseQuantity =async (itemId) => {
      try {
        const { data } =await inventoryAPI.decreaseQuantity(itemId);
        setItems((prev) =>prev.map((item) =>item._id === itemId? data: item));
        return data;
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };

  return (
    <InventoryContext.Provider
      value={{
        items,
        loading,
        getItems,
        addItem,
        updateItem,
        deleteItem,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory =() => {
    const context =useContext(InventoryContext);
    if (!context) {
      throw new Error(
        "useInventory must be used within InventoryProvider"
      );
    }

    return context;
};