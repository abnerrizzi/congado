$(document).ready(function() {

	$("input#cod").focus();

	$("#dt_inicio, #dt_fim").datepicker({

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
        beforeShow: customRange
	});

	$("#dt_inicio, #dt_fim").keyup(function(event){
	        val = $(this).val();
	        if (val.length == 2 || val.length == 5) {
	        	val = val +'/';
	        	$(this).val(val);
	        }
	});

	function customRange(input)
	{
		return {
			minDate: (input.id == "dt_inicio" ? new Date(2008, 12 - 1, 1) : null),
			minDate: (input.id == "dt_fim" ? $("#dt_inicio").datepicker("getDate") : null),
			maxDate: (input.id == "dt_inicio" ? $("#dt_fim").datepicker("getDate") : null)
		};
	}
});
