"use client"

import type { PokemonData } from "@/app/actions"
import { Ruler, Weight, Zap, Sparkles } from "lucide-react"

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

export function PokemonCard({ pokemon }: { pokemon: PokemonData }) {
  const primaryType = pokemon.types[0]
  const typeColor = typeColors[primaryType] || typeColors.normal

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl">
      {/* Background gradient based on primary type */}
      <div
        className={`absolute inset-0 ${typeColor.bg} opacity-10`}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Header: ID and Types */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            #{String(pokemon.id).padStart(4, "0")}
          </span>
          <div className="flex gap-2">
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

        {/* Pokemon Image */}
        <div className="relative mx-auto mb-4 flex h-48 w-48 items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full ${typeColor.bg} opacity-20 blur-2xl`}
            aria-hidden="true"
          />
          <img
            src={pokemon.sprite || "/placeholder.svg"}
            alt={pokemon.name}
            className="relative z-10 h-full w-full object-contain drop-shadow-lg transition-transform hover:scale-110"
          />
        </div>

        {/* Pokemon Name */}
        <h2 className="mb-4 text-center text-3xl font-bold capitalize text-foreground">
          {pokemon.name}
        </h2>

        {/* Physical Info */}
        <div className="mb-6 grid grid-cols-2 gap-3">
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

        {/* Abilities */}
        <div className="mb-6 rounded-lg bg-secondary p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Habilidades</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability) => (
              <span
                key={ability.name}
                className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                  ability.name === pokemon.mainAbility
                    ? "bg-primary text-primary-foreground"
                    : ability.isHidden
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {ability.name.replace(/-/g, " ")}
                {ability.isHidden && (
                  <span className="ml-1 inline-flex items-center">
                    <Sparkles className="h-3 w-3" />
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Estadísticas Base
          </h3>
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
        </div>
      </div>
    </div>
  )
}
