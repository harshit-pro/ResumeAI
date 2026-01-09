package com.htech.resumemaker.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component

@Slf4j // this annotation is used to generate a logger field in the class
// RequiredArgsConstructor is a Lombok annotation that generates a constructor with required arguments
public class ClerkJwksProvider {
    // this class is used to fetch and cache the JSON Web Key Set (JWKS) from Clerk
    // for JWT validation.
    // It retrieves public keys used to verify JWT tokens issued by Clerk.
    // with the help of this class, we can validate JWT tokens without needing to
    // store the public keys in our application, as they are fetched dynamically
    // in simple words is class ka kaam hai Clerk se JSON Web Key Set (JWKS) fetch karna
    // aur cache karna, taaki JWT tokens ko validate kar sakein.

    /**
     * The URL to fetch the JSON Web Key Set (JWKS) for Clerk authentication.
     * This URL is used to validate JWT tokens issued by Clerk.
     */
    @Value("${clerk.jwks.url}")
    String jwksUrl;
   public ClerkJwksProvider() {

    }
    private Map<String, PublicKey> keyCache = new HashMap<>(); // Cache to store fetched keys->
    // keys means kid and PublicKey that contains the actual public key which is used to verify the JWT signature
    private long lastFetchTime=0;
    private static final long CACHE_EXPIRY_TIME = 3600000; // 1 hour in milliseconds Time to live

    public PublicKey getPublicKey(String kid) throws Exception {
        if (shouldRefreshCache(kid)) {
            synchronized (this) {
                if (shouldRefreshCache(kid)) {
                    refreshKeys();
                }
            }
        }
        return keyCache.get(kid);
    }
    private boolean shouldRefreshCache(String kid) {
        return !keyCache.containsKey(kid) ||
                (System.currentTimeMillis() - lastFetchTime > CACHE_EXPIRY_TIME);
    }
    // Logic to fetch the  JWKS from the jwksUrl and populate keyCache
    // This method should be called periodically or when a key is not found in the cache
    private void refreshKeys() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode jwks = mapper.readTree(new URL(jwksUrl));
            JsonNode keys = jwks.get("keys");
            Map<String, PublicKey> newKeys = new HashMap<>();
            for (JsonNode keyNode : keys) {
                String kid = keyNode.get("kid").asText();
                if ("RSA".equals(keyNode.get("kty").asText()) &&
                        "RS256".equals(keyNode.get("alg").asText())) {
                    newKeys.put(kid, createPublicKey(
                            keyNode.get("n").asText(),
                            keyNode.get("e").asText()
                    ));
                }
            }

            keyCache.clear();
            keyCache.putAll(newKeys);
            lastFetchTime = System.currentTimeMillis();

        } catch (Exception e) {
            log.error("Failed to refresh JWKS keys", e);
            throw new RuntimeException("Failed to refresh JWKS keys", e);
        }
    }
    private PublicKey createPublicKey(String modulus, String exponent) throws Exception {
        byte[] modBytes = Base64.getUrlDecoder().decode(modulus);
        byte[] expBytes = Base64.getUrlDecoder().decode(exponent);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(
                new BigInteger(1, modBytes),
                new BigInteger(1, expBytes)
        );
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }
}

