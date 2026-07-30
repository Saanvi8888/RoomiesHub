import { Bot } from "lucide-react";
import { useAI } from "../../../context/AIContext";

const FloatingAIButton = () => {
  const { setIsOpen } = useAI();
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-[#6b4eff] text-white shadow-lg flex justify-center items-center"
    >
      <Bot size={28} className=""/>
    </button>
  );
};

export default FloatingAIButton;