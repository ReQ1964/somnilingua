import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function BugReportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const send = () => {
    const subject = encodeURIComponent(`[Bug] ${title}`);
    const body = encodeURIComponent(
      `${desc}\n\n---\nURL: ${window.location.href}\nUA: ${navigator.userAgent}\n${file ? `Attachment: ${file.name}` : ""}`
    );
    window.location.href = `mailto:support@example.com?subject=${subject}&body=${body}`;
    toast.success(t("bug.sent"));
    onOpenChange(false);
    setTitle("");
    setDesc("");
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("bug.title")}</DialogTitle>
          <DialogDescription>{t("bug.desc")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("bug.bugTitle")}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("bug.description")}</Label>
            <Textarea rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("bug.screenshot")}</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button onClick={send} disabled={!title || !desc} className="w-full bg-gradient-primary">
            <Send className="h-4 w-4 mr-2" /> {t("bug.send")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}