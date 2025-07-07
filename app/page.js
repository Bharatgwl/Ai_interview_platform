"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Button className="p-5" onClick={() => router.push("/dashboard")}>
        Click me
      </Button>
    </div>
  );
}
