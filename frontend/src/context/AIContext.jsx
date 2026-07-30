import {createContext, useContext, useState, useCallback, useMemo, useRef,} from "react";
import { aiAPI } from "../api/axios";

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const controllerRef = useRef(null);

  const sendMessage = useCallback(async (question, houseId) => {
    if (!question?.trim()) return;
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const abortController = new AbortController();
    controllerRef.current = abortController;

    const userMessage = {
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await aiAPI.ask(
        { question, houseId },
        { signal: abortController.signal }
      );
      const assistantMessage = {
        role: "assistant",
        content:res?.data?.answer || "No response received.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      if (error.name === "CanceledError" ||error.name === "AbortError") {
        console.log("Request cancelled");
        return;
      }

      console.error("AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      // Only clear loading if this is still the active request
      if (controllerRef.current === abortController) {
        setLoading(false);
      }
    }
  }, []);

  const clearChat = () => {
    setMessages([]);
  };

  const value = useMemo(() => ({
      messages,
      loading,
      isOpen,
      setIsOpen,
      sendMessage,
      setMessages,
      clearChat,
    }),
    [messages, loading, isOpen, sendMessage]
  );

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);

  if (!context) {
    throw new Error(
      "useAI must be used inside AIProvider"
    );
  }

  return context;
};