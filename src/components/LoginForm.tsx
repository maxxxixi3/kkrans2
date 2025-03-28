import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2 } from "lucide-react";
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
  auth,
} from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const loginSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
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
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
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
        // Default implementation using Firebase
        const redirectUrl = `${window.location.origin}/login`;
        const result = await sendMagicLink(values.email, redirectUrl);

        if (!result.success) throw result.error;
      }
      setMagicLinkSent(true);
    } catch (error) {
      console.error("Login error:", error);
      form.setError("email", {
        type: "manual",
        message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      });
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
      {!magicLinkSent ? (
        <>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Mitarbeiter Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Geben Sie Ihre E-Mail-Adresse ein, um einen Magic Link zu erhalten
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  "Magic Link senden"
                )}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Magic Link gesendet!
          </h2>
          <p className="text-gray-600 mb-6">
            Wir haben einen Magic Link an Ihre E-Mail-Adresse gesendet. Bitte
            prüfen Sie Ihren Posteingang und klicken Sie auf den Link, um sich
            anzumelden.
            {redirectToDashboard && (
              <span className="block mt-2 font-medium">
                Sie werden in Kürze zum Dashboard weitergeleitet...
              </span>
            )}
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setMagicLinkSent(false);
              form.reset();
            }}
          >
            Zurück zum Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
