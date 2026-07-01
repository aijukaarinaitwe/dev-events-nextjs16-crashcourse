import { Schibsted_Grotesk, Martian_Mono, } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/lightrays";
import Navbar from "@/components/Navbar";

const geist = ({subsets:['latin'],variable:'--font-sans'});


// 1. Initialize fonts with underscores in the import name
const schibstedGrotesk = Schibsted_Grotesk({
    subsets: ["latin"],
    variable: "--font-schibsted",
});

const martianMono = Martian_Mono({
    subsets: ["latin"],
    variable: "--font-martian",
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)}>
        {/* 2. Use the exact instance names you defined above */}
        <body className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}>
        <Navbar />

        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
        <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0}
            distortion={0.1}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
            />
        </div>

        <main>
        {children}
            </main>

        </body>
        </html>
    );
}