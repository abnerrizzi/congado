$(document).ready(function() {

	$("#add>a").before(
			'<a class="UIButton UIButton_Gray UIActionButton" href="javascript:void(0);" id="search" title="Pesquisar">\n'+
			'<span class="UIButton_Text">\n'+
			'<span class="UIButton_Search UIButton_IconNoSpriteMap_Search UIButton_IconSmallMonochromatic""></span>\n'+
			'Pesquisar\n'+
			'</span></a>\n'+
			'\n'
	);

	$('#add a#search').click(function(){search.diagnostico();});

	if (checkAddUrl(location.href)) {
		makeDateField("#dt_diagnostico", null, new Date());
		addSearchIcon('fichario', baseUrl+'/json/fichario/sexo/f', 'filter.animal', 600, 240);
		$("#fichario_cod").change(function(){change.animal(this, 'F');});
	}

});