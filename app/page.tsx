import { redirect } from "next/navigation"

export const metadata = {
  title: "API Explorer - Pokédex & Películas",
  description: "Explora múltiples APIs en una sola aplicación",
}

export default function Home() {
  redirect("/showcase")
}
