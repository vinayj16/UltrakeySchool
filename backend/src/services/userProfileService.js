import User from '../models/User.js';

class UserProfileService {
  async getUserProfile(schoolId, userId) {
    const user = await User.findOne({
      _id: userId,
      schoolId,
      isActive: true
    }).lean();

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatUserProfile(user);
  }

  async updateUserProfile(schoolId, userId, updateData) {
    const allowedFields = ['name', 'email', 'phone', 'profileImage', 'department'];
    const filteredData = {};

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const user = await User.findOneAndUpdate(
      { _id: userId, schoolId },
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatUserProfile(user.toObject());
  }

  async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      $set: { lastLogin: new Date() }
    });
  }

  async getUserPermissions(userId) {
    const user = await User.findById(userId).lean();
    
    if (!user) {
      throw new Error('User not found');
    }

    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
      principal: ['read', 'write', 'manage_academic'],
      teacher: ['read', 'write', 'manage_classes'],
      student: ['read'],
      parent: ['read'],
      staff: ['read', 'write']
    };

    return rolePermissions[user.role] || ['read'];
  }

  formatUserProfile(user) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.profileImage || '/assets/img/placeholder-avatar.webp',
      department: user.department,
      lastLogin: user.lastLogin || new Date(),
      isOnline: true,
      permissions: []
    };
  }
}

export default new UserProfileService();
