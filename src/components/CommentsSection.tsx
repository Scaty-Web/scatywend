import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { tr as trLocale, enUS } from "date-fns/locale";
import { Send, Reply, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
}

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(username, display_name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments((data as Comment[]) || []);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const channel = supabase
      .channel(`comments-${postId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `post_id=eq.${postId}` }, () => {
        fetchComments();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [postId, fetchComments]);

  const sendComment = async () => {
    if (!user || !newComment.trim()) return;
    setSending(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      content: newComment.trim(),
      parent_id: replyTo?.id || null,
    });
    if (error) {
      toast.error(t("commentFailed"));
    } else {
      setNewComment("");
      setReplyTo(null);
      if (replyTo) {
        setExpandedReplies((prev) => new Set(prev).add(replyTo.id));
      }
    }
    setSending(false);
  };

  const deleteComment = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    toast.success(t("commentDeleted"));
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter((c) => c.parent_id === parentId);

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const replies = getReplies(comment.id);
    const isOwn = user?.id === comment.user_id;
    const expanded = expandedReplies.has(comment.id);
    const avatarUrl = comment.profiles?.avatar_url;

    return (
      <div key={comment.id} className={`${isReply ? "ml-8 border-l-2 border-border pl-3" : ""}`}>
        <div className="flex gap-2 py-2">
          <Link to={`/profile/${comment.profiles?.username}`}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0">
                {(comment.profiles?.display_name || comment.profiles?.username || "?")[0].toUpperCase()}
              </div>
            )}
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link to={`/profile/${comment.profiles?.username}`} className="font-display font-semibold text-foreground text-sm hover:underline">
                {comment.profiles?.display_name || comment.profiles?.username}
              </Link>
              <span className="text-muted-foreground text-xs">@{comment.profiles?.username}</span>
              <span className="text-muted-foreground text-xs">
                · {formatDistanceToNow(new Date(comment.created_at), { locale: lang === "tr" ? trLocale : enUS, addSuffix: true })}
              </span>
            </div>
            <p className="text-foreground text-sm mt-0.5 whitespace-pre-wrap break-words">{comment.content}</p>
            <div className="flex items-center gap-3 mt-1">
              {user && !isReply && (
                <button
                  onClick={() => setReplyTo({ id: comment.id, username: comment.profiles?.username || "" })}
                  className="text-muted-foreground hover:text-primary text-xs flex items-center gap-1 transition-colors"
                >
                  <Reply size={13} />
                  {t("reply")}
                </button>
              )}
              {isOwn && (
                <button onClick={() => deleteComment(comment.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            {replies.length > 0 && !isReply && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-primary text-xs flex items-center gap-1 mt-1 hover:underline"
              >
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {replies.length} {t("replies")}
              </button>
            )}
          </div>
        </div>
        {expanded && replies.map((r) => renderComment(r, true))}
      </div>
    );
  };

  return (
    <div className="px-4 pb-3">
      {topLevel.map((c) => renderComment(c))}

      {user && (
        <div className="mt-2">
          {replyTo && (
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Reply size={12} />
              {t("replyingTo")} @{replyTo.username}
              <button onClick={() => setReplyTo(null)} className="ml-1 text-destructive hover:underline">{t("cancel")}</button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendComment()}
              placeholder={t("writeComment")}
              className="flex-1 h-8 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              maxLength={300}
            />
            <button
              onClick={sendComment}
              disabled={sending || !newComment.trim()}
              className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
