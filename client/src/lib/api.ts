//Base fetch helper

const BASE_URL = 'http://localhost:3000'

export async function apiClient(path: string, options?: RequestInit) {
    //Calls fetch with http://localhost:3000 + path
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
    }
    return data
}

//call apiClient with POST /auth/signup and { email, password }
export function signup(email: string, password: string) {
    return apiClient('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })
}

//call apiClient with POST /auth/verifyEmail and {email, code}
export function verifyEmail(email: string, code: string) {
    return apiClient('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, code })
    })
}

//call apiClient with POST /auth/resendCode and {email}
export function resendCode(email: string) {
    return apiClient('/auth/resend-code', {
        method: 'POST',
        body: JSON.stringify({ email })
    })
}

//call apiClient with POST /auth/signin and {email, passowrd}
export function signin(email: string, password: string) {
    return apiClient('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })
}

//call apiClient with POST /auth/signin
export function signout() {
    return apiClient('/auth/signout', {
        method: 'POST',
    })
}