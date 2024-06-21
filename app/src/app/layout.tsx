import "./globals.css";

import type { Metadata } from "next";
import { MapboxMap } from "@/components/mapbox/map";
import { MapboxMapProvider } from "@/components/mapbox/mapbox-map-context";
import { DataLayersProvider } from "@/contexts/data-layers";
import { AppFooter } from "@/app/footer";

export const metadata: Metadata = {
  title: "Lake County Mappings",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cmyk">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="h-screen w-screen relative bg-base-200 flex flex-col gap-2">
        <MapboxMapProvider>
          <DataLayersProvider>
            <div className="z-10 relative flex-1 m-8 pointer-events-none">
              {children}
            </div>
          </DataLayersProvider>
          <MapboxMap />
        </MapboxMapProvider>
        <AppFooter />
      </body>
    </html>
  );
}
