import { decodeJwt, type JWTPayload } from "jose";

/**
 * Validates if a JWT token is still valid (not expired)
 * @param token - JWT token string
 * @returns true if token exists and is not expired
 */
export const isTokenValid = (token: string | null | undefined): boolean => {
    if (!token) return false;

    try {
        const decoded: JWTPayload = decodeJwt(token);
        return decoded?.exp ? decoded.exp > Date.now() / 1000 : false;
    } catch {
        return false;
    }
};