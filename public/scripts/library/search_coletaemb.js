$(document).ready(function() {

	if (typeof(__module) == 'undefined') {
		__action = editUrl.split("/")[1];
		__module = '';
	} else {
//		__baseUrl = baseUrl + '/' + __module;
		__action = editUrl.split("/")[2];
	}

	$("#add>a").before(
			'<a class="UIButton UIButton_Gray UIActionButton" href="javascript:void(0);" id="search" title="Pesquisar">\n'+
			'<span class="UIButton_Text">\n'+
			'<span class="UIButton_Search UIButton_IconNoSpriteMap_Search UIButton_IconSmallMonochromatic""></span>\n'+
			'Pesquisar\n'+
			'</span></a>\n'+
			'\n'
	);

	var _Height = checkBrowser();

	var $dialog = $('<div></div>').dialog(
			{
				modal: true,
				draggable: true,
				closeOnEscape: true,
				autoOpen: false,
				resizable: false,
				title: __title,
				width: 620,
				height: parseInt(390 + _Height)
			}).attr('id', 'search');
	$dialog.html('<div id="search-default"></div>');

	$('a#search').click(function(){
		$dialog.dialog('open');
		$("#search-default").flexigrid(
		{
			url: baseUrl +'/'+ __module +'/json/'+ __action,
			dataType: 'json',
			colModel : [{
					display: 'Animal',
					name : 'vaca_cod',
					width : 140,
					sortable : true,
					align: 'left'
				}, {
					display: 'Coleta',
					name : 'data_coleta',
					width : 70,
					sortable : true,
					align: 'left'
				}, {
					display: 'Touro',
					name : 'touro_cod',
					width : 140,
					sortable : true,
					align: 'left'
				}, {
					display: 'Fecundados',
					name : 'fecundada',
					width : 70,
					sortable : true,
					align: 'left'
				}, {
					display: 'Viaveis',
					name : 'nao_viavel',
					width : 70,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Animal',
					name : 'fv.cod',
					isdefault: true
				}],
			sortname: "id",
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
				getRecord(row);
			}
		});
		$dialog.fadeIn(200);
	});

});