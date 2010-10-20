$(document).ready(function(){

	if (checkEditUrl(this.location.href)) {
		//showfilter_animal('<?=$this->baseUrl();?>/json/animal/sexo/f','vaca');
		$("#vaca_cod").change(changeSelectAnimal);
		$("#touro_cod").change(changeSelectAnimal);
		$("#inseminador_cod, #lote_cod").change(changeSelect);
	}
});
