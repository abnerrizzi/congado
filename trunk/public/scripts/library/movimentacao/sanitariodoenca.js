$(document).ready(function() {

	if (!$('#ocorrencia_cod').attr('readonly')) {
//		updateField('#ocorrencia_cod', 'doenca');
		addSearchIcon('ocorrencia', baseUrl+'/json/doenca', 'Doen�as', 'showfilter_doenca', 600, 240);
	}

	if (!$('#fichario_cod').attr('readonly')) {
		$("#fichario_cod").change(changeSelectAnimal);
		addSearchIcon('fichario_cod', baseUrl+'/json/animal', 'Doen�as', 'showfilter_animalPreventivo', 600, 240);
	}

	campoData("#data", new Date());

});
