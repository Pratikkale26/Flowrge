import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

// This fixes the build error by skipping static generation
export const dynamic = "force-dynamic";

export default function EmailCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-zinc-300">
        Loading...
      </div>
    }>
      <CallbackClient />
    </Suspense>
  );
}