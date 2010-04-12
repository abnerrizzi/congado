$(document).ready(function() {

	$("input#cod").focus();

	$("input#area").blur(function() {
		if (this.value.length > 0) {
			this.value = parseFloat(this.value.replace(",", "."));
			if (this.value == 'NaN') {
				this.value = '';
			}
		}
	});

	$('input#area').keypress(function(event) {
		return onlyNumbers(event);
	});

});
