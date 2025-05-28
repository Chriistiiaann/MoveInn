import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle-btn"

export function Navbar() {
    
    return (
        <header className="bg-gradient-to-r from-background to-foreground/80 text-[#0E1E40] dark:text-text-secondary py-4 px-4 md:px-8 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#0E1E40] dark:text-text">
                Move<span className="text-[#4C69DD] font-extrabold">Inn</span>
            </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-[#0E1E40] dark:text-text-secondary hover:text-[#4C69DD] transition-colors">
                Features
            </Link>
            <Link href="#how-it-works" className="text-[#0E1E40] dark:text-text-secondary hover:text-[#4C69DD] transition-colors">
                How It Works
            </Link>
            <Link href="#testimonials" className="text-[#0E1E40] dark:text-text-secondary hover:text-[#4C69DD] transition-colors">
                Testimonials
            </Link>
            </nav>

            <div className="flex items-center space-x-4">
            <Link href="/login">
                <Button variant="outline" className="border-[#4C69DD] dark:bg-foreground text-[#4C69DD] hover:bg-primary/10 dark:hover:bg-primary/30">
                Log In
                </Button>
            </Link>
            <Link href="/register" className="hidden md:inline-flex">
                <Button className="bg-[#4C69DD] text-white hover:bg-[#4C69DD]/90">Sign Up</Button>
            </Link>
            <ThemeToggle />
            </div>
        </div>
        </header>
    )
}

