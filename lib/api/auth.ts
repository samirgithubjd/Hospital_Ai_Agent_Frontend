import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";

export function setToken(token: string): void {
    try {
        Cookies.set(TOKEN_KEY, token, {
            expires: 7, // 7 days
        });
    } catch (error) {
        console.error("Error setting auth token:", error);
        // Fallback: try without options
        Cookies.set(TOKEN_KEY, token);
    }
}

export function getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
}

export function removeToken(): void {
    Cookies.remove(TOKEN_KEY);
}

export function hasToken(): boolean {
    return !!getToken();
}
