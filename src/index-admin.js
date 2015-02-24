"use strict";

var Backbone = require('./backbone')
  , $ = require('./jquery')
  , Project = require('./models/project')
  , router = require('./client')

router.add(require('./admin_views/routes'));

$(document).ready(function () {
  initFeedback();
  initEditors();
});

// Add a button for feedback
function initFeedback() {
  var FeedbackView = require('./admin_views/widgets/feedback')
    , feedbackHint = new FeedbackView()

  feedbackHint.$el.appendTo('body');
}

// Initialize text editors for textareas with the magic word in the class name
// TODO: remove?
function initEditors() {
  $('textarea.xhtml-textarea:visible').each(function (idx, textarea) {
    $(textarea).editText();
  });
}
