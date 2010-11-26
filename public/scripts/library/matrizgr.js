$(document).ready(function() {

	if (checkAddUrl(window.location.href) == true) {
		addSearchIcon('raca', baseUrl+'/json/raca', 'Raça', 'filter.raca', 600, 240);
		addSearchIcon('pai', baseUrl+'/json/grausangue', 'Matriz Grau Sangue', 'filter.grauSangue', 600, 240);
		addSearchIcon('mae', baseUrl+'/json/grausangue', 'Matriz Grau Sangue', 'filter.grauSangue', 600, 240);
	}
	addSearchIcon('cria', baseUrl+'/json/grausangue', 'Matriz Grau Sangue', 'filter.grauSangue', 600, 240);

	$('#raca_cod').change(function(){change.raca(this);});
	$('#pai_cod, #mae_cod, #cria_cod').change(function(){change.grauSangue(this);});
//	$("#pai, #mae, #cria, #raca").change(function(){change.fromSelect(this);});

});

function changeCod() {
	window.alert('Deprecated');
	__input = '#' + this.name + '_cod';
	__hidden = '#' + this.name + '_id';
	$(__hidden).val(this.value.split(";")[0]);
	$(__input).val(this.value.split(";")[1]);
}

function changeField(row, input) {
	window.alert('Deprecated');
	__id = row.attr("id").substr(3);
	__cod = $("#row"+__id+" td: div")[0].innerHTML;
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
