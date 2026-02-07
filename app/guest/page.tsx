import { Suspense } from "react";
import GuestClient from "./GuestClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GuestClient />
    </Suspense>
  );
}