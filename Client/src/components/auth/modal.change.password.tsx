'use client';

import { useHasMounted } from '@/utils/customHook';
import { Button, Form, Input, Modal, Steps } from 'antd';
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { sendRequest } from '@/utils/api';
import { useNotification } from '@/Hooks/useNotification';
import NotificationContainer from '@/components/NotificationContainer';

const ModalChangePassword = (props: any) => {
    const { isModalOpen, setIsModalOpen } = props;
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userEmail, setUserEmail] = useState('');

    // Sử dụng custom notification
    const { notifications, removeNotification, error, success } = useNotification();

    const hasMounted = useHasMounted();

    if (!hasMounted) return <></>;

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-password`,
            method: 'POST',
            body: {
                email,
            },
        });

        if (res?.data) {
            setUserEmail(res?.data?.email);
            setCurrent(1);
            success('Email đã được gửi', 'Vui lòng kiểm tra email của bạn để lấy mã xác thực');
        } else {
            // Thay thế notification.error bằng custom notification
            error('Lỗi gửi email', res?.message || 'Không thể gửi email khôi phục mật khẩu');
        }
    };

    const onFinishStep1 = async (values: any) => {
        const { code, password, confirmPassword } = values;
        if (password !== confirmPassword) {
            error('Lỗi xác thực', 'Mật khẩu và mật khẩu xác nhận không khớp');
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/change-password`,
            method: 'POST',
            body: {
                code,
                password,
                confirmPassword,
                email: userEmail,
            },
        });

        if (res?.data) {
            setCurrent(2);
            success('Đổi mật khẩu thành công', 'Tài khoản của bạn đã được cập nhật mật khẩu mới');
        } else {
            // Thay thế notification.error bằng custom notification
            error('Lỗi đổi mật khẩu', res?.message || 'Không thể thay đổi mật khẩu, vui lòng thử lại');
        }
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setCurrent(0);
        setUserEmail('');
        form.resetFields();
    };

    return (
        <>
            <Modal
                title="Quên mật khẩu"
                open={isModalOpen}
                onOk={resetModal}
                onCancel={resetModal}
                maskClosable={false}
                footer={null}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Email',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            icon: <SolutionOutlined />,
                        },
                        {
                            title: 'Done',
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 && (
                    <>
                        <div style={{ margin: '20px 0' }}>
                            <p>Để thực hiện thay đổi mật khẩu, vui lòng nhập email tài khoản của bạn.</p>
                        </div>
                        <Form
                            name="change-password"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout="vertical"
                            form={form}
                        >
                            <Form.Item label="" name="email">
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {current === 1 && (
                    <>
                        <div style={{ margin: '20px 0' }}>
                            <p>Vui lòng thực hiện đổi mật khẩu</p>
                        </div>

                        <Form name="change-pass-2" onFinish={onFinishStep1} autoComplete="off" layout="vertical">
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your code!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your new password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your new password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Confirm
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {current === 2 && (
                    <div style={{ margin: '20px 0' }}>
                        <p>Tải khoản của bạn đã được thay đổi mật khẩu thành công. Vui lòng đăng nhập lại</p>
                    </div>
                )}
            </Modal>

            {/* Custom Notification Container */}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </>
    );
};

export default ModalChangePassword;
