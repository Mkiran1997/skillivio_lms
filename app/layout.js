"use client";

import { Providers } from "./providers";
import "./globals.css";
import Splash from "@/components/splash";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          rel="stylesheet"
        />
        {/* <ColorSchemeScript /> */}
      </head>
      <body>
        <Splash />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
