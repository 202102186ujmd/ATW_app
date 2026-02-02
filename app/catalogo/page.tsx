import { Navbar } from "@/components/navbar"
import { PokemonGrid } from "@/components/pokemon-grid"

export const metadata = {
  title: "Catálogo - Pokédex",
  description: "Explora todos los Pokémon en el catálogo completo",
}

export default function CatalogoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Catálogo Pokémon
            </h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              Explora todos los Pokémon y filtra por tipo
            </p>
          </div>

          <PokemonGrid />
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Datos proporcionados por{" "}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              PokeAPI
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
