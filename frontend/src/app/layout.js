import "./globals.css";

export const metadata = {
  title: "BatteryCycle | Recycling Prediction",
  description:
    "Estimate lithium-ion battery recycling cost, circularity, and profit scenarios.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
