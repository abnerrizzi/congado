$(document).ready(function() {

	var _Height = checkBrowser();

	var $dialog = $('<div></div>').dialog(
			{
				modal: true,
				draggable: true,
				closeOnEscape: true,
				autoOpen: false,
				resizable: false,
				title: 'Pesquisar Animal',
				width: 620,
				height: parseInt(390 + _Height)
			}).attr('id', 'search');
	$dialog.html('<div id="search-grid"></div>');

	$("#search, a#search span").click(function() { fichario_search($dialog, _Height); });

});

function fichario_search($dialog, _Height){
	$dialog.dialog('open');
	$("#search-grid").flexigrid(
	{
		url: baseUrl + '/json/fichario',
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
		like: true,
		rp: 10,
		showTableToggleBtn: false,
		pagestat: 'Mostrando {from} até {to} de {total} itens',
		width: 600,
		height: (240 + _Height),
		onSelect: function(row) {
			getFichario(row);
		}
	});
	$dialog.fadeIn(200);
};


function getFichario(row) {
	__id = row.attr("id").substr(3);
	url = baseUrl + '/fichario/edit/id/' + __id;
	$(location).attr('href', url);
	$("#search").dialog('close');
}
