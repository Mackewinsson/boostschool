import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "quiet";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
};

type ButtonProps = CommonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "style" | "children"
  > & {
    href?: undefined;
  };

type LinkButtonProps = CommonProps & {
  href: string;
};

function classFor(variant: Variant, className?: string) {
  return ["admin-btn", `admin-btn--${variant}`, className]
    .filter(Boolean)
    .join(" ");
}

export function AdminButton(props: ButtonProps | LinkButtonProps) {
  const variant = props.variant ?? "primary";
  const cls = classFor(variant, props.className);

  if ("href" in props && props.href) {
    const { href, children, style } = props;
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;
  const { children, type, style, ...rest } = buttonProps;
  return (
    <button type={type ?? "button"} className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}
