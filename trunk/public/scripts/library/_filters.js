$(document).ready(function() {

	$('#dlg').bind('dialogbeforeclose', function(event, ui) {
		hide_filter();
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


function hide_filter() {
	$("#dlg").fadeOut(200);
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$('#dlg').dialog('destroy');
	$("#dlg-grid").remove();
	$("#dlg").append('<div id="dlg-grid"></div>');
}

function showfilter_criador(url, input)
{
	createDialog('Criador');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Criador',
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
					display: 'Criador',
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
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}
}


function showfilter_pelagem(url, input)
{
	createDialog('Pelagem');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Pelagem',
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
					display: 'Pelagem',
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

function showfilter_raca(url, input)
{
	createDialog('Raça');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Raça',
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
					display: 'Raça',
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
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}
}

function showfilter_rebanho(url, input)
{
	createDialog('Rebanho');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Raça',
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
					display: 'Raça',
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
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}
}

function showfilter_categoria(url, input)
{
	createDialog('Categoria');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Categoria',
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
					display: 'Categoria',
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
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}
}

function showfilter_local(url, input)
{
	if (!$('#fazenda_id').val().length > 0) {
		if ($("#ajax_loader")) {
			$("#ajax_loader").html("Por favor selecione uma fazenda.").show();
			setTimeout(function(){
				$("#ajax_loader").fadeOut(300); }
			, 2000);
		}
		return false;
	}

	createDialog('Local');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Local',
					name : 'local',
					width : 40,
					sortable : true,
					align: 'left'
				}, {
					display: 'Descrição',
					name : 'dsc',
					width : 180,
					sortable : true,
					align: 'left'
				}, {
					display: 'Fazenda',
					name : 'descricao',
					width : 240,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Local',
					name : 'local'
				}, {
					display: 'Descrição',
					name : 'dsc',
					isdefault: true
				}],
			sortname: "local",
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
			},
			params: [ 
			          {name: 'fazenda_id', value: $("#fazenda_id").val()}
			        ]
		});
		$("#dlg").fadeIn(200);
	}
}

function showfilter_grausangue(url, input)
{

	createDialog('Grau Sangue');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Grau Sangue',
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
					display: 'Grau Sangue',
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
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			},
			params: [ 
			          {name: 'fazenda_id', value: $("#fazenda_id").val()}
			        ]
		});
		$("#dlg").fadeIn(200);
	}
}

function showfilter_animal_OLD(url, input)
{

	$("#filter-bg").show();
	if ($("#dlg").length) {
		$("#filter-grid").flexigrid(
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
			title: 'Animal',
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
	$("#dlg").centerx();
	$(window).bind('resize', function() {$("#dlg").centerx();});
	$(window).bind('scroll', function() {$("#dlg").centerx();});
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

function showfilter_animalDoenca(url, input)
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
			onSelect: function(row, input) {
				__id = row.attr("id").substr(3);
				__cod = $("#row"+__id+" td: div")[0].innerHTML;
				$('#'+input).value(__cod);
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






function showfilter_doenca(url, input)
{
	createDialog('Doenças');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Raça',
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
					display: 'Raça',
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
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}
}

function showfilter_morte(url, input)
{
	createDialog('Causas Mortis');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Raça',
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
					display: 'Raça',
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
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}
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