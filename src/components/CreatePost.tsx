import { useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CreatePost = ({ onCreated }: { onCreated: () => void }) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;
    if (content.length > 500) {
      toast.error("Gönderi en fazla 500 karakter olabilir");
      return;
    }
    setLoading(true);
    try {
      await supabase.from("posts").insert({ user_id: user.id, content: content.trim() });
      setContent("");
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
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm shrink-0">
          {(profile?.display_name || profile?.username || "?")[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Neler oluyor?"
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[60px]"
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{content.length}/500</span>
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
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
