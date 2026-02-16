import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "tr" | "en";

const translations = {
  tr: {
    // Landing
    tagline: "Sende wendle!",
    landingDesc: "Başlamak için kayıt olun veya giriş yapın",
    login: "Giriş Yap",
    signup: "Kayıt Ol",

    // Login
    loginTitle: "Giriş Yap",
    usernamePlaceholder: "Kullanıcı adı",
    passwordPlaceholder: "Şifre",
    loggingIn: "Giriş yapılıyor...",
    noAccount: "Hesabın yok mu?",
    loginFailed: "Giriş başarısız",

    // Signup
    signupTitle: "Kayıt Ol",
    passwordHint: "Şifre (en az 6 karakter)",
    signingUp: "Kayıt yapılıyor...",
    hasAccount: "Zaten hesabın var mı?",
    accountCreated: "Hesap oluşturuldu!",
    signupFailed: "Kayıt başarısız",
    usernameMin: "Kullanıcı adı en az 3 karakter olmalı",
    usernameFormat: "Kullanıcı adı 3-30 karakter, sadece harf, rakam ve alt çizgi olmalı",
    usernameReserved: "Bu kullanıcı adı kullanılamaz",
    passwordMin: "Şifre en az 6 karakter olmalı",

    // Sidebar
    home: "Ana Sayfa",
    profile: "Profil",
    settings: "Ayarlar",
    logout: "Çıkış Yap",

    // Home
    homeTitle: "Ana Sayfa",
    noPosts: "Henüz gönderi yok. İlk wendle'ı sen paylaş!",

    // Create Post
    whatsHappening: "Neler oluyor?",
    wendle: "Wendle",
    postMaxChar: "Gönderi en fazla 500 karakter olabilir",
    postFailed: "Gönderi paylaşılamadı",
    imageMaxSize: "Resim en fazla 5MB olabilir",

    // Post Card
    postDeleted: "Gönderi silindi",
    comments: "Yorumlar",
    writeComment: "Yorum yaz...",
    reply: "Yanıtla",
    replies: "yanıt",
    replyingTo: "Yanıtlanıyor:",
    commentFailed: "Yorum gönderilemedi",
    commentDeleted: "Yorum silindi",

    // Profile
    userNotFound: "Kullanıcı bulunamadı",
    follow: "Takip Et",
    unfollow: "Takipten Çık",
    following: "Takip",
    followers: "Takipçi",
    noPostsYet: "Henüz gönderi yok",

    // Settings
    accountSettings: "Hesap Ayarları",
    profileInfo: "Profil Bilgileri",
    usernameLabel: "Kullanıcı Adı",
    displayNameLabel: "Görünen Ad",
    bioLabel: "Biyografi",
    save: "Kaydet",
    saving: "Kaydediliyor...",
    profileUpdated: "Profil güncellendi",
    updateFailed: "Güncellenemedi",
    changeAvatar: "Profil resmini değiştirmek için tıklayın",
    uploading: "Yükleniyor...",
    avatarUpdated: "Profil resmi güncellendi",
    avatarUploadFailed: "Yükleme başarısız",
    avatarMaxSize: "Profil resmi en fazla 2MB olabilir",
    dangerZone: "Tehlike Bölgesi",
    dangerDesc: "Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.",
    deleteAccount: "Hesabımı Sil",
    confirmDelete: "Evet, Sil",
    deleting: "Siliniyor...",
    cancel: "İptal",
    deleteFailed: "Hesap silinemedi",

    // Report
    reportTitle: "Şikayet Et",
    reportPlaceholder: "Şikayet nedeninizi yazın...",
    reportSent: "Şikayet gönderildi",
    reportFailed: "Şikayet gönderilemedi",
    send: "Gönder",

    // Loading
    loading: "Yükleniyor...",

    // 404
    pageNotFound: "Sayfa bulunamadı",
    returnHome: "Ana Sayfaya Dön",
  },
  en: {
    tagline: "Start wendling!",
    landingDesc: "Sign up or log in to get started",
    login: "Log In",
    signup: "Sign Up",

    loginTitle: "Log In",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    loginFailed: "Login failed",

    signupTitle: "Sign Up",
    passwordHint: "Password (min 6 characters)",
    signingUp: "Signing up...",
    hasAccount: "Already have an account?",
    accountCreated: "Account created!",
    signupFailed: "Sign up failed",
    usernameMin: "Username must be at least 3 characters",
    usernameFormat: "Username must be 3-30 characters, alphanumeric and underscore only",
    usernameReserved: "This username is reserved",
    passwordMin: "Password must be at least 6 characters",

    home: "Home",
    profile: "Profile",
    settings: "Settings",
    logout: "Log Out",

    homeTitle: "Home",
    noPosts: "No posts yet. Be the first to wendle!",

    whatsHappening: "What's happening?",
    wendle: "Wendle",
    postMaxChar: "Post can be max 500 characters",
    postFailed: "Failed to post",
    imageMaxSize: "Image can be max 5MB",

    postDeleted: "Post deleted",
    comments: "Comments",
    writeComment: "Write a comment...",
    reply: "Reply",
    replies: "replies",
    replyingTo: "Replying to:",
    commentFailed: "Failed to send comment",
    commentDeleted: "Comment deleted",

    userNotFound: "User not found",
    follow: "Follow",
    unfollow: "Unfollow",
    following: "Following",
    followers: "Followers",
    noPostsYet: "No posts yet",

    accountSettings: "Account Settings",
    profileInfo: "Profile Information",
    usernameLabel: "Username",
    displayNameLabel: "Display Name",
    bioLabel: "Bio",
    save: "Save",
    saving: "Saving...",
    profileUpdated: "Profile updated",
    updateFailed: "Update failed",
    changeAvatar: "Click to change profile picture",
    uploading: "Uploading...",
    avatarUpdated: "Profile picture updated",
    avatarUploadFailed: "Upload failed",
    avatarMaxSize: "Profile picture can be max 2MB",
    dangerZone: "Danger Zone",
    dangerDesc: "Deleting your account will permanently remove all your data. This action cannot be undone.",
    deleteAccount: "Delete My Account",
    confirmDelete: "Yes, Delete",
    deleting: "Deleting...",
    cancel: "Cancel",
    deleteFailed: "Could not delete account",

    reportTitle: "Report",
    reportPlaceholder: "Describe the reason for your report...",
    reportSent: "Report sent",
    reportFailed: "Failed to send report",
    send: "Send",

    loading: "Loading...",

    pageNotFound: "Page not found",
    returnHome: "Return to Home",
  },
} as const;

type TranslationKey = keyof typeof translations.tr;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("app-lang") as Lang) || "tr";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("app-lang", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
