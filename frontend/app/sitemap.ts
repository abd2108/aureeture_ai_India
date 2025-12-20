import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const routes = [
    "/",
    "/enterprise",
    "/contact",
    "/continue",
    "/velocity-cohort",
    "/policies/privacy-policy",
    "/policies/terms",
    "/policies/refund-cancellation",
    "/policies/return-policy",
  ]

  const now = new Date()

  return routes.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }))
}
