import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import routesName from 'src/routes/enum.routes';
import './AdminLogin.css';

const { Title, Paragraph } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual authentication
      // For now, use hardcoded credentials
      if (values.username === 'admin' && values.password === 'htcadmin2024') {
        // Mock JWT token
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_admin_token';
        localStorage.setItem('admin_token', mockToken);
        navigate(routesName.ADMIN_DASHBOARD);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-content">
        <Card className="admin-login-card">
          <div className="admin-login-header">
            <img src="/HTC_logo_Black_1.png" alt="HTC Studio" className="admin-login-logo" />
            <Title level={2} className="admin-login-title">HTC Studio Admin</Title>
            <Paragraph className="admin-login-subtitle">
              Sign in to access the admin dashboard
            </Paragraph>
          </div>

          <Divider />

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="admin-login-error"
            />
          )}

          <Form
            name="admin-login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter username"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="admin-login-button"
                block
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <div className="admin-login-footer">
            <Paragraph type="secondary" className="admin-login-demo">
              Demo credentials: <strong>admin</strong> / <strong>htcadmin2024</strong>
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;