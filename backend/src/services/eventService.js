import Event from '../models/Event.js';

class EventService {
  async createEvent(schoolId, data) {
    return await Event.create({ ...data, schoolId });
  }

  async getEvents(schoolId, filters = {}) {
    return await Event.find({ schoolId, ...filters })
      .populate('organizer', 'firstName lastName')
      .sort({ startDate: 1 });
  }

  async getEventById(eventId, schoolId) {
    const event = await Event.findOne({ _id: eventId, schoolId })
      .populate('organizer', 'firstName lastName')
      .populate('classIds', 'name section');
    if (!event) throw new Error('Event not found');
    return event;
  }

  async updateEvent(eventId, schoolId, updates) {
    const event = await Event.findOneAndUpdate(
      { _id: eventId, schoolId },
      { $set: updates },
      { new: true }
    );
    if (!event) throw new Error('Event not found');
    return event;
  }

  async deleteEvent(eventId, schoolId) {
    const event = await Event.findOneAndDelete({ _id: eventId, schoolId });
    if (!event) throw new Error('Event not found');
    return event;
  }

  async getUpcomingEvents(schoolId) {
    return await Event.find({ 
      schoolId, 
      startDate: { $gte: new Date() },
      status: { $ne: 'cancelled' },
      isActive: true 
    }).populate('organizer', 'firstName lastName').sort({ startDate: 1 });
  }

  async getEventsByType(schoolId, eventType) {
    return await Event.find({ schoolId, eventType, isActive: true })
      .populate('organizer', 'firstName lastName')
      .sort({ startDate: 1 });
  }
}

export default new EventService();
