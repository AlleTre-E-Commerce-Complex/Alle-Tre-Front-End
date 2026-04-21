import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuthState } from "./auth-context";
import { authAxios } from "../config/axios-config";
import api from "../api";
import { useSocket } from "./socket-context";

const SupportContext = createContext();

export const useSupport = () => useContext(SupportContext);

export const SupportProvider = ({ children }) => {
  const { user } = useAuthState();
  const socket = useSocket();
  const [supportUnreadCount, setSupportUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const response = await authAxios.get(api.app.bugReport.myReports);
      const reports = response.data.data || [];
      const total = reports.reduce((acc, report) => acc + (report.userUnreadCount || 0), 0);
      setSupportUnreadCount(total);
    } catch (error) {
      console.error("Error fetching support unread count:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewAdminMessage = (data) => {
        // Increment global count if it's an admin message
        if (data.message && data.message.adminId) {
            setSupportUnreadCount(prev => prev + 1);
        }
    };

    socket.on("new_bug_report_message", handleNewAdminMessage);

    return () => {
      socket.off("new_bug_report_message", handleNewAdminMessage);
    };
  }, [socket, user]);

  return (
    <SupportContext.Provider
      value={{
        supportUnreadCount,
        refreshSupportCount: fetchUnreadCount,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};
