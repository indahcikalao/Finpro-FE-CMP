import { render, screen } from '@testing-library/react';
import { withReadPermission } from '../../../../utils/hoc';
import { usePermission } from '../../../../hooks';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../../hooks/use-permission');

describe('withReadPermission', () => {
  const MockComponent = () => <div>Mock Component</div>;

  it('renders the wrapped component if user has read permission', () => {
    usePermission.mockReturnValue({
      config: {
        access: {
          canRead: true,
        },
      },
      hasPermission: jest.fn().mockReturnValue(true),
    });

    const WrappedComponent = withReadPermission(MockComponent, 'resource');
    render(<WrappedComponent />);

    expect(screen.getByText('Mock Component')).toBeInTheDocument();
  });

  it('does not render the wrapped component if user does not have read permission', () => {
    usePermission.mockReturnValue({
      config: {
        access: {
          canRead: false,
        },
      },
      hasPermission: jest.fn().mockReturnValue(false),
    });

    const WrappedComponent = withReadPermission(MockComponent, 'resource');

    render(
      <MemoryRouter>
        <WrappedComponent />
      </MemoryRouter>
    );

    expect(screen.queryByText('Mock Component')).not.toBeInTheDocument();
  });
});