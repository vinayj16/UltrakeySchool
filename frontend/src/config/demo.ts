// Global demo mode configuration
// This file provides a centralized way to check if demo mode is active

let globalDemoMode = false
let globalDemoUser: any = null

export const setGlobalDemoMode = (active: boolean, user?: any) => {
  globalDemoMode = active
  globalDemoUser = user
  console.log('[GlobalDemo] Mode set to:', active, 'User:', user)
}

export const isGlobalDemoMode = () => {
  return globalDemoMode
}

export const getGlobalDemoUser = () => {
  return globalDemoUser
}

// Initialize from storage on load
if (typeof window !== 'undefined') {
  try {
    const demoFlag = localStorage.getItem('demoModeActive') || sessionStorage.getItem('demoModeActive')
    const demoUserStr = localStorage.getItem('demoModeUser') || sessionStorage.getItem('demoModeUser')
    
    if (demoFlag === 'true' && demoUserStr) {
      globalDemoMode = true
      globalDemoUser = JSON.parse(demoUserStr)
      console.log('[GlobalDemo] Initialized from storage:', globalDemoUser)
    }
  } catch {
    console.warn('[GlobalDemo] Failed to initialize from storage')
  }
}
