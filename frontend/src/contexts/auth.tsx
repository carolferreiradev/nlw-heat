import { createContext, ReactNode, useEffect, useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { api } from "../services/api";

const MySwal = withReactContent(Swal);

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
};

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthContextdata = {
  user: User | null;
  signInURL: string;
  signOut: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextdata);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=CHAVE_GITHUB_AQUI`;

  async function signIn(githubCode: string) {
    try {
      const response = await api.post<AuthResponse>("authenticate", {
        code: githubCode,
      });

      const { token, user } = response.data;

      localStorage.setItem("@dowhile:token", token);

      api.defaults.headers.common.authorization = `Bearer ${token}`;
      
      setUser(user);
    } catch (error) {
      await MySwal.fire({
        title: "",
        html: <i>Ocorreu um erro ao tentar logar na aplicação.</i>,
        icon: "error",
        timer: 4000,
      });
    }
  }

  async function signOut() {
    try {
      setUser(null);
      localStorage.removeItem("@dowhile:token");
      await MySwal.fire({
        title: "",
        html: <i>Logout show</i>,
        icon: "success",
        timer: 4000,
      });
    } catch (error) {
      await MySwal.fire({
        title: "",
        html: <i>Ocorreu um erro ao tentar sair da aplicação.</i>,
        icon: "error",
        timer: 4000,
      });
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("@dowhile:token");

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      api.get<User>("profile").then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("signin/callback?code=");

      window.history.pushState({}, "", urlWithoutCode);
      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInURL, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
