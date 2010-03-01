$(document).ready(function() {

	$("input#cod").focus();

	$("input#unidade").blur(function() {
		if (this.value.length > 0) {
			this.value = parseFloat(this.value.replace(",", "."));
			if (this.value == 'NaN') {
				this.value = '';
			}
		}
	});

});
