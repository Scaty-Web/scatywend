import { Link, useLocation } from "react-router-dom";
import { Home, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/home", icon: Home, label: "Ana Sayfa" },
    { to: `/profile/${profile?.username}`, icon: User, label: "Profil" },
    { to: "/settings", icon: Settings, label: "Ayarlar" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen sticky top-0 border-r border-border p-4 flex flex-col bg-background">
      <Link to="/home" className="text-2xl font-display font-bold text-gradient mb-8 px-3">
        Scaty Wend
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-display transition-colors ${
              location.pathname === to
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg font-display text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
      >
        <LogOut size={20} />
        Çıkış Yap
      </button>
    </div>
  );
};

export default Sidebar;
