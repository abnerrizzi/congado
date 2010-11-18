var jsonCriador = '';
var jsonCriado = false;
$(document).ready(function() {

	$.post(baseUrl + '/json/criador', {
		ajax : 'true'
	}, function(j) {
		j = j.rows;
		jsonCriador = '<select name="criador"><option value="">-- Selecione um criador --</option>';
		for ( var i = 0; i < j.length; i++) {
			jsonCriador += '<option value="' + j[i].id + '">' + j[i].cell[0] +' - '+ j[i].cell[1]
					+ '</option>';
		}
		jsonCriador += '</select>';
	}, "json");

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

	makeDateField("#dt_coleta, #insemina_dh1d", false, new Date());


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
		$('#submit_').parent().hide();
	}


	$("#dt_coleta").change(function() {
		checkDate(this);
		checkFields();
	});
	$("#dt_coleta, #vaca_cod").blur(checkFields);

	if ($("#dt_coleta").val() != "" && $("#vaca_cod").val() != "") {
		checkFields();
	}

	// old jQuery
	// $("#coleta_de_embrioes:form").submit(function(){
	// new jQuery
	$("#coleta_de_embrioes").submit(function(){


		checkInts();

		if (checkAddUrl(window.location.href) == true) {
			var avaliadas	= parseInt($('#avalia_od').val()) + parseInt($('#avalia_oe').val());
			var fecundadas	= parseInt($('#fecundada').val()) + parseInt($('#nao_fecundada').val());
			var viaveis		= parseInt($('#viavel').val()) + parseInt($('#nao_viavel').val());

			if (avaliadas != fecundadas) {
				window.alert('O total de estruturas fecundadas e não fecundadas deve ser igual ao número de estruturas avaliadas.');
				return false;
			} else if (viaveis != parseInt($('#fecundada').val())) {
				window.alert('O total de estruturas viáveis e não viáveis deve ser igual ao número de estruturas fecundadas.');
				return false;
			} else if (parseInt($('[name*=embriao][name*=cod]').length) != parseInt($('#viavel').val())) {
				window.alert('Quantidade de embrioes diferente da quantidade de estruturas viaveis.');
				return false;
			} else if (viaveis == 0) {
				return window.confirm('Deseja realmente cadastrar uma coleta de embriões sem embriões viáveis?');
			} else {
				// ta tudo ok
			}
			if (verificaEmbrioesExists() == true) {
				return false;
			}
		}

		toggleFields(false);
	});

	checkFields();

	if ((typeof(jsonEmbrioes) != 'undefined') && jsonEmbrioes.length > 0) {
		createGridDataJson(jsonEmbrioes);
	}

});

function _xf()
{
	$('#fazenda_id').val(1);$('#dt_coleta').val('10/09/2010');
	$('#vaca_cod').val(101);$('#vaca_cod').change();
	$('#tabs').show();$('#tabs').tabs('option', 'selected', 1);
	$('#avalia_od').val(6);$('#avalia_oe').val(5);
	$('#fecundada').val(11);$('#nao_fecundada').val(0);
	$('#viavel').val(11);$('#nao_viavel').val(0);
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
		window.alert('O total de estruturas fecundadas e não fecundadas deve ser igual ao número de estruturas avaliadas.');
		return false;
	} else if (viaveis != parseInt($('#fecundada').val())) {
		window.alert('O total de estruturas viáveis e não viáveis deve ser igual ao número de estruturas fecundadas.');
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
		_ultimoInt = _ultimo.substr(firstInt);
		_ultimoStr = _ultimo.substr(0, firstInt);

		createGridData(_ultimoInt, _ultimoStr, parseInt($('#viavel').val()));
	}
}

