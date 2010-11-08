$(document).ready(function() {

	if (typeof(__module) == 'undefined') {
		__action = editUrl.split("/")[1];
		__module = '';
	} else {
		__baseUrl = baseUrl + '/' + __module;
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

	$('#add a#search').click(function(){
		$dialog.dialog('open');
		$("#search-default").flexigrid(
		{
			url: baseUrl +'/'+ __module +'/json/'+ __action,
			dataType: 'json',
			colModel : [{
					display: 'Receptora',
					name : 'v.cod',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Data',
					name : 'dh',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Embri�o',
					name : 'e.embriao',
					width : 100,
					sortable : true,
					align: 'left'
				}, {
					display: 'T�cnico',
					name : 'tec.cod',
					width : 60,
					sortable : true,
					align: 'left'
				}, {
					display: 'Tipo',
					name : 'tipo',
					width : 60,
					sortable : true,
					align: 'left'
				}, {
					display: 'T�cnica',
					name : 'tecnica',
					width : 60,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Receptora',
					name : 'v.cod'
				}, {
					display: 'Embri�o',
					name : 'e.embriao',
					isdefault: true
				}],
			sortname: "e.embriao",
			sortorder: "asc",
			usepager: true,
			title: false,
			useRp: true,
			like: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} at� {to} de {total} itens',
			width: 600,
			height: (240 + _Height),
			onSelect: function(row) {
				getRecord(row);
			}
		});
		$dialog.fadeIn(200);
	});


});

