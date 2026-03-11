import emailService from '../services/emailService.js';
import logger from '../utils/logger.js';
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '../utils/apiResponse.js';
import UserCredential from '../models/UserCredential.js';

// In-memory storage for demo purposes (will be replaced with database in production)
// TODO: Replace with database storage
export let userCredentials = []; // Temporary for backward compatibility

let accountRequests = [
  {
    _id: '1',
    instituteType: 'School',
    instituteCode: 'SCH001',
    fullName: 'John Doe',
    email: 'john.doe@school.com',
    status: 'pending',
    submittedAt: new Date().toISOString()
  },
  {
    _id: '2',
    instituteType: 'College',
    instituteCode: 'COL001',
    fullName: 'Jane Smith',
    email: 'jane.smith@college.com',
    status: 'pending',
    submittedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: '147852369',
    instituteType: 'School',
    instituteCode: 'SCH002',
    fullName: 'Test Student',
    email: 'school@gmail.com',
    status: 'approved',
    submittedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: '741852963',
    instituteType: 'School',
    instituteCode: 'SCH003',
    fullName: 'Another Student',
    email: 'school@gmail.com',
    status: 'approved',
    submittedAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    _id: '123456789',
    instituteType: 'College',
    instituteCode: 'COL002',
    fullName: 'Test Teacher',
    email: 'teacher@college.com',
    status: 'approved',
    submittedAt: new Date(Date.now() - 345600000).toISOString()
  }
];

// Function to add new account request (called from auth controller)
export const addAccountRequest = (requestData) => {
  const newRequest = {
    _id: requestData.requestId,
    instituteType: requestData.instituteType,
    instituteCode: requestData.instituteCode,
    fullName: requestData.fullName,
    email: requestData.email,
    status: requestData.status,
    submittedAt: requestData.submittedAt
  };
  
  accountRequests.unshift(newRequest); // Add to beginning of array
  logger.info('Account request added to admin storage:', newRequest);
  return newRequest;
};

// Create login credentials for approved account requests
export const createCredentials = async (req, res) => {
  try {
    logger.info('Create credentials request received:', {
      body: req.body
    });

    const { userId, email, password, role, permissions } = req.body;

    // Validation
    const errors = [];
    
    if (!userId || typeof userId !== 'string') {
      errors.push('User ID is required');
    }
    
    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
    } else {
      const emailErrors = validateEmail(email);
      if (emailErrors.length > 0) {
        errors.push(...emailErrors);
      }
    }
    
    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    
    if (!role || typeof role !== 'string') {
      errors.push('Role is required');
    }

    if (errors.length > 0) {
      logger.error('Create credentials validation failed:', errors);
      return validationErrorResponse(res, errors);
    }

    // Find the account request by ID
    const accountRequest = accountRequests.find(req => req._id === userId);
    if (!accountRequest) {
      logger.error('Account request not found:', { userId });
      return notFoundResponse(res, 'Account request not found');
    }

    // Check if request is approved
    if (accountRequest.status !== 'approved') {
      logger.error('Account request not approved:', { userId, status: accountRequest.status });
      return errorResponse(res, 'Account request must be approved before creating credentials', 400, 'REQUEST_NOT_APPROVED');
    }

    // Create user credentials (in production, this would be saved to database)
    const userCredential = {
      userId: userId,
      email: email.trim().toLowerCase(),
      password: password, // In production, this should be hashed
      role: role.toLowerCase().replace(' ', '_'),
      permissions: permissions || [],
      instituteType: accountRequest.instituteType,
      instituteCode: accountRequest.instituteCode,
      fullName: accountRequest.fullName,
      createdAt: new Date().toISOString(),
      status: 'active',
      hasLoggedIn: false // Track first-time login for welcome email
    };

    // Store credentials in database
    try {
      const newCredential = new UserCredential(userCredential);
      await newCredential.save();

      // Also store in memory for backward compatibility (temporary)
      userCredentials.push(userCredential);

      logger.info('User credentials created and stored in database:', {
        userId: userCredential.userId,
        email: userCredential.email,
        role: userCredential.role,
        instituteType: userCredential.instituteType
      });
    } catch (dbError) {
      logger.error('Failed to save credentials to database:', dbError);
      // Continue with in-memory storage as fallback
      userCredentials.push(userCredential);
    }

    // Send credentials email to institution
    try {
      const plainPassword = password; // Store plain password for email before hashing
      await emailService.sendCredentialEmail(email, {
        email: userCredential.email,
        password: plainPassword, // Send plain password in email
        role: userCredential.role,
        fullName: userCredential.fullName,
        instituteType: userCredential.instituteType,
        instituteCode: userCredential.instituteCode
      });

      logger.info('Credentials email sent successfully to:', email);
    } catch (emailError) {
      logger.error('Failed to send credentials email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return createdResponse(res, {
      userId: userCredential.userId,
      email: userCredential.email,
      role: userCredential.role,
      instituteType: userCredential.instituteType,
      instituteCode: userCredential.instituteCode,
      fullName: userCredential.fullName,
      emailSent: true,
      message: 'Login credentials created successfully and email sent'
    }, 'Login credentials created successfully and email sent');

  } catch (error) {
    logger.error('Create credentials error:', error);
    return errorResponse(res, 'Failed to create credentials', 500, 'CREATE_CREDENTIALS_FAILED');
  }
};

