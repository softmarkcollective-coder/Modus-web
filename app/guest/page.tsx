import { Suspense } from "react";
import GuestClient from "./GuestClient";

export default function GuestPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(1200px 600px at 50% -10%, #2a2f2c 0%, #141615 60%)",
            color: "#f5f5f5",
          }}
        >
          Loading…
        </main>
      }
    >
      <GuestClient />
    </Suspense>
  );
}