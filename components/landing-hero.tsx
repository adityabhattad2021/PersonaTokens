"use client";
import Link from "next/link";
import TypeWriterComponent from "typewriter-effect"
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function LandingHero() {

    const { theme } = useTheme();

    return (
        <div className={cn("text-white font-bold py-36 text-center space-y-5", theme === "light" && "text-slate-900")}>
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>Platform to create and trade</h1>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    <TypeWriterComponent
                        options={{
                            strings: [
                                "a friend.",
                                "a character.",
                                "a story.",
                                "a persona.",
                            ],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
            </div>
            <div className={cn("text-sm md:text-xl font-light text-zinc-400", theme === "light" && "text-slate-900")}>
                Marketplace for creators to create and trade their characters, stories, and much more.
            </div>
            <div>
                <Link href={"/marketplace"}>
                    <Button className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                        Explore Marketplace
                    </Button>
                </Link>
            </div>
        </div>
    )
}