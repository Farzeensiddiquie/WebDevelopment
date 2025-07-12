"use client";
import Link from "next/link";
import NProgress from "nprogress";

export default function ProgressLink({ href, children, ...props }) {
  const handleClick = (e) => {
    // Only start NProgress for left-clicks and internal links
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      (!props.target || props.target === "_self") &&
      typeof href === "string" &&
      !href.startsWith("http")
    ) {
      NProgress.start();
    }
    if (props.onClick) props.onClick(e);
  };

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
} 