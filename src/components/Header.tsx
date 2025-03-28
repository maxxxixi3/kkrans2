import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status when component mounts or location changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, [location]);

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      // Logout
      try {
        await signOut(auth);
        setIsLoggedIn(false);
        navigate("/");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      // Login
      if (onLoginClick) {
        onLoginClick();
      } else {
        navigate("/login");
      }
    }
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img
            src="/assets/images/logo.webp"
            alt="Logo"
            className="h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <Button onClick={handleAuthAction} variant="outline" className="ml-4">
          {isLoggedIn ? "Ausloggen" : "Login"}
        </Button>
      </div>
    </header>
  );
};

export default Header;
