$('#rhyme-form').on('submit', function(e) {
  var rhymeLine = $('#rhyme-line').val();
  $.post('/rhyme', {line: rhymeLine}, function(res) {
    var poem = [{'text': rhymeLine}].concat(res);
    for (var i = 0; i < res.length; i++) {
      $('#tweets').append('<li>' + poem[i].text + '</li>');
    }
  });

  return false;
});
