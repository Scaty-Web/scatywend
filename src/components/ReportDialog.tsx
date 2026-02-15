import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  reportedPostId?: string;
  reportedUserId?: string;
}

const ReportDialog = ({ open, onClose, reportedPostId, reportedUserId }: ReportDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!reason.trim() || !user) return;
    setLoading(true);
    try {
      await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_post_id: reportedPostId || null,
        reported_user_id: reportedUserId || null,
        reason: reason.trim(),
      });
      toast.success(t("reportSent"));
      onClose();
    } catch {
      toast.error(t("reportFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">{t("reportTitle")}</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("reportPlaceholder")}
          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-secondary text-secondary-foreground font-display hover:bg-secondary/80 transition-colors">
            {t("cancel")}
          </button>
          <button onClick={handleSubmit} disabled={loading || !reason.trim()} className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground font-display hover:opacity-90 transition-opacity disabled:opacity-50">
            {t("send")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDialog;
