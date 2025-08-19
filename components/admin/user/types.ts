// Re-export types from the user feature
export type { 
  User, 
  UserFormData, 
  ApiResponse, 
  UsersResponse 
} from '../../../features/user/userApi'

// Extend UserFormData to include password for add user form
export interface ExtendedUserFormData {
  userName?: string
  email?: string
  phone?: string
  password?: string
  isActive?: boolean
}
