$(document).ready(function() {

	if (typeof(__module) == 'undefined' || __module == '') {
		__action = editUrl.split("/")[1];
		__module = '';
	} else {
		__action = editUrl.split("/")[2];
	}

	$("#add>a").before(
			'<a class="UIButton UIButton_Gray UIActionButton" href="javascript:void(0);" id="search" title="Pesquisar">\n'+
			'<span class="UIButton_Text">\n'+
			'<span class="UIButton_Search UIButton_IconNoSpriteMap_Search UIButton_IconSmallMonochromatic"></span>\n'+
			'Pesquisar\n'+
			'</span></a>\n'+
			'\n'
	);

	$('#add a#search').click(function(){
		__url = baseUrl +'/'+ __module +'/json/'+ __action;
		search.url = __url;
		search.defaultColModel = [{
			display: 'C�digo',
			name : 'cod',
			width : 70,
			sortable : true,
			align: 'left'
		}, {
			display: 'Descri��o',
			name : 'dsc',
			width : 240,
			sortable : true,
			align: 'left'
		}];
		search.defaultSearchItem = [{
			display: 'C�digo',
			name : 'cod',
			isdefault: true
		}, {
			display: 'Descri��o',
			name : 'dsc'
		}];
		search.createDialog(__title);
		search.defaultSearch();
	});

});

