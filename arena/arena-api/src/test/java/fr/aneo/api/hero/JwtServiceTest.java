package fr.aneo.api.hero;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.Date;

import static org.junit.Assert.*;

public class JwtServiceTest {

    @Test
    public void createJwtToken() {

        Claims claims = Jwts.claims().setSubject("robot");
        claims.put("scopes", Collections.singletonList("ROLE_ADMIN"));
        Date today = new Date();
        String token = Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, "bWFiZGVsaGFtaWQ=")
                .setIssuedAt(today)
                .compact();
        Assertions.assertThat(token).isNotEmpty();
    }
}