"use client";

import { createContext, useContext } from "react";

const AdminEditContext = createContext(false);

export function AdminEditProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  return (
    <AdminEditContext.Provider value={isAdmin}>
      {children}
    </AdminEditContext.Provider>
  );
}

export function useAdminEdit() {
  return useContext(AdminEditContext);
}
