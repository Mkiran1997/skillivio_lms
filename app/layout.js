"use client";

import { Providers } from "./providers";
import "./globals.css";
import Splash from "@/components/splash";

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        {/* <ColorSchemeScript /> */}
      </head>
      <body >
        <Splash />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
