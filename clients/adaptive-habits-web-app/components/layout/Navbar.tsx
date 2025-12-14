import { logoutAction } from "@/app/actions";
import Image from "next/image";

export function Navbar() {
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
              src="/ah-logo.png"
              alt="Adaptive Habits Logo"
              width={64}
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
        </div>
      </div>
    </nav>
  );
}
