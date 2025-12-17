import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { LogOut, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const roleLabel: Record<string, string> = {
    student: "Student",
    mess_manager: "Mess Management",
    hostel_office: "Hostel Office",
  };

  const roleLinks: Record<string, { label: string; to: string }[]> = {
    student: [
      { label: "Dashboard", to: "/student/dashboard" },
      { label: "Mess Menu", to: "/student/menu" },
      { label: "Cancel Slot", to: "/student/cancel" },
    ],
    mess_manager: [
      { label: "Dashboard", to: "/mess/dashboard" },
      { label: "Update Menu", to: "/mess/menu" },
      { label: "Start Mess", to: "/mess/start" },
      { label: "Stats", to: "/mess/stats" },
    ],
    hostel_office: [
      { label: "Dashboard", to: "/admin/dashboard" },
      { label: "Approvals", to: "/admin/approvals" },
      { label: "Mess Mgmt", to: "/admin/mess" },
      { label: "Stats", to: "/admin/stats" },
    ],
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LEFT — LOGO + ROLE */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex flex-col">
            <span className="text-lg font-bold text-[#6770d2]">
              SmartMessBalance
            </span>
            {!user && (
              <span className="text-xs text-muted-foreground">
                Campus Mess System
              </span>
            )}
          </Link>

          {user && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#6770d2]/10 text-[#6770d2]">
              {roleLabel[user.role]}
            </span>
          )}
        </div>

        {/* RIGHT — ACTIONS */}
        <div className="flex items-center gap-6 text-sm">
          {/* ROLE NAV LINKS */}
          {user &&
            roleLinks[user.role]?.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground hover:text-foreground transition"
              >
                {item.label}
              </Link>
            ))}

          {/* THEME TOGGLE (ALWAYS VISIBLE) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </Button>

          {/* AUTH ACTION */}
          {!user ? (
            <Link to="/login">
              <Button className="bg-[#6770d2] hover:bg-[#5b63c7] shadow-md">
                Sign In / Sign Up
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Logout"
            >
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
