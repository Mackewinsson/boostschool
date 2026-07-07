import Link from "next/link";

type PrivacyNoteProps = {
  note: string;
  linkLabel: string;
};

export function PrivacyNote({ note, linkLabel }: PrivacyNoteProps) {
  return (
    <p className="text-center text-xs text-fg-faint">
      {note}{" "}
      <Link href="/privacidad" className="underline transition hover:text-accent">
        {linkLabel}
      </Link>
      .
    </p>
  );
}
