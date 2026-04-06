"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Screen = {
  id: number;
  alpha: string;
  Screen_type: number;
  screen_number: number;
  screen_description: string;
  file_label: string;
  screen_label: string;
  notes: string;
  status: string;
  sitemap: string;
};

const defaultData: Screen[] = [
  {
    id: 1,
    alpha: "A",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Screen 1",
    file_label: "A-01-LOGIN",
    screen_label: "A-01",
    notes: "Notes 1",
    status: "ACTIVE",
    sitemap: "Sitemap 1",
  },
  {
    id: 2,
    alpha: "B",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Screen 1",
    file_label: "B-01-LOGIN",
    screen_label: "B-01",
    notes: "Notes 1",
    status: "ACTIVE",
    sitemap: "Sitemap 1",
  },
  {
    id: 3,
    alpha: "S",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Screen 1",
    file_label: "S-01-LOGIN",
    screen_label: "S-01",
    notes: "Notes 1",
    status: "ACTIVE",
    sitemap: "Sitemap 1",
  },
  {
    id: 4,
    alpha: "AB",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Screen 1",
    file_label: "AB-01-LOGIN",
    screen_label: "AB-01",
    notes: "Notes 1",
    status: "ACTIVE",
    sitemap: "Sitemap 1",
  },
  {
    id: 5,
    alpha: "W ",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Dashboard",
    file_label: "W-01-DASHBOARD",
    screen_label: "W-01",
    notes: "Notes 1",
    status: "PENDING",
    sitemap: "Sitemap 1",
  },
];

type DatabaseContextType = {
  data: Screen[];
  handleAdd: (newData: any) => void;
  handleEdit: (id: number, updatedItem: any) => void;
  handleDelete: (id: number) => void;
  isMounted: boolean;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Screen[]>(defaultData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("dashboardScreensData");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing local storage data:", error);
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("dashboardScreensData", JSON.stringify(data));
    }
  }, [data, isMounted]);

  const handleEdit = (id: number, updatedItem: any) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              alpha: updatedItem.alpha,
              Screen_type: updatedItem.screenType,
              screen_number: Number(updatedItem.screenNumber),
              screen_description: updatedItem.screenDescription,
              file_label: updatedItem.fileLabel,
              screen_label: updatedItem.screenLabel,
              notes: updatedItem.notes,
              status: updatedItem.status,
              sitemap: updatedItem.sitemap,
            }
          : item,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleAdd = (newData: any) => {
    const formattedData: Screen = {
      id: data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1,
      alpha: newData.alpha,
      Screen_type: newData.screenType,
      screen_number: Number(newData.screenNumber),
      screen_description: newData.screenDescription,
      file_label: newData.fileLabel,
      screen_label: newData.screenLabel,
      notes: newData.notes,
      status: newData.status,
      sitemap: newData.sitemap,
    };
    setData([...data, formattedData]);
  };

  return (
    <DatabaseContext.Provider value={{ data, handleAdd, handleEdit, handleDelete, isMounted }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
