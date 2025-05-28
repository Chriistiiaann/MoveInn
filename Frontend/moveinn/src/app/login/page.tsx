import LoginForm from "@/components/login/login-form"
import { ThemeToggle } from "@/components/landing/theme-toggle-btn"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Botón de cambio de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
        
      </div>

      <div className="grid md:grid-cols-2 h-screen">
        <div className="flex items-center justify-center p-8">
          <LoginForm />
        </div>

        <div className="h-[95%] w-[95%] mx-auto my-auto 
          bg-gradient-to-br from-[#121E3E] via-[#5268D6] to-[#B7F8C8] dark:via-[#5268D6]/80 dark:to-foreground 
          rounded-[20px] flex items-center justify-center"
        >

          <div className="h-full flex flex-col justify-center p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-4">
                Move<span className="text-secondary">Inn</span>
              </h2>
              <p className="text-2xl font-medium">
                Connect with Erasmus students worldwide
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2 text-white">
                    {/* Icono Community */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path
                        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Community</h3>
                </div>
                <p className="text-sm">Join 5,000+ students</p>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2 text-white">
                    {/* Icono Locations */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Locations</h3>
                </div>
                <p className="text-sm">Active in 30+ cities</p>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2 text-white">
                    {/* Icono Global */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12h20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Global</h3>
                </div>
                <p className="text-sm">Students from 50+ countries</p>
              </div>

              {/* Puedes eliminar este div duplicado si fue por error */}
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2 text-white">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12h20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Global</h3>
                </div>
                <p className="text-sm">Students from 50+ countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
