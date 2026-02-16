import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Flag, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import ReportDialog from "./ReportDialog";
import CommentsSection from "./CommentsSection";
import { useLanguage } from "@/hooks/useLanguage";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    image_url?: string | null;
    profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
  };
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  onRefresh: () => void;
}

const PostCard = ({ post, likeCount, isLiked, commentCount, onRefresh }: PostCardProps) => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [reportOpen, setReportOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const isOwn = user?.id === post.user_id;

  const toggleLike = async () => {
    if (!user) return;
    if (isLiked) {
      await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", post.id);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, post_id: post.id });
    }
    onRefresh();
  };

  const deletePost = async () => {
    await supabase.from("posts").delete().eq("id", post.id);
    toast.success(t("postDeleted"));
    onRefresh();
  };

  const avatarUrl = post.profiles?.avatar_url;

  return (
    <div className="p-4 border-b border-border hover:bg-secondary/30 transition-colors">
      <div className="flex gap-3">
        <Link to={`/profile/${post.profiles?.username}`}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm shrink-0">
              {(post.profiles?.display_name || post.profiles?.username || "?")[0].toUpperCase()}
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${post.profiles?.username}`} className="font-display font-semibold text-foreground hover:underline truncate">
              {post.profiles?.display_name || post.profiles?.username}
            </Link>
            <span className="text-muted-foreground text-sm">@{post.profiles?.username}</span>
            <span className="text-muted-foreground text-xs">
              · {formatDistanceToNow(new Date(post.created_at), { locale: lang === "tr" ? tr : enUS, addSuffix: true })}
            </span>
          </div>
          {post.content && <p className="text-foreground mt-1 whitespace-pre-wrap break-words">{post.content}</p>}
          {post.image_url && (
            <img src={post.image_url} alt="" className="mt-2 rounded-xl border border-border max-h-96 w-auto" />
          )}
          <div className="flex items-center gap-4 mt-3">
            <button onClick={toggleLike} className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              {likeCount > 0 && likeCount}
            </button>
            <button onClick={() => setCommentsOpen(!commentsOpen)} className={`flex items-center gap-1 text-sm transition-colors ${commentsOpen ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
              <MessageCircle size={16} />
              {commentCount > 0 && commentCount}
            </button>
            {isOwn && (
              <button onClick={deletePost} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={16} />
              </button>
            )}
            {!isOwn && user && (
              <button onClick={() => setReportOpen(true)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Flag size={16} />
              </button>
            )}
          </div>
          {commentsOpen && <CommentsSection postId={post.id} />}
        </div>
      </div>
      {reportOpen && (
        <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} reportedPostId={post.id} reportedUserId={post.user_id} />
      )}
    </div>
  );
};

export default PostCard;
