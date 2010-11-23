$(document).ready(function(){

//	if (checkEditUrl(this.location.href)) {
//		$("#vaca_cod").change(changeAnimal);
//		$("#touro_cod").change(changeAnimal);
//		$("#inseminador_cod, #lote_cod").change(changeSelect);
//	}

	if (checkAddUrl(this.location.href)) {
//		$("#fichario_cod").change(changeAnimalSexoF);
		$("#fichario_cod").change(function(){change.animal(this, 'f');});
		$("#tecnico_cod").change(function(){change.select(this);});
		$("#embriao_cod").change(function(){change.embriao(this);});
	}
	addSearchIcon('fichario', baseUrl+'/json/fichario/sexo/f', 'Receptora', 'showfilter_animal', 600, 240);
	addSearchIcon('tecnico', baseUrl+'/json/tecnico', 'Técnico', 'showfilter_tecnico', 600, 240);
	addSearchIcon('embriao', baseUrl+'/json/reproeducao/embriao', 'Embrião', 'showfilter_embriao', 600, 240);

	minDate = new Date();
	minDate.setFullYear(2010, 10, 5);
	makeDateField('#dt_transferencia', minDate);
});

