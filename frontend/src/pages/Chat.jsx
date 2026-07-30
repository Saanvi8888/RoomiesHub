import { useEffect, useRef, useState } from "react";
import { useAI } from "../context/AIContext";

const Chat = ({ houseId }) => {
  const {messages,sendMessage,loading,isOpen,setIsOpen,} = useAI();
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    await sendMessage(text, houseId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full h-[100dvh] sm:w-96 sm:h-[600px] sm:bottom-5 sm:right-5 bg-[#171717] border border-gray-700 sm:rounded-xl flex flex-col z-50 shadow-2xl">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800 text-white">
        <h2 className="font-medium text-sm sm:text-base">
          RoomiesHub AI
        </h2>

        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-xl">
          x
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center mt-10">
            Start a conversation...
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} className={`flex ${isUser?"justify-end":"justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 rounded-lg whitespace-pre-wrap break-words ${isUser ? "bg-[#6b4eff] text-white":"bg-gray-800 text-gray-100"}`}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg">
              typing...
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="border-t border-gray-800 p-2 sm:p-3 flex gap-2">
        <input
          type="text"
          value={input}
          placeholder="Ask about balances, expenses, inventory..."
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-md outline-none text-sm"
         />

        <button
          onClick={handleSend}
          disabled={loading}
          className=" bg-[#6b4eff] hover:bg-[#5135de] text-white px-4 py-2 rounded-md disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;