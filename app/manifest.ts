import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SILO — The Last City",
    short_name: "SILO 18",
    description: "An interactive 3D structural archive of Silo 18.",
    start_url: "/",
    display: "standalone",
    background_color: "#080906",
    theme_color: "#080906",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
