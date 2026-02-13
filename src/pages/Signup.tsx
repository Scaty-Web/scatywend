import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "@/lib/auth";
import { toast } from "sonner";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    if (username.trim().length < 3) {
      toast.error("Kullanıcı adı en az 3 karakter olmalı");
      return;
    }
    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı");
      return;
    }
    setLoading(true);
    try {
      await signUp(username.trim(), password);
      toast.success("Hesap oluşturuldu!");
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message || "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-sm px-6">
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient">Scaty Wend</h1>
        </Link>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">Kayıt Ol</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Kullanıcı adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="password"
              placeholder="Şifre (en az 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </button>
          </form>

          <p className="text-muted-foreground text-sm text-center mt-4">
            Zaten hesabın var mı?{" "}
            <Link to="/login" className="text-primary hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
