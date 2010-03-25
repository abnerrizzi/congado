$(document).ready(function() {
	$("#pai, #mae, #cria, #raca").change(changeCod);
	$("#pai_cod, #mae_cod, #cria_cod, #raca_cod").change(changeSelect);
});

function changeCod() {
	__input = '#' + this.name + '_cod';
	__hidden = '#' + this.name + '_id';
	$(__hidden).val(this.value.split(";")[0]);
	$(__input).val(this.value.split(";")[1]);
}

function changeSelect() {

	this.value = this.value.toUpperCase();
	suffix = '_cod';
	__select = '#' + this.name.substr(0,(this.name.length - suffix.length));
	__hidden = '#' + this.name.substr(0,(this.name.length - suffix.length)) + '_id';

	for (int = 0; int < $("#raca option").length; int++) {
		if (this.value == $(__select + " option")[int].value.split(";")[1]) {
			$(__select).val($(__select + " option")[int].value);
			$(__hidden).val($(__select).val().split(";")[0]);
			$(__select).val(this.value.split(";")[1]);
			__exists = true;
			break;
		} else {
			$(__hidden).val('');
			$(__select).val('');
			__exists = false;
		}

	}
	if (!__exists) {
		if ($("#ajax_loader")) {
			$("#ajax_loader").html("Código não encontrado").show();
			setTimeout(function(){
				$("#ajax_loader").fadeOut(300); }
			, 2000);
		}
		return false;
	}

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

function showfilter_grsangue(url, input)
{
	$("#filter-bg").fadeIn(100);
	if ($("#filter").length) {
		$("#filter-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Código',
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
			title: 'Graus de Sangue',
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

function changeField(row, input) {
	__id = row.attr("id").substr(3);
	__cod = $("#row"+__id+" td: div")[0].innerHTML
	__fId = '#' + input + '_id';
	__fCod = '#' + input + '_cod';
	__fSel = '#' + input;
	$(__fId).val(row.attr("id").substr(3));
	$(__fCod).val(__cod);
	$(__fSel).val(row.attr("id").substr(3) + ';' + __cod);
	$("#filter, #filter-bg").fadeOut(200);
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$("#filter").append('<div id="filter-grid"></div>');
	return false;
}

function hide_filter() {
	$("#filter").fadeOut(200);
	$("#filter-bg").fadeOut(175);
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$("#filter").append('<div id="filter-grid"></div>');
}

//jQuery.fn.centerx = function () {
//    this.css("position","absolute");
//    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
//    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
//    return this;
//};
