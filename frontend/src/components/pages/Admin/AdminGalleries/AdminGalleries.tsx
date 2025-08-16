import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Select,
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
import { 
  getListGalleries, 
  createGallery, 
  updateGallery, 
  deleteGallery,
  GalleryDto 
} from 'src/apis/galleries/getGalleries';
import { getListArtist } from 'src/apis/artists/getArtist';
import { DetailArtist } from 'src/components/atoms/Artist/Artist.type';
import './AdminGalleries.css';

const { Title } = Typography;
const { Option } = Select;

interface GalleryFormData {
  artistId: string;
  showOnTop: boolean;
}

const AdminGalleries: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryDto[]>([]);
  const [artists, setArtists] = useState<DetailArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryDto | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchGalleries();
    fetchArtists();
  }, [pagination.current, pagination.pageSize]);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const response = await getListGalleries({ 
        page: pagination.current, 
        per_page: pagination.pageSize 
      });
      setGalleries(response.datas);
      setPagination(prev => ({
        ...prev,
        total: response.totalRecords,
      }));
    } catch (error) {
      message.error('Failed to fetch galleries');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtists = async () => {
    try {
      // Fetch all artists for the dropdown
      const response = await getListArtist({ page: 1 });
      setArtists(response.datas);
    } catch (error) {
      console.error('Failed to fetch artists');
    }
  };

  const handleAdd = () => {
    setEditingGallery(null);
    setModalVisible(true);
    form.resetFields();
    setFileList([]);
  };

  const handleEdit = (gallery: GalleryDto) => {
    setEditingGallery(gallery);
    setModalVisible(true);
    form.setFieldsValue({
      artistId: gallery.artistId,
      showOnTop: gallery.showOnTop,
    });
    setFileList([]);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGallery(id);
      message.success('Gallery deleted successfully');
      fetchGalleries();
    } catch (error) {
      message.error('Failed to delete gallery');
    }
  };

  const handleSubmit = async (values: GalleryFormData) => {
    try {
      const formData = new FormData();
      formData.append('artistId', values.artistId);
      formData.append('showOnTop', values.showOnTop.toString());

      // Picture is required for galleries
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('picture', fileList[0].originFileObj);
      } else if (!editingGallery) {
        message.error('Picture is required');
        return;
      }

      if (editingGallery) {
        await updateGallery(editingGallery.id, formData);
        message.success('Gallery updated successfully');
      } else {
        await createGallery(formData);
        message.success('Gallery created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchGalleries();
    } catch (error) {
      message.error(editingGallery ? 'Failed to update gallery' : 'Failed to create gallery');
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const getArtistName = (artistId: string) => {
    const artist = artists.find(a => a.id === artistId);
    return artist?.name || 'Unknown Artist';
  };

  const columns: ColumnsType<GalleryDto> = [
    {
      title: 'Picture',
      dataIndex: 'picture',
      key: 'picture',
      width: 100,
      render: (picture: string) => (
        picture ? (
          <Image
            width={60}
            height={60}
            src={picture.startsWith('http') ? picture : `http://localhost:5000${picture}`}
            style={{ borderRadius: '8px', objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div className="picture-placeholder">
            <UploadOutlined />
          </div>
        )
      ),
    },
    {
      title: 'Artist',
      dataIndex: 'artistId',
      key: 'artistId',
      render: (artistId: string) => getArtistName(artistId),
    },
    {
      title: 'Show on Top',
      dataIndex: 'showOnTop',
      key: 'showOnTop',
      render: (showOnTop: boolean) => (
        <Tag color={showOnTop ? 'gold' : 'default'}>
          {showOnTop ? 'Featured' : 'Normal'}
        </Tag>
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
      width: 200,
      render: (_, gallery) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {/* TODO: View gallery details */}}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(gallery)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this gallery?"
            onConfirm={() => handleDelete(gallery.id)}
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
    <div className="admin-galleries">
      <div className="admin-galleries-header">
        <Title level={2}>Galleries Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Gallery
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={galleries}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} galleries`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        className="admin-galleries-table"
      />

      <Modal
        title={editingGallery ? 'Edit Gallery' : 'Add Gallery'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ showOnTop: false }}
        >
          <Form.Item
            label="Artist"
            name="artistId"
            rules={[{ required: true, message: 'Please select an artist' }]}
          >
            <Select placeholder="Select an artist" showSearch optionFilterProp="children">
              {artists.map(artist => (
                <Option key={artist.id} value={artist.id}>
                  {artist.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Picture"
            name="picture"
            rules={editingGallery ? [] : [{ required: true, message: 'Please upload a picture' }]}
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
                  <div style={{ marginTop: 8 }}>Upload Picture</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Show on Top"
            name="showOnTop"
            valuePropName="checked"
          >
            <Switch checkedChildren="Featured" unCheckedChildren="Normal" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingGallery ? 'Update' : 'Create'}
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

export default AdminGalleries;