import type { ZodError } from "zod";


export function formatZodError(error: ZodError): string {
    if (!error.issues || error.issues.length === 0) {
        return "Invalid Input";
    }

    if (error.issues.path)
}

