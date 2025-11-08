import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterData, AuthState } from '../types';
// import { authApi } from '../services/api/authApi';
// import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKENS'; payload: AuthTokens | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGOUT':
      return { user: null, tokens: null, loading: false, error: null };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  tokens: null,
  loading: false, // Set to false for now since we don't have backend yet
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock authentication for now
  useEffect(() => {
    // Simulate checking for existing tokens
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Mock login - replace with real API call
      console.log('Mock login:', credentials);
      
      // Simulate a successful login
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        dateJoined: new Date().toISOString(),
        isEmailVerified: true,
      };

      const mockTokens: AuthTokens = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      };

      localStorage.setItem('authTokens', JSON.stringify(mockTokens));

      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_TOKENS', payload: mockTokens });
      
      console.log('Login successful!');
    } catch (error: any) {
      const errorMessage = 'Login failed - backend not connected';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Mock registration - replace with real API call
      console.log('Mock register:', data);
      
      // Simulate successful registration
      const mockUser: User = {
        id: '1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateJoined: new Date().toISOString(),
        isEmailVerified: false,
      };

      const mockTokens: AuthTokens = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      };

      localStorage.setItem('authTokens', JSON.stringify(mockTokens));

      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_TOKENS', payload: mockTokens });
      
      console.log('Registration successful!');
    } catch (error: any) {
      const errorMessage = 'Registration failed - backend not connected';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('authTokens');
    dispatch({ type: 'LOGOUT' });
    console.log('Logged out successfully');
  };

  const refreshToken = async () => {
    try {
      if (!state.tokens?.refresh) {
        throw new Error('No refresh token available');
      }

      // Mock token refresh
      console.log('Mock token refresh');
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 