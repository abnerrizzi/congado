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

});