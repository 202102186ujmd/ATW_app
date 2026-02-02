import { Navbar } from "@/components/navbar"
import { PokemonGrid } from "@/components/pokemon-grid"

export const metadata = {
  title: "Catálogo de Pokémon - Pokédex",
  description: "Explora nuestro catálogo de Pokémon",
}

export default function PokemonCatalogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="mb-10 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Catálogo de Pokémon
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Explora todos los Pokémon, filtra por tipo y descubre sus estadísticas
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
