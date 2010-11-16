$(document).ready(function() {

	$('#doadora').after(
		'<a href="javascript:void(0);" onclick="return showfilter_animal(\''+baseUrl+'/json/animal/sexo/f\', \'doadora\')">\n'+
		'<img alt="" src="'+baseUrl+'/images/search.png"/>\n'+
		'</a>\n'
	);

	$('#touro').after(
			'<a href="javascript:void(0);" onclick="return showfilter_animal(\''+baseUrl+'/json/animal/sexo/m\', \'touro\')">\n'+
			'<img alt="" src="'+baseUrl+'/images/search.png"/>\n'+
			'</a>\n'
	);

	$('#criador').after(
			'<a href="javascript:void(0);" onclick="return showfilter_criador(\''+baseUrl+'/json/criador\', \'criador\')">\n'+
			'<img alt="" src="'+baseUrl+'/images/search.png"/>\n'+
			'</a>\n'
	);

	$("#doadora_cod").change(function(){
		changeSelectAnimalBySexo(this, 'F');
	});
	$("#touro_cod").change(function(){
		changeSelectAnimalBySexo(this, 'M');
	});

	$("#criador_cod").change(changeSelect);

	makeDateField('#dt_coleta', false, new Date());

	// workaround to adjust size in mozilla
	$.each($.browser, function(i) {
		if ($.browser.mozilla) {
			var _Height = parseInt(20);
		} else {
			var _Height = parseInt(0);
		}
	});

});

