"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type NotificationContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <NotificationContext.Provider
      value={{ isOpen, open, close, setOpen: setIsOpen }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationModal() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationModal must be used within a NotificationProvider"
    );
  }
  return ctx;
}





