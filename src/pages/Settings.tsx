import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { deleteAccount } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

const Settings = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({
        display_name: displayName.trim() || profile.username,
        bio: bio.trim(),
      }).eq("id", profile.id);
      toast.success("Profil güncellendi");
    } catch {
      toast.error("Güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Hesap silinemedi");
      setDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="border-b border-border p-4">
        <h1 className="text-xl font-display font-bold text-foreground">Hesap Ayarları</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile section */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Profil Bilgileri</h2>
          
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Kullanıcı Adı</label>
            <input
              type="text"
              value={profile?.username || ""}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Görünen Ad</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Biyografi</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
              maxLength={160}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-card rounded-xl border border-destructive/30 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" size={20} />
            <h2 className="text-lg font-display font-semibold text-destructive">Tehlike Bölgesi</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
          </p>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-6 py-2 rounded-lg border border-destructive text-destructive font-display font-semibold hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Hesabımı Sil
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2 rounded-lg bg-destructive text-destructive-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleting ? "Siliniyor..." : "Evet, Sil"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-6 py-2 rounded-lg bg-secondary text-secondary-foreground font-display hover:bg-secondary/80 transition-colors"
              >
                İptal
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
