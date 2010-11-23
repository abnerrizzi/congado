$(document).ready(function() {

	$("#ocorrencia_cod").change(function(){change.select(this, 'doenca');});
	$("#sequencia_cod").change(function(){change.select(this, 'destino');});

	addSearchIcon('ocorrencia', baseUrl+'/json/doenca', 'Doenças', 'showfilter_doenca', 600, 240);
	addSearchIcon('sequencia', baseUrl+'/json/destino', 'Destino', 'showfilter_destino', 600, 240);

	if (checkAddUrl(this.location.href)) {
		$("#fichario_cod").change(changeSelectAnimal);
		addSearchIcon('fichario', baseUrl+'/json/animal', 'Doenças', 'showfilter_animal', 600, 240);
	}

	makeDateField($('#data'), false, new Date());

});
