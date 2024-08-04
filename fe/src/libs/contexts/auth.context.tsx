import { createContext, useState, useEffect, ReactNode, FC } from 'react';

interface User {
  username: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  authData: { token: string; user: User } | null;
  login: (authData: { token: string; user: User }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authData, setAuthData] = useState<{ token: string; user: User } | null>(() => {
    const data = localStorage.getItem('authData');
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    if (authData) {
      localStorage.setItem('authData', JSON.stringify(authData));
    } else {
      console.log("removeeee");
      
      localStorage.removeItem('authData');
    }
  }, [authData]);

  const login = (data: { token: string; user: User }) => {
    setAuthData(data);
  };

  const logout = () => {
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
