'use client';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authenticate } from '@/utils/action';
import { useRouter } from 'next/navigation';
import ModalReactive from './modal.reactive';
import { useState } from 'react';
import ModalChangePassword from './modal.change.password';
import { useNotification } from '@/Hooks/useNotification';
import NotificationContainer from '@/components/NotificationContainer';

const Login = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [changePassword, setChangePassword] = useState(false);

    // Sử dụng custom notification
    const { notifications, removeNotification, error, success } = useNotification();

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setUserEmail('');

        const res = await authenticate(username, password);

        if (res?.error) {
            if (res?.code === 2) {
                setIsModalOpen(true);
                setUserEmail(username);
                return;
            }
            // Thay thế notification.error bằng custom notification
            error('Error login', res?.error);
        } else {
            success('Đăng nhập thành công!', 'Chuyển hướng đến dashboard...');
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
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        Login
                                    </Button>
                                    <Button type="link" onClick={() => setChangePassword(true)}>
                                        Quên mật khẩu ?
                                    </Button>
                                </div>
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
            <ModalReactive isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userEmail={userEmail} />
            <ModalChangePassword isModalOpen={changePassword} setIsModalOpen={setChangePassword} />

            {/* Custom Notification Container */}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </>
    );
};

export default Login;
