'use client';

import { useHasMounted } from '@/utils/customHook';
import { Modal, Steps, Form, Input, Button } from 'antd';
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { sendRequest } from '@/utils/api';

const ModalReactive = (props: any) => {
    const [current, setCurrent] = useState(0);
    const { isModalOpen, setIsModalOpen, userEmail } = props;
    const [userId, setUserId] = useState('');
    const hasMounted = useHasMounted();
    const [form] = Form.useForm();
    useEffect(() => {
        if (userEmail) {
            form.setFieldValue('email', userEmail);
        }
    }, [userEmail, form]);

    if (!hasMounted) return null; //

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            method: 'POST',
            body: {
                email,
            },
        });

        if (res?.data) {
            setCurrent(1);
            setUserId(res?.data?._id);
        } else {
            alert(res?.message);
        }
    };

    const onFinishStep1 = async (values: any) => {
        const { code } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            method: 'POST',
            body: {
                code,
                _id: userId,
            },
        });

        if (res?.data) {
            setCurrent(2);
        } else {
            alert(res?.message);
        }
    };

    return (
        <Modal
            title="Kích hoạt tài khoản"
            closeIcon={<span aria-label="Close">×</span>}
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Steps
                current={current}
                items={[
                    { title: 'Login', icon: <UserOutlined /> },
                    { title: 'Verification', icon: <SolutionOutlined /> },
                    { title: 'Done', icon: <SmileOutlined /> },
                ]}
            />
            {current === 0 && (
                <>
                    <div style={{ margin: '20px 0' }}>
                        <p>Tài khoản của bạn chưa được kích hoạt</p>
                    </div>
                    <Form onFinish={onFinishStep0} form={form} name="verify" autoComplete="off" layout="vertical">
                        <Form.Item label="" name="email">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Resend
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}
            {current === 1 && (
                <>
                    <div style={{ margin: '20px 0' }}>
                        <p>Vui lòng nhập mã xác nhận</p>
                    </div>
                    <Form onFinish={onFinishStep1} form={form} name="verify2" autoComplete="off" layout="vertical">
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

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Kích hoạt
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}

            {current === 2 && (
                <div>
                    <div style={{ margin: '20px 0' }}>
                        <p>Tài khoản của bạn đã được kích thoạt thành công. VUi lòng đăng nhập lại</p>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ModalReactive;
