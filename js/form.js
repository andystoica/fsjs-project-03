/**
 * HTML snippets
 */

var colorsJsPuns  = '<option value="cornflowerblue">Cornflower Blue</option>' +
                    '<option value="darkslategrey">Dark Slate Grey</option>' +
                    '<option value="gold">Gold</option>';
var colorsHeartJs = '<option value="tomato">Tomato</option>' +
                    '<option value="steelblue">Steel Blue</option>' +
                    '<option value="dimgrey">Dim Grey</option>';



/**
 * Enhanced form behaviour
 */

// Focus on the first field when the page loads
$('#name').focus();

// Hide the Job Title field when JavaScript is working
$('#other-title').hide();

// When job role is changed, tf "other" is selected,
// show the "other-title" field, otherwise hide it
$('#title').change(function(){
  if ($(this).val().toLowerCase() === 'other') {
    $('#other-title').show();
  } else {
    $('#other-title').hide();
  }
});

// Hide the color section on page load
$('#colors-js-puns').hide();

// Show the correct color selection sub menu when the user
// selects a new theme or remove the color selection of no
// theme is chosen
$('#design').change(function(){
  switch($(this).val().toLowerCase()) {
    case 'js puns':
      $('#color').html(colorsJsPuns);
      $('#colors-js-puns').show();
      break;
    case 'heart js':
      $('#color').html(colorsHeartJs);
      $('#colors-js-puns').show();
      break;
    default:
      $('#color').html('');
      $('#colors-js-puns').hide();
  }
});
