import CustomField from '../models/CustomField.js';

class CustomFieldService {
  async createField(schoolId, data) {
    return await CustomField.create({ ...data, schoolId });
  }

  async getFields(schoolId, entityType) {
    return await CustomField.find({ schoolId, entityType, isActive: true })
      .sort({ displayOrder: 1 });
  }

  async getFieldById(fieldId, schoolId) {
    const field = await CustomField.findOne({ _id: fieldId, schoolId });
    if (!field) throw new Error('Custom field not found');
    return field;
  }

  async updateField(fieldId, schoolId, updates) {
    const field = await CustomField.findOneAndUpdate(
      { _id: fieldId, schoolId },
      { $set: updates },
      { new: true }
    );
    if (!field) throw new Error('Custom field not found');
    return field;
  }

  async deleteField(fieldId, schoolId) {
    const field = await CustomField.findOneAndDelete({ _id: fieldId, schoolId });
    if (!field) throw new Error('Custom field not found');
    return field;
  }

  async reorderFields(schoolId, entityType, orderedIds) {
    await Promise.all(orderedIds.map((id, index) => 
      CustomField.updateOne({ _id: id, schoolId, entityType }, { displayOrder: index })
    ));
    return await this.getFields(schoolId, entityType);
  }
}

export default new CustomFieldService();
