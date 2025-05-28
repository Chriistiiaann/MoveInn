import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-foreground/50 to-background z-0"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#B7F8C8]/20 dark:bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#62C3BA]/20 dark:bg-primary/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#FFBF00]/20 dark:bg-primary/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#0E1E40] dark:text-text">
                Welcome to <span className="text-[#4C69DD] dark:text-primary font-extrabold text-xxl">MoveInn</span>
                </h1>
                <p className="text-xl mb-8 text-[#0E1E40] dark:text-gray-300">
                Your all-in-one platform for making the most of your Erasmus experience. Find accommodation, connect with
                hosts, join events, and more!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#4C69DD] hover:bg-[#4C69DD]/90 text-white font-bold px-8 py-6 text-lg">
                    Get Started
                </Button>
                <Button
                    variant="outline"
                    className="border-[#FFBF00] text-[#FFBF00] hover:bg-[#FFBF00]/10 px-8 py-6 text-lg"
                >
                    How It Works
                </Button>
                </div>
                <div className="mt-8 flex items-center">
                <div className="flex -space-x-2 mr-4">
                    {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${
                        i % 2 === 0 ? "bg-[#4C69DD] text-white" : "bg-[#FFBF00] text-[#0E1E40]"
                        }`}
                    >
                        {i}
                    </div>
                    ))}
                </div>
                <p className="text-sm text-[#0E1E40] dark:text-gray-400">
                    Join <span className="font-bold">5,000+</span> Erasmus students already on the platform
                </p>
                </div>
            </div>
            <div className="relative">
                <div className="bg-gradient-to-br from-[#4C69DD] dark:from-[#4C69DD]/80 to-[#62C3BA] dark:to-foreground/50 rounded-xl p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#B7F8C8] flex items-center justify-center mb-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-[#0E1E40]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                        </svg>
                    </div>
                    <h3 className="font-semibold mb-1 text-white">Find Housing</h3>
                    <p className="text-xs text-white/80">Connect with potential roommates</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFBF00] flex items-center justify-center mb-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-[#0E1E40]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                        </svg>
                    </div>
                    <h3 className="font-semibold mb-1 text-white">Meet Locals</h3>
                    <p className="text-xs text-white/80">Connect with experienced hosts</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#62C3BA] flex items-center justify-center mb-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-[#0E1E40]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                        </svg>
                    </div>
                    <h3 className="font-semibold mb-1 text-white">Join Events</h3>
                    <p className="text-xs text-white/80">Discover local activities and trips</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFBF00] flex items-center justify-center mb-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-[#0E1E40]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                        </svg>
                    </div>
                    <h3 className="font-semibold mb-1 text-white">Explore</h3>
                    <p className="text-xs text-white/80">Discover student recommendations</p>
                    </div>
                </div>
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFBF00] flex items-center justify-center mr-3">
                        <span className="text-[#0E1E40] font-bold">!</span>
                    </div>
                    <h3 className="font-semibold text-white">Upcoming Orientation</h3>
                    </div>
                    <p className="text-sm mb-3 text-white/80">
                    Join our virtual orientation session for new Erasmus students in Madrid!
                    </p>
                    <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">March 25, 2025 • 6:00 PM</span>
                    <Button size="sm" className="bg-[#FFBF00] text-[#0E1E40] hover:bg-[#FFBF00]/90 font-medium">
                        RSVP
                    </Button>
                    </div>
                </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#FFBF00] rounded-full flex items-center justify-center text-[#0E1E40] font-bold text-lg animate-pulse">
                New!
                </div>
            </div>
            </div>
        </div>
        </section>
    )
}

