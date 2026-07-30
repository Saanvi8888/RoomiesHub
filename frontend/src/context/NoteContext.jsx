import { createContext, useContext, useState } from "react";
import { notesAPI } from "../api/axios";

const NoteContext = createContext();

export const NoteProvider = ({children})=>{
    const [notes,setNotes] = useState([]);
    const [loading,setLoading] = useState(false);
    const createNote = async(houseId,noteData)=>{
        try {
            if(!houseId) return;
            setLoading(true);
            const {data} = await notesAPI.createNote(houseId,noteData);
            setNotes((prev) => [data,...prev]);
            return data;
        } catch (error) {
            console.log(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    const getNotes = async(houseId)=>{
        try {
            if(!houseId) return ;
            setLoading(true);
            const {data } = await notesAPI.getNotes(houseId);
            setNotes(data);
            return data;
        } catch (error) {
            console.log(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    const updateNote = async(noteId,updatedData)=>{
        try {
            setLoading(true);
            const {data} = await notesAPI.updateNote(noteId,updatedData);
            setNotes((prev) =>prev.map((notes) =>notes._id === noteId? data:notes));
            return data;
        } catch (error) {
            console.log(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    const deleteNote = async(noteId) => {
        try {
            setLoading(true);
            const {data} = await notesAPI.deleteNote(noteId);
            setNotes((prev) =>prev.filter((notes) =>notes._id !== noteId));
            return data;
        } catch (error) {
            console.log(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        createNote,
        getNotes,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export const useNotes =() => {
    const context =useContext(NoteContext);

    if (!context) {
      throw new Error(
        "useNotes must be used within NoteProvider"
      );
    }

    return context;
  };