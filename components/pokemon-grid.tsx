"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { Search, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PokemonModal } from "@/components/pokemon-modal"
import {
  getPokemonList,
  getPokemonById,
  searchPokemon,
  type PokemonListItem,
  type PokemonData,
} from "@/app/actions"

const typeColors: Record<string, { bg: string; border: string }> = {
  fire: { bg: "bg-orange-500/20", border: "border-orange-500/50" },
  water: { bg: "bg-blue-500/20", border: "border-blue-500/50" },
  grass: { bg: "bg-green-500/20", border: "border-green-500/50" },
  electric: { bg: "bg-yellow-400/20", border: "border-yellow-400/50" },
  ice: { bg: "bg-cyan-300/20", border: "border-cyan-300/50" },
  fighting: { bg: "bg-red-700/20", border: "border-red-700/50" },
  poison: { bg: "bg-purple-500/20", border: "border-purple-500/50" },
  ground: { bg: "bg-amber-600/20", border: "border-amber-600/50" },
  flying: { bg: "bg-indigo-400/20", border: "border-indigo-400/50" },
  psychic: { bg: "bg-pink-500/20", border: "border-pink-500/50" },
  bug: { bg: "bg-lime-500/20", border: "border-lime-500/50" },
  rock: { bg: "bg-stone-500/20", border: "border-stone-500/50" },
  ghost: { bg: "bg-purple-700/20", border: "border-purple-700/50" },
  dragon: { bg: "bg-indigo-600/20", border: "border-indigo-600/50" },
  dark: { bg: "bg-neutral-700/20", border: "border-neutral-700/50" },
  steel: { bg: "bg-slate-400/20", border: "border-slate-400/50" },
  fairy: { bg: "bg-pink-300/20", border: "border-pink-300/50" },
  normal: { bg: "bg-gray-400/20", border: "border-gray-400/50" },
}

const typeColorsBadge: Record<string, { bg: string; text: string }> = {
  fire: { bg: "bg-orange-500", text: "text-white" },
  water: { bg: "bg-blue-500", text: "text-white" },
  grass: { bg: "bg-green-500", text: "text-white" },
  electric: { bg: "bg-yellow-400", text: "text-black" },
  ice: { bg: "bg-cyan-300", text: "text-black" },
  fighting: { bg: "bg-red-700", text: "text-white" },
  poison: { bg: "bg-purple-500", text: "text-white" },
  ground: { bg: "bg-amber-600", text: "text-white" },
  flying: { bg: "bg-indigo-400", text: "text-white" },
  psychic: { bg: "bg-pink-500", text: "text-white" },
  bug: { bg: "bg-lime-500", text: "text-black" },
  rock: { bg: "bg-stone-500", text: "text-white" },
  ghost: { bg: "bg-purple-700", text: "text-white" },
  dragon: { bg: "bg-indigo-600", text: "text-white" },
  dark: { bg: "bg-neutral-700", text: "text-white" },
  steel: { bg: "bg-slate-400", text: "text-black" },
  fairy: { bg: "bg-pink-300", text: "text-black" },
  normal: { bg: "bg-gray-400", text: "text-black" },
}

const pokemonTypes = [
  { value: "all", label: "Todos los tipos" },
  { value: "fire", label: "Fuego" },
  { value: "water", label: "Agua" },
  { value: "grass", label: "Planta" },
  { value: "electric", label: "Eléctrico" },
  { value: "ice", label: "Hielo" },
  { value: "fighting", label: "Lucha" },
  { value: "poison", label: "Veneno" },
  { value: "ground", label: "Tierra" },
  { value: "flying", label: "Volador" },
  { value: "psychic", label: "Psíquico" },
  { value: "bug", label: "Bicho" },
  { value: "rock", label: "Roca" },
  { value: "ghost", label: "Fantasma" },
  { value: "dragon", label: "Dragón" },
  { value: "dark", label: "Siniestro" },
  { value: "steel", label: "Acero" },
  { value: "fairy", label: "Hada" },
  { value: "normal", label: "Normal" },
]

const ITEMS_PER_PAGE = 24

export function PokemonGrid() {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isListPending, startListTransition] = useTransition()
  const [isDetailPending, startDetailTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null)

  const fetchList = useCallback((offset: number, type: string) => {
    startListTransition(async () => {
      setError(null)
      const result = await getPokemonList(offset, ITEMS_PER_PAGE, type)
      if (result.status === "success") {
        setPokemonList(result.data)
        setTotal(result.total)
      } else {
        setError(result.message)
      }
    })
  }, [])

  useEffect(() => {
    fetchList(page * ITEMS_PER_PAGE, typeFilter)
  }, [page, typeFilter, fetchList])

  const handleTypeChange = (value: string) => {
    setTypeFilter(value)
    setPage(0)
  }

  const handlePokemonClick = (id: number) => {
    setModalOpen(true)
    setSelectedPokemon(null)
    startDetailTransition(async () => {
      const result = await getPokemonById(id)
      if (result.status === "success") {
        setSelectedPokemon(result.data)
      }
    })
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setModalOpen(true)
    setSelectedPokemon(null)
    startDetailTransition(async () => {
      const result = await searchPokemon(searchQuery)
      if (result.status === "success") {
        setSelectedPokemon(result.data)
      }
    })
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
            Buscar
          </Button>
        </div>

        <Select value={typeFilter} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            {pokemonTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="mt-4 text-lg font-medium text-foreground">{error}</p>
          <Button
            onClick={() => fetchList(page * ITEMS_PER_PAGE, typeFilter)}
            variant="outline"
            className="mt-4 bg-transparent"
          >
            Reintentar
          </Button>
        </div>
      )}

      {isListPending ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <Skeleton className="mx-auto h-24 w-24 rounded-full" />
              <Skeleton className="mx-auto mt-3 h-4 w-20" />
              <div className="mt-2 flex justify-center gap-1">
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !error && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {pokemonList.map((pokemon) => {
              const primaryType = pokemon.types[0]
              const colors = typeColors[primaryType] || typeColors.normal
              
              return (
                <button
                  key={pokemon.id}
                  onClick={() => handlePokemonClick(pokemon.id)}
                  className={`group cursor-pointer rounded-xl border ${colors.border} ${colors.bg} p-4 transition-all hover:scale-105 hover:shadow-lg`}
                >
                  <div className="relative mx-auto h-24 w-24">
                    <img
                      src={pokemon.sprite || "/placeholder.svg"}
                      alt={pokemon.name}
                      className="h-full w-full object-contain drop-shadow-md transition-transform group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    #{String(pokemon.id).padStart(4, "0")}
                  </p>
                  <p className="text-center text-sm font-semibold capitalize text-foreground">
                    {pokemon.name}
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {pokemon.types.map((type) => {
                      const badgeColors = typeColorsBadge[type] || typeColorsBadge.normal
                      return (
                        <span
                          key={type}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${badgeColors.bg} ${badgeColors.text}`}
                        >
                          {type}
                        </span>
                      )
                    })}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isListPending}
              className="bg-transparent"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1 || isListPending}
              className="bg-transparent"
            >
              Siguiente
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      <PokemonModal
        pokemon={selectedPokemon}
        isLoading={isDetailPending}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
