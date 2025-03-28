import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  sendMagicLink,
  completeSignInWithEmailLink,
  loginWithEmailAndPassword,
  signUpWithEmailAndPassword,
  auth,
} from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const loginSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => Promise<void>;
  className?: string;
  redirectToDashboard?: boolean;
}

const LoginForm = ({
  onSubmit,
  className = "",
  redirectToDashboard = true,
}: LoginFormProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && redirectToDashboard) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate, redirectToDashboard]);

  // Check if this is a sign-in link
  useEffect(() => {
    const handleSignInLink = async () => {
      if (
        location.pathname === "/login" &&
        auth &&
        auth.isSignInWithEmailLink &&
        auth.isSignInWithEmailLink(window.location.href)
      ) {
        setIsLoading(true);
        try {
          const result = await completeSignInWithEmailLink();
          if (result.success && redirectToDashboard) {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error completing sign-in:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleSignInLink();
  }, [location, navigate, redirectToDashboard]);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Use email/password authentication
        let result;

        if (isSignUp) {
          // Sign up new user
          result = await signUpWithEmailAndPassword(
            values.email,
            values.password,
          );
        } else {
          // Login existing user
          result = await loginWithEmailAndPassword(
            values.email,
            values.password,
          );
        }

        if (!result.success) throw result.error;

        // If successful and redirectToDashboard is true, navigate to dashboard
        if (redirectToDashboard) {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific Firebase auth errors
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        form.setError("password", {
          type: "manual",
          message: "Ungültige E-Mail oder Passwort",
        });
      } else if (error.code === "auth/email-already-in-use") {
        form.setError("email", {
          type: "manual",
          message: "Diese E-Mail-Adresse wird bereits verwendet",
        });
      } else {
        form.setError("email", {
          type: "manual",
          message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-md p-6 bg-white rounded-lg shadow-md",
        className,
      )}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Mitarbeiter {isSignUp ? "Registrierung" : "Login"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isSignUp
            ? "Erstellen Sie ein neues Mitarbeiterkonto"
            : "Melden Sie sich mit Ihren Zugangsdaten an"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="name@example.de"
                      className="pl-10"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwort</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      type="password"
                      placeholder={
                        isSignUp
                          ? "Neues Passwort (min. 6 Zeichen)"
                          : "Ihr Passwort"
                      }
                      className="pl-10"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Konto wird erstellt..." : "Anmeldung..."}
              </>
            ) : isSignUp ? (
              "Konto erstellen"
            ) : (
              "Anmelden"
            )}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                form.reset();
              }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {isSignUp
                ? "Bereits registriert? Zum Login"
                : "Noch kein Konto? Jetzt registrieren"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