function checkFields()
{
	__return = false;
	if ($("#vaca_id").val() != "" && $("#dt_coleta").val() != "") {
		$('#tabs').show();
		$('#submit_').parent().show();
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
		"#partida4",
		"#ultimo"
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

function createGridData(int, str, size)
{

	$('#ajax_loader').html('Gerando dados...').show();
	if (jsonCriado == true)
		if (!window.confirm("Deseja gerar novamente a tabela de embrioes? (Os dados anteriores serao substituidos)")) {
			$('#ajax_loader').fadeOut(100);
			return false;
		}

	__str = window.prompt('Qual codigo sera utilizado para gerar os embriões?', str);
	if (__str == null) {
		return false;
	} else {
		str = __str;
	}

	__int = window.prompt('Qual o numero para continuar a sequencia?', int);
	if (__int == null && __int != int) {
		return false;
	} else {
		int = __int;
	}

	// delete linhas caso existam linhas na tabela.
	if ($('#embrioes tr').length > 7) {
		while ($('#embrioes tr').length > 7)
		{
			$('#embrioes tr:eq(5)').remove();
		}
	}

	int++;
	// remove default row
	// $('#id1').remove();
	// add empty line
	_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
	_c0 = _r1.insertCell(0);
	_c0.colSpan = 12;
	_c0.height = 4;

	_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
	_c0 = _r1.insertCell(0);
	_c0.colSpan = 12;
	_c0.height = 2;

	_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
	_c0 = _r1.insertCell(0);
	_c0.bgColor = "#bfbdb3";
	_c0.colSpan = 12;
	_c0.height = 1;

	// total rows except bottom
	for (var i = 0; i < size; i++) {
		sequence = str + (parseInt(int)+parseInt(i));

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
			_r1.lang = i;


		currentCell = 0;
		cell = _r1.insertCell(currentCell);

		// Codigo
		currentCell++;
		cell = _r1.insertCell(currentCell);
		$(cell).html('<span id="cod'+i+'">'+sequence+'</span>');
		$('<input type="text" name="embriao['+i+'][cod]" value="'+sequence+'" size="7"/>').appendTo(cell).hide();
		$(cell).click(function(){
			CurrentId = $(this).parent().attr('lang');
			CurrentField = $('[name*=embriao['+CurrentId+']][name*=cod]');
			CurrentField.keyup(function(){$(this).val($(this).val().toUpperCase());});
			$('#cod'+CurrentId).hide();
			CurrentField.show().focus().blur(function(){
				$('#cod'+CurrentId).html(CurrentField.val()).show();
				$('#cod'+CurrentId).parent().css('background', '');
				CurrentField.hide();
			});
		});

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.style.backgroundImage = "url(/images/grid/divisor_content.gif)";

		currentCell++;
		cell = _r1.insertCell(currentCell);

		// Criador
		currentCell++;
		cell = _r1.insertCell(currentCell);
		input = '<input type="hidden" name="embriao['+i+'][criador]" value="" size="7"/>';
		$(cell).html(input+'<span id="criador'+i+'"> - </span>');
		$(cell).click(function(){
			CurrentId = $(this).parent().attr('lang');
			CurrentField = $('[name*=embriao['+CurrentId+']][name*=criador]');
			if ($('#criador'+CurrentId+' select').length == 0) {
				$('#criador'+CurrentId).html(jsonCriador);
				$('#criador'+CurrentId+' select').focus();
				$('#criador'+CurrentId+' select').val(CurrentField.val());
			} else {
				$('#criador'+CurrentId+' select').show();
				$('#criador'+CurrentId+' select').val(CurrentField.val());
			}
			$('#criador'+CurrentId + ' select').change(function(){
				CurrentField.val($('#criador'+CurrentId+' select').val());
				$('#criador'+CurrentId).html($('#criador'+CurrentId+' select :selected').text().substr(0, strpos($('#criador'+CurrentId+' select :selected').text(), ' - ')));
			});
			$('#criador'+CurrentId + ' select').blur(function(){
				CurrentField.val($('#criador'+CurrentId+' select').val());
				$('#criador'+CurrentId).html($('#criador'+CurrentId+' select :selected').text().substr(0, strpos($('#criador'+CurrentId+' select :selected').text(), ' - ')));
			});
		});

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
	jsonCriado = true;
	$('#ajax_loader').fadeOut(100);

}

function toogleInput(i)
{
	window.alert(i);
}

function createGridDataJson(json)
{

	$('#ajax_loader').html('Gerando dados...').show();

	// delete linhas caso existam linhas na tabela.
	if ($('#embrioes tr').length > 7) {
		while ($('#embrioes tr').length > 7)
		{
			$('#embrioes tr:eq(5)').remove();
		}
	}

	// remove default row
	// $('#id1').remove();
	// add empty line
	_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
	_c0 = _r1.insertCell(0);
	_c0.colSpan = 12;
	_c0.height = 4;

	_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
	_c0 = _r1.insertCell(0);
	_c0.colSpan = 12;
	_c0.height = 2;

	_r1 = $('#embrioes')[0].insertRow(parseInt($('#embrioes')[0].rows.length-2));
	_c0 = _r1.insertCell(0);
	_c0.bgColor = "#bfbdb3";
	_c0.colSpan = 12;
	_c0.height = 1;

	// total rows except bottom
	size = json.length;
	for (var i = 0; i < size; i++) {
		row = json[i];

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
			_r1.lang = i;


		currentCell = 0;
		cell = _r1.insertCell(currentCell);

		// Codigo
		currentCell++;
		cell = _r1.insertCell(currentCell);
		$(cell).html('<span id="cod'+i+'">'+row.cod+'</span>');
		$('<input type="text" name="embriao['+i+'][cod]" value="'+row.cod+'" size="7"/>').appendTo(cell).hide();
		$(cell).click(function(){
			CurrentId = $(this).parent().attr('lang');
			CurrentField = $('[name*=embriao['+CurrentId+']][name*=cod]');
			CurrentField.keyup(function(){$(this).val($(this).val().toUpperCase());});
			$('#cod'+CurrentId).hide();
			CurrentField.show().focus().blur(function(){
				$('#cod'+CurrentId).html(CurrentField.val()).show();
				$('#cod'+CurrentId).parent().css('background', '');
				CurrentField.hide();
			});
		});

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.style.backgroundImage = "url(/images/grid/divisor_content.gif)";

		currentCell++;
		cell = _r1.insertCell(currentCell);

		// Criador
		currentCell++;
		cell = _r1.insertCell(currentCell);
		input = '<input type="hidden" name="embriao['+i+'][criador]" value="'+row.criador+'" size="7"/>';
		$(cell).html(input+'<span id="criador'+i+'"> - </span>');
		if (row.criador != '') {
			$('#criador'+i).html(criadorJson[row.criador]);
		}
		$(cell).click(function(){
			CurrentId = $(this).parent().attr('lang');
			CurrentField = $('[name*=embriao['+CurrentId+']][name*=criador]');
			if ($('#criador'+CurrentId+' select').length == 0) {
				$('#criador'+CurrentId).html(jsonCriador);
				$('#criador'+CurrentId+' select').focus();
				$('#criador'+CurrentId+' select').val(CurrentField.val());
			} else {
				$('#criador'+CurrentId+' select').show();
				$('#criador'+CurrentId+' select').val(CurrentField.val());
			}
			$('#criador'+CurrentId + ' select').change(function(){
				CurrentField.val($('#criador'+CurrentId+' select').val());
				$('#criador'+CurrentId).html($('#criador'+CurrentId+' select :selected').text().substr(0, strpos($('#criador'+CurrentId+' select :selected').text(), ' - ')));
			});
			$('#criador'+CurrentId + ' select').blur(function(){
				CurrentField.val($('#criador'+CurrentId+' select').val());
				$('#criador'+CurrentId).html($('#criador'+CurrentId+' select :selected').text().substr(0, strpos($('#criador'+CurrentId+' select :selected').text(), ' - ')));
			});
		});

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.style.backgroundImage = "url(/images/grid/divisor_content.gif)";

		currentCell++;
		cell = _r1.insertCell(currentCell);

		// Class
		currentCell++;
		cell = _r1.insertCell(currentCell);
		if (row.class != "") {
			$(cell).html('<span id="class'+i+'">'+row.class+'</span>');
		} else {
			$(cell).html('<span id="class'+i+'"></span>');
		}
		$('<input type="text" name="embriao['+i+'][class]" value="'+row.class+'" size="7" maxlength="1"/>').appendTo(cell).hide();
		$(cell).click(function(){
			CurrentId = $(this).parent().attr('lang');
			CurrentField = $('[name*=embriao['+CurrentId+']][name*=class]');
			CurrentField.keyup(function(){$(this).val($(this).val().toUpperCase());});
			$('#class'+CurrentId).hide();
			CurrentField.show().focus().blur(function(){
				$('#class'+CurrentId).html(CurrentField.val()).show();
				CurrentField.hide();
			});
		});

		currentCell++;
		cell = _r1.insertCell(currentCell);
		cell.style.backgroundImage = "url(/images/grid/divisor_content.gif)";

		// Grau
		currentCell++;
		cell = _r1.insertCell(currentCell);
		if (row.grau != "") {
			$(cell).html('<span id="grau'+i+'">'+row.grau+'</span>');
		} else {
			$(cell).html('<span id="grau'+i+'"></span>');
		}
		$('<input type="text" name="embriao['+i+'][grau]" value="'+row.grau+'" size="7" maxlength="1"/>').appendTo(cell).hide();
		$(cell).click(function(){
			CurrentId = $(this).parent().attr('lang');
			CurrentField = $('[name*=embriao['+CurrentId+']][name*=grau]');
			CurrentField.keyup(function(){$(this).val($(this).val().toUpperCase());});
			$('#grau'+CurrentId).hide();
			CurrentField.show().focus().blur(function(){
				$('#grau'+CurrentId).html(CurrentField.val()).show();
				CurrentField.hide();
			});
		});
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
	jsonCriado = true;
	$('#ajax_loader').fadeOut(100);

}

function verificaEmbrioesExists()
{

	$("#ajax_loader").html("Carregando...").show();

	var __fields = $('[name*=embriao][name*=cod]');
	var __values = new Array();
	var __return = false;

	for ( var i = 0; i < __fields.length; i++) {
		__values.push(__fields[i].value);
	}
	$.post(baseUrl + '/json/verifyembrioes', {
		'cod[]'		: __values,
		fazenda_id	: $('#fazenda_id').val(),
		ajax		: 'true',
		rkey		: Math.random()
	}, function(j) {
		if (j.length > 0) {
			window.alert('Existem codigos sendo usados que já foram cadastrados anteriormente no banco de dados');
			__fieldCods = $('[name*=embriao][name*=cod]');
			for (var i = 0; i < j.length; i++)
			{
				for (z=0; z <= __fieldCods.length; z++)
				{
					__field = $(__fieldCods[z]);
					if (__field.val() == j[i] || __field.val().toUpperCase() == j[i]) {
						__row_id = __field.parent().parent().attr('lang');
						$('#cod' + __row_id).parent().css('background', '#f99');
						__return = true;
					}
				}
			}
		}
		$("#ajax_loader").fadeOut(30);
		return __return;
	}, "json");

}