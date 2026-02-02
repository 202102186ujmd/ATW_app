"use client"

import React from "react"

import { useState } from "react"
import { searchMovieByTitle } from "@/app/omdb-actions"
import type { MovieData } from "@/app/omdb-actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MovieModal } from "@/components/movie-modal"
import { Search, AlertCircle } from "lucide-react"

export function MovieSearch() {
  const [title, setTitle] = useState("")
  const [movie, setMovie] = useState<MovieData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setNotFound(false)
    setMovie(null)

    const result = await searchMovieByTitle(title)

    if (result.status === "success") {
      setMovie(result.data)
      setShowModal(true)
    } else if (result.status === "not_found") {
      setNotFound(true)
      setError(result.message)
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-8 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Busca una película..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-12 h-12"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!title.trim() || isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">{notFound ? "No encontrada" : "Error"}</h3>
            <p className="text-sm text-destructive/80">{error}</p>
            {notFound && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTitle("")}
                className="mt-2 h-8 text-xs"
              >
                Ir al catálogo
              </Button>
            )}
          </div>
        </div>
      )}

      <MovieModal
        movie={movie}
        isLoading={isLoading}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </div>
  )
}
