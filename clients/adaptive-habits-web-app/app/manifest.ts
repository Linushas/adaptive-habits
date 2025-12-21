import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adaptive Habits",
    short_name: "Adaptive",
    description: "A habit tracker adapts to the user's progress",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F2F2",
    theme_color: "#0C0C0C",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
