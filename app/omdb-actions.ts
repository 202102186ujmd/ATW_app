"use server"

export interface MovieData {
  title: string
  year: string
  rated: string
  releaseDate: string
  runtime: string
  genre: string[]
  director: string
  writer: string
  actors: string[]
  plot: string
  language: string
  country: string
  poster: string
  imdbId: string
  imdbRating: string
  type: string
}

export interface MovieListItem {
  title: string
  year: string
  imdbId: string
  type: string
  poster: string
}

export type MovieSearchResult =
  | { status: "success"; data: MovieData }
  | { status: "not_found"; message: string }
  | { status: "error"; message: string }

export type MovieListResult =
  | { status: "success"; data: MovieListItem[]; totalResults: number }
  | { status: "error"; message: string }

async function fetchFromOMDb(params: Record<string, string>): Promise<Record<string, unknown>> {
  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) {
    throw new Error("OMDB_API_KEY no configurada")
  }

  const searchParams = new URLSearchParams({ apikey: apiKey, ...params })
  const response = await fetch(
    `https://www.omdbapi.com/?${searchParams.toString()}`,
    { next: { revalidate: 3600 } }
  )

  const data = await response.json() as Record<string, unknown>
  
  if ((data.Response as string) === "False") {
    const errorMessage = (data.Error as string) || "Error desconocido"
    throw new Error(errorMessage)
  }

  return data
}

export async function searchMovieByTitle(title: string): Promise<MovieSearchResult> {
  if (!title || title.trim() === "") {
    return { status: "error", message: "Por favor ingresa el título de una película" }
  }

  try {
    const data = await fetchFromOMDb({
      t: title.trim(),
      type: "movie",
      plot: "full",
    })

    const movie: MovieData = {
      title: (data.Title as string) || "",
      year: (data.Year as string) || "",
      rated: (data.Rated as string) || "N/A",
      releaseDate: (data.Released as string) || "",
      runtime: (data.Runtime as string) || "",
      genre: ((data.Genre as string) || "").split(",").map((g) => g.trim()),
      director: (data.Director as string) || "",
      writer: (data.Writer as string) || "",
      actors: ((data.Actors as string) || "").split(",").map((a) => a.trim()),
      plot: (data.Plot as string) || "",
      language: (data.Language as string) || "",
      country: (data.Country as string) || "",
      poster: ((data.Poster as string) || "").startsWith("http") ? (data.Poster as string) : "",
      imdbId: (data.imdbID as string) || "",
      imdbRating: (data.imdbRating as string) || "N/A",
      type: (data.Type as string) || "movie",
    }

    return { status: "success", data: movie }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al conectar con OMDb"
    
    if (message.includes("not found")) {
      return { status: "not_found", message: `No se encontró "${title}"` }
    }

    return { status: "error", message }
  }
}

export async function searchMovies(title: string, page: number = 1): Promise<MovieListResult> {
  if (!title || title.trim() === "") {
    return { status: "error", message: "Por favor ingresa un título" }
  }

  try {
    const data = await fetchFromOMDb({
      s: title.trim(),
      type: "movie",
      page: page.toString(),
    })

    const movies: MovieListItem[] = ((data.Search as Record<string, unknown>[]) || []).map((m) => ({
      title: (m.Title as string) || "",
      year: (m.Year as string) || "",
      imdbId: (m.imdbID as string) || "",
      type: (m.Type as string) || "movie",
      poster: ((m.Poster as string) || "").startsWith("http") ? (m.Poster as string) : "",
    }))

    return {
      status: "success",
      data: movies,
      totalResults: parseInt((data.totalResults as string) || "0", 10),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al conectar con OMDb"
    return { status: "error", message }
  }
}
