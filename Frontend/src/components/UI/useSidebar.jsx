import React, { useState, createContext, useContext } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className = "", children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.div
      className={`h-screen px-4 py-6 hidden md:flex md:flex-col bg-card border-r border-border shrink-0 satoshi sticky top-0 overflow-y-auto overflow-x-hidden ${className}`}
      animate={{
        width: animate ? (open ? "260px" : "76px") : "260px",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({ className = "", children, ...props }) => {
  const { open, setOpen } = useSidebar();

  return (
    <div
      className={`h-14 px-4 flex flex-row md:hidden items-center justify-between bg-card border-b border-border w-full satoshi sticky top-0 z-40 ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2">
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
      </div>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl text-muted-foreground hover:bg-muted/80 transition-colors"
      >
        <IconMenu2 className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
            className={`fixed inset-0 h-screen w-full bg-card p-6 z-100 flex flex-col border-r border-border shadow-2xl ${className}`}
          >
            <button
              type="button"
              className="absolute right-4 top-4 p-2 text-muted-foreground hover:bg-muted/80 rounded-xl"
              onClick={() => setOpen(false)}
            >
              <IconX className="h-5 w-5" />
            </button>
            <div className="flex flex-col flex-1 mt-8 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({ link, className = "", ...props }) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      to={link.href}
      onClick={(e) => {
        if (link.onClick) {
          e.preventDefault();
          link.onClick();
        }
      }}
      className={`flex items-center justify-start gap-3 group/sidebar py-2.5 px-3 rounded-xl hover:bg-muted/60 text-muted-foreground hover:text-brand transition-all duration-150 ease-out ${className}`}
      {...props}
    >
      <div className="shrink-0 transition-transform group-hover/sidebar:scale-105">
        {link.icon}
      </div>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.1 }}
        className="text-sm font-semibold tracking-wide whitespace-pre inline-block p-0! m-0! transition-colors truncate"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
