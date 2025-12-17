import {
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, googleProvider } from "@/firebase";
import { setAccessToken, clearAuth } from "@/auth/authStore";
import { continueAuth } from "@/api/auth.api";
import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { type AuthUser } from "@/auth/auth.types";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 FINALIZE AUTH (shared by all login methods)
  const finalizeAuth = useCallback(async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error("Authentication failed");

    const token = await firebaseUser.getIdToken(true);
    setAccessToken(token);

    const me = await continueAuth();
    setUser(me);

    return me;
  }, []);

  // ✅ EMAIL LOGIN
  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await finalizeAuth();
      toast.success("Logged in successfully");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      throw err;
    }
  };

  // ✅ EMAIL SIGNUP
  const signupWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await finalizeAuth();
      toast.success("Account created successfully");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
      throw err;
    }
  };

  // ✅ GOOGLE SIGN-IN (REDIRECT)
  const googleAuth = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
      throw err;
    }
  };

  // 🔥 HANDLE GOOGLE REDIRECT RESULT
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        const email = result.user.email;

        if (!email?.endsWith("@nitk.edu.in")) {
          await signOut(auth);
          toast.error("Please use your NITK institute Google account");
          return;
        }

        await finalizeAuth();
        toast.success("Logged in successfully");
      } catch (err: any) {
        toast.error(err.message || "Google authentication failed");
      }
    };

    handleRedirect();
  }, [finalizeAuth]);

  // 🔁 RESTORE SESSION ON REFRESH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          clearAuth();
          setLoading(false);
          return;
        }

        const token = await firebaseUser.getIdToken();
        setAccessToken(token);

        const me = await continueAuth();
        setUser(me);
      } catch {
        setUser(null);
        clearAuth();
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // 🚪 LOGOUT
  const logout = async () => {
    await signOut(auth);
    clearAuth();
    setUser(null);
    toast.success("Logged out");
  };

  return {
    user,
    loading, // 🔹 important for route protection
    loginWithEmail,
    signupWithEmail,
    googleAuth,
    logout,
  };
};
