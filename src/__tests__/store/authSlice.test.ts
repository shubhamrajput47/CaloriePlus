/**
 * Auth slice tests
 */
import authReducer, { setCredentials, logout, updateProfile } from '@store/slices/authSlice';

describe('authSlice', () => {
  const mockUser = {
    id: '1',
    email: 'test@test.com',
    dailyCalorieGoal: 2000,
  };

  it('initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('setCredentials sets user and token', () => {
    const state = authReducer(
      undefined,
      setCredentials({ user: mockUser, token: 'token123' }),
    );
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('token123');
    expect(state.isAuthenticated).toBe(true);
  });

  it('logout resets state', () => {
    const state = authReducer(
      { user: mockUser, token: 'x', isAuthenticated: true, isLoading: false, error: null },
      logout(),
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('updateProfile merges into user', () => {
    const state = authReducer(
      { user: mockUser, token: 'x', isAuthenticated: true, isLoading: false, error: null },
      updateProfile({ dailyCalorieGoal: 2200 }),
    );
    expect(state.user?.dailyCalorieGoal).toBe(2200);
  });
});
