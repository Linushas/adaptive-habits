"use client";

import { logoutAction } from "@/app/actions";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Calendar", href: "/calendar" },
    { name: "Agent", href: "/agent" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <nav className="min-w-full shrink-0 bg-bg text-fg-muted relative top-0 z-50">
      <div className="max-w-7xl bg-transparent mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center bg-transparent justify-between h-16">
          <a href={"/"}>
            <Image
              src="/adaptive_habits_logo.png"
              alt="Adaptive Habits Logo"
              width={32}
              height={8}
            />
          </a>

          <div className="hidden md:block bg-transparent">
            <ul className="flex space-x-6 items-center bg-transparent">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 hover:text-fg/90 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}

              <li key={"logout"}>
                <a
                  onClick={() => logoutAction()}
                  className="flex items-center gap-2 hover:text-fg/90 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-fg-muted"
            >
              {isOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-bg border-b border-bg-light absolute pt-4 w-full z-50 shadow-lg">
          <ul className="flex flex-col space-y-2 px-4 pb-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-bg-light/50 hover:text-fg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li key="logout">
              <a
                onClick={() => {
                  logoutAction();
                  setIsOpen(false);
                }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-bg-light/50 hover:text-fg transition-colors cursor-pointer"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
