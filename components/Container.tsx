import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 md:px-8", className)}>
      {children}
    </div>
  );
}
