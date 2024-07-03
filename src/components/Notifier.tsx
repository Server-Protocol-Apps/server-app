"use client";
import { NodeProps } from "@/utils/props";
import { SnackbarProvider } from "notistack";
import { FC } from "react";

export const Notifier: FC<NodeProps> = ({ children }) => (
  <SnackbarProvider>{children}</SnackbarProvider>
);
