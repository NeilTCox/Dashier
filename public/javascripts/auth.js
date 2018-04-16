$(function() {
  const joinModal = $('#joinModal');
  const loginModal = $('#loginModal');
  const joinButton = $('#joinButton');
  const loginButton = $('#loginButton');
  const joinError = $('#join-errors');
  const loginError = $('#login-errors');

  joinModal.on('submit', function(event) {
    event.preventDefault();
    joinButton.prop('disabled', true);
    form_data = $(this).serialize;
    axios.post('/user/join', form_data)
      .then(function(response) {
        window.location.href = "/dashboard";
      })
      .catch(function(error) {
        joinError.removeClass('hide').text(error.response.data);
        joinButton.prop('disabled', false);
      });
  });

  loginModal.on('submit', function(event) {
    event.preventDefault();
    loginButton.prop('disabled', true);
    form_data = $(this).serialize;
    axios.post('/user/login', form_data)
      .then(function(response) {
        window.location.href = "/dashboard";
      })
      .catch(function(error) {
        loginError.removeClass('hide').text(error.response.data);
        loginButton.prop('disabled', false);
      });
  });
});