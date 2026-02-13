import { useState, useRef } from "react";
import { Send, ImagePlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CreatePost = ({ onCreated }: { onCreated: () => void }) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resim en fazla 5MB olabilir");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !imageFile) || !user) return;
    if (content.length > 500) {
      toast.error("Gönderi en fazla 500 karakter olabilir");
      return;
    }
    setLoading(true);
    try {
      let image_url: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("post-images").upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      await supabase.from("posts").insert({
        user_id: user.id,
        content: content.trim() || "",
        image_url,
      } as any);

      setContent("");
      removeImage();
      onCreated();
    } catch {
      toast.error("Gönderi paylaşılamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-border">
      <div className="flex gap-3">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm shrink-0">
            {(profile?.display_name || profile?.username || "?")[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Neler oluyor?"
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[60px]"
            maxLength={500}
          />
          {imagePreview && (
            <div className="relative mt-2 inline-block">
              <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg border border-border" />
              <button onClick={removeImage} className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors">
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <button onClick={() => fileRef.current?.click()} className="text-primary hover:text-accent transition-colors">
                <ImagePlus size={20} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <span className="text-xs text-muted-foreground">{content.length}/500</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && !imageFile)}
              className="px-5 py-2 rounded-full bg-gradient-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={14} />
              Wendle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
