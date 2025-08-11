"use client";

import React from "react";
import MainHomePage from "@/components/MainHomePage";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <MainHomePage />
    </ErrorBoundary>
  );
}
