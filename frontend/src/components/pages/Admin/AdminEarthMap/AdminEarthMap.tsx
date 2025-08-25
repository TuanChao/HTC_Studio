import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Upload, Row, Col, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import EarthMapSection from '../../EarthMap/EarthMapOrganisms/EarthMapSection';
import { projectsApi, Project, CreateProjectRequest, UpdateProjectRequest } from '../../../../apis/earthmap/projectsApi';
import './AdminEarthMap.css';

export default function AdminEarthMap() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error('Lỗi khi tải danh sách dự án');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 80,
      render: (logo: string) => {
        // Check if logo is valid (not fakepath, not empty, not browser path)
        const isValidUrl = logo && 
                          !logo.includes('fakepath') && 
                          !logo.startsWith('C:') && 
                          !logo.startsWith('D:') && 
                          logo.trim() !== '';
        
        if (isValidUrl) {
          // Construct full URL for relative paths
          const logoUrl = logo.startsWith('/uploads') 
            ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${logo}` 
            : logo;
          
          return (
            <img 
              src={logoUrl} 
              alt="Project Logo" 
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Replace with placeholder
                const placeholder = document.createElement('div');
                placeholder.style.cssText = 'width: 40px; height: 40px; background-color: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;';
                placeholder.textContent = 'Error';
                target.parentNode?.appendChild(placeholder);
              }}
            />
          );
        }
        
        return (
          <div style={{ 
            width: 40, 
            height: 40, 
            backgroundColor: '#f0f0f0', 
            borderRadius: '4px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '10px',
            color: '#999'
          }}>
            No Logo
          </div>
        );
      },
    },
    {
      title: 'Tên dự án',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150,
    },
    {
      title: 'Tọa độ',
      key: 'coordinates',
      width: 120,
      render: (record: Project) => `${record.lat.toFixed(4)}, ${record.lng.toFixed(4)}`,
    },
    {
      title: 'X Link',
      dataIndex: 'xLink',
      key: 'xLink',
      width: 150,
      render: (xLink: string) => (
        <a href={xLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2' }}>
          {xLink.length > 30 ? `${xLink.substring(0, 30)}...` : xLink}
        </a>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean, record: Project) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(record.id, checked)}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (record: Project) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingProject(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.setFieldsValue(project);
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa dự án này?',
      async onOk() {
        try {
          await projectsApi.deleteProject(id);
          await fetchProjects(); // Refresh list
          message.success('Xóa thành công!');
        } catch (error) {
          console.error('Error deleting project:', error);
          message.error('Lỗi khi xóa dự án');
        }
      },
    });
  };

  const handleSubmit = async (values: CreateProjectRequest | UpdateProjectRequest) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('projectName', values.projectName);
      formData.append('description', values.description);
      formData.append('xLink', values.xLink);
      formData.append('lat', values.lat.toString());
      formData.append('lng', values.lng.toString());
      formData.append('size', values.size.toString());
      formData.append('isActive', values.isActive.toString());
      
      // Add logo file if selected
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('logo', fileList[0].originFileObj);
      } else if (editingProject && editingProject.logo) {
        // Keep existing logo for update
        formData.append('logoUrl', editingProject.logo);
      }
      
      if (editingProject) {
        // Update
        await projectsApi.updateProject(editingProject.id, formData);
        message.success('Cập nhật thành công!');
      } else {
        // Add
        await projectsApi.createProject(formData);
        message.success('Thêm mới thành công!');
      }
      
      setIsModalVisible(false);
      await fetchProjects(); // Refresh list
    } catch (error) {
      console.error('Error saving project:', error);
      message.error(editingProject ? 'Lỗi khi cập nhật dự án' : 'Lỗi khi tạo dự án');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) return;

      const formData = new FormData();
      formData.append('projectName', project.projectName);
      formData.append('description', project.description);
      formData.append('xLink', project.xLink);
      formData.append('lat', project.lat.toString());
      formData.append('lng', project.lng.toString());
      formData.append('size', project.size.toString());
      formData.append('isActive', isActive.toString());
      formData.append('logoUrl', project.logo);

      await projectsApi.updateProject(id, formData);
      await fetchProjects(); // Refresh list
      message.success(`${isActive ? 'Bật' : 'Tắt'} dự án thành công!`);
    } catch (error) {
      console.error('Error toggling project:', error);
      message.error('Lỗi khi thay đổi trạng thái dự án');
    }
  };


  const handleMapClick = (lat: number, lng: number) => {
    form.setFieldsValue({ lat, lng });
  };

  return (
    <div className="admin-earth-map">
      <div className="admin-header">
        <h2>Quản lý Earth Map</h2>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm dự án
          </Button>
          <Button 
            icon={<EyeOutlined />}
            onClick={() => setPreviewVisible(!previewVisible)}
          >
            {previewVisible ? 'Ẩn Preview' : 'Hiển thị Preview'}
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={previewVisible ? 12 : 24}>
          <div className="projects-table">
            <Table
              columns={columns}
              dataSource={projects}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </div>
        </Col>
        
        {previewVisible && (
          <Col span={12}>
            <div className="map-preview">
              <h3>Preview Map</h3>
              <div style={{ height: '500px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                <EarthMapSection />
              </div>
            </div>
          </Col>
        )}
      </Row>

      <Modal
        title={editingProject ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ size: 0.3, isActive: true }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="projectName"
                label="Tên dự án"
                rules={[{ required: true, message: 'Vui lòng nhập tên dự án!' }]}
              >
                <Input placeholder="VD: HTC Studio" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="xLink"
                label="Link X/Twitter"
                rules={[
                  { required: true, message: 'Vui lòng nhập link X!' },
                  { type: 'url', message: 'Link không hợp lệ!' }
                ]}
              >
                <Input placeholder="https://x.com/username" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả về dự án..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="lat"
                label="Vĩ độ (Latitude)"
                rules={[{ required: true, message: 'Vui lòng nhập vĩ độ!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="21.0285"
                  step={0.0001}
                  precision={4}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="lng"
                label="Kinh độ (Longitude)"
                rules={[{ required: true, message: 'Vui lòng nhập kinh độ!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="105.8542"
                  step={0.0001}
                  precision={4}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="size"
                label="Kích thước marker"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  placeholder="0.3"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="logo"
                label="Logo"
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
                      <div style={{ marginTop: 8 }}>Upload Logo</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Trạng thái"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Bật"
                  unCheckedChildren="Tắt"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-actions">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingProject ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}