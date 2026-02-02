"use client"

import type { PokemonData } from "@/app/actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Ruler, 
  Weight, 
  Sparkles, 
  Zap, 
  Star, 
  Swords, 
  Package, 
  Gamepad2,
  Volume2,
  VolumeX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"

const typeColors: Record<string, { bg: string; text: string }> = {
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

const statColors: Record<string, string> = {
  hp: "bg-red-500",
  attack: "bg-orange-500",
  defense: "bg-blue-500",
  specialAttack: "bg-purple-500",
  specialDefense: "bg-green-500",
  speed: "bg-yellow-400",
}

const statLabels: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defensa",
  specialAttack: "At. Esp.",
  specialDefense: "Def. Esp.",
  speed: "Velocidad",
}

interface PokemonModalProps {
  pokemon: PokemonData | null
  isLoading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PokemonModal({ pokemon, isLoading, open, onOpenChange }: PokemonModalProps) {
  const primaryType = pokemon?.types[0] || "normal"
  const typeColor = typeColors[primaryType] || typeColors.normal
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showShiny, setShowShiny] = useState(false)

  const playCry = () => {
    if (pokemon?.cryUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {isLoading ? (
          <div className="space-y-4">
            <VisuallyHidden.Root>
              <DialogTitle>Cargando Pokémon</DialogTitle>
              <DialogDescription>Cargando información del Pokémon</DialogDescription>
            </VisuallyHidden.Root>
            <Skeleton className="mx-auto h-40 w-40 rounded-full" />
            <Skeleton className="mx-auto h-8 w-48" />
            <div className="flex justify-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
          </div>
        ) : pokemon ? (
          <div className="relative">
            {pokemon.cryUrl && (
              <audio ref={audioRef} src={pokemon.cryUrl} onEnded={handleAudioEnd} />
            )}
            
            <div
              className={`absolute inset-0 ${typeColor.bg} opacity-5 rounded-lg`}
              aria-hidden="true"
            />

            <DialogHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  #{String(pokemon.id).padStart(4, "0")}
                </span>
                <div className="flex items-center gap-2">
                  {pokemon.cryUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={playCry}
                      disabled={isPlaying}
                    >
                      {isPlaying ? (
                        <Volume2 className="h-4 w-4 animate-pulse text-primary" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                  {pokemon.types.map((type) => {
                    const colors = typeColors[type] || typeColors.normal
                    return (
                      <span
                        key={type}
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${colors.bg} ${colors.text}`}
                      >
                        {type}
                      </span>
                    )
                  })}
                </div>
              </div>
            </DialogHeader>

            <div className="relative z-10 mt-4">
              {/* Pokemon Image with Shiny Toggle */}
              <div className="relative mx-auto mb-2 flex h-40 w-40 items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full ${typeColor.bg} opacity-20 blur-2xl`}
                  aria-hidden="true"
                />
                <img
                  src={(showShiny && pokemon.spriteShiny) || pokemon.sprite || "/placeholder.svg"}
                  alt={pokemon.name}
                  className="relative z-10 h-full w-full object-contain drop-shadow-lg transition-all"
                />
              </div>
              
              {pokemon.spriteShiny && (
                <div className="mb-4 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShiny(!showShiny)}
                    className="gap-2 text-xs"
                  >
                    <Sparkles className={`h-3 w-3 ${showShiny ? "text-yellow-400" : "text-muted-foreground"}`} />
                    {showShiny ? "Ver Normal" : "Ver Shiny"}
                  </Button>
                </div>
              )}

              <DialogTitle className="mb-2 text-center text-2xl font-bold capitalize">
                {pokemon.name}
              </DialogTitle>
              <VisuallyHidden.Root>
                <DialogDescription>
                  Información detallada de {pokemon.name}
                </DialogDescription>
              </VisuallyHidden.Root>
              
              {/* Base Experience Badge */}
              <div className="mb-4 flex justify-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
                  <Star className="h-3 w-3" />
                  {pokemon.baseExperience} EXP Base
                </span>
              </div>

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                  <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
                  <TabsTrigger value="moves" className="text-xs">Moves</TabsTrigger>
                  <TabsTrigger value="more" className="text-xs">Más</TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value="info" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                        <Ruler className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Altura</p>
                        <p className="font-semibold text-foreground">{pokemon.height} m</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
                        <Weight className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Peso</p>
                        <p className="font-semibold text-foreground">{pokemon.weight} kg</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-secondary p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">Habilidades</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.abilities.map((ability) => (
                        <span
                          key={ability.name}
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            ability.name === pokemon.mainAbility
                              ? "bg-primary text-primary-foreground"
                              : ability.isHidden
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {ability.name.replace(/-/g, " ")}
                          {ability.isHidden && " (oculta)"}
                        </span>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="mt-4 space-y-3">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>Total: {Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}</span>
                  </div>
                  {Object.entries(pokemon.stats).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-20 text-xs font-medium text-muted-foreground">
                        {statLabels[key]}
                      </span>
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full ${statColors[key]} transition-all duration-700 ease-out`}
                          style={{ width: `${(value / 255) * 100}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-bold text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </TabsContent>

                {/* Moves Tab */}
                <TabsContent value="moves" className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Swords className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Movimientos por nivel</span>
                  </div>
                  {pokemon.moves.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {pokemon.moves.map((move) => (
                        <div
                          key={move.name}
                          className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2"
                        >
                          <span className="text-xs capitalize text-foreground">
                            {move.name.replace(/-/g, " ")}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Nv.{move.levelLearnedAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground">
                      No hay movimientos por nivel
                    </p>
                  )}
                </TabsContent>

                {/* More Tab */}
                <TabsContent value="more" className="mt-4 space-y-4">
                  {/* Held Items */}
                  {pokemon.heldItems.length > 0 && (
                    <div className="rounded-lg bg-secondary p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold text-foreground">Objetos Equipables</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pokemon.heldItems.map((item) => (
                          <span
                            key={item.name}
                            className="rounded-full bg-muted px-3 py-1 text-xs capitalize text-muted-foreground"
                          >
                            {item.name.replace(/-/g, " ")} ({item.rarity}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Games */}
                  {pokemon.games.length > 0 && (
                    <div className="rounded-lg bg-secondary p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold text-foreground">Aparece en</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pokemon.games.map((game) => (
                          <span
                            key={game}
                            className="rounded-full bg-muted px-2 py-1 text-xs capitalize text-muted-foreground"
                          >
                            {game.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sprites Gallery */}
                  <div className="rounded-lg bg-secondary p-4">
                    <h4 className="mb-3 text-sm font-semibold text-foreground">Sprites</h4>
                    <div className="flex justify-center gap-4">
                      {pokemon.spriteFront && (
                        <div className="text-center">
                          <img
                            src={pokemon.spriteFront || "/placeholder.svg"}
                            alt="Front sprite"
                            className="h-16 w-16 object-contain"
                          />
                          <span className="text-[10px] text-muted-foreground">Frente</span>
                        </div>
                      )}
                      {pokemon.spriteBack && (
                        <div className="text-center">
                          <img
                            src={pokemon.spriteBack || "/placeholder.svg"}
                            alt="Back sprite"
                            className="h-16 w-16 object-contain"
                          />
                          <span className="text-[10px] text-muted-foreground">Espalda</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
