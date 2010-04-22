$(document).ready(function() {

	$('#dlg').bind('dialogbeforeclose', function(event, ui) {
		hide_filter();
	});

	$("#acompanhamento_cod").change(changeSelect);
	$("#fichario_cod").change(changeSelectAnimal);

	$("#data").datepicker({

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
	});

	$("#data").keyup(function(event){
        val = $(this).val();
        if (val.length == 2 || val.length == 5) {
        	val = val +'/';
        	$(this).val(val);
        }
});
});




function changeSelect() {

	this.value = this.value.toUpperCase();
	suffix = '_cod';
	__fieldName = this.name.substr(0,(this.name.length - suffix.length));
	__fieldValue = this.value;
	__json = __fieldName;

	__url = baseUrl + '/json/' + __json;

	if (__fieldName == 'local') {
		__qtype = 'local';
		if (!$('#fazenda_id').val().length > 0) {
			if ($("#ajax_loader")) {
				$("#ajax_loader").html("Por favor selecione uma fazenda.").show();
				setTimeout(function(){
					$("#ajax_loader").fadeOut(300);
				}
				, 2000);
			}
			return false;
		}
	} else {
		__qtype = 'cod';
	}
	if (__fieldValue == '') {
		$("#" + __fieldName + "_id").val(null);
		$("#" + __fieldName + "_cod").val(null);
		$("#" + __fieldName).val(null);
		return false;
	}
	$("#ajax_loader").html("Buscando dados...").show();
	suffix = '_cod';
	$.post(__url, {
		fazenda_id: $('#fazenda_id').val(),
		qtype : __qtype,
		query : __fieldValue,
		like : 'false',
		ajax : 'true'
	}, function(j) {
		j = j.rows;
		if (j && j.length == 1) {
			$("#" + __fieldName + "_id").val(j[0].id);
			$("#" + __fieldName + "_cod").val(j[0].cell[0]);
			$("#" + __fieldName).val(j[0].cell[1]);
		} else {
			$("#ajax_loader").html("Código não encontrado").show();
			$("#" + __fieldName + "_id").val(null);
//			$("#" + __fieldName + "_cod").val(null);
			$("#" + __fieldName).val(null);
			setTimeout(function(){
				$("#ajax_loader").fadeOut(300); }
			, 2000);
			return false;
		}
		$("#ajax_loader").fadeOut(100);
	}, "json");
}


function changeSelectAnimal() {

	this.value = this.value.toUpperCase();
	suffix = '_cod';
	__fieldName = this.name.substr(0,(this.name.length - suffix.length));
	__fieldValue = this.value;
	__url = baseUrl + '/json/animal';

	if (__fieldValue == '') {
		$("#" + __fieldName + "_id").val('');
		$("#" + __fieldName + "_cod").val('');
		$("#" + __fieldName).val('');
		return true;
	} else if (__fieldValue == $("#cod").val()) {
		$("#ajax_loader").html("Código não pode ser o mesmo do animal atual.").show();
		setTimeout(function(){
			$("#ajax_loader").fadeOut(300); }
		, 2000);
		return false;
	}

	__qtype = 'fichario.cod';

	$("#ajax_loader").html("Buscando dados...").show();
	suffix = '_cod';
	$.post(__url, {
		qtype	: __qtype,
		query	: __fieldValue,
		like	: 'false',
		ajax	: 'true'
	}, function(j) {
		j = j.rows;
		if (j && j.length == 1) {
			$("#" + __fieldName + "_id").val(j[0].id);
			$("#" + __fieldName + "_cod").val(j[0].cell[0]);
			$("#" + __fieldName).val(j[0].cell[1]);
		} else {
			$("#ajax_loader").html("Código não encontrado").show();
			$("#" + __fieldName + "_id").val(null);
//			$("#" + __fieldName + "_cod").val(null);
			$("#" + __fieldName).val(null);
			setTimeout(function(){
				$("#ajax_loader").fadeOut(300); }
			, 2000);
			return false;
		}
		$("#ajax_loader").fadeOut(100);
	}, "json");

}



function showfilter_animal(url, input)
{

	createDialog('Animal');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Animal',
					name : 'cod',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Nome',
					name : 'nome',
					width : 160,
					sortable : true,
					align: 'left'
				}, {
					display: 'RGN',
					name : 'rgn',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'SISBOV',
					name : 'sisbov',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Sexo',
					name : 'sexo',
					width : 40,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Animal',
					name : 'fichario.cod'
				}, {
					display: 'Nome',
					name : 'nome',
					isdefault: true
				}, {
					display: 'RGN',
					name : 'rgn',
					isdefault: true
				}, {
					display: 'SISBOV',
					name : 'fichario.sisbov',
					isdefault: true
				}],
			sortname: "nome",
			sortorder: "asc",
			usepager: true,
			title: false,
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}

}

/**
 * 
 * @param title
 * @param w
 * @param h
 * @param modal
 * @return
 */
function createDialog(title, w, h, modal)
{
	$.each($.browser, function(i) {
		if ($.browser.mozilla) {
			_Height = parseInt(20);
		} else {
			_Height = parseInt(0);
		}
	});

	// Setting default values
	w = typeof(w) != 'undefined' ? w : 620;
	h = typeof(h) != 'undefined' ? h : (390 + _Height);

	modal = typeof(modal) != 'undefined' ? modal : true;

	$("#dlg").dialog({
		modal: modal,
		autoOpen: false,
		resizable: false,
		title: title,
		width: w,
		height: h
	});

	$("#dlg").dialog('open');

	// Workaround to set title forced
	$('#ui-dialog-title-dlg').html(title);

}


function changeField(row, input) {
	__id = row.attr("id").substr(3);
	__cod = $("#row"+__id+" td: div")[0].innerHTML;
	__dsc = $("#row"+__id+" td: div")[1].innerHTML;
	if (__dsc == '&nbsp;') {
		__dsc = '';
	}
	__fId = '#' + input + '_id';
	__fCod = '#' + input + '_cod';
	__fSel = '#' + input;
	$(__fId).val(row.attr("id").substr(3));
	$(__fCod).val(__cod);
	$(__fSel).val(__dsc);
	$("#dlg").dialog('close');
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$("#dlg").append('<div id="dlg-grid"></div>');
	return false;
}





























function showfilter_acompanhamento(url, input)
{
	createDialog('Acompanhamento');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Acompanhamento',
					name : 'cod',
					width : 40,
					sortable : true,
					align: 'left'
				}, {
					display: 'Descrição',
					name : 'dsc',
					width : 180,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Acompanhamento',
					name : 'cod'
				}, {
					display: 'Descrição',
					name : 'dsc',
					isdefault: true
				}],
			sortname: "cod",
			sortorder: "asc",
			usepager: true,
			title: false,
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: 240,
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}
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

