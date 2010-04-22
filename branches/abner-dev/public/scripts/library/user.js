$(document).ready(function() {

	$("#cancel").click(function(){
		location.href = baseUrl + '/index';
		return false;
	});

	$("form").submit(function() {
		x = $("form #login");
		if (x.attr('readonly')) {
			x.removeAttr('readonly');
		}
		if (x.attr('disabled')) {
			x.removeAttr('disabled');
		}
		x.removeClass('readonly');
		x.addClass('input');
	});

});
