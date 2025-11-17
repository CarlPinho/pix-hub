// Em: src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Definimos os dados dos nossos usuários (batendo com o DBeaver)
// Assumindo que o ID de Carlos é 1 e do Analista é 2 (ajuste se for diferente)
const CARLOS_SILVA = {
  id: 1,
  name: "Virginia Fonseca",
  cpf: "123.456.789-00",
  pixKeyType: "CPF",
  pixKey: "123.456.789-00"
};

const ANALISTA_ADMIN = {
  id: 2,
  name: "Admin",
  cpf: "999.888.777-00",
  pixKeyType: "EMAIL",
  pixKey: "analista@pixhub.com"
};

// 2. Definimos os Tipos (Type) para o TypeScript
type User = typeof CARLOS_SILVA;
type AuthContextType = {
  user: User | null;
  login: (userType: 'cliente' | 'analista') => void;
  logout: () => void;
};

// 3. Criamos o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Criamos o Provedor (Provider)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Função de Login
  const login = (userType: 'cliente' | 'analista') => {
    if (userType === 'cliente') {
      setUser(CARLOS_SILVA);
      navigate('/customer'); // Navega para a home do cliente
    } else {
      setUser(ANALISTA_ADMIN);
      navigate('/analyst'); // Navega para o dashboard do analista
    }
  };

  // Função de Logout
  const logout = () => {
    setUser(null);
    navigate('/'); // Navega de volta para o login
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Criamos o Hook 'useAuth'
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};