import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um servidor Node autônomo — necessário para a imagem Docker leve.
  output: "standalone",
};

export default nextConfig;
