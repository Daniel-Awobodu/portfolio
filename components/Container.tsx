import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/** Shell width (~1100px) with consistent gutters at every breakpoint. */
export default function Container({
  children,
  as: Tag = "div",
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className">) {
  return (
    <Tag
      className={`mx-auto w-full max-w-shell px-5 sm:px-8 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
