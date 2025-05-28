"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/context/authcontext";
import { WebsocketProvider } from "@/context/WebSocketContext";
import { Toaster } from "@/components/ui/sonner"

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <WebsocketProvider>
        {children}
        <Toaster richColors position="top-right"/>
      </WebsocketProvider>
    </AuthProvider>
  );
}
