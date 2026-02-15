import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();

  const toggle = () => setLang(lang === "tr" ? "en" : "tr");

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-sm font-display"
      title={lang === "tr" ? "Switch to English" : "Türkçe'ye geç"}
    >
      <Globe size={18} />
      <span className="uppercase font-semibold">{lang === "tr" ? "TR" : "EN"}</span>
    </button>
  );
};

export default LanguageSwitcher;
