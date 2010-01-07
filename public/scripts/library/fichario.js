$(document).ready(function() {
	$("#criador_cod, #pelagem_cod, #raca_cod, #rebanho_cod, #categoria_cod, #local_cod, #grausangue_cod").change(changeSelect);
	$("#pai_cod, #mae_cod, #receptora_cod").change(changeSelectAnimal);
	$("#grausangue_manual").click(changeGrauSangue);
	$("#obs").keyup(function() {this.value = this.value.toUpperCase();});
	$("#fichario:form").submit(function() { toggleFields(false); });
	toggleFields(true);
	changeGrauSangue();

	$("#dt_nascimento").datepicker({

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

	$("#dt_nascimento").keyup(function(event){
	        val = $(this).val();
	        if (val.length == 2 || val.length == 5) {
	        	val = val +'/';
	        	$(this).val(val);
	        }
	});

});

/*
 * funcao responsavel por habilitar/desabilitar os campos para que os dados sejam enviados pelo post
 * e nao precisem ser recuperados depois via ajax novamente.
 */
function toggleFields(opt) {


	objs = Array(
		"#fazenda_id",
		"#criador",
		"#pelagem",
		"#raca",
		"#rebanho",
		"#categoria",
		"#local",
		"#grausangue",
		"#grausangue_cod"
	);

	for (i=0; i < objs.length; i++)
	{
		$(objs[i]).attr('disabled', opt);
		$(objs[i]).attr('readonly', opt);
	}

	if ($("#fichario").attr('action').split('/')[4] == 'add') {
		$("#fazenda_id").attr('disabled', false);
		$("#fazenda_id").attr('readonly', false);
	}
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

	if (__fieldName == 'mae' || __fieldName == 'receptora') {
		__sexo = 'F';
	} else {
		__sexo = 'M';
	}
	__qtype = 'fichario.cod';

	$("#ajax_loader").html("Buscando dados...").show();
	suffix = '_cod';
	$.post(__url, {
		qtype	: __qtype,
		query	: __fieldValue,
		sexo	: __sexo,
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

/*
 * Busca via ajax os valores de id e descricao dos campos de acordo com o codigo digitado
 */
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
	$("#filter, #filter-bg").fadeOut(200);
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$("#filter").append('<div id="filter-grid"></div>');
	return false;
}

function changeGrauSangue() {
	// se tiver checado ativa os campos
	if ($("#grausangue_manual").attr('checked') == true) {
		$("#grausangue_cod").removeAttr("disabled");
		$("#grausangue_cod").removeAttr("readonly");
		$("#grausangue_search").show();
	} else {
		$("#grausangue_cod").attr("disabled", true);
		$("#grausangue_cod").attr("readonly", true);
		$("#grausangue_search").hide();
	}
}

function hide_filter() {
	$("#filter").fadeOut(200);
	$("#filter-bg").fadeOut(175);
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$("#filter").append('<div id="filter-grid"></div>');
}

jQuery.fn.centerx = function () {
    this.css("position","absolute");
    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
};

function showfilter_criador(url, input)
{
	$("#filter-bg").show();
	if ($("#filter").length) {
		$("#filter-grid").flexigrid(
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
			title: 'Criador',
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: 285,
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#filter").fadeIn(200);
	}
	$("#filter").centerx();
	$(window).bind('resize', function() {$("#filter").centerx();});
	$(window).bind('scroll', function() {$("#filter").centerx();});
}


function showfilter_pelagem(url, input)
{
	$("#filter-bg").show();
	if ($("#filter").length) {
		$("#filter-grid").flexigrid(
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
			title: 'Pelagem',
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: 285,
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#filter").fadeIn(200);
	}
	$("#filter").centerx();
	$(window).bind('resize', function() {$("#filter").centerx();});
	$(window).bind('scroll', function() {$("#filter").centerx();});
}

function showfilter_raca(url, input)
{
	$("#filter-bg").show();
	if ($("#filter").length) {
		$("#filter-grid").flexigrid(
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
			title: 'Raça',
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: 285,
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#filter").fadeIn(200);
	}
	$("#filter").centerx();
	$(window).bind('resize', function() {$("#filter").centerx();});
	$(window).bind('scroll', function() {$("#filter").centerx();});
}

function showfilter_rebanho(url, input)
{
	$("#filter-bg").show();
	if ($("#filter").length) {
		$("#filter-grid").flexigrid(
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
			title: 'Raça',
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: 285,
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#filter").fadeIn(200);
	}
	$("#filter").centerx();
	$(window).bind('resize', function() {$("#filter").centerx();});
	$(window).bind('scroll', function() {$("#filter").centerx();});
}

function showfilter_categoria(url, input)
{
	$("#filter-bg").show();
	if ($("#filter").length) {
		$("#filter-grid").flexigrid(
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
			title: 'Categoria',
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: 285,
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#filter").fadeIn(200);
	}
	$("#filter").centerx();
	$(window).bind('resize', function() {$("#filter").centerx();});
	$(window).bind('scroll', function() {$("#filter").centerx();});
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

	$("#filter-bg").show();
	if ($("#filter").length) {
		$("#filter-grid").flexigrid(
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
			title: 'Local',
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: 285,
			onSelect: function(row) {
				changeField(row, input);
			},
			params: [ 
			          {name: 'fazenda_id', value: $("#fazenda_id").val()}
			        ]
		});
		$("#filter").fadeIn(200);
	}
	$("#filter").centerx();
	$(window).bind('resize', function() {$("#filter").centerx();});
	$(window).bind('scroll', function() {$("#filter").centerx();});
}

function showfilter_grausangue(url, input)
{

	$("#filter-bg").show();
	if ($("#filter").length) {
		$("#filter-grid").flexigrid(
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
			title: 'Grau Sangue',
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: 285,
			onSelect: function(row) {
				changeField(row, input);
			},
			params: [ 
			          {name: 'fazenda_id', value: $("#fazenda_id").val()}
			        ]
		});
		$("#filter").fadeIn(200);
	}
	$("#filter").centerx();
	$(window).bind('resize', function() {$("#filter").centerx();});
	$(window).bind('scroll', function() {$("#filter").centerx();});
}

function showfilter_animal(url, input)
{

	$("#filter-bg").show();
	if ($("#filter").length) {
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
					name : 'sisbov',
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
			height: 285,
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#filter").fadeIn(200);
	}
	$("#filter").centerx();
	$(window).bind('resize', function() {$("#filter").centerx();});
	$(window).bind('scroll', function() {$("#filter").centerx();});
}
