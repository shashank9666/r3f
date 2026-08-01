
import "./globals.css";


export const metadata = {
  title: "r3f",
  description: "react three fiber",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
