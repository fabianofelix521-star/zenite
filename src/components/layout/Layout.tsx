import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingIcons from "@/components/features/FloatingIcons";
import MobileNavBar from "@/components/features/MobileNavBar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingIcons />
      <MobileNavBar />
      <Footer />
    </div>
  );
}
