$(document).ready(function() {

	$("#add>a").before(
			'<a class="UIButton UIButton_Gray UIActionButton" href="javascript:void(0);" id="search" title="Pesquisar">\n'+
			'<span class="UIButton_Text">\n'+
			'<span class="UIButton_Search UIButton_IconNoSpriteMap_Search UIButton_IconSmallMonochromatic""></span>\n'+
			'Pesquisar\n'+
			'</span></a>\n'+
			'\n'
	);
	$('#add a#search').click(function(){search.coletaEmbriao();});

	if (checkAddUrl(this.location.href) || checkEditUrl(this.location.href)) {

		makeDateField('#dt_coleta', false, new Date());

		$("#doadora_cod").change(function(){change.animal(this, 'f');});
		$("#touro_cod").change(function(){change.animal(this, 'm');});
		$("#criador_cod").change(function(){change.select(this);});

		addSearchIcon('doadora', baseUrl+'/json/fichario/sexo/f', 'filter.animal', 600, 240);
		addSearchIcon('touro', baseUrl+'/json/fichario/sexo/m', 'filter.animal', 600, 240);
		addSearchIcon('criador', baseUrl+'/json/criador', 'filter.criador', 600, 240);

	}

});

