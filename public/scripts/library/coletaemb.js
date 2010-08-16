$(document).ready(function() {

	$('#vaca, #vaca_cod')
		.css('font-size', '16px')
		.css('font-weight', 'bold')
		.css('border', '2px solid #f63');

	$('#ultimo').addClass('readonly');
	$('#ultimo').attr('disabled', 'disabled');

	$('#dlg').bind('dialogbeforeclose', function(event, ui) {
		hide_filter();
	});

	$("#vaca_cod").change(function(){
		changeSelectAnimalBySexo(this, 'F', buscaUltimoEmbriao);
	});
	$("#touro_cod").change(function(){
		changeSelectAnimalBySexo(this, 'M');
	});

	$("#dt_coleta, #trata_inicio, #trata_final").datepicker({

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

	$("#prost_dhd, #gnrh_dhd, #cio_dhd, #insemina_dh1d, #insemina_dh2d, #insemina_dh3d, #insemina_dh4d").datepicker({

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

	// Filtro para campos de hora
	$('#prost_dhh, #gnrh_dhh, #cio_dhh, #insemina_dh1h, #insemina_dh2h, #insemina_dh3h, #insemina_dh4h').keypress(function(event){
        val = $(this).val();
        if (val.length == 2) {
        	val = val +':';
        	$(this).val(val);
        }
	}).blur(function() {
		time = $(this).val().split(':');
		if (time[0] > 23 || time[1] > 59) {
			$(this).val('');
			$(this).focus();
			if ($("#ajax_loader")) {
				$("#ajax_loader").html("Hora inválida").show();
				setTimeout(function(){
					$("#ajax_loader").fadeOut(300);
				}
				, 2000);
			} else {
				window.alert('Hora inválida');
			}
		}
	});

	$("#tabs").tabs();
	

	// if obs exists Dialogs appers
	if ($('#obs').val() != '') {
		createDialog('Animal com observação', 400, 300);
		$('#dlg').html($('#obs').val());
	};

	// workaround to adjust size in mozilla
	$.each($.browser, function(i) {
		if ($.browser.mozilla) {
			var _Height = parseInt(20);
		} else {
			var _Height = parseInt(0);
		}
	});

	// check edit mode and put correct icons
	__editMode = checkEditUrl(window.location.href);
	if (__editMode) {
		$('#touro').next().remove();
	} else {
		$('#tabs').hide();
	}


	$("#dt_coleta").change(function() {
		checkDate(this);
		checkFields();
	});
	$("#dt_coleta, #vaca_cod").blur(checkFields);

	$("#coleta_de_embrioes:form").submit(function() { toggleFields(false); });
});


function checkFields()
{
	__return = false;
	if ($("#vaca_id").val() != "" && $("#dt_coleta").val() != "") {
		$('#tabs').show();
		$("#submit_").parent().parent().parent().show();
		__return = true;
	} else {
		__return = false;
	}

	return __return;

}



function hide_filter() {
	$("#dlg").fadeOut(200);
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$('#dlg').dialog('destroy');
	$("#dlg-grid").remove();
	$("#dlg").append('<div id="dlg-grid"></div>');
}

function toggleFields(opt) {


	objs = Array(
		"#vaca_cod",
		"#vaca",
		"#dt_coleta",
		"#touro_cod",
		"#touro",
		"#insemina_dh1d",
		"#insemina_dh1h",
		"#dose1",
		"#partida1",
		"#insemina_dh2d",
		"#insemina_dh2h",
		"#dose2",
		"#partida2",
		"#insemina_dh3d",
		"#insemina_dh3h",
		"#dose3",
		"#partida3",
		"#insemina_dh4d",
		"#insemina_dh4h",
		"#dose4",
		"#partida4"
	);

	for (i=0; i < objs.length; i++)
	{
		$(objs[i]).attr('disabled', opt);
		$(objs[i]).attr('readonly', opt);
	}

}

function buscaUltimoEmbriao(el)
{
	$("#ajax_loader").html("Buscando dados...").show();

	__url = baseUrl + '/json/ultimoembriao';
	$.post(__url, {
		id		: $('#vaca_id').val(),
		ajax	: 'true'
	}, function(j) {
		$('#ultimo').val(j.embriao);
		/*
		if (j && j.length == 1) {
			$("#" + __fieldName + "_id").val(j[0].id);
			$("#" + __fieldName + "_cod").val(j[0].cell[0]);
			$("#" + __fieldName).val(j[0].cell[1]);
		} else {
			$("#ajax_loader").html("Código não encontrado").show();
			$("#" + __fieldName + "_id").val('');
//			$("#" + __fieldName + "_cod").val(null);
			$("#" + __fieldName).val('');
			setTimeout(function(){
				$("#ajax_loader").fadeOut(300); }
			, 2000);
			return false;
		}
		*/
		$("#ajax_loader").fadeOut(30);
	}, "json");
}


