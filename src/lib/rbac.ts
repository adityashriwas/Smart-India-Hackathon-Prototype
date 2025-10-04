// Role-Based Access Control (RBAC) System
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  permissions: Permission[]
  isActive: boolean
  lastLogin?: Date
}

export type UserRole = 
  | 'super_admin'
  | 'admin' 
  | 'department_head'
  | 'staff'
  | 'citizen'

export type Permission = 
  // System Management
  | 'system:manage'
  | 'system:view_analytics'
  | 'system:export_data'
  | 'system:backup'
  
  // User Management
  | 'users:create'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  | 'users:manage_roles'
  
  // Report Management
  | 'reports:create'
  | 'reports:read'
  | 'reports:update'
  | 'reports:delete'
  | 'reports:assign'
  | 'reports:resolve'
  | 'reports:view_all'
  | 'reports:view_department'
  | 'reports:view_own'
  
  // Department Management
  | 'departments:create'
  | 'departments:read'
  | 'departments:update'
  | 'departments:delete'
  | 'departments:manage'
  
  // Task Management
  | 'tasks:create'
  | 'tasks:read'
  | 'tasks:update'
  | 'tasks:delete'
  | 'tasks:assign'
  | 'tasks:view_all'
  | 'tasks:view_department'
  | 'tasks:view_assigned'
  
  // Notification Management
  | 'notifications:create'
  | 'notifications:read'
  | 'notifications:update'
  | 'notifications:delete'
  | 'notifications:send_all'
  | 'notifications:send_department'

// Role definitions with their default permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // Full system access
    'system:manage',
    'system:view_analytics',
    'system:export_data',
    'system:backup',
    
    // Full user management
    'users:create',
    'users:read',
    'users:update',
    'users:delete',
    'users:manage_roles',
    
    // Full report management
    'reports:create',
    'reports:read',
    'reports:update',
    'reports:delete',
    'reports:assign',
    'reports:resolve',
    'reports:view_all',
    
    // Full department management
    'departments:create',
    'departments:read',
    'departments:update',
    'departments:delete',
    'departments:manage',
    
    // Full task management
    'tasks:create',
    'tasks:read',
    'tasks:update',
    'tasks:delete',
    'tasks:assign',
    'tasks:view_all',
    
    // Full notification management
    'notifications:create',
    'notifications:read',
    'notifications:update',
    'notifications:delete',
    'notifications:send_all',
  ],
  
  admin: [
    // Limited system access
    'system:view_analytics',
    'system:export_data',
    
    // User management (except role changes)
    'users:create',
    'users:read',
    'users:update',
    
    // Full report management
    'reports:create',
    'reports:read',
    'reports:update',
    'reports:assign',
    'reports:resolve',
    'reports:view_all',
    
    // Department viewing and basic management
    'departments:read',
    'departments:update',
    
    // Full task management
    'tasks:create',
    'tasks:read',
    'tasks:update',
    'tasks:assign',
    'tasks:view_all',
    
    // Notification management
    'notifications:create',
    'notifications:read',
    'notifications:update',
    'notifications:send_all',
  ],
  
  department_head: [
    // Basic analytics
    'system:view_analytics',
    
    // Limited user management within department
    'users:read',
    'users:update',
    
    // Department-specific report management
    'reports:create',
    'reports:read',
    'reports:update',
    'reports:assign',
    'reports:resolve',
    'reports:view_department',
    
    // Own department management
    'departments:read',
    'departments:update',
    
    // Department task management
    'tasks:create',
    'tasks:read',
    'tasks:update',
    'tasks:assign',
    'tasks:view_department',
    
    // Department notifications
    'notifications:create',
    'notifications:read',
    'notifications:send_department',
  ],
  
  staff: [
    // Basic report management
    'reports:create',
    'reports:read',
    'reports:update',
    
    // Basic department viewing
    'departments:read',
    
    // Assigned task management
    'tasks:read',
    'tasks:update',
    'tasks:view_assigned',
    
    // Basic notifications
    'notifications:read',
  ],
  
  citizen: [
    // Basic report creation and viewing own reports
    'reports:create',
    'reports:view_own',
    
    // Basic department viewing
    'departments:read',
    
    // Basic notifications
    'notifications:read',
  ]
}

