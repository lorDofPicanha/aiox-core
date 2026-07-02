import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** clsx + tailwind-merge so conflicting Tailwind utilities resolve correctly. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
