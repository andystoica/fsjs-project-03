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
 * Collect events data and store into an index array of objects
 * with following fields: index, name, description, time, price
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
 * Enhanced form behaviour
 */
function enhanceForm() {
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

  // Disable conflicting activities, calculate total price
  // for all selected events and update the messags
  var eventList = collectEvents();
  $('input[type=checkbox]').change(function(){
    var eventName = $(this).attr('name');
    var isChecked = $(this).is(':checked');
    var conflicts = checkConflicts(eventList, eventName);

    // Iterate through all conflicts, if any and deal with them
    for (var i = 0; i < conflicts.length; i++) {
      // If the control is checked, then disable the conflicts
      // other wise enable the conflincting event
      if (isChecked) {
        disableEvent(conflicts[i]);
      } else {
        enableEvent(conflicts[i]);
      }
    }

    // Calculate and update the total cost
    var totalCost = calculateCost(eventList);
    // If the cost is larger than 0, update the cost
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
}


enhanceForm();
