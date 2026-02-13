import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles(username, display_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);
    setPosts(data || []);

    if (user) {
      const { data: likesData } = await supabase.from("likes").select("*").eq("user_id", user.id);
      setLikes(likesData || []);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("posts-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  // Count likes per post
  const [allLikes, setAllLikes] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("likes").select("*").then(({ data }) => setAllLikes(data || []));
  }, [posts]);

  return (
    <AppLayout>
      <div className="border-b border-border p-4">
        <h1 className="text-xl font-display font-bold text-foreground">Ana Sayfa</h1>
      </div>
      <CreatePost onCreated={fetchPosts} />
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            likeCount={allLikes.filter((l) => l.post_id === post.id).length}
            isLiked={likes.some((l) => l.post_id === post.id)}
            onRefresh={fetchPosts}
          />
        ))}
        {posts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Henüz gönderi yok. İlk wendle'ı sen paylaş!
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Home;
