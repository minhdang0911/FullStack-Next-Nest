'use client';
import React, { useEffect, useState } from 'react';
import { NotificationItem } from '../Hooks/useNotification';

interface NotificationContainerProps {
    notifications: NotificationItem[];
    onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onRemove }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                maxWidth: '400px',
                pointerEvents: 'none',
            }}
        >
            {notifications.map((notification) => (
                <NotificationBox key={notification.id} notification={notification} onRemove={onRemove} />
            ))}
        </div>
    );
};

interface NotificationBoxProps {
    notification: NotificationItem;
    onRemove: (id: string) => void;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({ notification, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Show animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsRemoving(true);
        setTimeout(() => onRemove(notification.id), 300);
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return 'ℹ';
        }
    };

    const getColor = () => {
        switch (notification.type) {
            case 'success':
                return '#52c41a';
            case 'error':
                return '#ff4d4f';
            case 'warning':
                return '#faad14';
            case 'info':
                return '#1890ff';
            default:
                return '#1890ff';
        }
    };

    return (
        <div
            style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                marginBottom: '12px',
                padding: '16px 20px',
                borderLeft: `4px solid ${getColor()}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                minWidth: '320px',
                maxWidth: '400px',
                position: 'relative',
                pointerEvents: 'auto',
                transform: isRemoving ? 'translateX(100%)' : isVisible ? 'translateX(0)' : 'translateX(100%)',
                opacity: isRemoving ? 0 : isVisible ? 1 : 0,
                transition: 'all 0.3s ease-in-out',
            }}
        >
            {/* Icon */}
            <div
                style={{
                    fontSize: '18px',
                    marginTop: '2px',
                    color: getColor(),
                    flexShrink: 0,
                    fontWeight: 'bold',
                }}
            >
                {getIcon()}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        margin: '0 0 4px 0',
                        color: '#262626',
                        lineHeight: 1.4,
                    }}
                >
                    {notification.message}
                </div>
                {notification.description && (
                    <div
                        style={{
                            fontSize: '13px',
                            color: '#595959',
                            lineHeight: 1.4,
                            margin: 0,
                        }}
                    >
                        {notification.description}
                    </div>
                )}
            </div>

            {/* Close Button */}
            <button
                onClick={handleClose}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    color: '#bfbfbf',
                    cursor: 'pointer',
                    padding: '0',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8c8c8c';
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#bfbfbf';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                ×
            </button>
        </div>
    );
};

export default NotificationContainer;
