import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getGreetings(hour: number): string {
  if (hour < 0 || hour > 23 || !Number.isInteger(hour)) {
    throw new Error("Invalid hour")
  }
  if (hour >= 5 && hour < 12) return 'Good Morning, did you get your coffee?'
  if (hour >= 12 && hour < 18) return 'Good Afternoon, hope you had a good lunch'
  if (hour >= 18 && hour < 22) return "Good Evening, winding down?"
  if (hour >= 22 || hour < 1) return "Night owl? Let's get some stuff done"
  return "You have done enough, now go get some rest"
}