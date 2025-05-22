'use client';
import { Layout } from 'antd';
const { Footer } = Layout;
const AdminFooter = () => {
    return (
        <>
            <Footer style={{ textAlign: 'center' }}> Minhdang©{new Date().getFullYear()} Created by minhdang</Footer>
        </>
    );
};
export default AdminFooter;
