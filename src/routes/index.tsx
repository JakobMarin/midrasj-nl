import { createFileRoute } from "@tanstack/react-router";
import { MidrasjApp } from "@/components/midrash/midrasj-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <MidrasjApp />;
}
