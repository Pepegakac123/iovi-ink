import "./globals.css";
import Navbar from "@/components/Navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="bg-background"
      >
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
