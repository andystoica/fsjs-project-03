// "use strict";

/**
 * HTML snippets and global variables
 */

var colorsJsPuns  = '<option value="cornflowerblue">Cornflower Blue</option>' +
                    '<option value="darkslategrey">Dark Slate Grey</option>' +
                    '<option value="gold">Gold</option>';
var colorsHeartJs = '<option value="tomato">Tomato</option>' +
                    '<option value="steelblue">Steel Blue</option>' +
                    '<option value="dimgrey">Dim Grey</option>';
var errName       = ['Name:', 'Please provide your name:'];
var errEmail      = ['Email:', 'Please provide a valid email address:'];
var errActivities = 'Please select an activity:';
var errPayment    = 'Please select a payment method:';
var emailRegEx    = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;




/**
 * Collect events data and store into an associative array of objects
 * using name as key and the following fields: description, price, time
 *
 * Return: associative array of event objects
 */
function collectEvents() {
  var events = {}; // Keeps all events information
  // Get all labels for that control
  var optionLabels = $('.activities label');
  // Iterate over all option, extract information using RegExp and populare array
  for (var i = 0; i < optionLabels.length; i++) {
    var htmlData = optionLabels.eq(i).html();
    var eventName = htmlData.match(/name="(.+)"/)[1];
    var eventData= {
      description: htmlData.match(/> (.+) —/)[1],
      price: htmlData.match(/\$(.+)/)[1],
      time: (htmlData.match(/— (.+),/) ? htmlData.match(/— (.+),/)[1] : null)
    };
    events[eventName] = eventData;
  }
  return events;
}




/**
 * Calculate costs of selected events
 *
 * Param: eventList - Associative Array of all events
 * Return: Integer - total cost of all checked events
 */
function calculateCost(eventList) {
  var totalCost = 0;
  $('.activities input[type="checkbox"]:checked').each(function(){
    var eventName = $(this).attr('name');
    totalCost += parseInt(eventList[eventName].price);
  });
  return totalCost;
}




/**
 * Check for time conflicting events
 *
 * Param: eventList - Associative Array of event objects
 * Param: anEvent - An event name to check for conflicting times
 * Return: Array of conflicting event names
 */
function checkConflicts(eventList, anEvent) {
  // Get the event time to be checked
  var aTime = eventList[anEvent].time;
  var conflicts = [];

  for (var eventName in eventList) {
    // Check other events only
    if (eventName !== anEvent) {
      // Check if times are not null and it maches the aTime attribute
      if (eventList[eventName].time && aTime && eventList[eventName].time.toLowerCase() === aTime.toLowerCase()) {
        conflicts.push(eventName);
      }
    }
  }
  return conflicts;
}




/**
 * Disables event in the option list
 * Param: eventName - String
 */
function disableEvent(eventName) {
  $('input[name="' + eventName + '"]').attr("disabled", true);
  $('input[name="' + eventName + '"]').parent().addClass('disabled');
}




/**
 * Enables event in the option list
 * Param: eventName - String
 */
function enableEvent(eventName) {
  $('input[name="' + eventName + '"]').removeAttr("disabled");
  $('input[name="' + eventName + '"]').parent().removeClass('disabled');
}




/**
 * Clears all form validation errors
 */
function clearErrors() {
  $('label').removeClass('error');
  $('label[for="name"]').text(errName[0]);
  $('label[for="mail"]').text(errEmail[0]);
  $('p.error').remove();
}




/**
 * Credit card number validator using
 * the Luhn Alogorithm
 */
function validCC(aNumber) {
  // Accept only digits, dashes or spaces
  if (aNumber.match(/[^0-9-\s]+/)) {
    return false;
  }

  // Minimum 13 characters (shortest credit card number)
  if (aNumber.length < 13) {
    return false;
  }

  // Remove all non digits and spaces
  aNumber = aNumber.replace(/\D/g, "");

  // The Luhn Algorithm
  var controlDigit = parseInt(aNumber.charAt(aNumber.length - 1));
  var controlSum   = 0;
  var currentDigit = 0;
  var counter      = 1;

  // Iterate backwords from second last to first digit
  for (var i = aNumber.length - 2; i >= 0; i--) {
    currentDigit = parseInt(aNumber.charAt(i));

    // Multipley odd digits by 2 and subtract 9 of larger than 9
    if (counter % 2) {
      if ((currentDigit *= 2) > 9) {
        currentDigit -= 9;
      }
    }

    // Add them to the control sum
    controlSum += currentDigit;
    counter++;
  }

  // True if the modulo 10 matches the last digit
  return (controlSum % 10) === controlDigit;
}




/**
 * Form valiadator
 */
