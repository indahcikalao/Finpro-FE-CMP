import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserRoleManagement from '.';

import { useAuth } from '../../../hooks';

export const usePermission = () => {
  const { auth } = useAuth();
  const { permission: permissions } = auth || {}; 

  const config = PERMISSIONS_CONFIG; 

  return permissions;
};

describe('UserRoleManagement', () => {
  beforeEach(() => {
    jest.mock('path-to-auth', () => ({
      useAuth: () => ({
        auth: {
          permission: 'admin'
        }
      })
    }));

    jest.mock('path-to-permission', () => ({
      usePermission: () => 'admin'
    }));
  });

  test('renders without error', () => {
    render(<UserRoleManagement />);
  });

  test('displays data after loading', async () => {
    render(<UserRoleManagement />);

    await screen.findByText('Role Name');
    await screen.findByText('Monitoring');
    await screen.findByText('Download');

    expect(screen.getByText('Role Name')).toBeInTheDocument();
    expect(screen.getByText('Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  test('searches and filters data', async () => {
    render(<UserRoleManagement />);

    await screen.findByText('Role Name');
    await screen.findByText('Monitoring');
    await screen.findByText('Download');

    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Admin' } });

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.queryByText('User')).not.toBeInTheDocument();
  });

  test('handles edit role', async () => {
    render(<UserRoleManagement />);

    await screen.findByText('Role Name');
    await screen.findByText('Monitoring');
    await screen.findByText('Download');

    const editButton = screen.getAllByLabelText('Edit')[0];
    fireEvent.click(editButton);

    const roleNameInput = screen.getByLabelText('Role Name');
    fireEvent.change(roleNameInput, { target: { value: 'Updated Role' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText('Updated Role')).toBeInTheDocument();
  });

  test('handles delete role', async () => {
    render(<UserRoleManagement />);

    await screen.findByText('Role Name');
    await screen.findByText('Monitoring');
    await screen.findByText('Download');

    const deleteButton = screen.getAllByLabelText('Delete')[0];
    fireEvent.click(deleteButton);

    const confirmDialog = await screen.findByRole('dialog');

    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);

    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
