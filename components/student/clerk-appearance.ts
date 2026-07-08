export const clerkAppearance = {
  variables: {
    colorBackground: "#0b1120",
    colorInputBackground: "#030712",
    colorInputText: "#f8fafc",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
    colorPrimary: "#06b6d4",
    colorDanger: "#f87171",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "border border-white/10 bg-[#0b1120] shadow-none",
    formButtonPrimary:
      "bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90",
    footerActionLink: "text-[#22d3ee] hover:text-[#a78bfa]",
  },
} as const;
