import "./globals.css";

export const metadata = {
  title: "Bookmark Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 p-6">{children}</body>
    </html>
  );
}
