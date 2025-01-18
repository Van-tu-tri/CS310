package cs310.cs_310_v3.Util;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Secret key for signing the JWT
    private final long expirationTimeMs = 24 * 60 * 60 * 1000; // 24 hours

    // Generate a JWT token
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeMs))
                .signWith(key)
                .compact();
    }

    // Validate a JWT token and retrieve the claims
    public String validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject(); // Return the email (subject)
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token has expired", e);
        } catch (MalformedJwtException e) {
            throw new RuntimeException("Invalid token format", e);
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("Unsupported token", e);
        } catch (JwtException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }
}
