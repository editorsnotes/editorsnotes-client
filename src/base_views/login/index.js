var $ = require('jquery')
  , Backbone = require('../../backbone')
  , cookie = require('cookie-cutter')

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
      cookie.set('token', data.token, { path: '/' })
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
      localStorage.userInfo = JSON.stringify(resp);
    });
  }
});
