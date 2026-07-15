import React from "react";
import { Link, NavLink } from "react-router";
import { ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";
import Avatar from "boring-avatars";
import { PlanBadge } from "./PlanBadge";

export const MobileDrawer = ({
  isOpen,
  setIsOpen,
  discoverItems,
  resourceItems,
  openMobileDropdown,
  setOpenMobileDropdown,
  isAuthenticated,
  authUser,
  userPlan,
  logout,
}) => {
  if (!isOpen) return null;

  const toggleDropdown = (name) => {
    setOpenMobileDropdown(openMobileDropdown === name ? null : name);
  };

  return (
    <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl text-foreground max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-4 duration-300 shadow-2xl relative z-40">
      <div className="px-4 pt-4 pb-8 space-y-3 satoshi">
        <NavLink
          to="/"
          end
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `block p-3 text-base font-medium rounded-xl transition-colors ${isActive ? "bg-muted text-brand font-semibold" : "text-foreground/80 hover:bg-muted/50"} }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/problems"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `block p-3 text-base font-medium rounded-xl transition-colors ${isActive ? "bg-muted text-brand font-semibold" : "text-foreground/80 hover:bg-muted/50"}`
          }
        >
          Practice
        </NavLink>

        {/* Discover Accordion */}
        <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/10">
          <button
            onClick={() => toggleDropdown("discover")}
            className="w-full p-3 text-base font-medium flex items-center justify-between text-foreground/80 focus:outline-none"
          >
            <span>Discover</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${openMobileDropdown === "discover" ? "rotate-180 text-brand" : ""}`}
            />
          </button>
          {openMobileDropdown === "discover" && (
            <div className="px-2 pb-2 space-y-1 bg-card border-t border-border/20 animate-in fade-in duration-200">
              {discoverItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block p-2.5 rounded-lg text-sm font-medium ${isActive ? "text-brand bg-muted/40 font-semibold" : "text-foreground/70 hover:text-brand"}`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Resources Accordion */}
        <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/10">
          <button
            onClick={() => toggleDropdown("resources")}
            className="w-full p-3 text-base font-medium flex items-center justify-between text-foreground/80 focus:outline-none"
          >
            <span>Resources</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${openMobileDropdown === "resources" ? "rotate-180 text-brand" : ""}`}
            />
          </button>
          {openMobileDropdown === "resources" && (
            <div className="px-2 pb-2 space-y-1 bg-card border-t border-border/20 animate-in fade-in duration-200">
              {resourceItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block p-2.5 rounded-lg text-sm font-medium ${isActive ? "text-brand bg-muted/40 font-semibold" : "text-foreground/70 hover:text-brand"}`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <NavLink
          to="/pricing"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `block p-3 text-base font-medium rounded-xl transition-colors ${isActive ? "bg-muted text-brand font-semibold" : "text-foreground/80 hover:bg-muted/50"}`
          }
        >
          Pricing
        </NavLink>

        <div className="h-px bg-border/60 my-3" />

        {/* Dynamic Auth Section */}
        {isAuthenticated ? (
          <div className="space-y-4 p-1 flex flex-col">
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-2xl border border-border/40">
              <div className="flex items-center space-x-3">
                <Avatar
                  size={36}
                  name={authUser?.name || "Ninja"}
                  variant="beam"
                  colors={["#e02020", "#0a0a0a", "#94a3b8"]}
                />
                <span className="text-sm font-bold text-foreground truncate max-w-32.5">
                  {authUser?.name}
                </span>
              </div>
              {userPlan !== "free" && <PlanBadge plan={userPlan} isMobile />}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 p-2.5 text-center text-sm font-semibold bg-muted text-foreground rounded-xl border border-border hover:bg-muted/80"
              >
                <User className="h-4 w-4 opacity-70" /> My Profile
              </Link>

              {authUser?.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 p-2.5 text-center text-sm font-semibold bg-muted text-foreground rounded-xl border border-border hover:bg-muted/80"
                >
                  <LayoutDashboard className="h-4 w-4 opacity-70" /> Admin
                  Dashboard
                </Link>
              )}
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="p-2.5 text-center text-sm font-semibold bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/15"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2.5 pt-2">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full p-3 text-center text-sm font-bold rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors duration-150"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-bold text-white bg-brand hover:opacity-95 shadow-md"
            >
              Join For Free
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
