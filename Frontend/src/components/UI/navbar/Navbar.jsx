import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import Avatar from "boring-avatars";
import { useAuthStore } from "../../../store/useAuthStore";
import { useThemeStore } from "../../../store/useThemeStore";
import { MenuDropdown } from "./MenuDropdown";
import { MobileDrawer } from "./MobileDrawer";
import { PlanBadge } from "./PlanBadge";

import {
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
  Code,
  Layers,
  FileText,
  User,
  LayoutDashboard,
} from "lucide-react";
import { ModeButton } from "../../core/ModeButton";

const discoverItems = [
  {
    title: "Featured Courses",
    to: "/courses",
    description:
      "Explore our curated coding courses to level up your DSA skills.",
    icon: <BookOpen className="h-4 w-4 text-brand" />,
  },
  {
    title: "Sheets Library",
    to: "/sheets/public",
    description:
      "Explore curated question sheets built for optimized practice.",
    icon: <Code className="h-4 w-4 text-brand" />,
  },
];

const resourceItems = [
  {
    title: "Blogs",
    to: "/blogs",
    description:
      "Read insightful articles on system design and technical interviews.",
    icon: <FileText className="h-4 w-4 text-brand" />,
  },
  {
    title: "Roadmaps",
    to: "/roadmaps",
    description: "Step-by-step interactive paths to master modern engineering.",
    icon: <Layers className="h-4 w-4 text-brand" />,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [userPlan, setUserPlan] = useState("free");

  const location = useLocation();
  const { isAuthenticated, authUser, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isAuthenticated && authUser) {
      setUserPlan(authUser?.plan);
    } else {
      setUserPlan("free");
    }
  }, [authUser, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300  ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-1.5"
          : "bg-transparent border-b border-transparent py-3"
      }`}
      style={{
        backgroundColor: isScrolled
          ? undefined
          : isDarkMode
            ? "#0a0a0a"
            : "var(--color-background)",
      }}
    >
      {/* ── Reddish Glow Ambient Backdrop (Matches your page halo designs) ── */}
      <div
        className="absolute top-0 left-1/4 -translate-x-1/2 w-75 h-15 pointer-events-none z-0 transition-opacity duration-500 rounded-full"
        style={{
          background: `radial-gradient(circle, oklch(0.6 0.25 25 / 12%) 0%, transparent 80%)`,
          opacity: isDarkMode ? 1 : 0.3,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="shrink-0 flex items-center transition-transform duration-200 hover:scale-[1.02]"
            >
              <p
                className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-brand arp-display"
                alt="AlgoNinja System Branding"
              >
                {"<AlgoNinja/>"}
              </p>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-7">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 satoshi tracking-wide ${isActive ? "text-brand font-semibold" : "text-foreground/70 hover:text-brand"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/problems"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 satoshi tracking-wide ${isActive ? "text-brand font-semibold" : "text-foreground/70 hover:text-brand"}`
              }
            >
              Practice
            </NavLink>

            <MenuDropdown label="Discover" items={discoverItems} />
            <MenuDropdown label="Resources" items={resourceItems} />

            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 satoshi tracking-wide ${isActive ? "text-brand font-semibold" : "text-foreground/70 hover:text-brand"}`
              }
            >
              Pricing
            </NavLink>
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Theme Toggle Button */}
            <ModeButton/>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 pl-3 border-l border-border">
                {userPlan === "free" ? (
                  <NavLink
                    to="/pricing"
                    className={({ isActive }) => {
                      `btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted text-foreground border border-border transition-all duration-150 hover:border-brand/40 satoshi} ${isActive ? "border-brand text-brand" : ""}`;
                    }}
                  >
                    Go Pro
                  </NavLink>
                ) : (
                  <PlanBadge plan={userPlan} />
                )}

                {/* Native Profile Dropdown Menu */}
                <div className="dropdown dropdown-end group">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center justify-center rounded-full h-9 w-9 border border-border hover:border-brand/40 transition-all cursor-pointer shadow-sm focus:outline-none"
                  >
                    <Avatar
                      size={29}
                      name={authUser?.name || "User"}
                      variant="beam"
                      colors={["#e02020", "#0a0a0a", "#94a3b8", "#1a1a1a"]}
                    />
                  </div>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 mt-3 bg-card border border-border text-foreground rounded-2xl shadow-xl w-60 gap-1 z-50 origin-top-right transition-all duration-200 
               opacity-0 invisible scale-95 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:scale-100"
                  >
                    <div className="flex flex-col p-3 bg-muted/40 rounded-xl mb-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-0.5 satoshi">
                        Profile Dashboard
                      </span>
                      <span className="text-sm font-semibold text-foreground truncate">
                        {authUser?.name || "Ninja Hacker"}
                      </span>
                    </div>

                    <li>
                      <Link
                        to="/profile"
                        onClick={() =>
                          document.activeElement instanceof HTMLElement &&
                          document.activeElement.blur()
                        }
                        className="flex items-center gap-2 w-full text-sm font-medium p-2 rounded-xl text-foreground hover:bg-muted satoshi"
                      >
                        <User className="h-4 w-4 opacity-70" /> My Profile
                      </Link>
                    </li>

                    {authUser?.role === "admin" && (
                      <li>
                        <Link
                          to="/admin-dashboard"
                          onClick={() =>
                            document.activeElement instanceof HTMLElement &&
                            document.activeElement.blur()
                          }
                          className="flex items-center gap-2 w-full text-sm font-medium p-2 rounded-xl text-foreground hover:bg-muted satoshi"
                        >
                          <LayoutDashboard className="h-4 w-4 opacity-70" />{" "}
                          Admin Dashboard
                        </Link>
                      </li>
                    )}

                    <div className="bg-border/60 h-px my-1" />

                    <li>
                      <button
                        onClick={() => {
                          if (document.activeElement instanceof HTMLElement)
                            document.activeElement.blur();
                          logout();
                        }}
                        className="p-2.5 font-semibold text-sm text-destructive hover:bg-destructive/10 rounded-xl flex items-center justify-between"
                      >
                        <span>Log Out</span>
                        <LogOut className="h-4 w-4" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex lg:not-first-of-type:lg:flex items-center space-x-3 pl-3 border-l border-border">
                <Link
                  to="/login"
                  className="text-sm font-semibold px-4 py-2 rounded-xl text-foreground hover:bg-muted border border-transparent hover:border-border transition-all duration-200 satoshi"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="h-10 px-5 text-xs font-bold text-white bg-brand rounded-xl shadow-lg flex items-center justify-center tracking-wide hover:opacity-95 transform active:scale-95 transition-all satoshi"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-3 lg:hidden">
           <ModeButton/>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-foreground bg-card border border-border hover:bg-muted transition-all duration-200 active:scale-95 focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              {/* Smooth rotating transition from Hamburger to X */}
              <div className="relative w-5 h-5 transition-transform duration-300 transform">
                {isOpen ? (
                  <X className="absolute inset-0 h-5 w-5 animate-in spin-in-90 duration-200" />
                ) : (
                  <Menu className="absolute inset-0 h-5 w-5 animate-in fade-in duration-200" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content Wrapper */}
      <MobileDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        // isActive={isActive}
        discoverItems={discoverItems}
        resourceItems={resourceItems}
        openMobileDropdown={openMobileDropdown}
        setOpenMobileDropdown={setOpenMobileDropdown}
        isAuthenticated={isAuthenticated}
        authUser={authUser}
        userPlan={userPlan}
        logout={logout}
      />
    </nav>
  );
}
