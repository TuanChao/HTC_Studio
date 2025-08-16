import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Button, Space, Tag } from 'antd';
import {
  UserOutlined,
  PictureOutlined,
  TeamOutlined,
  StarOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import routesName from 'src/routes/enum.routes';
import './AdminDashboard.css';

const { Title, Paragraph } = Typography;

interface DashboardStats {
  artists: number;
  galleries: number;
  kols: number;
  teams: number;
}

interface RecentActivity {
  id: string;
  type: 'artist' | 'gallery' | 'kol' | 'team';
  action: 'created' | 'updated' | 'deleted';
  name: string;
  time: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    artists: 0,
    galleries: 0,
    kols: 0,
    teams: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      // Mock data for now
      setStats({
        artists: 15,
        galleries: 127,
        kols: 8,
        teams: 12,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'artist',
          action: 'created',
          name: 'New Artist: John Doe',
          time: '2 hours ago',
        },
        {
          id: '2',
          type: 'gallery',
          action: 'updated',
          name: 'Gallery: Summer Collection',
          time: '4 hours ago',
        },
        {
          id: '3',
          type: 'kol',
          action: 'created',
          name: 'KOL: Jane Smith',
          time: '1 day ago',
        },
        {
          id: '4',
          type: 'team',
          action: 'updated',
          name: 'Team Member: Bob Wilson',
          time: '2 days ago',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'green';
      case 'updated':
        return 'blue';
      case 'deleted':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'artist':
        return <UserOutlined />;
      case 'gallery':
        return <PictureOutlined />;
      case 'kol':
        return <StarOutlined />;
      case 'team':
        return <TeamOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const recentActivityColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Space>
          {getTypeIcon(type)}
          <span style={{ textTransform: 'capitalize' }}>{type}</span>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={getActionColor(action)} style={{ textTransform: 'capitalize' }}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <Title level={2}>Dashboard</Title>
        <Paragraph>Welcome to HTC Studio Admin Panel</Paragraph>
      </div>

      <Row gutter={[24, 24]} className="admin-dashboard-stats">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Artists"
              value={stats.artists}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Button
              type="link"
              onClick={() => navigate(routesName.ADMIN_ARTISTS)}
              style={{ padding: 0, marginTop: 8 }}
            >
              Manage Artists
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Galleries"
              value={stats.galleries}
              prefix={<PictureOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Button
              type="link"
              onClick={() => navigate(routesName.ADMIN_GALLERIES)}
              style={{ padding: 0, marginTop: 8 }}
            >
              Manage Galleries
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="KOLs"
              value={stats.kols}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
            <Button
              type="link"
              onClick={() => navigate(routesName.ADMIN_KOLS)}
              style={{ padding: 0, marginTop: 8 }}
            >
              Manage KOLs
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Teams"
              value={stats.teams}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Button
              type="link"
              onClick={() => navigate(routesName.ADMIN_TEAMS)}
              style={{ padding: 0, marginTop: 8 }}
            >
              Manage Teams
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="admin-dashboard-content">
        <Col xs={24} lg={16}>
          <Card title="Recent Activities" className="admin-dashboard-activities">
            <Table
              columns={recentActivityColumns}
              dataSource={recentActivities}
              pagination={false}
              loading={loading}
              rowKey="id"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Quick Actions" className="admin-dashboard-actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<UserOutlined />}
                block
                onClick={() => navigate(routesName.ADMIN_ARTISTS)}
              >
                Add New Artist
              </Button>
              <Button
                icon={<PictureOutlined />}
                block
                onClick={() => navigate(routesName.ADMIN_GALLERIES)}
              >
                Add New Gallery
              </Button>
              <Button
                icon={<StarOutlined />}
                block
                onClick={() => navigate(routesName.ADMIN_KOLS)}
              >
                Add New KOL
              </Button>
              <Button
                icon={<TeamOutlined />}
                block
                onClick={() => navigate(routesName.ADMIN_TEAMS)}
              >
                Add New Team Member
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;