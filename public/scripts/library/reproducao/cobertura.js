$(document).ready(function(){

	if (checkEditUrl(this.location.href)) {
		$("#touro_cod").change(function(){change.animal(this, 'M');});
		$("#inseminador_cod, #lote_cod").change(function(){change.select(this);});
		addSearchIcon('inseminador', baseUrl+'/json/inseminador', 'filter.inseminador', 600, 240);
		addSearchIcon('lote', baseUrl+'/json/lote', 'filter.lote', 600, 240);
		addSearchIcon('touro', baseUrl+'/json/fichario/sexo/m', 'filter.animal', 600, 240);
	}

});
