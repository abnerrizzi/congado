$(document).ready(function() {
	$("#uf").change(changeState);

//	$("#cpf_cnpj").keypress(function(e) {
//		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
//			if ($("#ajax_loader")) {
//				$("#ajax_loader").html("Campo só aceita números").show();
//				setTimeout(function(){
//					$("#ajax_loader").fadeOut(300); }
//				, 2000);
//			}
//			return false;
//		}
//		onlyNumbers(e);
//	});

	$("#cpf_cnpj").blur(function() {
	if (this.value.length > 0)
		if (isCnpj(this.value) || isCpf(this.vallue)) {
			this.value = formatCpfCnpj(this.value, true, isCnpj(this.value));
		}
	});

	$("#cpf_cnpj").focus(function() {
		this.value = unformatNumber(this.value);
	});

	if ($("#cpf_cnpj").get()[0].value != '') {
		$("#cpf_cnpj").get()[0].value = formatCpfCnpj(
			$("#cpf_cnpj").get()[0].value, true, isCnpj($("#cpf_cnpj").get()[0].value));
	}

});

function changeState() {
	$("#ajax_loader").html("Carregando...").show();
	$.post(baseUrl + '/json/cidades', {
		id : $(this).val(),
		ajax : 'true'
	}, function(j) {
		var options = '<option value=""> -- Selecione uma cidade --</option>';
		for ( var i = 0; i < j.length; i++) {
			options += '<option value="' + j[i].id + '">' + j[i].nome
					+ '</option>';
		}
		$("select#cidades_id").html(options);
		$("#ajax_loader").fadeOut(100);
	}, "json");
}

//function onlyNumbers(e) {
//	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
//		return false;
//	}
//}