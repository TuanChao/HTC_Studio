import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Upload, message, Popconfirm, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { getKols, createKol, updateKol, deleteKol, KolDto, CreateKolDto, UpdateKolDto } from 'src/apis/kols/getKols';
import './AdminKols.css';

const AdminKols: React.FC = () => {
  const [kols, setKols] = useState<KolDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKol, setEditingKol] = useState<KolDto | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchKols = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      const response = await getKols(page, pageSize);
      setKols(response.datas);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.totalRecords,
      });
    } catch (error) {
      message.error('Failed to fetch KOLs');
      console.error('Error fetching KOLs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKols();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchKols(pagination.current, pagination.pageSize);
  };

  const getAvatarUrl = (avatar: string | undefined) => {
    if (!avatar) return undefined;
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:5000${avatar}`;
  };

  const columns: ColumnsType<KolDto> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <Avatar
          size={40}
          src={getAvatarUrl(avatar)}
          icon={<UserOutlined />}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
            title="Are you sure you want to delete this KOL?"
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
    setEditingKol(null);
    setModalVisible(true);
    form.resetFields();
    setFileList([]);
  };

  const handleEdit = (kol: KolDto) => {
    setEditingKol(kol);
    setModalVisible(true);
    form.setFieldsValue({
      name: kol.name,
      linkX: kol.linkX,
      disabled: kol.disabled,
    });
    setFileList([]);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKol(id);
      message.success('KOL deleted successfully');
      fetchKols(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete KOL');
      console.error('Error deleting KOL:', error);
    }
  };

  const handleSubmit = async (values: CreateKolDto | UpdateKolDto) => {
    try {
      console.log('=== KOL Form Submit ===');
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

      if (editingKol) {
        await updateKol(editingKol.id, formData);
        message.success('KOL updated successfully');
      } else {
        await createKol(formData);
        message.success('KOL created successfully');
      }

      setModalVisible(false);
      fetchKols(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(editingKol ? 'Failed to update KOL' : 'Failed to create KOL');
      console.error('Error submitting KOL:', error);
    }
  };

  const uploadProps: UploadProps = {
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  return (
    <div className="admin-kols">
      <div className="admin-kols-header">
        <h2>KOL Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add KOL
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={kols}
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
        className="kols-table"
      />

      <Modal
        title={editingKol ? 'Edit KOL' : 'Add New KOL'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="kol-form"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter KOL name' }]}
          >
            <Input placeholder="Enter KOL name" />
          </Form.Item>

          <Form.Item
            label="Link X (Twitter)"
            name="linkX"
          >
            <Input placeholder="Enter X/Twitter link" />
          </Form.Item>

          <Form.Item
            label="Avatar"
            name="avatar"
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>
                Upload Avatar
              </Button>
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
              {editingKol ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminKols;