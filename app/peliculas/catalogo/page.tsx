import { Navbar } from "@/components/navbar"
import { MovieGrid } from "@/components/movie-grid"

export const metadata = {
  title: "Catálogo de Películas - OMDb",
  description: "Explora nuestro catálogo de películas",
}

export default function MoviesCatalogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="mb-10 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Catálogo de Películas
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Busca y explora películas en nuestro catálogo completo
            </p>
          </div>

          <MovieGrid />
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Datos proporcionados por{" "}
            <a
              href="https://www.omdbapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              OMDb
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