// RBAC Helper Functions
export class RBACService {
  static hasPermission(user: User, permission: Permission): boolean {
    return user.permissions.includes(permission) && user.isActive
  }

  static hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission))
  }

  static hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission))
  }

  static canAccessResource(user: User, resource: string, action: string): boolean {
    const permission = `${resource}:${action}` as Permission
    return this.hasPermission(user, permission)
  }

  static getPermissionsForRole(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || []
  }

  static createUserWithRole(userData: Omit<User, 'permissions'>, role: UserRole): User {
    return {
      ...userData,
      role,
      permissions: this.getPermissionsForRole(role),
    }
  }

  static updateUserRole(user: User, newRole: UserRole): User {
    return {
      ...user,
      role: newRole,
      permissions: this.getPermissionsForRole(newRole),
    }
  }

  static canManageUser(currentUser: User, targetUser: User): boolean {
    // Super admin can manage anyone
    if (currentUser.role === 'super_admin') return true
    
    // Admin can manage non-admin users
    if (currentUser.role === 'admin' && !['super_admin', 'admin'].includes(targetUser.role)) {
      return true
    }
    
    // Department head can manage staff in their department
    if (currentUser.role === 'department_head' && 
        targetUser.role === 'staff' && 
        currentUser.department === targetUser.department) {
      return true
    }
    
    return false
  }

  static canViewReports(user: User, reportDepartment?: string): boolean {
    if (this.hasPermission(user, 'reports:view_all')) return true
    
    if (this.hasPermission(user, 'reports:view_department') && 
        user.department === reportDepartment) return true
    
    return false
  }

  static getAccessibleDepartments(user: User, allDepartments: string[]): string[] {
    if (this.hasPermission(user, 'departments:manage') || 
        this.hasPermission(user, 'reports:view_all')) {
      return allDepartments
    }
    
    if (user.department && this.hasPermission(user, 'reports:view_department')) {
      return [user.department]
    }
    
    return []
  }

  static filterDataByAccess<T extends { department?: string; userId?: string }>(
    user: User, 
    data: T[]
  ): T[] {
    // Super admin and admin see everything
    if (['super_admin', 'admin'].includes(user.role)) {
      return data
    }
    
    // Department head sees department data
    if (user.role === 'department_head') {
      return data.filter(item => item.department === user.department)
    }
    
    // Staff and citizens see only their own data
    return data.filter(item => item.userId === user.id)
  }
}

// Permission checking utility for React components
export function checkPermission(user: User, permission: Permission): boolean {
  return RBACService.hasPermission(user, permission)
}

// Mock users with different roles for testing
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'System Administrator',
    email: 'superadmin@jharkhand.gov.in',
    role: 'super_admin',
    permissions: ROLE_PERMISSIONS.super_admin,
    isActive: true,
    lastLogin: new Date(),
  },
  {
    id: '2',
    name: 'Municipal Admin',
    email: 'admin@jharkhand.gov.in',
    role: 'admin',
    permissions: ROLE_PERMISSIONS.admin,
    isActive: true,
    lastLogin: new Date(),
  },
  {
    id: '3',
    name: 'Water Department Head',
    email: 'water.head@jharkhand.gov.in',
    role: 'department_head',
    department: 'water',
    permissions: ROLE_PERMISSIONS.department_head,
    isActive: true,
    lastLogin: new Date(),
  },
  {
    id: '4',
    name: 'Sanitation Staff',
    email: 'sanitation.staff@jharkhand.gov.in',
    role: 'staff',
    department: 'sanitation',
    permissions: ROLE_PERMISSIONS.staff,
    isActive: true,
    lastLogin: new Date(),
  },
  {
    id: '5',
    name: 'John Citizen',
    email: 'john.citizen@email.com',
    role: 'citizen',
    permissions: ROLE_PERMISSIONS.citizen,
    isActive: true,
    lastLogin: new Date(),
  },
]
