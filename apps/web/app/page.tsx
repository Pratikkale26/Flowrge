import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { Appbar } from "../components/Appbar";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen">
      <Appbar />
      <Hero />
      {/* <HeroVideo /> */}
      <Footer />
    </main>
  );
}
