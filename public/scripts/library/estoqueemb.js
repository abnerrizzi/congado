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

	$("#dt_coleta").datepicker({

		changeMonth: true,
		changeYear: true,
		showAnim: 'fadeIn',

		dateFormat: 'dd/mm/yy',
		autoSize: true,
		dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
		dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
		monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		],
	    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
	                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
	    ],
	    nextText: 'Próximo',
	    prevText: 'Anterior',
	    maxDate: new Date()
	}).keyup(function(event){
	        val = $(this).val();
	        if (val.length == 2 || val.length == 5) {
	        	val = val +'/';
	        	$(this).val(val);
	        }
	});

	// workaround to adjust size in mozilla
	$.each($.browser, function(i) {
		if ($.browser.mozilla) {
			var _Height = parseInt(20);
		} else {
			var _Height = parseInt(0);
		}
	});

});

