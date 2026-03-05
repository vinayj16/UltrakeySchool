import Class from '../models/Class.js';
import mongoose from 'mongoose';

class ClassService {
  async createClass(classData) {
    const existingClass = await Class.findOne({
      name: classData.name,
      section: classData.section,
      academicYear: classData.academicYear,
      institutionId: classData.institutionId,
      isDeleted: false
    });

    if (existingClass) {
      throw new Error('Class with this name and section already exists for this academic year');
    }

    const newClass = new Class(classData);
    return await newClass.save();
  }

  async getClassById(classId) {
    return await Class.findById(classId)
      .populate('classTeacher', 'name email')
      .populate('institutionId', 'name')
      .populate('metadata.createdBy', 'name')
      .populate('metadata.updatedBy', 'name');
  }

  async getClassByClassId(classId) {
    return await Class.findOne({ classId, isDeleted: false })
      .populate('classTeacher', 'name email')
      .populate('institutionId', 'name');
  }

  async getAllClasses(filters = {}, options = {}) {
    const {
      name,
      section,
      status,
      academicYear,
      institutionId,
      search
    } = filters;

    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query = { isDeleted: false };

    if (name) query.name = name;
    if (section) query.section = section;
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    if (institutionId) query.institutionId = institutionId;

    if (search) {
      query.$or = [
        { classId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { section: { $regex: search, $options: 'i' } },
        { room: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [classes, total] = await Promise.all([
      Class.find(query)
        .populate('classTeacher', 'name email')
        .populate('institutionId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Class.countDocuments(query)
    ]);

    return {
      classes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateClass(classId, updateData) {
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      throw new Error('Class not found');
    }

    if (updateData.name || updateData.section || updateData.academicYear) {
      const existingClass = await Class.findOne({
        _id: { $ne: classId },
        name: updateData.name || classDoc.name,
        section: updateData.section || classDoc.section,
        academicYear: updateData.academicYear || classDoc.academicYear,
        institutionId: classDoc.institutionId,
        isDeleted: false
      });

      if (existingClass) {
        throw new Error('Class with this name and section already exists for this academic year');
      }
    }

    Object.assign(classDoc, updateData);
    return await classDoc.save();
  }

  async deleteClass(classId) {
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      throw new Error('Class not found');
    }

    classDoc.isDeleted = true;
    return await classDoc.save();
  }

  async getClassesByInstitution(institutionId, academicYear) {
    return await Class.find({
      institutionId,
      academicYear,
      isDeleted: false
    })
      .populate('classTeacher', 'name email')
      .sort({ name: 1, section: 1 });
  }

  async getClassesByStatus(status, institutionId) {
    const query = { status, isDeleted: false };
    if (institutionId) query.institutionId = institutionId;

    return await Class.find(query)
      .populate('classTeacher', 'name email')
      .sort({ name: 1, section: 1 });
  }

  async getClassStatistics(institutionId, academicYear) {
    const match = { isDeleted: false };
    if (institutionId) match.institutionId = mongoose.Types.ObjectId(institutionId);
    if (academicYear) match.academicYear = academicYear;

    const [
      totalClasses,
      activeClasses,
      inactiveClasses,
      totalStudents,
      avgStudentsPerClass,
      classesByName
    ] = await Promise.all([
      Class.countDocuments(match),
      Class.countDocuments({ ...match, status: 'active' }),
      Class.countDocuments({ ...match, status: 'inactive' }),
      Class.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: '$students' } } }
      ]),
      Class.aggregate([
        { $match: match },
        { $group: { _id: null, avg: { $avg: '$students' } } }
      ]),
      Class.aggregate([
        { $match: match },
        { $group: { _id: '$name', count: { $sum: 1 }, students: { $sum: '$students' } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    return {
      totalClasses,
      activeClasses,
      inactiveClasses,
      totalStudents: totalStudents[0]?.total || 0,
      avgStudentsPerClass: Math.round(avgStudentsPerClass[0]?.avg || 0),
      classesByName
    };
  }

  async updateStudentCount(classId, count) {
    return await Class.findByIdAndUpdate(
      classId,
      { students: count },
      { new: true }
    );
  }

  async updateSubjectCount(classId, count) {
    return await Class.findByIdAndUpdate(
      classId,
      { subjects: count },
      { new: true }
    );
  }

  async assignClassTeacher(classId, teacherId, userId) {
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      throw new Error('Class not found');
    }

    classDoc.classTeacher = teacherId;
    classDoc.metadata.updatedBy = userId;
    return await classDoc.save();
  }

  async getClassesByTeacher(teacherId) {
    return await Class.find({
      classTeacher: teacherId,
      isDeleted: false
    })
      .populate('institutionId', 'name')
      .sort({ name: 1, section: 1 });
  }

  async bulkUpdateStatus(classIds, status, userId) {
    return await Class.updateMany(
      { _id: { $in: classIds }, isDeleted: false },
      {
        $set: {
          status,
          'metadata.updatedBy': userId,
          updatedAt: new Date()
        }
      }
    );
  }

  async searchClasses(searchTerm, institutionId) {
    const query = {
      $or: [
        { classId: { $regex: searchTerm, $options: 'i' } },
        { name: { $regex: searchTerm, $options: 'i' } },
        { section: { $regex: searchTerm, $options: 'i' } },
        { room: { $regex: searchTerm, $options: 'i' } }
      ],
      isDeleted: false
    };

    if (institutionId) query.institutionId = institutionId;

    return await Class.find(query)
      .populate('classTeacher', 'name email')
      .populate('institutionId', 'name')
      .sort({ name: 1, section: 1 })
      .limit(50);
  }
}

export default new ClassService();
