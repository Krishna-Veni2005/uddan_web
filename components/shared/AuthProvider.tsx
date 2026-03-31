"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getDocument } from "@/lib/firestore";
import { useAppStore } from "@/store/useAppStore";
import { User } from "@/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser, setIsLoadingMetadata } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user details from Firestore
          const userData = await getDocument<User>("users", firebaseUser.uid);
          if (userData) {
            setCurrentUser(userData);
          } else {
            // If they are in firebase auth but not our users collection, 
            // set them up anyway, or let the sign-up flow handle it.
            setCurrentUser(null); 
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoadingMetadata(false);
    });

    return () => unsubscribe();
  }, [setCurrentUser, setIsLoadingMetadata]);

  return <>{children}</>;
}
