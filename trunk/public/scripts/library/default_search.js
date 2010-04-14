$(document).ready(function() {

	__action = editUrl.split("/")[1];

	$("#add>a").before(
			'<a class="UIButton UIButton_Gray UIActionButton" href="javascript:void(0);" id="search" title="Pesquisar">\n'+
			'<span class="UIButton_Text">\n'+
			'<span class="UIButton_Search UIButton_IconNoSpriteMap_Search UIButton_IconSmallMonochromatic" style="background: url(/congado/public/images/search.png) no-repeat;background-position: 4pt 1px;"></span>\n'+
			'Pesquisar\n'+
			'</span></a>\n'+
			'\n'
//			'<td width="2%" align="right"><a href="javascript:void(0);" id="search" title="Pesquisar"><img src="' + baseUrl + '/images/search.png" alt="Pesquisar"/></a></td>'
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

	$('a#search span').click(function(){
		$dialog.dialog('open');
		$("#search-default").flexigrid(
		{
			url: baseUrl + '/json/'+__action+'',
			dataType: 'json',
			colModel : [{
					display: 'Codigo',
					name : 'cod',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Descri��o',
					name : 'dsc',
					width : 160,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Codigo',
					name : 'cod'
				}, {
					display: 'Descri��o',
					name : 'dsc',
					isdefault: true
				}],
			sortname: "dsc",
			sortorder: "asc",
			usepager: true,
			title: false,
			useRp: true,
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

function getRecord(row) {
	__id = row.attr("id").substr(3);
	url = baseUrl + '/'+__action+'/edit/id/' + __id;
	$(location).attr('href', url);
	$("#search").dialog('close');
}

function checkBrowser()
{
	if ($.browser.mozilla) {
		return parseInt(20);
	} else {
		return parseInt(0);
	}
}