import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leandro Paiva - Front-End Developer",
  description: "Specialized in Next.js, TypeScript, and modern web development. Building scalable applications with attention to detail and performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}