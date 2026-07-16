import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useProblemStore } from "../store/useProblemStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Avatar from "boring-avatars";
import { Sidebar, SidebarBody, SidebarLink } from "../components/UI/useSidebar";
import { HeroSection } from "../components/Profile/HeroSection";
import { StatCard } from "../components/Profile/StatCard";
import { ProgressChart } from "../components/Profile/ProgressChart";
import { ActivityHeatmap } from "../components/Profile/ActivityHeatmap";
import { SubmissionsHistory } from "../components/Profile/SubmissionsHistory";
import {
  Home,
  Code2,
  Layers,
  Map,
  GraduationCap,
  LogOut,
  CheckCircle,
  Code,
  Flame,
  Target,
} from "lucide-react";

export const ProfilePage = () => {
  const { authUser, isAuthenticated, isCheckAuth, logout } = useAuthStore();
  const { solvedCount, getUserSolvedProblemsCount } = useProblemStore();
  const {
    problemSubmissions,
    getAllSubmission,
    isLoading: submissionsLoading,
  } = useSubmissionStore();

  console.log(problemSubmissions);

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && authUser) {
      getUserSolvedProblemsCount();
      getAllSubmission();
    }
  }, [isAuthenticated, authUser]);

  if (isCheckAuth || submissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground satoshi">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const successRate = (() => {
    if (!problemSubmissions.length) return 0;
    const passed = problemSubmissions.filter(
      (s) => s.status?.toUpperCase() === "ACCEPTED",
    ).length;
    return Number(((passed / problemSubmissions.length) * 100).toFixed(1));
  })();

  const navigationLinks = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 text-foreground/80" />,
    },
    {
      label: "Practice Problems",
      href: "/problems",
      icon: <Code2 className="h-5 w-5 text-foreground/80" />,
    },
    {
      label: "Sheet Library",
      href: "/sheets",
      icon: <Layers className="h-5 w-5 text-foreground/80" />,
    },
    {
      label: "Roadmaps",
      href: "/roadmaps",
      icon: <Map className="h-5 w-5 text-foreground/80" />,
    },
    {
      label: "Featured Courses",
      href: "/courses",
      icon: <GraduationCap className="h-5 w-5 text-foreground/80" />,
    },
    {
      label: "Logout",
      href: "#",
      onClick: async () => {
        await logout();
        navigate("/login");
      },
      icon: <LogOut className="h-5 w-5 text-destructive" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row satoshi transition-colors duration-200">
      {/* Sidebar Section */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="bg-card border-r border-border shadow-sm">
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
            <div className="flex items-center gap-2 py-2">
              <span
                className={`md:text-2xl  font-bold tracking-tight text-brand arp-display ${sidebarOpen && "hidden"}`}
              >
                {"<A"}
              </span>
              {sidebarOpen && (
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="shrink-0 flex items-center transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <p
                      className="hidden md:flex md:text-2xl font-bold tracking-tight text-brand arp-display"
                      alt="AlgoNinja System Branding"
                    >
                      {"<AlgoNinja/>"}
                    </p>
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {navigationLinks.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className="hover:bg-muted/50 rounded-xl px-2 transition-all duration-150"
                />
              ))}
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-border">
            <SidebarLink
              link={{
                label: authUser?.name || "AlgoNinja Dev",
                href: "/profile",
                icon: (
                  <Avatar
                    size={28}
                    name={authUser?.name || "Ninja"}
                    variant="beam"
                    colors={["#e02020", "#0a0a0a", "#94a3b8", "#1a1a1a"]}
                    className="rounded-full ring-2 ring-brand"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main View Wrapper Element */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden space-y-8 max-w-7xl mx-auto w-full">
        <HeroSection
          user={authUser}
          submissionsCount={problemSubmissions.length}
          successRate={successRate}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Problems Solved"
            value={solvedCount}
            icon={<CheckCircle />}
            color="green"
          />
          <StatCard
            title="Total Submissions"
            value={problemSubmissions.length}
            icon={<Code />}
            color="yellow"
          />
          <StatCard
            title="Current Streak"
            value={authUser?.streakCount || 0}
            secondaryValue={authUser?.highestStreak || 0}
            icon={<Flame />}
            color="orange"
            isStreak
          />
          <StatCard
            title="Success Rate"
            value={successRate}
            icon={<Target />}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProgressChart submissions={problemSubmissions} />
          </div>
          <div>
            <ActivityHeatmap submissions={problemSubmissions} />
          </div>
        </div>

        <SubmissionsHistory submissions={problemSubmissions} />
      </main>
    </div>
  );
};
