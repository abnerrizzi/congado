$(document).ready(function(){

	if (checkEditUrl(this.location.href)) {
		$("#vaca_cod").change(changeAnimal);
		$("#touro_cod").change(changeAnimal);
		$("#inseminador_cod, #lote_cod").change(changeSelect);
	}
});
