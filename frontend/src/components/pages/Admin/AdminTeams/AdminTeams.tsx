import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Upload, message, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload';
import { getTeams, createTeam, updateTeam, deleteTeam, TeamDto, CreateTeamDto, UpdateTeamDto } from 'src/apis/teams/getTeams';
import './AdminTeams.css';

const { TextArea } = Input;

const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamDto | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTeams = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      const response = await getTeams(page, pageSize);
      setTeams(response.datas);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.totalRecords,
      });
    } catch (error) {
      message.error('Failed to fetch team members');
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchTeams(pagination.current, pagination.pageSize);
  };

  const getAvatarUrl = (avatar: string | undefined) => {
    if (!avatar) return undefined;
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:5000${avatar}`;
  };

  const columns: ColumnsType<TeamDto> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        avatar ? (
          <Image
            width={50}
            height={50}
            src={getAvatarUrl(avatar)}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div className="avatar-placeholder">
            <TeamOutlined />
          </div>
        )
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      sorter: true,
    },
    {
      title: 'Link X',
      dataIndex: 'linkX',
      key: 'linkX',
      render: (linkX: string) => linkX ? (
        <a href={linkX} target="_blank" rel="noopener noreferrer">
          {linkX}
        </a>
      ) : '-',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => description || '-',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'disabled',
      key: 'disabled',
      render: (disabled: boolean) => (
        <span className={disabled ? 'status-disabled' : 'status-active'}>
          {disabled ? 'Disabled' : 'Active'}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this team member?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingTeam(null);
    setModalVisible(true);
    form.resetFields();
    setFileList([]);
  };

  const handleEdit = (team: TeamDto) => {
    setEditingTeam(team);
    setModalVisible(true);
    form.setFieldsValue({
      name: team.name,
      description: team.description,
      position: team.position,
      linkX: team.linkX,
      disabled: team.disabled,
    });
    setFileList([]);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeam(id);
      message.success('Team member deleted successfully');
      fetchTeams(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete team member');
      console.error('Error deleting team member:', error);
    }
  };

  const handleSubmit = async (values: CreateTeamDto | UpdateTeamDto) => {
    try {
      console.log('=== Team Form Submit ===');
      console.log('Values:', values);
      console.log('FileList length:', fileList.length);
      if (fileList.length > 0) {
        console.log('File name:', fileList[0].name);
        console.log('File object:', fileList[0].originFileObj);
      }
      
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('avatar', fileList[0].originFileObj);
        console.log('✅ Avatar added to FormData');
      } else {
        console.log('❌ No avatar file');
      }

      if (editingTeam) {
        await updateTeam(editingTeam.id, formData);
        message.success('Team member updated successfully');
      } else {
        await createTeam(formData);
        message.success('Team member created successfully');
      }

      setModalVisible(false);
      fetchTeams(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(editingTeam ? 'Failed to update team member' : 'Failed to create team member');
      console.error('Error submitting team member:', error);
    }
  };

  return (
    <div className="admin-teams">
      <div className="admin-teams-header">
        <h2>Team Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Team Member
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={teams}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
        className="teams-table"
      />

      <Modal
        title={editingTeam ? 'Edit Team Member' : 'Add New Team Member'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="team-form"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter team member name' }]}
          >
            <Input placeholder="Enter team member name" />
          </Form.Item>

          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Input placeholder="Enter position (e.g., CEO, CTO, Designer)" />
          </Form.Item>

          <Form.Item
            label="Link X (Twitter)"
            name="linkX"
          >
            <Input placeholder="Enter X/Twitter link" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea
              rows={4}
              placeholder="Enter team member description..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Avatar"
            name="avatar"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload Avatar</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Status"
            name="disabled"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Disabled" 
              unCheckedChildren="Active"
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button onClick={() => setModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingTeam ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTeams;