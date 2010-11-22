var change = {
	suffix:	'_cod',
	qtype:	'cod',
	url:	baseUrl + '/json/fichario',
	run:	function() {
		window.alert('Nothing to do!!!');
	},
	__getFields:	function(__field) {
		__field.value = __field.value.toUpperCase();
		this.suffix = '_cod';
		__fieldName = __field.name.substr(0,(__field.name.length - this.suffix.length));
		this.fieldValue = __field.value;
		__json = __fieldName;

		// check field type
		if (this.sexo == null) {
			this.sexo = null;
		} else if (__fieldName == 'vaca' || __fieldName == 'receptora' || this.sexo.toUpperCase() == 'F') {
			this.sexo = 'f';
		} else if (__fieldName == 'touro' || this.sexo.toUpperCase() == 'M') {
			this.sexo = 'm';
		} else {
			this.sexo = null;
		}

		if (this.fieldValue == '') {
			$("#" + __fieldName + "_id").val(null);
			$("#" + __fieldName + "_cod").val(null);
			$("#" + __fieldName).val(null);
			return false;
		}
	},
	__ajaxRequest:	function() {
		$("#ajax_loader").html("Buscando dados...").show();
		$.post(this.url, {
			fazenda_id: $('#fazenda_id').val(),
			sexo:	this.sexo,
			qtype:	this.qtype,
			query:	this.fieldValue,
			like:	'false',
			ajax:	'true'
		}, function(j) {
			j = j.rows;
			if (j && j.length == 1) {
				$("#" + __fieldName + "_id").val(j[0].id);
				$("#" + __fieldName + "_cod").val(j[0].cell[0]);
				$("#" + __fieldName).val(j[0].cell[1]);
			} else {
				$("#ajax_loader").html("Código não encontrado").show();
				$("#" + __fieldName + "_id").val(null);
				$("#" + __fieldName).val(null);
				if (__fieldName == 'embriao') {
					$("#" + __fieldName + "_cod").val('');
				}
				setTimeout(function(){
					$("#ajax_loader").fadeOut(300); }
				, 5000);
				return false;
			}
			$("#ajax_loader").fadeOut(30);
		}, "json");
	}
};

change.tecnico = function(field){
	this.run = function(field) {
		this.url = baseUrl + '/json/tecnico';
		this.__getFields(field);
		this.__ajaxRequest();
	};
	this.run(field);
};

change.embriao = function(field){
	this.run = function(field) {
		this.qtype = 'embriao';
		this.url = baseUrl + '/json/embriao';
		this.__getFields(field);
		this.__ajaxRequest();
	};
	this.run(field);
};

change.animal = function(field, sexo) {
	if ($('#fazenda_id').val() == '') {
		$("#ajax_loader").html("Por favor, selecione uma fazenda!").show();
		return false;
	} else if (sexo.toUpperCase() != 'M' && sexo.toUpperCase() != 'F') {
		$("#ajax_loader").html("Erro inesperado, contacte o desenvolvedor!").show();
		console.log(sexo);
		return false;
	} else {
		this.sexo = sexo;
	}
	this.run = function(field) {
		this.url = baseUrl + '/json/animal/sexo'+sexo;
		this.__getFields(field);
		this.__ajaxRequest();
		this.sexo = null;
	};
	this.run(field);
};