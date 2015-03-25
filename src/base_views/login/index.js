var $ = require('jquery')
  , Backbone = require('../../backbone')
  , cookie = require('cookie-cutter')

function getExpirationTime(numDays) {
  var now = new Date().getTime()
    , day = 1000 * 60 * 60 * 24

  numDays = numDays || 120;

  return new Date(now + numDays * day);
}

module.exports = Backbone.View.extend({
  template: 'login.html',
  events: {
    'submit form': 'handleSubmit'
  },
  handleSubmit: function (e) {
    e.preventDefault();

    $.ajax({
      type: 'POST',
      url: '/auth-token/',
      dataType: 'json',
      contentType:"application/json; charset=utf-8",
      data: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value
      }),
    }).then(function (data) {
      cookie.set('token', '', { expires: new Date(0) });
      cookie.set('token', data.token, { path: '/', expires: getExpirationTime() })
      return data.token;
    }).then(function (token) {
      return $.ajax({
        url: '/me/',
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Token ' + token);
        }
      });
    }).then(function (resp) {
      var querystring = require('querystring')
        , next = querystring.parse(window.location.search).return_to || '/me/'

      localStorage.userInfo = JSON.stringify(resp);
      sessionStorage.message = {
        tags: 'success',
        content: 'successfully logged in.'
      }

      window.location.href = next;
    }, function (err) {
      console.error(err);
    });
  }
});
