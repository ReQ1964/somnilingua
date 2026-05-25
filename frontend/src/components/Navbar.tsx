import { Link, useLocation } from "react-router-dom";
import { Bug, Languages, Moon, Settings as SettingsIcon, Sun, Sparkles, Menu, LayoutDashboard, History as HistoryIcon, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import BugReportDialog from "./BugReportDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [bugOpen, setBugOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();
  const isDark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lt.lang", code);
  };

  const navItems = [
    { to: "/", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/history", label: t("nav.history"), icon: HistoryIcon },
    { to: "/stats", label: t("nav.stats"), icon: BarChart3 },
    { to: "/settings", label: t("nav.settings"), icon: SettingsIcon },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("nav.menu")}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b border-border/60">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {t("app.name")}
                  </SheetTitle>
                </SheetHeader>
                <nav className="p-3 flex flex-col gap-1">
                  {navItems.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                      <SheetClose asChild key={item.to}>
                        <Link
                          to={item.to}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                  <div className="h-px bg-border/60 my-3" />
                  <button
                    onClick={() => { setSheetOpen(false); setBugOpen(true); }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/60"
                  >
                    <Bug className="h-4 w-4" />
                    {t("nav.reportBug")}
                  </button>
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow"
              >
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="text-lg font-semibold tracking-tight">{t("app.name")}</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.to}
                asChild
                variant={location.pathname === item.to ? "secondary" : "ghost"}
                size="sm"
              >
                <Link to={item.to}>
                  <item.icon className="h-4 w-4 mr-1.5" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("nav.language")}>
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGS.map((l) => (
                  <DropdownMenuItem key={l.code} onClick={() => changeLang(l.code)}>
                    {l.label} {i18n.language === l.code && "✓"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label={t("nav.theme")}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setBugOpen(true)} aria-label={t("nav.reportBug")} className="hidden md:inline-flex">
              <Bug className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <BugReportDialog open={bugOpen} onOpenChange={setBugOpen} />
    </>
  );
}