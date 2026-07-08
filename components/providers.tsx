import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { clerkAppearance } from "@/components/student/clerk-appearance";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider appearance={clerkAppearance} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
}
