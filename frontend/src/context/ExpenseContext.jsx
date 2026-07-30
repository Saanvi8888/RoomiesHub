import {createContext,useContext,useState,} from "react";
import { expenseAPI } from "../api/axios";

const ExpenseContext =createContext();

export const ExpenseProvider = ({children,}) => {
  const [expenses, setExpenses] =useState([]);
  const [balances, setBalances] =useState({});
  const [settlements, setSettlements] =useState([]);
  const [loading, setLoading] =useState(false);
  const getExpenses = async (houseId) => {
    try {
      setLoading(true);
      const { data } =await expenseAPI.getExpenses(houseId);
      setExpenses(data);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (houseId,expenseData) => {
    try {
      setLoading(true);
      const { data } =await expenseAPI.addExpense( houseId, expenseData);
      setExpenses((prev) => [data,...prev,]);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (expenseId,updatedData) => {
    try {
      setLoading(true);
      const { data } =await expenseAPI.updateExpense(expenseId,updatedData);
      setExpenses((prev) => prev.filter((expense) => expense._id !== expenseId));
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
 const deleteExpense = async (expenseId) => {
  try {
    setLoading(true);
    await expenseAPI.deleteExpense(expenseId);
    setExpenses((prev) =>
      prev.filter((expense) => expense._id !== expenseId)
    );

  } catch (error) {
    console.log(error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

  const getBalances = async (houseId) => {
    try {
      setLoading(true);
      const { data } =await expenseAPI.getBalances(houseId);
      setBalances(data);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getSettlements = async ( houseId) => {
    try {
      setLoading(true);
      const { data } =
        await expenseAPI.getSettlements(houseId);
      setSettlements(data);
      return data;
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        balances,
        settlements,
        loading,
        getExpenses,
        addExpense,
        updateExpense,
        getBalances,
        getSettlements,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context =
    useContext(ExpenseContext);

  if (!context) {
    throw new Error(
      "useExpense must be used within ExpenseProvider"
    );
  }

  return context;
};