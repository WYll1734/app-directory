import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "ServerMate Panel",
  description: "Control Panel Login",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
