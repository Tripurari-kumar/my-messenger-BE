const {
  addMessage,
  getAllMessage,
  allLastTextMessages,
} = require('../controllers/messagesController');

const router = require('express').Router();

router.post('/addmsg/', addMessage);
router.post('/getmsg/', getAllMessage);
router.get('/allLastMsgs/:id', allLastTextMessages);

module.exports = router;
