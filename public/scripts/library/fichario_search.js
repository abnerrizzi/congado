$(document).ready(function() {
	$("#add").parent().before(
		'<td width="2%" align="right"><a href="javascript:void(0);" id="search" title="Pesquisar"><img src="' + baseUrl + '/images/search.png" alt="Pesquisar"/></a></td>'
	);

	var $dialog = $('<div></div>').dialog(
			{
				modal: true,
				draggable: true,
				closeOnEscape: true,
				autoOpen: false,
				resizable: false,
				title: 'Pesquisar Animal',
				width: 620,
				height: 420
			}).attr('id', 'dlg');
	$dialog.html('<div id="dlg-grid"></div>');

	$("#search").click(function(){
		$dialog.dialog('open');
		$("#dlg-grid").flexigrid(
		{
			url: baseUrl + '/json/animal',
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
			height: 260,
			onSelect: function(row) {
				getFichario(row);
			}
		});
		$dialog.fadeIn(200);
	});


});

function getFichario(row) {
	__id = row.attr("id").substr(3);
	url = baseUrl + '/fichario/edit/id/' + __id;
	$(location).attr('href', url);
	$("#dlg").dialog('close');
}

