import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { Coffee, Github, Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const changeLang = (c: string) => {
    i18n.changeLanguage(c);
    localStorage.setItem("lt.lang", c);
  };

  return (
    <main className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{t("settings.title")}</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">{t("settings.appearance")}</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t("settings.theme")}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "light", icon: Sun, label: t("settings.light") },
                  { v: "dark", icon: Moon, label: t("settings.dark") },
                  { v: "system", icon: Monitor, label: t("settings.system") },
                ].map(({ v, icon: Icon, label }) => (
                  <button
                    key={v}
                    onClick={() => setTheme(v as any)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all",
                      theme === v ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t("settings.language")}</p>
              <Select value={i18n.language} onValueChange={changeLang}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => (
                    <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-2">{t("settings.account")}</h2>
          <p className="text-sm text-muted-foreground">{t("settings.accountDesc")}</p>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">{t("settings.links")}</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            <Button asChild variant="outline" className="justify-start">
              <a href="https://buymeacoffee.com" target="_blank" rel="noreferrer">
                <Coffee className="h-4 w-4 mr-2 text-accent" />
                {t("settings.buyCoffee")}
              </a>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4 mr-2" />
                {t("settings.sourceCode")}
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}