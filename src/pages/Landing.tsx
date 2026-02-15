import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-gradient">
          Scaty Wend
        </h1>

        <p className="text-2xl md:text-3xl font-display font-semibold text-foreground">
          {t("tagline")}
        </p>

        <p className="text-muted-foreground text-lg max-w-md">
          {t("landingDesc")}
        </p>

        <div className="flex gap-4 mt-4">
          <Link
            to="/login"
            className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-display font-semibold hover:bg-secondary/80 transition-colors"
          >
            {t("login")}
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity glow-purple"
          >
            {t("signup")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
