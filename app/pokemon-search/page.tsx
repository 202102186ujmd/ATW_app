import { Navbar } from "@/components/navbar"
import { PokemonSearch } from "@/components/pokemon-search"

export const metadata = {
  title: "Buscar Pokémon - Pokédex",
  description: "Busca información detallada de Pokémon",
}

export default function PokemonSearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="mb-10 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Encuentra tu Pokémon
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Busca cualquier Pokémon por nombre o número para ver sus estadísticas
            </p>
          </div>

          <PokemonSearch />
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
