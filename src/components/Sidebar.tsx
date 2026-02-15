import { Link, useLocation } from "react-router-dom";
import { Home, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";

const Sidebar = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const links = [
    { to: "/home", icon: Home, label: t("home") },
    { to: `/profile/${profile?.username}`, icon: User, label: t("profile") },
    { to: "/settings", icon: Settings, label: t("settings") },
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

      <div className="flex flex-col gap-1">
        <LanguageSwitcher />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-display text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
        >
          <LogOut size={20} />
          {t("logout")}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
