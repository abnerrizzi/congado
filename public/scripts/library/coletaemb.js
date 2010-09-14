function _xf()
{
	$('#fazenda_id').val(1);$('#dt_coleta').val('10/09/2010');
	$('#vaca_cod').val(101);$('#vaca_cod').change();
	$('#tabs').show();$('#tabs').tabs('option', 'selected', 2);
	$('#avalia_od').val(11);$('#avalia_oe').val(10);
	$('#fecundada').val(21);$('#nao_fecundada').val(0);
	$('#viavel').val(21);$('#nao_viavel').val(0);
}




function checkInts()
{
	for ( var int = 0; int < $('#tab3 .input_num').length; int++) {
		var __el =  $('#tab3 .input_num')[int];
		if (isNaN(parseInt(__el.value))) {
			__el.value = 0;
		}
	}
}

function checkEmbrioes()
{
	checkInts();

	var avaliadas	= parseInt($('#avalia_od').val()) + parseInt($('#avalia_oe').val());
	var fecundadas	= parseInt($('#fecundada').val()) + parseInt($('#nao_fecundada').val());
	var viaveis		= parseInt($('#viavel').val()) + parseInt($('#nao_viavel').val());

	if (avaliadas != fecundadas) {
		window.alert('O total de estruturas fecundadas e n�o fecundadas deve ser igual ao n�mero de estruturas avaliadas.');
		return false;
	} else if (viaveis != parseInt($('#fecundada').val())) {
		window.alert('O total de estruturas vi�veis e n�o vi�veis deve ser igual ao n�mero de estruturas fecundadas.');
		return false;
	} else if (parseInt($('#vaca_id').val()) > 0) {
		// Ta tudo OK
		// Continua o script ate chamar a funcao e gerar o grid
		// window.alert('aguarde enquanto o grid eh criado');
		// chama a funcao de criar as linhas na tabela de embrioes
	} else {
		window.alert('ocorreu um erro inesperado');
	}

	if ($('#ultimo').val() != "") {
		var _ultimo = $('#ultimo').val();
		for (var int = (_ultimo.length - 1); int >= 0; int--) {
			if (parseInt(_ultimo.substr(int,1)) >= 0) {
				var firstInt = int;
			} else {
				break;
			}
		}
//		console.log('ultima' + '(' + _ultimo.substr(firstInt) + ')');
//		console.log('str:  ' + '(' + _ultimo.substr(0, firstInt) + ')');
		_ultimoInt = _ultimo.substr(firstInt);
		_ultimoStr = _ultimo.substr(0, firstInt);

		createGridData(_ultimoInt, _ultimoStr, parseInt($('#viavel').val()));
	}
}

$(document).ready(function() {

		// implementar validacao
		/*
		 * (viavel + nao_viavel) = fecundada
		 * num_emb_na_lista = viavel
		 */

	// verifica o numero de estruturas viaves/nao viaveis x fecundadas
	// ((parseInt($('#viavel').val()) + parseInt($('#nao_viavel').val())) == parseInt($('#fecundada').val()));

	/*
	 * msg d aviso do congado
	 * O n�mero de embri�es lan�ados est� menor que o n�mero de estruturas vi�veis.
	 */


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
		dayNames: ['Domingo', 'Segunda', 'Ter�a', 'Quarta', 'Quinta', 'Sexta', 'S�bado'],
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
		dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
		monthNames: ['Janeiro', 'Fevereiro', 'Mar�o', 'Abril', 'Maio', 'Junho',
		             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		],
	    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
	                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
	    ],
	    nextText: 'Pr�ximo',
	    prevText: 'Anterior',
	    maxDate: new Date()
	}).keyup(function(event){
	        val = $(this).val();
	        if (val.length == 2 || val.length == 5) {
	        	val = val +'/';
	        	$(this).val(val);
	        }
	}).focus(function() {
        $('#ui-datepicker-div').css('left', $(this).offset().left + 80);
    });

	$("#prost_dhd, #gnrh_dhd, #cio_dhd, #insemina_dh1d, #insemina_dh2d, #insemina_dh3d, #insemina_dh4d").datepicker({

		changeMonth: true,
		changeYear: true,
		showAnim: 'fadeIn',

		dateFormat: 'dd/mm/yy',
		autoSize: true,
		dayNames: ['Domingo', 'Segunda', 'Ter�a', 'Quarta', 'Quinta', 'Sexta', 'S�bado'],
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
		dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
		monthNames: ['Janeiro', 'Fevereiro', 'Mar�o', 'Abril', 'Maio', 'Junho',
		             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		],
	    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
	                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
	    ],
	    nextText: 'Pr�ximo',
	    prevText: 'Anterior',
	    maxDate: new Date()
	}).keyup(function(event){
	        val = $(this).val();
	        if (val.length == 2 || val.length == 5) {
	        	val = val +'/';
	        	$(this).val(val);
	        }
	}).focus(function() { 
        $('#ui-datepicker-div').css('left', $(this).offset().left + 80); 
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
				$("#ajax_loader").html("Hora inv�lida").show();
				setTimeout(function(){
					$("#ajax_loader").fadeOut(300);
				}
				, 2000);
			} else {
				window.alert('Hora inv�lida');
			}
		}
	});

	$("#tabs").tabs();


	// if obs exists Dialogs appers
	if ($('#obs').val() != '') {
		createDialog('Animal com observa��o', 400, 300);
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

	if ($("#dt_coleta").val() != "" && $("#vaca_cod").val() != "") {
		checkFields();
	}

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
		"#fazenda_id",
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
			$("#ajax_loader").html("C�digo n�o encontrado").show();
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


function createGridData(int, str, size)
{
	int++;
	console.log('Int: ' + int + '\n' + 'Str: ' + str + '\n' + 'siz: ' + size);
	// remove default row
	// $('#id1').remove();
	// add empty line

	// total rows except bottom
	for (var i = 0; i < size; i++) {
		sequence = str + (parseInt(int)+parseInt(i));
//		_lastRow = $('#embrioes')[0].rows.length-2;
		// insere tr;



		// espacamento anterior
		if (i > 0) {
			_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
				_r1.className = 'content';
			_c0 = _r1.insertCell(0);
				_c0.height = 2;
				_c0.colSpan = 12;
		}

		// Conteudo
		_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
			_r1.className = 'row' + (i%2);

		currentCell = 0;
		cell = _r1.insertCell(currentCell);

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.innerHTML = sequence;

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.style.backgroundImage = "url(/images/grid/divisor_content.gif)";

		currentCell++;
		cell = _r1.insertCell(currentCell);

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.innerHTML = 'innerHTML';

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.style.backgroundImage = "url(/images/grid/divisor_content.gif)";

		currentCell++;
		cell = _r1.insertCell(currentCell);
		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.innerHTML = 'xxx';

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.style.backgroundImage = "url(/images/grid/divisor_content.gif)";

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.innerHTML = 'yyy';
		cell = _r1.insertCell(currentCell);
		cell.style.backgroundImage = "url(/images/grid/divisor_content.gif)";

		if (i < (size-1)) {
			_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
			_c0 = _r1.insertCell(0);
			_c0.colSpan = 12;
			_c0.height = 2;

			_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
			_c0 = _r1.insertCell(0);
			_c0.bgColor = "#bfbdb3";
			_c0.colSpan = 12;
			_c0.height = 1;
		}
	}

}