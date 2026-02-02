"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  // Determinar sección actual
  const isPokemon = pathname.startsWith("/pokemon-search") || pathname.startsWith("/pokemon-catalog")
  const isMovies = pathname.startsWith("/peliculas")
  const isShowcase = pathname.startsWith("/showcase")

  let title = "API Explorer"
  let icon = "🔍"
  let navLinks: Array<{ href: string; label: string }> = []

  if (isPokemon) {
    title = "Pokédex"
    icon = "🎮"
    navLinks = [
      { href: "/pokemon-search", label: "Buscar" },
      { href: "/pokemon-catalog", label: "Catálogo" },
    ]
  } else if (isMovies) {
    title = "Películas"
    icon = "🎬"
    navLinks = [
      { href: "/peliculas", label: "Buscar" },
      { href: "/peliculas/catalogo", label: "Catálogo" },
    ]
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/showcase" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-lg">{icon}</span>
          </div>
          <span className="text-xl font-bold text-foreground">{title}</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(link.href) && link.href !== "/showcase"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {!isShowcase && (
            <Link
              href="/showcase"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              Inicio
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
