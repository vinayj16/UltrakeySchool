import emailService from '../services/emailService.js';

const createEmail = async (req, res) => {
  try {
    const email = await emailService.createEmail(req.body);
    res.status(201).json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getEmailById = async (req, res) => {
  try {
    const email = await emailService.getEmailById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllEmails = async (req, res) => {
  try {
    const result = await emailService.getAllEmails(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmail = async (req, res) => {
  try {
    const email = await emailService.updateEmail(req.params.id, req.body);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteEmail = async (req, res) => {
  try {
    const email = await emailService.deleteEmail(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    res.json({ success: true, message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { ids, isRead } = req.body;
    const result = await emailService.markAsRead(ids, isRead);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const toggleStar = async (req, res) => {
  try {
    const email = await emailService.toggleStar(req.params.id);
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const toggleImportant = async (req, res) => {
  try {
    const email = await emailService.toggleImportant(req.params.id);
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const moveToFolder = async (req, res) => {
  try {
    const { ids, folder } = req.body;
    const result = await emailService.moveToFolder(ids, folder);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const sendEmail = async (req, res) => {
  try {
    const email = await emailService.sendEmail(req.body);
    res.status(201).json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const saveDraft = async (req, res) => {
  try {
    const email = await emailService.saveDraft(req.body);
    res.status(201).json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const scheduleEmail = async (req, res) => {
  try {
    const { scheduledFor, ...emailData } = req.body;
    const email = await emailService.scheduleEmail(emailData, scheduledFor);
    res.status(201).json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const replyToEmail = async (req, res) => {
  try {
    const email = await emailService.replyToEmail(req.params.id, req.body);
    res.status(201).json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const forwardEmail = async (req, res) => {
  try {
    const email = await emailService.forwardEmail(req.params.id, req.body);
    res.status(201).json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const addTags = async (req, res) => {
  try {
    const { tags } = req.body;
    const email = await emailService.addTags(req.params.id, tags);
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeTags = async (req, res) => {
  try {
    const { tags } = req.body;
    const email = await emailService.removeTags(req.params.id, tags);
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const addLabels = async (req, res) => {
  try {
    const { labels } = req.body;
    const email = await emailService.addLabels(req.params.id, labels);
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeLabels = async (req, res) => {
  try {
    const { labels } = req.body;
    const email = await emailService.removeLabels(req.params.id, labels);
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { userId, institutionId } = req.query;
    const stats = await emailService.getStatistics(userId, institutionId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmailsByThread = async (req, res) => {
  try {
    const emails = await emailService.getEmailsByThread(req.params.threadId);
    res.json({ success: true, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchEmails = async (req, res) => {
  try {
    const { search, userId, institutionId } = req.query;
    const emails = await emailService.searchEmails(search, userId, institutionId);
    res.json({ success: true, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecentEmails = async (req, res) => {
  try {
    const { userId, institutionId, days } = req.query;
    const emails = await emailService.getRecentEmails(userId, institutionId, days);
    res.json({ success: true, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    const result = await emailService.bulkDelete(ids);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const permanentDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    const result = await emailService.permanentDelete(ids);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const emptyTrash = async (req, res) => {
  try {
    const { userId, institutionId } = req.query;
    const result = await emailService.emptyTrash(userId, institutionId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export default {
  createEmail,
  getEmailById,
  getAllEmails,
  updateEmail,
  deleteEmail,
  markAsRead,
  toggleStar,
  toggleImportant,
  moveToFolder,
  sendEmail,
  saveDraft,
  scheduleEmail,
  replyToEmail,
  forwardEmail,
  addTags,
  removeTags,
  addLabels,
  removeLabels,
  getStatistics,
  getEmailsByThread,
  searchEmails,
  getRecentEmails,
  bulkDelete,
  permanentDelete,
  emptyTrash
};
