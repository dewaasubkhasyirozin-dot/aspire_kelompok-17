"use client";

// ============================================================
// SAVED CONTEXT — LANGKAH.ID
// ============================================================

import React, { createContext, useContext, useReducer, useCallback } from "react";
import { createClient } from "@/lib/supabase-client";
import type { UserSavedOpportunity, SavedStatus } from "@/types";
import toast from "react-hot-toast";

interface SavedState {
  items: UserSavedOpportunity[];
  isLoading: boolean;
}

type SavedAction =
  | { type: "SET_ITEMS"; payload: UserSavedOpportunity[] }
  | { type: "ADD_ITEM"; payload: UserSavedOpportunity }
  | { type: "UPDATE_ITEM"; payload: { id: string; status?: SavedStatus; notes?: string } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: SavedState = { items: [], isLoading: false };

function savedReducer(state: SavedState, action: SavedAction): SavedState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload, isLoading: false };
    case "ADD_ITEM":
      return { ...state, items: [action.payload, ...state.items] };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status || item.status, notes: action.payload.notes !== undefined ? action.payload.notes : item.notes }
            : item
        ),
      };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface SavedContextType extends SavedState {
  saveOpportunity: (opportunityId: string, status?: SavedStatus) => Promise<void>;
  updateSavedItem: (id: string, data: { status?: SavedStatus; notes?: string }) => Promise<void>;
  removeSavedItem: (id: string) => Promise<void>;
  isOpportunitySaved: (opportunityId: string) => boolean;
  getSavedItem: (opportunityId: string) => UserSavedOpportunity | undefined;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(savedReducer, initialState);
  const supabase = createClient();

  const saveOpportunity = useCallback(async (opportunityId: string, status: SavedStatus = "interested") => {
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: UserSavedOpportunity = {
      id: tempId, user_id: "", opportunity_id: opportunityId, status, notes: null, reminder_date: null, created_at: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ITEM", payload: optimisticItem });
    toast.success("Peluang disimpan!");

    const { data, error } = await supabase
      .from("user_saved_opportunities")
      .upsert({ opportunity_id: opportunityId, status })
      .select("*")
      .single();

    if (error) {
      dispatch({ type: "REMOVE_ITEM", payload: tempId });
      toast.error("Gagal menyimpan peluang");
      return;
    }

    dispatch({ type: "REMOVE_ITEM", payload: tempId });
    dispatch({ type: "ADD_ITEM", payload: data as UserSavedOpportunity });
  }, [supabase]);

  const updateSavedItem = useCallback(async (id: string, data: { status?: SavedStatus; notes?: string }) => {
    dispatch({ type: "UPDATE_ITEM", payload: { id, ...data } });
    const { error } = await supabase.from("user_saved_opportunities").update(data).eq("id", id);
    if (error) toast.error("Gagal mengupdate");
    else toast.success("Berhasil diupdate!");
  }, [supabase]);

  const removeSavedItem = useCallback(async (id: string) => {
    const item = state.items.find((i) => i.id === id);
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast.success("Dihapus dari simpanan");
    const { error } = await supabase.from("user_saved_opportunities").delete().eq("id", id);
    if (error && item) {
      dispatch({ type: "ADD_ITEM", payload: item });
      toast.error("Gagal menghapus");
    }
  }, [supabase, state.items]);

  const isOpportunitySaved = useCallback(
    (opportunityId: string) => state.items.some((item) => item.opportunity_id === opportunityId),
    [state.items]
  );

  const getSavedItem = useCallback(
    (opportunityId: string) => state.items.find((item) => item.opportunity_id === opportunityId),
    [state.items]
  );

  return (
    <SavedContext.Provider value={{ ...state, saveOpportunity, updateSavedItem, removeSavedItem, isOpportunitySaved, getSavedItem }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSavedContext() {
  const context = useContext(SavedContext);
  if (context === undefined) throw new Error("useSavedContext harus digunakan di dalam SavedProvider");
  return context;
}