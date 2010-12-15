$(document).ready(function() {

	if (checkAddUrl(this.location.href)) {

		addSearchIcon('acompanhamento', baseUrl+'/json/acompanhamento', 'filter.acompanhamento', 600, 240);
		addSearchIcon('fichario', baseUrl+'/json/fichario/sexo/f', 'filter.animal', 600, 240);

		$("#fichario_cod").change(function(){change.animal(this, 'F');});
		$("#acompanhamento_cod").change(function(){change.select(this);});

		$("#obs").keyup(function(){
			$(this).val($(this).val().toUpperCase());
		});
		makeDateField('#data');
	}

	$("#add>a").before(
			'<a class="UIButton UIButton_Gray UIActionButton" href="javascript:void(0);" id="search" title="Pesquisar">\n'+
			'<span class="UIButton_Text">\n'+
			'<span class="UIButton_Search UIButton_IconNoSpriteMap_Search UIButton_IconSmallMonochromatic""></span>\n'+
			'Pesquisar\n'+
			'</span></a>\n'+
			'\n'
	);
	$('#add a#search').click(function(){search.exameRep();});
});