'use client';

import AdvocacyToolkit from "@/components/advocacy-toolkit";
import ProtectedRoute from "@/components/protected-route";

export default function ToolkitPage() {
  return (
    <ProtectedRoute>
      <AdvocacyToolkit />
    </ProtectedRoute>
  );
}