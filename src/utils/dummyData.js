const dummyRoles = [
    {
      id: 1,
      userName: 'John Doe',
      role: 'Admin',
      permissions: {
        read: true,
        write: true,
      },
    },
    {
      id: 2,
      userName: 'Jane Smith',
      role: 'User',
      permissions: {
        read: true,
        write: false,
      },
    },
    {
      id: 3,
      userName: 'Alice Johnson',
      role: 'Manager',
      permissions: {
        read: true,
        write: true,
      },
    },
    {
      id: 4,
      userName: 'Bob Wilson',
      role: 'Secretary',
      permissions: {
        read: false,
        write: true,
      },
    },
    {
      id: 5,
      userName: 'Emma Davis',
      role: 'Assistant Manager',
      permissions: {
        read: true,
        write: false,
      },
    },
    {
      id: 6,
      userName: 'Michael Brown',
      role: 'Auditor',
      permissions: {
        read: true,
        write: true,
      },
    },
    {
      id: 7,
      userName: 'Olivia Taylor',
      role: 'Chief Executive',
      permissions: {
        read: true,
        write: true,
      },
    },
    {
      id: 8,
      userName: 'Sophia Anderson',
      role: 'Accout Manager',
      permissions: {
        read: false,
        write: false,
      },
    },
    {
      id: 9,
      userName: 'James Clark',
      role: 'Financial Manager',
      permissions: {
        read: true,
        write: true,
      },
    },
    {
      id: 10,
      userName: 'Liam Moore',
      role: 'Accounting',
      permissions: {
        read: true,
        write: true,
      },
    },
  ];
  
  export default dummyRoles;
  