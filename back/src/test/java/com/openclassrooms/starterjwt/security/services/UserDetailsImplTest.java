package com.openclassrooms.starterjwt.security.services;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class UserDetailsImplTest {

	@Test
	@DisplayName("User Details Implementation Test")
	void equalsTest() {
		UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
		UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();
		UserDetailsImpl user3 = UserDetailsImpl.builder().id(2L).build();

		// 1. Test 'if (this == o)' branch
		assertTrue(user1.equals(user1));

		// 2. Test 'if (o == null)' branch
		assertFalse(user1.equals(null));

		// 3. Test 'getClass() != o.getClass()' branch
		assertFalse(user1.equals("Not a UserDetails object"));

		// 4. Test identical IDs (returns true)
		assertTrue(user1.equals(user2));

		// 5. Test different IDs (returns false)
		assertFalse(user1.equals(user3));
	}

}
