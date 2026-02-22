package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

class JwtUtilsTest {

	private JwtUtils jwtUtils;

	private final String secretString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	private final int expirationMs = 3600000;

	@BeforeEach
	void setUp() {
		jwtUtils = new JwtUtils();
		ReflectionTestUtils.setField(jwtUtils, "jwtSecret", secretString);
		ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", expirationMs);
	}

	@Test
	@DisplayName("Valid Token returns true")
	void validateJwtToken_shouldReturnTrue_whenTokenIsValid() {

		String token = Jwts.builder().setSubject("testUser").setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expirationMs))
				.signWith(SignatureAlgorithm.HS512, secretString).compact();

		assertTrue(jwtUtils.validateJwtToken(token));
	}

	@Test
	@DisplayName("SignatureException returns false")
	void validateJwtToken_shouldReturnFalse_whenSignatureException() {

		String wrongSecret = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYA";

		String token = Jwts.builder().setSubject("testUser").setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expirationMs))
				.signWith(SignatureAlgorithm.HS512, wrongSecret).compact();

		assertFalse(jwtUtils.validateJwtToken(token));
	}

	@Test
	@DisplayName("MalformedJwtException returns false")
	void validateJwtToken_shouldReturnFalse_whenMalformedException() {
		assertFalse(jwtUtils.validateJwtToken("malformed token"));
	}

	@Test
	@DisplayName("ExpiredJwtException returns false")
	void validateJwtToken_shouldReturnFalse_whenExpiredException() {

		String token = Jwts.builder().setSubject("testUser").setIssuedAt(new Date(System.currentTimeMillis() - 10000))
				.setExpiration(new Date(System.currentTimeMillis() - 5000))
				.signWith(SignatureAlgorithm.HS512, secretString).compact();

		assertFalse(jwtUtils.validateJwtToken(token));
	}

	@Test
	@DisplayName("UnsupportedJwtException returns false")
	void validateJwtToken_shouldReturnFalse_whenUnsupportedException() {

		// JWT without signature
		String token = Jwts.builder().setSubject("testUser").compact();

		assertFalse(jwtUtils.validateJwtToken(token));
	}

	@Test
	@DisplayName("IllegalArgumentException returns false")
	void validateJwtToken_shouldReturnFalse_whenIllegalArgumentException() {
		assertFalse(jwtUtils.validateJwtToken(""));
		assertFalse(jwtUtils.validateJwtToken(null));
	}

}
