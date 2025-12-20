import { Router } from 'express';
import Message from '../modals/Message';
import EnterpriseDemo from '../modals/EnterpriseDemo';
import Lead from '../modals/Lead';

const router = Router();

// POST /api/leads
router.post('/leads', async (req, res) => {
  try {
    const { name, email, mobile, utm, page } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'Name, email, and mobile are required.' });
    }
    const newLead = new Lead({ name, email, mobile, utm, page, source: 'website-modal' });
    await newLead.save();
    res.status(201).json({ message: 'Lead saved successfully!' });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/enterprise-demo
router.post('/enterprise-demo', async (req, res) => {
  try {
    const { name, email, company, page } = req.body;
    if (!name || !email || !company) {
      return res.status(400).json({ message: 'Name, email, and company are required.' });
    }
    const newDemoRequest = new EnterpriseDemo({ name, email, company, page });
    await newDemoRequest.save();
    res.status(201).json({ message: 'Demo request saved successfully!' });
  } catch (error) {
    console.error('Error saving demo request:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }
    const newMessage = new Message({ name, email, phone, subject, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message saved successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

export default router;


