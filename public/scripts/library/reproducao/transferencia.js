$(document).ready(function(){

//	if (checkEditUrl(this.location.href)) {
//		$("#vaca_cod").change(changeAnimal);
//		$("#touro_cod").change(changeAnimal);
//		$("#inseminador_cod, #lote_cod").change(changeSelect);
//	}

	addSearchIcon('fichario', baseUrl+'/json/fichario/sexo/m', 'Receptora', 'showfilter_animal', 600, 240);
	addSearchIcon('tecnico', baseUrl+'/json/tecnico', 'T�cnico', 'showfilter_tecnico', 600, 240);
	addSearchIcon('embriao', baseUrl+'/json/reproeducao/embriao', 'Embri�o', 'showfilter_embriao', 600, 240);

});
