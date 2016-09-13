
/**
 * Main form behaviour
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
