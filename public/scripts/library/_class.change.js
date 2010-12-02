var change = {
	ajaxRequest:	false,
	suffix:	'_cod',
	qtype:	'cod',
	url:	null,
	run:	function() {
		window.alert('Nothing to do!!!');
	},

	__getFields:	function(__field) {
		__field.value = __field.value.toUpperCase();
		this.suffix = '_cod';
		__fieldName = __field.name.substr(0,(__field.name.length - this.suffix.length));
		this.fieldValue = __field.value;

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
		this.ajaxRequest = true;
		xhr = $.post(this.url, {
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

change.select = function(field, jsonUrl) {
	__fieldName = field.name.substr(0,(field.name.length - this.suffix.length));

	this.run = function(field) {
		if (typeof(jsonUrl) != 'undefined' && jsonUrl != '') {
			this.url = baseUrl + '/json/' + jsonUrl;
		} else {
			this.url = baseUrl + '/json/' + __fieldName;
		}
		if (__fieldName == 'local') {
			this.qtype = 'local';
			if (!$('#fazenda_id').val().length > 0) {
				if ($("#ajax_loader")) {
					$("#ajax_loader").html("Por favor selecione uma fazenda.").show();
					setTimeout(function(){
						$("#ajax_loader").fadeOut(300);
					}
					, 2000);
				}
				return false;
			}
		}
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

change.raca = function(field){
	this.run = function(field) {
		this.url = baseUrl + '/json/raca';
		this.__getFields(field);
		this.__ajaxRequest();
	};
	this.run(field);
};

change.grauSangue = function(field){
	this.run = function(field) {
		this.url = baseUrl + '/json/grausangue';
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
		this.url = baseUrl + '/json/animal/';
		this.__getFields(field);
		this.__ajaxRequest();
		this.sexo = null;
	};
	this.run(field);
};








// without ajax request
change.bySelect = function(field) {
	window.alert('Deprecated function _class.change.js->change.bySelect()');
	field.value = field.value.toUpperCase();
	__select = '#' + field.name.substr(0,(field.name.length - this.suffix.length));
	__hidden = '#' + field.name.substr(0,(field.name.length - this.suffix.length)) + '_id';

	__currentSelect = $(__select + " option");
	for (int = 0; int < __currentSelect.length; int++)
	{
		if (field.value == __currentSelect[int].value.split(";")[1]) {
			$(__select).val(__currentSelect[int].value);
			$(__hidden).val($(__select).val().split(";")[0]);
			__exists = true;
			break;
		} else {
			$(__hidden).val('');
			$(__select).val('');
			__exists = false;
		}

	};

	if (!__exists) {
		if ($("#ajax_loader")) {
			$("#ajax_loader").html("Código inválido encontrado").show();
			setTimeout(function(){
				$("#ajax_loader").fadeOut(300); }
			, 2000);
		}
		return false;
	}

	return false;
};


change.fromSelect = function(field) {
	__input = '#' + field.name + '_cod';
	__hidden = '#' + field.name + '_id';
	$(__hidden).val(field.value.split(";")[0]);
	$(__input).val(field.value.split(";")[1]);
};