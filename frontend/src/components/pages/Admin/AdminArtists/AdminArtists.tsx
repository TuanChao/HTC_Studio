import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Switch,
  Upload,
  message,
  Popconfirm,
  Image,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { getListArtist, createArtist, updateArtist, deleteArtist } from 'src/apis/artists/getArtist';
import { DetailArtist } from 'src/components/atoms/Artist/Artist.type';
import './AdminArtists.css';

const { Title } = Typography;
const { TextArea } = Input;

interface ArtistFormData {
  name: string;
  style: string;
  linkX?: string;
  xTag?: string;
  disabled: boolean;
}

const AdminArtists: React.FC = () => {
  const [artists, setArtists] = useState<DetailArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArtist, setEditingArtist] = useState<DetailArtist | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchArtists();
  }, [pagination.current, pagination.pageSize]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await getListArtist({ page: pagination.current });
      setArtists(response.datas);
      setPagination(prev => ({
        ...prev,
        total: response.totalRecords,
      }));
    } catch (error) {
      message.error('Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingArtist(null);
    setModalVisible(true);
    form.resetFields();
    setFileList([]);
  };

  const handleEdit = (artist: DetailArtist) => {
    setEditingArtist(artist);
    setModalVisible(true);
    form.setFieldsValue({
      name: artist.name,
      style: artist.style,
      linkX: artist.linkX,
      xTag: artist.xTag,
      disabled: artist.disabled,
    });
    setFileList([]);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArtist(id);
      message.success('Artist deleted successfully');
      fetchArtists();
    } catch (error) {
      message.error('Failed to delete artist');
    }
  };

  const handleSubmit = async (values: ArtistFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('style', values.style);
      if (values.linkX) formData.append('linkX', values.linkX);
      if (values.xTag) formData.append('xTag', values.xTag);
      formData.append('disabled', values.disabled.toString());
      formData.append('totalImage', '0');

      // Add avatar file if selected
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('avatar', fileList[0].originFileObj);
      }

      if (editingArtist) {
        await updateArtist(editingArtist.id, formData);
        message.success('Artist updated successfully');
      } else {
        await createArtist(formData);
        message.success('Artist created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchArtists();
    } catch (error) {
      message.error(editingArtist ? 'Failed to update artist' : 'Failed to create artist');
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const columns: ColumnsType<DetailArtist> = [
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
            src={avatar.startsWith('http') ? avatar : `http://localhost:5000${avatar}`}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div className="avatar-placeholder">
            <UploadOutlined />
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
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      sorter: true,
    },
    {
      title: 'X Tag',
      dataIndex: 'xTag',
      key: 'xTag',
      render: (xTag: string) => xTag ? <Tag color="blue">@{xTag}</Tag> : '-',
    },
    {
      title: 'Status',
      dataIndex: 'disabled',
      key: 'disabled',
      render: (disabled: boolean) => (
        <Tag color={disabled ? 'red' : 'green'}>
          {disabled ? 'Disabled' : 'Active'}
        </Tag>
      ),
    },
    {
      title: 'Total Images',
      dataIndex: 'totalImage',
      key: 'totalImage',
      render: (count: number) => count || 0,
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
      width: 200,
      render: (_, artist) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {/* TODO: View artist details */}}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(artist)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this artist?"
            onConfirm={() => handleDelete(artist.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-artists">
      <div className="admin-artists-header">
        <Title level={2}>Artists Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Artist
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={artists}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} artists`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        className="admin-artists-table"
      />

      <Modal
        title={editingArtist ? 'Edit Artist' : 'Add Artist'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ disabled: false }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter artist name' }]}
          >
            <Input placeholder="Enter artist name" />
          </Form.Item>

          <Form.Item
            label="Style"
            name="style"
            rules={[{ required: true, message: 'Please enter artist style' }]}
          >
            <Input placeholder="Enter artist style" />
          </Form.Item>

          <Form.Item
            label="X/Twitter Link"
            name="linkX"
          >
            <Input placeholder="https://twitter.com/username" />
          </Form.Item>

          <Form.Item
            label="X Tag"
            name="xTag"
          >
            <Input placeholder="username" addonBefore="@" />
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
            <Switch checkedChildren="Disabled" unCheckedChildren="Active" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingArtist ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminArtists;