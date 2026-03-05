/**
 * Plan configuration for EduManage Pro
 * Defines subscription plans and their features
 */

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: {
    maxUsers: number;
    maxStudents: number;
    maxModules: number;
    storageLimit: number; // in GB
    supportLevel: 'basic' | 'premium' | 'enterprise';
    customDomain: boolean;
    apiAccess: boolean;
    analytics: boolean;
    customReports: boolean;
    prioritySupport: boolean;
    dedicatedManager: boolean;
  };
  modules: string[]; // List of module IDs available in this plan
  limitations: string[];
  enabled: boolean;
}

// Define all plans
export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small institutions starting out',
    price: 99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      maxUsers: 5,
      maxStudents: 100,
      maxModules: 5,
      storageLimit: 5,
      supportLevel: 'basic',
      customDomain: false,
      apiAccess: false,
      analytics: false,
      customReports: false,
      prioritySupport: false,
      dedicatedManager: false
    },
    modules: [
      'dashboard',
      'academic',
      'attendance',
      'fees',
      'hrm'
    ],
    limitations: [
      'Limited to 5 users',
      'Maximum 100 students',
      'Only 5 modules available',
      '5GB storage limit',
      'Basic email support only'
    ],
    enabled: true
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Ideal for growing institutions',
    price: 199,
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      maxUsers: 20,
      maxStudents: 500,
      maxModules: 10,
      storageLimit: 20,
      supportLevel: 'premium',
      customDomain: true,
      apiAccess: true,
      analytics: true,
      customReports: true,
      prioritySupport: true,
      dedicatedManager: false
    },
    modules: [
      'dashboard',
      'academic',
      'attendance',
      'fees',
      'hrm',
      'library',
      'transport',
      'hostel',
      'examination',
      'communication'
    ],
    limitations: [
      'Up to 20 users',
      'Maximum 500 students',
      '10 modules included',
      '20GB storage',
      'Priority email and phone support'
    ],
    enabled: true
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Complete solution for large institutions',
    price: 399,
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      maxUsers: 100,
      maxStudents: 2000,
      maxModules: 14,
      storageLimit: 100,
      supportLevel: 'enterprise',
      customDomain: true,
      apiAccess: true,
      analytics: true,
      customReports: true,
      prioritySupport: true,
      dedicatedManager: true
    },
    modules: [
      'dashboard',
      'academic',
      'attendance',
      'fees',
      'hrm',
      'library',
      'transport',
      'hostel',
      'examination',
      'communication',
      'inventory',
      'canteen',
      'reports',
      'settings'
    ],
    limitations: [
      'Up to 100 users',
      'Maximum 2000 students',
      'All 14 modules included',
      '100GB storage',
      '24/7 enterprise support',
      'Dedicated account manager'
    ],
    enabled: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solution for large organizations',
    price: 0, // Custom pricing
    currency: 'USD',
    billingCycle: 'yearly',
    features: {
      maxUsers: -1, // Unlimited
      maxStudents: -1, // Unlimited
      maxModules: -1, // All modules
      storageLimit: -1, // Unlimited
      supportLevel: 'enterprise',
      customDomain: true,
      apiAccess: true,
      analytics: true,
      customReports: true,
      prioritySupport: true,
      dedicatedManager: true
    },
    modules: [], // All modules included
    limitations: [
      'Custom pricing based on requirements',
      'Unlimited users and students',
      'All modules included',
      'Unlimited storage',
      '24/7 premium support',
      'Dedicated technical account manager',
      'Custom integrations and features'
    ],
    enabled: true
  }
];

/**
 * Get plan by ID
 */
export function getPlanById(id: string): Plan | null {
  return PLANS.find(plan => plan.id === id) || null;
}

/**
 * Get all enabled plans
 */
export function getEnabledPlans(): Plan[] {
  return PLANS.filter(plan => plan.enabled);
}

/**
 * Check if a plan exists
 */
export function planExists(id: string): boolean {
  return PLANS.some(plan => plan.id === id);
}

/**
 * Get plan features summary
 */
export function getPlanFeaturesSummary(planId: string): string[] {
  const plan = getPlanById(planId);
  if (!plan) return [];
  
  const features: string[] = [];
  
  if (plan.features.maxUsers !== -1) {
    features.push(`Up to ${plan.features.maxUsers} users`);
  } else {
    features.push('Unlimited users');
  }
  
  if (plan.features.maxStudents !== -1) {
    features.push(`Up to ${plan.features.maxStudents} students`);
  } else {
    features.push('Unlimited students');
  }
  
  if (plan.features.maxModules !== -1) {
    features.push(`${plan.features.maxModules} modules`);
  } else {
    features.push('All modules');
  }
  
  if (plan.features.storageLimit !== -1) {
    features.push(`${plan.features.storageLimit}GB storage`);
  } else {
    features.push('Unlimited storage');
  }
  
  features.push(`${plan.features.supportLevel} support`);
  
  if (plan.features.customDomain) {
    features.push('Custom domain');
  }
  
  if (plan.features.apiAccess) {
    features.push('API access');
  }
  
  if (plan.features.analytics) {
    features.push('Advanced analytics');
  }
  
  if (plan.features.prioritySupport) {
    features.push('Priority support');
  }
  
  if (plan.features.dedicatedManager) {
    features.push('Dedicated manager');
  }
  
  return features;
}

/**
 * Check if a module is available in a plan
 */
export function isModuleEnabledForPlan(moduleId: string, planId: string): boolean {
  const plan = getPlanById(planId);
  if (!plan) return false;
  
  // Enterprise plan includes all modules
  if (plan.id === 'enterprise') return true;
  
  return plan.modules.includes(moduleId);
}

/**
 * Get available modules for a plan
 */
export function getAvailableModulesForPlan(planId: string): string[] {
  const plan = getPlanById(planId);
  if (!plan) return [];
  
  // Enterprise plan includes all modules
  if (plan.id === 'enterprise') {
    return PLANS[0].modules; // Return all modules from basic plan as reference
  }
  
  return plan.modules;
}

/**
 * Calculate yearly price with discount
 */
export function getYearlyPrice(planId: string): number {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  
  // Apply 20% discount for yearly billing
  return plan.price * 12 * 0.8;
}

/**
 * Get plan comparison data
 */
export function getPlanComparison(): any[] {
  return PLANS.map(plan => ({
    plan: plan.name,
    price: plan.price,
    features: getPlanFeaturesSummary(plan.id),
    modules: plan.modules.length,
    limitations: plan.limitations
  }));
}