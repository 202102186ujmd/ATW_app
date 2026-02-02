"use client"

import React from "react"

import { useState, useTransition } from "react"
import { Search, Loader2, AlertCircle, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PokemonCard } from "@/components/pokemon-card"
import { searchPokemon, type SearchResult, type PokemonData } from "@/app/actions"

export function PokemonSearch() {
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<SearchResult | null>(null)
  const [pokemon, setPokemon] = useState<PokemonData | null>(null)

  const handleSearch = () => {
    if (!query.trim()) return

    startTransition(async () => {
      const searchResult = await searchPokemon(query)
      setResult(searchResult)
      if (searchResult.status === "success") {
        setPokemon(searchResult.data)
      } else {
        setPokemon(null)
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar Pokémon por nombre o número..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 rounded-xl border-border bg-card pl-12 pr-4 text-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              disabled={isPending}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isPending || !query.trim()}
            className="h-14 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Buscar"
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-primary/20" />
            </div>
          </div>
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Buscando Pokémon...
          </p>
        </div>
      )}

      {/* Not Found State */}
      {!isPending && result?.status === "not_found" && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            Pokémon no encontrado
          </h3>
          <p className="mt-2 text-center text-muted-foreground">
            {result.message}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Intenta con otro nombre o número de la Pokédex
          </p>
        </div>
      )}

      {/* Error State */}
      {!isPending && result?.status === "error" && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
            <AlertCircle className="h-10 w-10 text-orange-500" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            Error de conexión
          </h3>
          <p className="mt-2 text-center text-muted-foreground">
            {result.message}
          </p>
          <Button
            onClick={handleSearch}
            variant="outline"
            className="mt-4 bg-transparent"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Success State - Pokemon Card */}
      {!isPending && result?.status === "success" && pokemon && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PokemonCard pokemon={pokemon} />
        </div>
      )}

      {/* Initial State - Suggestions */}
      {!isPending && !result && (
        <div className="text-center">
          <p className="text-muted-foreground">
            Prueba buscando: <span className="font-medium text-primary">pikachu</span>,{" "}
            <span className="font-medium text-primary">charizard</span>, o{" "}
            <span className="font-medium text-primary">25</span>
          </p>
        </div>
      )}
    </div>
  )
}
