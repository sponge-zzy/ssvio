export type UserRole = 'guest' | 'user' | 'admin'

export type User = {
  id: string
  nickname: string
  role: UserRole
}
