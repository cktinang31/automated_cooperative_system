const Content = require('../models/content');

const post_announcement = async (req, res) => {
    try {
        const { content_title, content } = req.body;
    
        const newContent = await Content.create({
          content_title,
          content,
          timestamp: new Date()
        });
    
        console.log('Member/Announcement:', newContent);
        res.send('Announcement Posted');
      } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).send('Error creating announcement.');
      }
    
};


const delete_content = async (req, res) => {
  try {
      const { user_id } = req.body;  
      const content = await Content.findByPk(user_id);
      if (!content) {
          return res.status(404).send('Content not found');
      }
      await content.destroy();
      return res.status(200).send('Content deleted successfully');
  } catch (error) {
      console.error('Error deleting content:', error);
      return res.status(500).send('Error deleting content.');
  }
};


module.exports = {
    post_announcement,
    delete_content,
}