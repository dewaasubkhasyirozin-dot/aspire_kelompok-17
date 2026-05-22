"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: "12px", padding: "12px 16px", fontSize: "14px", fontWeight: "500" },
        success: {
          iconTheme: { primary: "#10B981", secondary: "#ECFDF5" },
          style: { background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" },
        },
        error: {
          iconTheme: { primary: "#EF4444", secondary: "#FEF2F2" },
          style: { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" },
        },
      }}
    />
  );
}