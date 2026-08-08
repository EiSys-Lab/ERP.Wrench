import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — merge de classes Tailwind com resolução de conflitos.
 * Ponto de entrada canônico para composição de className.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
