import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PostCard from "@/components/PostCard";
import ReportDialog from "@/components/ReportDialog";
import { Flag } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [allLikes, setAllLikes] = useState<any[]>([]);
  const [allComments, setAllComments] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!username) return;
    const { data: p } = await supabase.from("profiles").select("*").eq("username", username).single();
    if (!p) return;
    setProfile(p);

    const { data: postsData } = await supabase
      .from("posts")
      .select("*, profiles(username, display_name, avatar_url)")
      .eq("user_id", p.id)
      .order("created_at", { ascending: false });
    setPosts(postsData || []);

    const { count: followers } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", p.id);
    const { count: following } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", p.id);
    setFollowerCount(followers || 0);
    setFollowingCount(following || 0);

    if (user) {
      const { data: followData } = await supabase.from("follows").select("*").eq("follower_id", user.id).eq("following_id", p.id);
      setIsFollowing((followData || []).length > 0);

      const { data: likesData } = await supabase.from("likes").select("*").eq("user_id", user.id);
      setLikes(likesData || []);
    }

    const postIds = (postsData || []).map((pp: any) => pp.id);
    if (postIds.length > 0) {
      const { data: al } = await supabase.from("likes").select("*").in("post_id", postIds);
      setAllLikes(al || []);
      const { data: ac } = await supabase.from("comments").select("id, post_id").in("post_id", postIds);
      setAllComments(ac || []);
    }
  }, [username, user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleFollow = async () => {
    if (!user || !profile) return;
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", profile.id);
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: profile.id });
    }
    fetchData();
  };

  if (!profile) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">{t("userNotFound")}</div>
      </AppLayout>
    );
  }

  const isOwn = user?.id === profile.id;

  return (
    <AppLayout>
      <div className="border-b border-border">
        <div className="h-32 bg-gradient-primary" />
        <div className="px-4 pb-4">
          <div className="flex justify-between items-end -mt-8">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-background" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-card border-4 border-background flex items-center justify-center text-2xl font-display font-bold text-gradient">
                {(profile.display_name || profile.username)[0].toUpperCase()}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              {!isOwn && user && (
                <>
                  <button onClick={() => setReportOpen(true)} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive transition-colors">
                    <Flag size={16} />
                  </button>
                  <button
                    onClick={toggleFollow}
                    className={`px-5 py-2 rounded-full font-display font-semibold text-sm transition-all ${
                      isFollowing
                        ? "bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground"
                        : "bg-gradient-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {isFollowing ? t("unfollow") : t("follow")}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-display font-bold text-foreground">{profile.display_name || profile.username}</h2>
            <p className="text-muted-foreground text-sm">@{profile.username}</p>
            {profile.bio && <p className="text-foreground mt-2">{profile.bio}</p>}
            <div className="flex gap-4 mt-3 text-sm">
              <span><strong className="text-foreground">{followingCount}</strong> <span className="text-muted-foreground">{t("following")}</span></span>
              <span><strong className="text-foreground">{followerCount}</strong> <span className="text-muted-foreground">{t("followers")}</span></span>
            </div>
          </div>
        </div>
      </div>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          likeCount={allLikes.filter((l) => l.post_id === post.id).length}
          isLiked={likes.some((l) => l.post_id === post.id)}
          commentCount={allComments.filter((c) => c.post_id === post.id).length}
          onRefresh={fetchData}
        />
      ))}
      {posts.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">{t("noPostsYet")}</div>
      )}

      {reportOpen && (
        <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} reportedUserId={profile.id} />
      )}
    </AppLayout>
  );
};

export default Profile;
