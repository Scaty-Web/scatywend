import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 max-w-2xl border-r border-border">
        {children}
      </main>
      {/* Right side empty space like Twitter */}
      <div className="hidden lg:block flex-1" />
    </div>
  );
};

export default AppLayout;
