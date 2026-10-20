package com.engineersveedu.backend.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class JwtUtil {

    public static String generateToken(String email, String role) {
        String data = email + ":" + role + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(data.getBytes(StandardCharsets.UTF_8));
    }

    public static String getEmailFromToken(String token) {
        try {
            String cleanToken = extractToken(token);
            String decoded = new String(Base64.getDecoder().decode(cleanToken), StandardCharsets.UTF_8);
            return decoded.split(":")[0];
        } catch (Exception e) {
            return null;
        }
    }

    public static String getRoleFromToken(String token) {
        try {
            String cleanToken = extractToken(token);
            String decoded = new String(Base64.getDecoder().decode(cleanToken), StandardCharsets.UTF_8);
            return decoded.split(":")[1];
        } catch (Exception e) {
            return null;
        }
    }

    public static boolean validateToken(String token) {
        if (token == null || token.isEmpty()) return false;
        try {
            String cleanToken = extractToken(token);
            String decoded = new String(Base64.getDecoder().decode(cleanToken), StandardCharsets.UTF_8);
            String[] parts = decoded.split(":");
            return parts.length >= 3;
        } catch (Exception e) {
            return false;
        }
    }

    private static String extractToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }
}
