import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";
const USER_ID_KEY = "user_id";

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

export function setUserRole(role: string): void {
    try {
        Cookies.set(ROLE_KEY, role, {
            expires: 7,
        });
    } catch (error) {
        console.error("Error setting user role:", error);
        Cookies.set(ROLE_KEY, role);
    }
}

export function setUserId(userId: string): void {
    try {
        Cookies.set(USER_ID_KEY, userId, {
            expires: 7,
        });
    } catch (error) {
        console.error("Error setting user ID:", error);
        Cookies.set(USER_ID_KEY, userId);
    }
}

export function getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
}

export function getUserRole(): string | undefined {
    return Cookies.get(ROLE_KEY);
}

export function getUserId(): string | undefined {
    return Cookies.get(USER_ID_KEY);
}

export function removeToken(): void {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(ROLE_KEY);
    Cookies.remove(USER_ID_KEY);
}

export function hasToken(): boolean {
    return !!getToken();
}
