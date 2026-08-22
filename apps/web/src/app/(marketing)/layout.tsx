import { AppFooter } from "@/components/AppFooter";

// Exists so every public page — landing, métiers, login, signup and the
// legal pages nested below — carries the legal links.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AppFooter />
    </>
  );
}