// Login endpoint for testing created credentials
export const loginWithCredentials = async (req, res) => {
  try {
    logger.info('Login attempt with credentials:', {
      email: req.body.email
    });

    const { email, password } = req.body;

    if (!email || !password) {
      return validationErrorResponse(res, ['Email and password are required']);
    }

    // Find user credentials (try database first, fallback to in-memory)
    let user = null;
    try {
      user = await UserCredential.findOne({ email: email.toLowerCase() });
      if (user) {
        logger.info('User found in database:', { email: user.email, role: user.role });
      }
    } catch (dbError) {
      logger.warn('Database query failed, falling back to in-memory storage:', dbError.message);
    }

    // Fallback to in-memory storage if not found in database
    if (!user) {
      user = userCredentials.find(cred => cred.email.toLowerCase() === email.toLowerCase());
      if (user) {
        logger.info('User found in memory storage:', { email: user.email, role: user.role });
      }
    }

    if (!user) {
      logger.warn('Login attempt with invalid email:', email);
      return errorResponse(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check password (in production, this should be hashed)
    if (user.password !== password) {
      logger.warn('Login attempt with invalid password for user:', email);
      return errorResponse(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status !== 'active') {
      logger.warn('Login attempt for inactive account:', email);
      return errorResponse(res, 'Account is not active', 401, 'ACCOUNT_INACTIVE');
    }

    // Check if this is the user's first login and send welcome email
    const isFirstLogin = !user.hasLoggedIn;

    if (isFirstLogin) {
      try {
        // Send welcome email for first-time login
        await emailService.sendWelcomeEmail(user.email, {
          fullName: user.fullName,
          instituteType: user.instituteType,
          instituteCode: user.instituteCode,
          requestId: user.userId,
          email: user.email
        });

        logger.info('Welcome email sent for first login:', { email: user.email });

        // Update the user's hasLoggedIn status in database
        try {
          await UserCredential.updateOne(
            { email: user.email.toLowerCase() },
            {
              hasLoggedIn: true,
              lastLoginAt: new Date()
            }
          );
        } catch (dbError) {
          logger.warn('Failed to update login status in database:', dbError.message);
          // Update in-memory storage as fallback
          user.hasLoggedIn = true;
        }

      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError);
        // Don't fail the login if email fails, just log it
      }
    } else {
      // Update last login time for returning users
      try {
        await UserCredential.updateOne(
          { email: user.email.toLowerCase() },
          { lastLoginAt: new Date() }
        );
      } catch (dbError) {
        logger.warn('Failed to update last login time in database:', dbError.message);
      }
    }

    // Return success response (in production, this would include JWT tokens)
    return successResponse(res, {
      userId: user.userId,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      instituteType: user.instituteType,
      instituteCode: user.instituteCode,
      permissions: user.permissions,
      isFirstLogin: isFirstLogin, // Include this in response for frontend
      message: isFirstLogin ? 'Welcome! First login successful' : 'Login successful'
    }, isFirstLogin ? 'Welcome! First login successful' : 'Login successful');

  } catch (error) {
    logger.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500, 'LOGIN_FAILED');
  }
};

// Helper function to validate email
function validateEmail(email) {
  const errors = [];
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!EMAIL_PATTERN.test(email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
}

// Get all account requests
export const getAccountRequests = async (req, res) => {
  try {
    logger.info('Get account requests called:', {
      query: req.query,
      totalRequests: accountRequests.length
    });

    const { status, page = 1, limit = 10 } = req.query;
    
    let filteredRequests = accountRequests;
    
    // Filter by status if provided
    if (status && status !== 'all') {
      filteredRequests = accountRequests.filter(req => req.status === status);
      logger.info('Filtered requests:', { status, count: filteredRequests.length });
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
    
    logger.info('Returning requests:', {
      total: filteredRequests.length,
      paginated: paginatedRequests.length,
      page: page,
      limit: limit
    });
    
    return successResponse(res, {
      requests: paginatedRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredRequests.length / limit),
        totalRequests: filteredRequests.length,
        hasNext: endIndex < filteredRequests.length,
        hasPrev: page > 1
      },
      stats: {
        total: accountRequests.length,
        pending: accountRequests.filter(req => req.status === 'pending').length,
        approved: accountRequests.filter(req => req.status === 'approved').length,
        rejected: accountRequests.filter(req => req.status === 'rejected').length
      }
    }, 'Account requests retrieved successfully');
    
  } catch (error) {
    logger.error('Get account requests error:', error);
    return errorResponse(res, 'Failed to get account requests', 500, 'GET_ACCOUNT_REQUESTS_FAILED');
  }
};

// Get account request statistics
export const getAccountRequestStats = async (req, res) => {
  try {
    const stats = {
      total: accountRequests.length,
      pending: accountRequests.filter(req => req.status === 'pending').length,
      approved: accountRequests.filter(req => req.status === 'approved').length,
      rejected: accountRequests.filter(req => req.status === 'rejected').length,
      thisMonth: accountRequests.filter(req => {
        const requestDate = new Date(req.submittedAt);
        const now = new Date();
        return requestDate.getMonth() === now.getMonth() && 
               requestDate.getFullYear() === now.getFullYear();
      }).length,
      lastMonth: accountRequests.filter(req => {
        const requestDate = new Date(req.submittedAt);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return requestDate.getMonth() === lastMonth.getMonth() && 
               requestDate.getFullYear() === lastMonth.getFullYear();
      }).length
    };
    
    return successResponse(res, stats, 'Account request statistics retrieved successfully');
    
  } catch (error) {
    logger.error('Get account request stats error:', error);
    return errorResponse(res, 'Failed to get account request statistics', 500, 'GET_STATS_FAILED');
  }
};

// Get single account request
export const getAccountRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = accountRequests.find(req => req._id === id);
    
    if (!request) {
      return notFoundResponse(res, 'Account request not found');
    }
    
    return successResponse(res, request, 'Account request retrieved successfully');
    
  } catch (error) {
    logger.error('Get account request by ID error:', error);
    return errorResponse(res, 'Failed to get account request', 500, 'GET_REQUEST_FAILED');
  }
};

