"use server"

export interface PokemonAbility {
  name: string
  isHidden: boolean
}

export interface PokemonMove {
  name: string
  levelLearnedAt: number
}

export interface PokemonHeldItem {
  name: string
  rarity: number
}

export interface PokemonData {
  id: number
  name: string
  sprite: string
  spriteShiny: string | null
  spriteFront: string | null
  spriteBack: string | null
  types: string[]
  weight: number
  height: number
  abilities: PokemonAbility[]
  mainAbility: string
  baseExperience: number
  moves: PokemonMove[]
  heldItems: PokemonHeldItem[]
  cryUrl: string | null
  games: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
}

export interface PokemonListItem {
  id: number
  name: string
  sprite: string
  types: string[]
}

export type SearchResult =
  | { status: "success"; data: PokemonData }
  | { status: "not_found"; message: string }
  | { status: "error"; message: string }

export type ListResult =
  | { status: "success"; data: PokemonListItem[]; total: number }
  | { status: "error"; message: string }

function parsePokemonData(data: Record<string, unknown>): PokemonData {
  const abilitiesRaw = data.abilities as { ability: { name: string }; is_hidden: boolean }[]
  const mainAbility = abilitiesRaw.find(a => !a.is_hidden)?.ability.name || abilitiesRaw[0]?.ability.name || "unknown"
  
  const sprites = data.sprites as Record<string, unknown>
  
  // Parse moves - get level-up moves only, sorted by level
  const movesRaw = data.moves as { 
    move: { name: string }
    version_group_details: { level_learned_at: number; move_learn_method: { name: string } }[]
  }[]
  
  const moves: PokemonMove[] = movesRaw
    .map(m => {
      const levelUpDetail = m.version_group_details.find(d => d.move_learn_method.name === "level-up")
      return levelUpDetail ? {
        name: m.move.name,
        levelLearnedAt: levelUpDetail.level_learned_at
      } : null
    })
    .filter((m): m is PokemonMove => m !== null)
    .sort((a, b) => a.levelLearnedAt - b.levelLearnedAt)
    .slice(0, 12) // Limit to 12 moves
  
  // Parse held items
  const heldItemsRaw = data.held_items as { 
    item: { name: string }
    version_details: { rarity: number }[]
  }[] || []
  
  const heldItems: PokemonHeldItem[] = heldItemsRaw.map(item => ({
    name: item.item.name,
    rarity: item.version_details[0]?.rarity || 0
  }))
  
  // Parse games
  const gameIndices = data.game_indices as { version: { name: string } }[] || []
  const games = [...new Set(gameIndices.map(g => g.version.name))].slice(0, 8)
  
  // Parse cries
  const cries = data.cries as { latest?: string; legacy?: string } | null
  
  return {
    id: data.id as number,
    name: data.name as string,
    sprite: sprites.other?.["official-artwork"]?.front_default as string || sprites.front_default as string,
    spriteShiny: sprites.other?.["official-artwork"]?.front_shiny as string || sprites.front_shiny as string || null,
    spriteFront: sprites.front_default as string || null,
    spriteBack: sprites.back_default as string || null,
    types: (data.types as { type: { name: string } }[]).map(t => t.type.name),
    weight: (data.weight as number) / 10,
    height: (data.height as number) / 10,
    abilities: abilitiesRaw.map(a => ({ name: a.ability.name, isHidden: a.is_hidden })),
    mainAbility,
    baseExperience: (data.base_experience as number) || 0,
    moves,
    heldItems,
    cryUrl: cries?.latest || cries?.legacy || null,
    games,
    stats: {
      hp: (data.stats as { base_stat: number }[])[0].base_stat,
      attack: (data.stats as { base_stat: number }[])[1].base_stat,
      defense: (data.stats as { base_stat: number }[])[2].base_stat,
      specialAttack: (data.stats as { base_stat: number }[])[3].base_stat,
      specialDefense: (data.stats as { base_stat: number }[])[4].base_stat,
      speed: (data.stats as { base_stat: number }[])[5].base_stat,
    },
  }
}

export async function searchPokemon(name: string): Promise<SearchResult> {
  if (!name || name.trim() === "") {
    return { status: "error", message: "Por favor ingresa un nombre de Pokémon" }
  }

  const pokemonName = name.toLowerCase().trim()

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
      { next: { revalidate: 3600 } }
    )

    if (response.status === 404) {
      return {
        status: "not_found",
        message: `No se encontró ningún Pokémon llamado "${name}"`,
      }
    }

    if (!response.ok) {
      return {
        status: "error",
        message: "Error al conectar con la API",
      }
    }

    const data = await response.json()
    const pokemon = parsePokemonData(data)

    return { status: "success", data: pokemon }
  } catch {
    return {
      status: "error",
      message: "Error de conexión. Verifica tu conexión a internet.",
    }
  }
}

export async function getPokemonById(id: number): Promise<SearchResult> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      return {
        status: "not_found",
        message: `No se encontró el Pokémon #${id}`,
      }
    }

    const data = await response.json()
    const pokemon = parsePokemonData(data)

    return { status: "success", data: pokemon }
  } catch {
    return {
      status: "error",
      message: "Error de conexión. Verifica tu conexión a internet.",
    }
  }
}

export async function getPokemonList(
  offset: number = 0,
  limit: number = 24,
  typeFilter?: string
): Promise<ListResult> {
  try {
    if (typeFilter && typeFilter !== "all") {
      const typeResponse = await fetch(
        `https://pokeapi.co/api/v2/type/${typeFilter}`,
        { next: { revalidate: 3600 } }
      )
      
      if (!typeResponse.ok) {
        return { status: "error", message: "Error al filtrar por tipo" }
      }
      
      const typeData = await typeResponse.json()
      const pokemonOfType = typeData.pokemon.map((p: { pokemon: { name: string; url: string } }) => {
        const urlParts = p.pokemon.url.split("/")
        return {
          id: parseInt(urlParts[urlParts.length - 2]),
          name: p.pokemon.name,
        }
      }).filter((p: { id: number }) => p.id <= 1025)
      
      const total = pokemonOfType.length
      const paginatedPokemon = pokemonOfType.slice(offset, offset + limit)
      
      const detailedPokemon: PokemonListItem[] = await Promise.all(
        paginatedPokemon.map(async (p: { id: number; name: string }) => {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${p.id}`,
            { next: { revalidate: 3600 } }
          )
          const data = await res.json()
          return {
            id: data.id,
            name: data.name,
            sprite: data.sprites.other?.["official-artwork"]?.front_default || data.sprites.front_default,
            types: data.types.map((t: { type: { name: string } }) => t.type.name),
          }
        })
      )
      
      return { status: "success", data: detailedPokemon, total }
    }

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      return { status: "error", message: "Error al obtener la lista de Pokémon" }
    }

    const listData = await response.json()
    const total = Math.min(listData.count, 1025)

    const detailedPokemon: PokemonListItem[] = await Promise.all(
      listData.results.map(async (p: { name: string; url: string }) => {
        const res = await fetch(p.url, { next: { revalidate: 3600 } })
        const data = await res.json()
        return {
          id: data.id,
          name: data.name,
          sprite: data.sprites.other?.["official-artwork"]?.front_default || data.sprites.front_default,
          types: data.types.map((t: { type: { name: string } }) => t.type.name),
        }
      })
    )

    return { status: "success", data: detailedPokemon, total }
  } catch {
    return {
      status: "error",
      message: "Error de conexión. Verifica tu conexión a internet.",
    }
  }
}
