import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { cn } from "@/lib/utils";
import { auth, sendMagicLink } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (values: { email: string }) => {
    try {
      // Ensure we're using the correct origin for the redirect URL
      // This helps with network issues in development environments
      const origin = window.location.origin;
      const redirectUrl = `${origin}/login`;

      console.log("Sending magic link to:", values.email);
      console.log("Redirect URL:", redirectUrl);

      // Add retry logic for network issues
      let attempts = 0;
      let result;

      while (attempts < 3) {
        try {
          result = await sendMagicLink(values.email, redirectUrl);
          break; // If successful, exit the loop
        } catch (err) {
          attempts++;
          console.warn(`Login attempt ${attempts} failed, retrying...`, err);
          if (attempts >= 3) throw err; // Rethrow if all attempts fail
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }

      if (!result || !result.success) {
        console.error("Login-Fehler:", result?.error);
        throw result?.error || new Error("Failed to send magic link");
      }

      // Redirect will happen automatically in the LoginForm component
      return;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <img
          src="/assets/images/logo.webp"
          alt="Logo"
          className="h-16 mx-auto mb-4"
        />
        <p className="text-gray-600">
          Mitarbeiterbereich - Bitte melden Sie sich an
        </p>
      </div>

      <LoginForm
        onSubmit={handleLogin}
        className={cn("w-full max-w-md")}
        redirectToDashboard={true}
      />

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Zurück zur Startseite
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