// Approve account request
export const approveAccountRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    
    const requestIndex = accountRequests.findIndex(req => req._id === id);
    
    if (requestIndex === -1) {
      return notFoundResponse(res, 'Account request not found');
    }
    
    // Update request status
    accountRequests[requestIndex] = {
      ...accountRequests[requestIndex],
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: req.user?.id || 'admin',
      adminNotes: adminNotes || ''
    };
    
    logger.info('Account request approved:', {
      requestId: id,
      instituteType: accountRequests[requestIndex].instituteType,
      instituteCode: accountRequests[requestIndex].instituteCode
    });
    
    return successResponse(res, accountRequests[requestIndex], 'Account request approved successfully');
    
  } catch (error) {
    logger.error('Approve account request error:', error);
    return errorResponse(res, 'Failed to approve account request', 500, 'APPROVE_REQUEST_FAILED');
  }
};

// Reject account request
export const rejectAccountRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return errorResponse(res, 'Rejection reason is required', 400, 'REJECTION_REASON_REQUIRED');
    }
    
    const requestIndex = accountRequests.findIndex(req => req._id === id);
    
    if (requestIndex === -1) {
      return notFoundResponse(res, 'Account request not found');
    }
    
    // Update request status
    accountRequests[requestIndex] = {
      ...accountRequests[requestIndex],
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: req.user?.id || 'admin',
      rejectionReason
    };
    
    logger.info('Account request rejected:', {
      requestId: id,
      instituteType: accountRequests[requestIndex].instituteType,
      instituteCode: accountRequests[requestIndex].instituteCode,
      rejectionReason
    });
    
    return successResponse(res, accountRequests[requestIndex], 'Account request rejected successfully');
    
  } catch (error) {
    logger.error('Reject account request error:', error);
    return errorResponse(res, 'Failed to reject account request', 500, 'REJECT_REQUEST_FAILED');
  }
};

