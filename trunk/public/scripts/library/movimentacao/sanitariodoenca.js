$(document).ready(function() {

	if (!$('#ocorrencia_cod').attr('readonly')) {
		updateField('#ocorrencia_cod', 'doenca');
		addSearchIcon('ocorrencia', baseUrl+'/json/doenca', 'Doenças', 'showfilter_doenca', 600, 240);
	}

	if (!$('#sequencia_cod').attr('readonly')) {
		updateField('#sequencia_cod', 'destino');
		addSearchIcon('sequencia', baseUrl+'/json/destino', 'Destino', 'showfilter_destino', 600, 240);
	}

	if (!$('#fichario_cod').attr('readonly')) {
		$("#fichario_cod").change(changeSelectAnimal);
		addSearchIcon('fichario', baseUrl+'/json/animal', 'Doenças', 'showfilter_animal', 600, 240);
	}

	campoData("#data", new Date());

});
