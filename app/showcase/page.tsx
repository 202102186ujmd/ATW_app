"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Film, ArrowRight } from "lucide-react"

export default function ShowcasePage() {
  const router = useRouter()

  const apis = [
    {
      id: "pokemon",
      title: "Pokédex",
      description: "Explora la base de datos completa de Pokémon con estadísticas, habilidades y movimientos.",
      icon: Gamepad2,
      color: "from-emerald-500/20 to-cyan-500/20",
      borderColor: "border-emerald-500/20",
      accentColor: "text-emerald-400",
      routes: [
        { label: "Buscar Pokémon", href: "/pokemon-search" },
        { label: "Catálogo", href: "/pokemon-catalog" },
      ],
    },
    {
      id: "movies",
      title: "Películas",
      description: "Descubre películas, directores, actores y sinopsis con la API de OMDb.",
      icon: Film,
      color: "from-red-500/20 to-orange-500/20",
      borderColor: "border-red-500/20",
      accentColor: "text-red-400",
      routes: [
        { label: "Buscar Película", href: "/peliculas" },
        { label: "Catálogo", href: "/peliculas/catalogo" },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              API Explorer
            </h1>
            <p className="mt-4 text-pretty text-xl text-muted-foreground md:text-2xl">
              Explora múltiples APIs en una sola aplicación
            </p>
          </div>

          {/* Grid de APIs */}
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {apis.map((api) => {
              const Icon = api.icon
              return (
                <Card
                  key={api.id}
                  className={`group relative overflow-hidden border-2 ${api.borderColor} bg-gradient-to-br ${api.color} p-8 transition-all hover:border-opacity-100 hover:shadow-lg`}
                >
                  {/* Background decoration */}
                  <div
                    className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{
                      background: api.accentColor.replace("text-", ""),
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`mb-6 inline-block rounded-full p-4 ${api.color} border-2 ${api.borderColor}`}>
                      <Icon className={`h-8 w-8 ${api.accentColor}`} />
                    </div>

                    {/* Title and Description */}
                    <h2 className="mb-3 text-3xl font-bold text-foreground">
                      {api.title}
                    </h2>
                    <p className="mb-8 text-muted-foreground leading-relaxed">
                      {api.description}
                    </p>

                    {/* Routes */}
                    <div className="space-y-3">
                      {api.routes.map((route) => (
                        <Button
                          key={route.href}
                          onClick={() => router.push(route.href)}
                          variant="outline"
                          className="w-full justify-between group/btn"
                        >
                          <span>{route.label}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Features Section */}
          <section className="mt-20 rounded-xl border border-border bg-card/50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
              Características
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {[
                { label: "APIs Múltiples", value: "2+" },
                { label: "Búsqueda Rápida", value: "Instant" },
                { label: "Datos Actualizados", value: "Real-time" },
                { label: "Interfaz Moderna", value: "Responsive" },
              ].map((feature) => (
                <div key={feature.label} className="text-center">
                  <div className="mb-2 text-2xl font-bold text-primary">
                    {feature.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{feature.label}</div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Desarrollado con Next.js, React y APIs públicas
          </p>
        </div>
      </footer>
    </div>
  )
}
