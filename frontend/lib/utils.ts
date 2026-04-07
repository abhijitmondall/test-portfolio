import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMM yyyy");
}

export function formatDateLong(date: string | Date) {
  return format(new Date(date), "MMMM d, yyyy");
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const TECH_COLORS: Record<string, string> = {
  "React.js": "#61DAFB",
  "Next.js": "#ffffff",
  "Node.js": "#68A063",
  "TypeScript": "#3178C6",
  "JavaScript": "#F7DF1E",
  "MongoDB": "#47A248",
  "PostgreSQL": "#336791",
  "Prisma": "#2D3748",
  "Express.js": "#ffffff",
  "Tailwind CSS": "#38BDF8",
  "Stripe": "#635BFF",
  "GraphQL": "#E10098",
  default: "#E8FF00",
};

export function getTechColor(tech: string): string {
  return TECH_COLORS[tech] || TECH_COLORS.default;
}
