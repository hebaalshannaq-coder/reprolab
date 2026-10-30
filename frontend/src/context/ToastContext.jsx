import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

const ICONS = { success: "✅", error: "⚠️", info: "ℹ️" };

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const notify = useCallback(
        (message, type = "success") => {
            const id = Date.now() + Math.random();
            setToasts((list) => [...list, { id, message, type }]);
            setTimeout(() => remove(id), 4000);
        },
        [remove]
    );

    return (
        <ToastContext.Provider value={{ notify }}>
            {children}
            <div className="toast-stack">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`app-toast ${t.type}`}
                        onClick={() => remove(t.id)}
                        role="status"
                    >
                        <span>{ICONS[t.type]}</span>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);