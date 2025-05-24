'use client';
import { useState, useCallback } from 'react';

export interface NotificationItem {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    description?: string;
    duration?: number;
}

export const useNotification = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const addNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: NotificationItem = {
            ...notification,
            id,
            duration: notification.duration || 4500,
        };

        setNotifications((prev) => [...prev, newNotification]);

        // Auto remove after duration
        setTimeout(() => {
            removeNotification(id);
        }, newNotification.duration);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const success = useCallback(
        (message: string, description?: string, duration?: number) => {
            addNotification({ type: 'success', message, description, duration });
        },
        [addNotification],
    );

    const error = useCallback(
        (message: string, description?: string, duration?: number) => {
            addNotification({ type: 'error', message, description, duration });
        },
        [addNotification],
    );

    const warning = useCallback(
        (message: string, description?: string, duration?: number) => {
            addNotification({ type: 'warning', message, description, duration });
        },
        [addNotification],
    );

    const info = useCallback(
        (message: string, description?: string, duration?: number) => {
            addNotification({ type: 'info', message, description, duration });
        },
        [addNotification],
    );

    return {
        notifications,
        removeNotification,
        success,
        error,
        warning,
        info,
    };
};
