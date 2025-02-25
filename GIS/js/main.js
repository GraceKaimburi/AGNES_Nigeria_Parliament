$(document).ready(function() {
	// Toggle navbar menu on mobile
	$('.navbar-toggle').on('click', function() {
	  $('#navbar-menu').toggleClass('in');
	});
	
	// Add active class to current page
	var path = window.location.pathname;
	var page = path.split("/").pop();
	
	$('.nav.navbar-nav.navbar-right li a').each(function() {
	  var href = $(this).attr('href');
	  if (href.indexOf(page) > -1) {
		$(this).parent().addClass('active');
	  }
	});
  });