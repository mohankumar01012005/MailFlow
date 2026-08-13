type ClassValue = string | number | null | boolean | undefined;

/**
 * Lightweight class-name combiner. Avoids pulling in clsx/tailwind-merge
 * for a need this small — filters falsy values and joins the rest.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}