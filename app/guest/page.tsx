import { Suspense } from "react";
import GuestClient from "./GuestClient";

export default function GuestPage() {
  return (
    <Suspense fallback={null}>
      <GuestClient />
    </Suspense>
  );
}