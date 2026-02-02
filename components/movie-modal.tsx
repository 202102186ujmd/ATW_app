"use client"

import { useState } from "react"
import type { MovieData } from "@/app/omdb-actions"
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
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Film, Star, Globe, Award } from "lucide-react"

interface MovieModalProps {
  movie: MovieData | null
  isLoading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovieModal({ movie, isLoading, open, onOpenChange }: MovieModalProps) {
  const [showFullPlot, setShowFullPlot] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {isLoading ? (
          <div className="space-y-4">
            <VisuallyHidden.Root>
              <DialogTitle>Cargando película</DialogTitle>
              <DialogDescription>Cargando información de la película</DialogDescription>
            </VisuallyHidden.Root>
            <Skeleton className="mx-auto h-64 w-40 rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ) : movie ? (
          <div>
            <DialogHeader>
              <div className="space-y-2">
                <div className="flex items-start gap-4">
                  {movie.poster && (
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="h-48 w-32 rounded-lg object-cover shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
                    <VisuallyHidden.Root>
                      <DialogDescription>
                        Información detallada de {movie.title}
                      </DialogDescription>
                    </VisuallyHidden.Root>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{movie.year}</Badge>
                      {movie.rated !== "N/A" && <Badge variant="outline">{movie.rated}</Badge>}
                      {movie.imdbRating !== "N/A" && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                          <Star className="mr-1 h-3 w-3" />
                          {movie.imdbRating}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      {movie.releaseDate && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{movie.releaseDate}</span>
                        </div>
                      )}
                      {movie.runtime && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Film className="h-4 w-4" />
                          <span>{movie.runtime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="info" className="mt-6 w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info" className="text-xs sm:text-sm">Info</TabsTrigger>
                <TabsTrigger value="cast" className="text-xs sm:text-sm">Elenco</TabsTrigger>
                <TabsTrigger value="details" className="text-xs sm:text-sm">Detalles</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-4 space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Géneros</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g) => (
                      <Badge key={g} variant="secondary">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                {movie.plot && (
                  <div>
                    <h3 className="mb-2 font-semibold">Sinopsis</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {movie.plot}
                    </p>
                  </div>
                )}

                {movie.director && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Director</h3>
                    </div>
                    <p className="text-sm">{movie.director}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cast" className="mt-4 space-y-4">
                {movie.actors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Actores principales</h3>
                    </div>
                    <div className="space-y-2">
                      {movie.actors.map((actor) => (
                        <div
                          key={actor}
                          className="flex items-center gap-3 rounded-lg bg-secondary p-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{actor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="mt-4 space-y-4">
                {movie.writer && (
                  <div className="rounded-lg bg-secondary p-4">
                    <h4 className="mb-2 text-sm font-semibold">Guionista/Escritor</h4>
                    <p className="text-sm text-muted-foreground">{movie.writer}</p>
                  </div>
                )}

                {movie.language && (
                  <div className="rounded-lg bg-secondary p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-semibold">Idioma</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{movie.language}</p>
                  </div>
                )}

                {movie.country && (
                  <div className="rounded-lg bg-secondary p-4">
                    <h4 className="mb-2 text-sm font-semibold">País</h4>
                    <p className="text-sm text-muted-foreground">{movie.country}</p>
                  </div>
                )}

                {movie.imdbId && (
                  <div className="rounded-lg bg-secondary p-4">
                    <a
                      href={`https://www.imdb.com/title/${movie.imdbId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Ver en IMDb
                      <span className="text-xs">↗</span>
                    </a>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
