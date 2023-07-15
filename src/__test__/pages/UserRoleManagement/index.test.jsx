import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserRoleManagement from '../../../pages/Protected/UserRoleManagement';
import api from '../../../api/axios';
import { usePermission } from '../../../hooks';

jest.mock('../../../api/axios', () => ({
  get: jest.fn(),
}));

jest.mock('../../../hooks/use-permission', () => {
  const RESOURCES = {
    monitoring: 'monitoring',
    download: 'download',
    user: 'user',
    role: 'role',
  };

  const ACCESS = {
    canRead: 'can_read',
    canWrite: 'can_write',
  };

  const PERMISSIONS_CONFIG = {
    resources: RESOURCES,
    access: ACCESS,
  };

  return {
    usePermission: jest.fn().mockReturnValue({
      config: PERMISSIONS_CONFIG,
      hasPermission: jest.fn(),
      hasWritePermission: jest.fn(() => true),
      hasReadPermission: jest.fn(),
    }),
  };
});

describe('UserRoleManagement', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: {} });
  });

  test('renders without error', () => {
    render(<UserRoleManagement />);
  });

  test('displays data after loading', async () => {
    const responseData = {
      page: 1,
      limit: 5,
      total: 19,
      total_pages: 4,
      data: [
        {
          id: 26,
          name: 'Admin',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'Role', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: true },
          ],
        },
        {
          id: 29,
          name: 'Finance',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: false },
          ],
        },
        {
          id: 30,
          name: 'Auditor Manager',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: false },
          ],
        },
        {
          id: 31,
          name: 'Finance Auditor',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: false },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: true },
          ],
        },
        {
          id: 32,
          name: 'Manager',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: true },
            { resource: 'Role', can_read: true, can_write: true },
          ],
        },
      ],
    };

    api.get.mockResolvedValue({ data: responseData });

    render(<UserRoleManagement />);

    expect(screen.getByText('Please wait for a moment...')).toBeInTheDocument();

    await screen.findByText('Admin');
    await screen.findByText('Finance');
    await screen.findByText('Auditor Manager');
    await screen.findByText('Finance Auditor');
    await screen.findByText('Manager');

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Auditor Manager')).toBeInTheDocument();
    expect(screen.getByText('Finance Auditor')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  test('searches and filters data', async () => {
    const responseData = {
      page: 1,
      limit: 5,
      total: 19,
      total_pages: 4,
      data: [
        {
          id: 26,
          name: 'Admin',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'Role', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: true },
          ],
        },
        {
          id: 29,
          name: 'Finance',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: false },
          ],
        },
        {
          id: 30,
          name: 'Auditor Manager',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: false },
          ],
        },
        {
          id: 31,
          name: 'Finance Auditor',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: false },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: true },
          ],
        },
        {
          id: 32,
          name: 'Manager',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: true },
            { resource: 'Role', can_read: true, can_write: true },
          ],
        },
      ],
    };

    api.get.mockResolvedValue({ data: responseData });

    render(<UserRoleManagement />);

    expect(screen.getByText('Please wait for a moment...')).toBeInTheDocument();

    await screen.findByText('Admin');
    await screen.findByText('Finance');
    await screen.findByText('Auditor Manager');
    await screen.findByText('Finance Auditor');
    await screen.findByText('Manager');

    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Admin' } });

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.queryByText('Finance')).not.toBeInTheDocument();
    expect(screen.queryByText('Auditor Manager')).not.toBeInTheDocument();
    expect(screen.queryByText('Finance Auditor')).not.toBeInTheDocument();
    expect(screen.queryByText('Manager')).not.toBeInTheDocument();
  });

  test('handles edit role', async () => {
    const responseData = {
      page: 1,
      limit: 5,
      total: 19,
      total_pages: 4,
      data: [
        {
          id: 26,
          name: 'Admin',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'Role', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: true },
          ],
        },
        {
          id: 29,
          name: 'Finance',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: false },
          ],
        },
        {
          id: 30,
          name: 'Auditor Manager',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: false },
          ],
        },
        {
          id: 31,
          name: 'Finance Auditor',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: false },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: true },
          ],
        },
        {
          id: 32,
          name: 'Manager',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: true },
            { resource: 'Role', can_read: true, can_write: true },
          ],
        },
      ],
    };

    api.get.mockResolvedValue({ data: responseData });

    render(<UserRoleManagement />);

    expect(screen.getByText('Please wait for a moment...')).toBeInTheDocument();

    await screen.findByText('Admin');
    await screen.findByText('Finance');
    await screen.findByText('Auditor Manager');
    await screen.findByText('Finance Auditor');
    await screen.findByText('Manager');

    const editButton = screen.getAllByText('Edit')[0];
    fireEvent.click(editButton);

    const roleNameInput = screen.getByLabelText('Role Name');
    fireEvent.change(roleNameInput, { target: { value: 'Updated Role' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText('Updated Role')).toBeInTheDocument();
  });

  test('handles delete role', async () => {
    const responseData = {
      page: 1,
      limit: 5,
      total: 19,
      total_pages: 4,
      data: [
        {
          id: 26,
          name: 'Admin',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'Role', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: true },
          ],
        },
        {
          id: 29,
          name: 'Finance',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: false },
          ],
        },
        {
          id: 30,
          name: 'Auditor Manager',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: false },
          ],
        },
        {
          id: 31,
          name: 'Finance Auditor',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: false },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: false },
            { resource: 'Role', can_read: true, can_write: true },
          ],
        },
        {
          id: 32,
          name: 'Manager',
          access: [
            { resource: 'Monitoring', can_read: true, can_write: true },
            { resource: 'Download', can_read: true, can_write: true },
            { resource: 'User', can_read: true, can_write: true },
            { resource: 'Role', can_read: true, can_write: true },
          ],
        },
      ],
    };

    api.get.mockResolvedValue({ data: responseData });

    render(<UserRoleManagement />);

    expect(screen.getByText('Please wait for a moment...')).toBeInTheDocument();

    await screen.findByText('Admin');
    await screen.findByText('Finance');
    await screen.findByText('Auditor Manager');
    await screen.findByText('Finance Auditor');
    await screen.findByText('Manager');

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);

    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