// Send support email from institution to superadmin
export const sendSupportEmail = async (req, res) => {
  try {
    logger.info('Support email request received:', {
      fromEmail: req.body.fromEmail,
      subject: req.body.subject,
      institutionName: req.body.institutionName
    });

    const { fromEmail, institutionName, subject, message, priority = 'medium' } = req.body;

    // Validation
    const errors = [];

    if (!fromEmail || typeof fromEmail !== 'string') {
      errors.push('Sender email is required');
    } else {
      const emailErrors = validateEmail(fromEmail);
      if (emailErrors.length > 0) {
        errors.push(...emailErrors);
      }
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      errors.push('Subject is required');
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      errors.push('Message is required');
    }

    if (errors.length > 0) {
      logger.error('Support email validation failed:', errors);
      return validationErrorResponse(res, errors);
    }

    // Send support email to superadmin
    await emailService.sendSupportEmail(
      fromEmail.trim(),
      institutionName || 'Unknown Institution',
      subject.trim(),
      message.trim(),
      priority
    );

    logger.info('Support email sent successfully:', {
      from: fromEmail,
      to: process.env.SUPERADMIN_EMAIL,
      subject: subject
    });

    return successResponse(res, {
      message: 'Support request sent successfully',
      sentTo: process.env.SUPERADMIN_EMAIL
    }, 'Support request sent successfully');

  } catch (error) {
    logger.error('Send support email error:', error);
    return errorResponse(res, 'Failed to send support request', 500, 'SEND_SUPPORT_EMAIL_FAILED');
  }
};

// Get all user credentials for superadmin management
export const getAllCredentials = async (req, res) => {
  try {
    logger.info('Get all credentials request received');

    // Try to fetch from database first
    let credentials = [];
    try {
      credentials = await UserCredential.find({})
        .select('-password') // Exclude password from response for security
        .sort({ createdAt: -1 }); // Sort by newest first

      logger.info(`Found ${credentials.length} credentials in database`);
    } catch (dbError) {
      logger.warn('Database query failed, falling back to in-memory storage:', dbError.message);
      // Fallback to in-memory storage
      credentials = userCredentials.map(cred => ({
        userId: cred.userId,
        email: cred.email,
        role: cred.role,
        fullName: cred.fullName,
        instituteType: cred.instituteType,
        instituteCode: cred.instituteCode,
        permissions: cred.permissions,
        status: cred.status,
        hasLoggedIn: cred.hasLoggedIn,
        createdAt: cred.createdAt
      }));
    }

    return successResponse(res, {
      credentials: credentials,
      total: credentials.length
    }, 'Credentials retrieved successfully');

  } catch (error) {
    logger.error('Get all credentials error:', error);
    return errorResponse(res, 'Failed to retrieve credentials', 500, 'GET_CREDENTIALS_FAILED');
  }
};

export default {
  getAccountRequests,
  getAccountRequestStats,
  getAccountRequestById,
  approveAccountRequest,
  rejectAccountRequest,
  createCredentials,
  loginWithCredentials,
  addAccountRequest,
  sendSupportEmail,
  getAllCredentials
};
