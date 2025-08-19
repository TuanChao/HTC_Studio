import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  PictureOutlined,
  TeamOutlined,
  StarOutlined,
  HeartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import routesName from 'src/routes/enum.routes';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: routesName.ADMIN_DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: routesName.ADMIN_ARTISTS,
      icon: <UserOutlined />,
      label: 'Artists',
    },
    {
      key: routesName.ADMIN_GALLERIES,
      icon: <PictureOutlined />,
      label: 'Galleries',
    },
    {
      key: routesName.ADMIN_KOLS,
      icon: <StarOutlined />,
      label: 'KOLs',
    },
    {
      key: routesName.ADMIN_PETS,
      icon: <HeartOutlined />,
      label: 'Pets',
    },
    {
      key: routesName.ADMIN_TEAMS,
      icon: <TeamOutlined />,
      label: 'Teams',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    localStorage.removeItem('admin_token');
    navigate(routesName.ADMIN_LOGIN);
  };

  const userMenuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} className="admin-sider">
        <div className="admin-logo">
          <img src="/HTC_logo_White_1.png" alt="HTC Studio" />
          {!collapsed && <Title level={4} style={{ color: 'white', margin: 0 }}>HTC Admin</Title>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      
      <Layout className="admin-content-layout">
        <Header className="admin-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="admin-collapse-btn"
          />
          
          <div className="admin-header-right">
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div className="admin-user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="admin-username">Admin</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="admin-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;