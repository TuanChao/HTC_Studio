import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Upload, message, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload';
import { getPets, createPet, updatePet, deletePet, PetDto, CreatePetDto, UpdatePetDto } from 'src/apis/pets/getPet';
import './AdminPets.css';

const AdminPets: React.FC = () => {
  const [pets, setPets] = useState<PetDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<PetDto | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPets = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      const response = await getPets(page, pageSize);
      setPets(response.datas);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.totalRecords,
      });
    } catch (error) {
      message.error('Failed to fetch Pets');
      console.error('Error fetching Pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchPets(pagination.current, pagination.pageSize);
  };

  const getAvatarUrl = (avatar: string | undefined) => {
    if (!avatar) return undefined;
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:5000${avatar}`;
  };

  const columns: ColumnsType<PetDto> = [
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
            title="Are you sure you want to delete this Pet?"
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
    setEditingPet(null);
    setModalVisible(true);
    form.resetFields();
    setFileList([]);
  };

  const handleEdit = (pet: PetDto) => {
    setEditingPet(pet);
    setModalVisible(true);
    form.setFieldsValue({
      name: pet.name,
      linkX: pet.linkX,
      disabled: pet.disabled,
    });
    setFileList([]);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePet(id);
      message.success('Pet deleted successfully');
      fetchPets(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete Pet');
      console.error('Error deleting Pet:', error);
    }
  };

  const handleSubmit = async (values: CreatePetDto | UpdatePetDto) => {
    try {
      console.log('=== Pet Form Submit ===');
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

      if (editingPet) {
        await updatePet(editingPet.id, formData);
        message.success('Pet updated successfully');
      } else {
        await createPet(formData);
        message.success('Pet created successfully');
      }

      setModalVisible(false);
      fetchPets(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(editingPet ? 'Failed to update Pet' : 'Failed to create Pet');
      console.error('Error submitting Pet:', error);
    }
  };


  return (
    <div className="admin-pets">
      <div className="admin-pets-header">
        <h2>Pet Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Pet
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={pets}
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
        className="pets-table"
      />

      <Modal
        title={editingPet ? 'Edit Pet' : 'Add New Pet'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="pet-form"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter Pet name' }]}
          >
            <Input placeholder="Enter Pet name" />
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
              {editingPet ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPets;