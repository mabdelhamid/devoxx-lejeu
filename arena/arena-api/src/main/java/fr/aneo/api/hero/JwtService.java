package fr.aneo.api.hero;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;

/**
 * Created by eeugene on 25/03/2017.
 */
@Log
@Service
public class JwtService {
    private final String token;

    public JwtService(@Value("${aneo.security.jwt.secretKey}") String jwtSecretKey) {
        log.info("secretyKey is : " + jwtSecretKey);
        token = createJwtToken(jwtSecretKey);
    }

    protected String createJwtToken(String secretKey) {
        Claims claims = Jwts.claims().setSubject("robot");
        claims.put("scopes", Collections.singletonList("ROLE_ADMIN"));
        Date today = new Date();
        String token = Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .setIssuedAt(today)
                .compact();
        return token;
    }

    public String getToken() {
        return token;
    }
}