function validateForm() {
  clearErrors();
  var valid = true;
  var firstError;
  // NAME should not be empty
  if ($('#name').val().length === 0) {
    $('label[for="name"]').addClass('error').text(errName[1]);
    valid = false;
    if (!firstError) firstError = 'label[for="name"]';
  }

  // EMAIL should be a valid address
  if (!$('#mail').val().match(emailRegEx)) {
    $('label[for="mail"]').addClass('error').text(errEmail[1]);
    valid = false;
    if (!firstError) firstError = 'label[for="mail"]';
  }

  // At least one ACTIVITY is selected
  var isSelected = false;
  $('.activities input[type=checkbox]').each(function(){
    isSelected = isSelected || $(this).is(':checked');
  });
  if (!isSelected) {
    $("<p></p>").text(errActivities).addClass('error').insertAfter('.activities legend');
    valid = false;
    if (!firstError) firstError = '.activities label';
  }

  // PAYMENT option should be selected
  if ($('#payment').val() === "select_method") {
    $("<p></p>").text(errPayment).addClass('error').insertAfter('.payment legend');
    valid = false;
    if (!firstError) firstError = '.payment label';
  }

  // CREDIT CARD fileds shold be filled in and valid
  if ($('#payment').val() === "credit card") {
    if ($('#cc-num').val().length < 1 || !validCC($('#cc-num').val())) {
      $('label[for="cc-num"]').addClass('error');
      valid = false;
    }
    if (!$('#zip').val().match(/^\d{5}(?:[-\s]\d{4})?$/)) {
      $('label[for="zip"]').addClass('error');
      valid = false;
    }
    if (!$('#cvv').val().match(/\d{3}/)) {
      $('label[for="cvv"]').addClass('error');
      valid = false;
    }
  }

  // Scroll up to first error
  if (!valid) {
    $(firstError).focus();
  }

  return valid;
}




/**
 * Enhanced form behaviour
 */
function enhanceForm() {

  //// BASIC INFO
  ///
  // Focus on the first field when the page loads
  $('#name').focus();

  // Hide the Job Title field when JavaScript is working
  $('#other-title').hide();

  // When job role is changed, if "other" is selected,
  // show the "other-title" field, otherwise hide it
  $('#title').change(function(){
    if ($(this).val().toLowerCase() === 'other') {
      $('#other-title').show().focus();
    } else {
      $('#other-title').hide();
    }
  });

  //// T-SHIRT INFO
  ///
  // Hide the color section on page load
  $('#colors-js-puns').hide();

  // Show the correct color selection sub menu when the user
  // selects a new theme or remove the color selection if no
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

  //// REGISTER FOR ACTIVITIES
  ///
  // Disable conflicting activities, calculate total price
  // for all selected events and update the messags
  var eventList = collectEvents();
  $('input[type=checkbox]').change(function(){
    var eventName = $(this).attr('name');
    var isChecked = $(this).is(':checked');
    var conflicts = checkConflicts(eventList, eventName);

    // Iterate through all conflicts, if any, and deal with them
    for (var i = 0; i < conflicts.length; i++) {
      // If the control is checked, then disable the conflicts
      // otherwise enable the conflincting events
      if (isChecked) {
        disableEvent(conflicts[i]);
      } else {
        enableEvent(conflicts[i]);
      }
    }

    // Calculate and update the total cost
    var totalCost = calculateCost(eventList);
    // If the cost is larger than 0, update the cost heading
    if (totalCost > 0) {
      // If the total heading exists, then update
      // otherwise create a new element and append to the form
      if ($('h4.total-cost').length > 0) {
        $('h4.total-cost').text('Total: $' + totalCost);
      } else {
        $('<h4 class="total-cost">Total: $' + totalCost + '</h4>').insertAfter('.activities');
      }
    // If the cost is 0, remove the total heading
    } else {
      $('h4.total-cost').remove();
    }
  });

  // Wrap all checkbox labels in span element to apply custom styling
  $('input[type=checkbox]')

  //// PAYMENT INFO
  ///
  // Display appropriate content for the selected payment method
  $('#payment').change(function(){
    $(this).siblings('div').hide();
    switch ($(this).val()) {
      case 'credit card':
        $('#credit-card').show();
        break;
      case 'paypal':
        $('#paypal').show();
        break;
      case 'bitcoin':
        $('#bitcoin').show();
        break;
    }
  });

  // Select Credit Card option when the page loads
  $('#payment option').eq(1).prop('selected', true).change();

  //// FORM validation
  ///
  // Validate form on pressing the submit button
  $('button[type="submit"]').click(function(e){
    if (!validateForm()) {
      e.preventDefault();
    }
  });
}

enhanceForm();
