import { createContext, useContext, useEffect, useState } from "react";
import { request } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await request("/auth/me");
                setUser(data.user);
            } catch (error) {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        const data = await request("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        localStorage.setItem("token", data.token);
        setUser(data.user);
    };

    const register = async (name, email, password) => {
        await request("/auth/register", {
            method: "POST",
            body: { name, email, password },
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);