export interface UserUpdateInput {
    email?: string
    username?: string
    password?: string
  }
  
  export interface PasswordResetInput {
    token: string
    password: string
  }
  
  