$(document).ready(function() {

	$('[name=fazenda]').change(function(){
		$('#form_fazenda').submit();
	});
	$('span > input').click(function(){
		$('#form_fazenda').submit();
	});
});
