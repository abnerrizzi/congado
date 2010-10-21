$(document).ready(function(){

	if (checkEditUrl(this.location.href)) {
		$("#vaca_cod").change(changeAnimal);
		$("#touro_cod").change(changeAnimal);
		$("#inseminador_cod, #lote_cod").change(changeSelect);
	}

	addSearchIcon('lote', baseUrl+'/json/lote', 'Lote', 'showfilter_lote', 600, 240);
	addSearchIcon('inseminador', baseUrl+'/json/inseminador', 'Inseminador', 'showfilter_inseminador', 600, 240);
	addSearchIcon('touro', baseUrl+'/json/fichario/sexo/m', 'Inseminador', 'showfilter_animal', 600, 240);

});
