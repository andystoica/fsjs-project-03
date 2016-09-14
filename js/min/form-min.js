"use strict";function collectEvents(){for(var e={},t=$(".activities label"),a=0;a<t.length;a++){var r=t.eq(a).html(),o=r.match(/name="(.+)"/)[1],l={description:r.match(/> (.+) —/)[1],price:r.match(/\$(.+)/)[1],time:r.match(/— (.+),/)?r.match(/— (.+),/)[1]:null};e[o]=l}return e}function calculateCost(e){var t=0;return $('.activities input[type="checkbox"]:checked').each(function(){var a=$(this).attr("name");t+=parseInt(e[a].price)}),t}function checkConflicts(e,t){var a=e[t].time,r=[];for(var o in e)o!==t&&e[o].time&&a&&e[o].time.toLowerCase()===a.toLowerCase()&&r.push(o);return r}function disableEvent(e){$('input[name="'+e+'"]').attr("disabled",!0),$('input[name="'+e+'"]').parent().addClass("disabled")}function enableEvent(e){$('input[name="'+e+'"]').removeAttr("disabled"),$('input[name="'+e+'"]').parent().removeClass("disabled")}function clearErrors(){$("label").removeClass("error"),$('label[for="name"]').text(errName[0]),$('label[for="mail"]').text(errEmail[0]),$("p.error").remove()}function validCC(e){if(e.match(/[^0-9-\s]+/))return!1;if(e.length<13)return!1;e=e.replace(/\D/g,"");for(var t=parseInt(e.charAt(e.length-1)),a=0,r=0,o=1,l=e.length-2;l>=0;l--)r=parseInt(e.charAt(l)),o%2&&(r*=2)>9&&(r-=9),a+=r,o++;return a%10===t}function validateForm(){clearErrors();var e=!0;0===$("#name").val().length&&($('label[for="name"]').addClass("error").text(errName[1]),e=!1),$("#mail").val().match(emailRegEx)||($('label[for="mail"]').addClass("error").text(errEmail[1]),e=!1);var t=!1;return $(".activities input[type=checkbox]").each(function(){t=t||$(this).is(":checked")}),t||($("<p></p>").text(errActivities).addClass("error").insertAfter(".activities legend"),e=!1),"select_method"===$("#payment").val()&&($("<p></p>").text(errPayment).addClass("error").insertAfter(".payment legend"),e=!1),"credit card"===$("#payment").val()&&(($("#cc-num").val().length<1||!validCC($("#cc-num").val()))&&($('label[for="cc-num"]').addClass("error"),e=!1),$("#zip").val().match(/^\d{5}(?:[-\s]\d{4})?$/)||($('label[for="zip"]').addClass("error"),e=!1),$("#cvv").val().match(/\d{3}/)||($('label[for="cvv"]').addClass("error"),e=!1)),e}function enhanceForm(){$("#name").focus(),$("#other-title").hide(),$("#title").change(function(){"other"===$(this).val().toLowerCase()?$("#other-title").show():$("#other-title").hide()}),$("#colors-js-puns").hide(),$("#design").change(function(){switch($(this).val().toLowerCase()){case"js puns":$("#color").html(colorsJsPuns),$("#colors-js-puns").show();break;case"heart js":$("#color").html(colorsHeartJs),$("#colors-js-puns").show();break;default:$("#color").html(""),$("#colors-js-puns").hide()}});var e=collectEvents();$("input[type=checkbox]").change(function(){for(var t=$(this).attr("name"),a=$(this).is(":checked"),r=checkConflicts(e,t),o=0;o<r.length;o++)a?disableEvent(r[o]):enableEvent(r[o]);var l=calculateCost(e);l>0?$("h4.total-cost").length>0?$("h4.total-cost").text("Total: $"+l):$('<h4 class="total-cost">Total: $'+l+"</h4>").insertAfter(".activities"):$("h4.total-cost").remove()}),$("#payment").change(function(){switch($(this).siblings("div").hide(),$(this).val()){case"credit card":$("#credit-card").show();break;case"paypal":$("#paypal").show();break;case"bitcoin":$("#bitcoin").show()}}),$("#payment option").eq(1).prop("selected",!0).change(),$('button[type="submit"]').click(function(e){validateForm()||e.preventDefault()})}var colorsJsPuns='<option value="cornflowerblue">Cornflower Blue</option><option value="darkslategrey">Dark Slate Grey</option><option value="gold">Gold</option>',colorsHeartJs='<option value="tomato">Tomato</option><option value="steelblue">Steel Blue</option><option value="dimgrey">Dim Grey</option>',errName=["Name:","Please provide your name"],errEmail=["Email:","Please provide a valid email address"],errActivities="Please select an activity",errPayment="Please select a payment method",emailRegEx=/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;enhanceForm();