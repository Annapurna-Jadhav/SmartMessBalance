import axiosClient from "./axiosClient";
import {type  AuthUser } from "@/auth/auth.types";

export const continueAuth = async (): Promise<AuthUser> => {
  const { data } = await axiosClient.post("/auth/continue");
  return data.data;
};
