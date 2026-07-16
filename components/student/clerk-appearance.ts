/**
 * Clerk UI theme aligned with Boostschool dark canvas.
 * Prefer current variable names (Clerk 2025+); keep legacy aliases as fallback.
 */
export const clerkAppearance = {
  variables: {
    colorBackground: "#0b1120",
    colorForeground: "#f8fafc",
    colorMutedForeground: "#94a3b8",
    colorPrimary: "#06b6d4",
    colorPrimaryForeground: "#f8fafc",
    colorDanger: "#f87171",
    colorInput: "#030712",
    colorInputForeground: "#f8fafc",
    colorNeutral: "#f8fafc",
    colorBorder: "rgba(255, 255, 255, 0.12)",
    colorMuted: "#07101f",
    colorRing: "#22d3ee",
    borderRadius: "0.75rem",
    // Legacy aliases (pre-2025-07) — harmless if ignored by newer Clerk
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
    colorInputText: "#f8fafc",
    colorInputBackground: "#030712",
  },
  elements: {
    rootBox: "text-white",
    card: "border border-white/10 bg-[#0b1120] shadow-none text-white",
    headerTitle: "text-white",
    headerSubtitle: "text-slate-300",
    formFieldLabel: "text-slate-200",
    formFieldInput:
      "bg-[#030712] text-white border-white/15 placeholder:text-slate-500",
    formFieldInputShowPasswordButton: "text-slate-300",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-cyan-300",
    otpCodeFieldInput:
      "bg-[#030712] text-white border-white/20 caret-cyan-400",
    formButtonPrimary:
      "bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:opacity-90",
    footerActionLink: "text-[#22d3ee] hover:text-[#a78bfa]",
    footerActionText: "text-slate-400",
    alternativeMethodsBlockButton: "text-cyan-300 border-white/10",
    formResendCodeLink: "text-[#22d3ee]",
    dividerLine: "bg-white/10",
    dividerText: "text-slate-400",
    socialButtonsBlockButton:
      "bg-[#030712] text-white border border-white/10 hover:bg-[#0f1729]",
    socialButtonsBlockButtonText: "text-white",
  },
} as const;
