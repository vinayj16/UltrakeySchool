import authService, { type User } from '../api/authService'
import { useAuthStore } from '../store/authStore'
import { setGlobalDemoMode } from '../config/demo'

const DEMO_MODE_FLAG = 'demoModeActive'
const DEMO_USER_KEY = 'demoModeUser'
const SELECTED_ROLE_KEY = 'selectedUserRole'

type DemoModeUser = Pick<
  User,
  'id' | 'name' | 'email' | 'role' | 'plan' | 'modules' | 'permissions' | 'status'
> & {
  avatar?: string
}

const isBrowser = typeof window !== 'undefined'

// In-memory fallback when localStorage is blocked
let inMemoryDemoMode = false
let inMemoryDemoUser: DemoModeUser | null = null

const persistDemoFlag = (value: boolean) => {
  inMemoryDemoMode = value
  if (!isBrowser) return
  
  try {
    if (value) {
      window.localStorage.setItem(DEMO_MODE_FLAG, 'true')
      window.sessionStorage.setItem(DEMO_MODE_FLAG, 'true')
    } else {
      window.localStorage.removeItem(DEMO_MODE_FLAG)
      window.sessionStorage.removeItem(DEMO_MODE_FLAG)
    }
  } catch (e) {
    console.warn('[DemoMode] Storage blocked, using in-memory mode')
  }
}

const persistDemoUser = (user: DemoModeUser | null) => {
  inMemoryDemoUser = user
  if (!isBrowser) return
  
  try {
    if (user) {
      const userData = JSON.stringify(user)
      window.localStorage.setItem(DEMO_USER_KEY, userData)
      window.sessionStorage.setItem(DEMO_USER_KEY, userData)
      window.localStorage.setItem(SELECTED_ROLE_KEY, user.role.toUpperCase())
      window.sessionStorage.setItem(SELECTED_ROLE_KEY, user.role.toUpperCase())
    } else {
      window.localStorage.removeItem(DEMO_USER_KEY)
      window.sessionStorage.removeItem(DEMO_USER_KEY)
      window.localStorage.removeItem(SELECTED_ROLE_KEY)
      window.sessionStorage.removeItem(SELECTED_ROLE_KEY)
    }
  } catch (e) {
    console.warn('[DemoMode] Storage blocked, using in-memory mode')
  }
}

export const setDemoUser = (user: DemoModeUser) => {
  const timestamp = Date.now()
  authService.setTokens(`demo-access-${user.role}-${timestamp}`, `demo-refresh-${user.role}-${timestamp}`)

  const normalizedUser: User = {
    ...user,
    status: user.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as User

  console.log('[DemoMode] Setting demo user:', normalizedUser)

  // Set global demo mode FIRST
  setGlobalDemoMode(true, normalizedUser)

  useAuthStore.setState({
    user: normalizedUser as any,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })

  persistDemoFlag(true)
  persistDemoUser(normalizedUser)
  
  console.log('[DemoMode] Demo mode activated for role:', user.role)
}

export const clearDemoMode = () => {
  authService.clearTokens()
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })
  persistDemoFlag(false)
  persistDemoUser(null)
}

export const isDemoMode = (): boolean => {
  // Check in-memory first
  if (inMemoryDemoMode) return true
  
  if (!isBrowser) return false
  
  try {
    return window.localStorage.getItem(DEMO_MODE_FLAG) === 'true' ||
           window.sessionStorage.getItem(DEMO_MODE_FLAG) === 'true'
  } catch (e) {
    return inMemoryDemoMode
  }
}

export const getCurrentDemoUser = (): DemoModeUser | null => {
  // Check in-memory first
  if (inMemoryDemoUser) return inMemoryDemoUser
  
  if (!isBrowser) return null
  
  try {
    const value = window.localStorage.getItem(DEMO_USER_KEY) || 
                  window.sessionStorage.getItem(DEMO_USER_KEY)
    if (!value) return null

    return JSON.parse(value) as DemoModeUser
  } catch (error) {
    console.warn('[demoMode] Failed to parse demo user from storage', error)
    return inMemoryDemoUser
  }
}

export type { DemoModeUser }
