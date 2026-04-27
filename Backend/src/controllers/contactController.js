import Contact from '../models/Contact.js';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message
    });
    
    res.status(201).json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      contact: newContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
