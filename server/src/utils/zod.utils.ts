import type { ZodError } from "zod";

export function formatZodError(error: ZodError): string {
    if (!error.issues || error.issues.length === 0) {
        return "Invalid Input"
    }

    // Turn each issue into a single string
    const messages = error.issues.map((issue) => {
        const path = issue.path.map(String).join(".")
        return path !== "" ? `${path}: ${issue.message}` : issue.message
    })

    return messages.join(", ");
}