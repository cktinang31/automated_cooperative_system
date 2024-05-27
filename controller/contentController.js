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

module.exports = {
    post_announcement,
}