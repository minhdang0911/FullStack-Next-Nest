'use client';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authenticate } from '@/utils/action';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const CustomNotification = ({
    message,
    description,
    onClose,
}: {
    message: string;
    description?: string;
    onClose: () => void;
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            style={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 9999,
                minWidth: 300,
                padding: '16px 24px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: 4,
                borderLeft: '5px solid #ff4d4f',
                fontFamily: 'Arial, sans-serif',
                cursor: 'pointer',
            }}
            onClick={onClose}
        >
            <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>{message}</div>
            {description && <div style={{ fontSize: 14, color: '#555' }}>{description}</div>}
        </div>
    );
};

const Login = () => {
    const router = useRouter();
    const [notification, setNotification] = useState<{ message: string; description?: string } | null>(null);

    const onFinish = async (values: any) => {
        const { username, password } = values;

        const res = await authenticate(username, password);
        if (res?.error) {
            setNotification({ message: 'Error login', description: res.error });
            if (res?.code === 2) {
                router.push('/verify');
            }
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <>
            <Row justify={'center'} style={{ marginTop: '30px' }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset
                        style={{
                            padding: '15px',
                            margin: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                        }}
                    >
                        <legend>Đăng Nhập</legend>
                        <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
                            <Form.Item
                                label="Email"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                        <Link href={'/'}>
                            <ArrowLeftOutlined /> Quay lại trang chủ
                        </Link>
                        <Divider />
                        <div style={{ textAlign: 'center' }}>
                            Chưa có tài khoản? <Link href={'/auth/register'}>Đăng ký tại đây</Link>
                        </div>
                    </fieldset>
                </Col>
            </Row>

            {/* Notification tự tạo */}
            {notification && (
                <CustomNotification
                    message={notification.message}
                    description={notification.description}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    );
};

export default Login;
