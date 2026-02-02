import { Navbar } from "@/components/navbar"
import { MovieSearch } from "@/components/movie-search"

export const metadata = {
  title: "Buscar Películas - OMDb",
  description: "Busca información detallada de películas",
}

export default function MoviesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="mb-10 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Busca tu Película
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Encuentra información detallada sobre cualquier película usando OMDb
            </p>
          </div>

          <MovieSearch />
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
