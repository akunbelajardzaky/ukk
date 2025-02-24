"use client"
import { useEffect, useState } from "react";

 export const WelcomeScreen = ({name}:{name:string}) => {
  const [visible, setVisible] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Get current hour to determine greeting
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }

    // Set timer to fade out
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1400); // Start fade slightly before 3s

    return () => clearTimeout(timer);
  }, []);

  return visible ? (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#ffff] transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center animate-fade-in">
      
        <h1 className="text-4xl font-light text-[#8E9196] tracking-wide">
          {greeting}, <span className="font-normal">{name}</span>
        </h1>
      </div>
    </div>
  ) : null;
};

