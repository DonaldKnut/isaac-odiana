"use client";

import { ViewTransition } from "react";

export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ViewTransition default="page-fade">{children}</ViewTransition>;
}
