import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ show: false, message: '', icon: '✓' });

    const showToast = useCallback((message, icon = '✓') => {
        setToast({ show: true, message, icon });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={`toast ${toast.show ? 'show' : ''}`}>
                <span className="toast-icon">{toast.icon}</span>
                <span>{toast.message}</span>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
