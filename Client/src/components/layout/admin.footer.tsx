'use client';
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>minhdang ©{new Date().getFullYear()} Created by @minhdang</Footer>
        </>
    );
};

export default AdminFooter;
