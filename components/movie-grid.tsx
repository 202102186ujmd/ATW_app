"use client"

import React from "react"
import { Film } from "lucide-react"

import { useEffect, useState } from "react"
import { searchMovies, searchMovieByTitle } from "@/app/omdb-actions"
import type { MovieListItem, MovieData } from "@/app/omdb-actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MovieModal } from "@/components/movie-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

export function MovieGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [movies, setMovies] = useState<MovieListItem[]>([])
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMovie, setLoadingMovie] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const itemsPerPage = 8

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    setError(null)
    setCurrentPage(1)

    const result = await searchMovies(searchTerm, 1)

    if (result.status === "success") {
      setMovies(result.data)
      setTotalResults(result.totalResults)
    } else {
      setError(result.message)
      setMovies([])
    }

    setIsLoading(false)
  }

  const handleSelectMovie = async (movie: MovieListItem) => {
    setLoadingMovie(true)
    const result = await searchMovieByTitle(movie.title)

    if (result.status === "success") {
      setSelectedMovie(result.data)
    } else {
      setError(result.message)
    }

    setLoadingMovie(false)
    setShowModal(true)
  }

  const handleNextPage = async () => {
    const nextPage = currentPage + 1
    setIsLoading(true)
    setError(null)

    const result = await searchMovies(searchTerm, nextPage)

    if (result.status === "success") {
      setMovies(result.data)
      setCurrentPage(nextPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  const handlePrevPage = async () => {
    const prevPage = currentPage - 1
    if (prevPage < 1) return

    setIsLoading(true)
    setError(null)

    const result = await searchMovies(searchTerm, prevPage)

    if (result.status === "success") {
      setMovies(result.data)
      setCurrentPage(prevPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  const totalPages = Math.ceil(totalResults / itemsPerPage)

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-8 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Busca una película..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!searchTerm.trim() || isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3 mb-6">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">Error</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-video rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {movies.map((movie) => (
              <button
                key={movie.imdbId}
                onClick={() => handleSelectMovie(movie)}
                className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
              >
                <div className="aspect-video overflow-hidden rounded-lg bg-secondary">
                  {movie.poster ? (
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Film className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{movie.year}</p>
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || isLoading}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      ) : searchTerm ? (
        <div className="rounded-lg border border-border bg-secondary/50 p-8 text-center">
          <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No se encontraron películas</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-secondary/50 p-8 text-center">
          <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Busca una película para comenzar</p>
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        isLoading={loadingMovie}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </div>
  )
}
