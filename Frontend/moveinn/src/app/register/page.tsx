import { ThemeToggle } from "@/components/landing/theme-toggle-btn"
import RegisterForm from "@/components/register/register-form"

export default function RegisterPage() {
  return (
    <main className="min-h-screen relative">
      {/* Botón de cambio de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="grid md:grid-cols-2 h-screen">
        {/* IZQUIERDA - Características (oculta en móviles) */}
        <div className="hidden md:flex h-[95%] w-[95%] mx-auto my-auto 
          bg-gradient-to-br from-[#121E3E] via-[#5268D6] to-[#B7F8C8] dark:via-[#5268D6]/80 dark:to-foreground 
          rounded-[20px] items-center justify-center"
        >
          <div className="h-full flex flex-col justify-center p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-4">
                Move<span className="text-secondary">Inn</span>
              </h2>
              <p className="text-2xl font-medium">
                Begin your Erasmus adventure today
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="bg-white/30 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Find accommodation with ease</h3>
                    <p className="text-sm text-white/80">
                      Connect with potential roommates and explore housing options
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="bg-white/30 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Meet local student hosts</h3>
                    <p className="text-sm text-white/80">
                      Get guidance from experienced students who know the city
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="bg-white/30 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Join events and make friends</h3>
                    <p className="text-sm text-white/80">
                      Discover social activities and cultural experiences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DERECHA - Formulario */}
        <div className="flex items-center justify-center p-8">
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
