$(document).ready(function() {

	if (!$('#ocorrencia_cod').attr('readonly')) {
		updateField('#ocorrencia_cod', 'doenca');
		addSearchIcon('ocorrencia', baseUrl+'/json/doenca', 'Doenças', 'showfilter_doenca', 600, 240);
	}

	if (!$('#fichario_cod').attr('readonly')) {
		addSearchIcon('fichario_cod', baseUrl+'/json/animal', 'Doenças', 'showfilter_animalPreventivo', 600, 240);
	}

	campoData("#data", new Date());
	campoData("#dataproximo", new Date()+(60*60*24*365*30));

	$("#fichario_grid").parent().css('text-align', 'center');
	$("#fichario_cod").keypress(function(e) {

		if (e.keyCode == 13) {

			// Check if fazenda is selected
			if ($('#fazenda_id').val() == "") {
				$("#ajax_loader").html("Por favor selecione uma fazenda").fadeIn(100);
				setTimeout(function(){
					$("#ajax_loader").fadeOut(300); }
				, 2000);
				$('#fazenda_id').focus();
				return false;
			}

			// Check if cod is present
			if (this.value == "") {
				return false;
			}

			$("#ajax_loader").html("Buscando dados...").fadeIn(100);
            searchAnimalByCod(this.value);

            return false;
	}

	});

	$("#fichario_cod").keyup(function() {
		this.value = this.value.toUpperCase();
	});

	$('form').submit(function(){
		if ($('#dataproximo').length > 0 && $('#dataproximo').val() != '') {
			__dataProximo = $('#dataproximo').val().split('/');
			__data = $('#data').val().split('/');
			__dtp = new Date(parseInt(__dataProximo[2]), parseInt(__dataProximo[1])-1, parseInt(__dataProximo[0]));
			__dt  = new Date(parseInt(__data[2]), parseInt(__data[1])-1, parseInt(__data[0]));
			if ((__dt - __dtp) >= 0) {
				__msgError = 'A data da proxima preventiva deve ser maior que a\ndata da preventiva atual: '+ $('#data').val();
				window.alert(__msgError);
				return false;
			}
		}
	});

});


/*
 * Busca via ajax os valores de id e descricao dos campos de acordo com o codigo digitado
 */
function updateField(__fld, __jsonUrl, __qtype)
{
	// Change default value if not passed through function call
	__qtype = typeof(__qtype) != 'undefined' ? __qtype : 'cod';

	$(__fld).change(function(){
		this.value = this.value.toUpperCase();
		suffix = '_cod';
		__fieldName = this.name.substr(0,(this.name.length - suffix.length));
		__fieldValue = this.value;

		__url = baseUrl + '/json/' + __jsonUrl;

		if (__fieldValue == '') {
			$("#" + __fieldName + "_id").val(null);
			$("#" + __fieldName + "_cod").val(null);
			$("#" + __fieldName).val(null);
			return false;
		}

		$("#ajax_loader").html("Buscando dados...").show();
		suffix = '_cod';

		$.ajax({
			type: "POST",
			url: __url,
			data: ({
				qtype : __qtype,
				query : __fieldValue,
				like : 'false'
			}),
			dataType: "json",
			success: function(j) {
				j = j.rows;
				if (j && j.length == 1) {
					$("#" + __fieldName + "_id").val(j[0].id);
					$("#" + __fieldName + "_cod").val(j[0].cell[0]);
					$("#" + __fieldName).val(j[0].cell[1]);
				} else {
					$("#ajax_loader").html("Código não encontrado").show();
					$("#" + __fieldName + "_id").val('');
					$("#" + __fieldName).val('');
					$("#" + __fieldName + "_cod").focus();
					setTimeout(function(){
						$("#ajax_loader").fadeOut(300); }
					, 2000);
					return false;
				}
				$("#ajax_loader").fadeOut(30);
			},

			error: function() {
				$("#ajax_loader").html("Erro inesperado!").show();
				$("#" + __fieldName + "_id").val('');
				$("#" + __fieldName).val('');
				setTimeout(function(){
					$("#ajax_loader").fadeOut(3000); }
				, 2000);
				return false;
			}

		});

	});
}






/**
 * Funcao que adiciona linha na tabela com o retorno do json
 */
function addAnimal(j, time)
{
	if ($('#id'+j.id).length > 0) {
		window.alert('Animal ja inserido anteriormente');
		$("#fichario_cod").focus();
		
	} else {

		if (j.cod == null) {
			j.cod = "";
		}
		if (j.nome == null) {
			j.nome = "";
		}

		if (typeof(time) != 'undefined') {
			j.time = time;
		}
		input = '<input type="hidden" name="fichario_id['+j.id+']" value="'+j.time+'"/>';
		del = input + '<a class="UIObjectListing_RemoveLink" href="javascript:void(0);" onclick="deleteAnimal('+j.id+');">&nbsp;</a>';

		if ($('#lastRow').prev().attr('class') == 'head') {
			html = '<tr><td height="1" colspan="12" bgcolor="#BFBDB3"></td></tr><tr class="row0" id="id'+j.id+'"><td/><td>'+j.cod+'</td><td style="background: url(\'/images/grid/divisor_content.gif\');"></td><td/><td align="left">'+j.nome+'</td><td style="background: url(\'/images/grid/divisor_content.gif\');"></td><td/><td align="left" style="padding-left: 10px;">'+j.time+'</td><td style="background: url(\'/images/grid/divisor_content.gif\');"></td><td/><td align="center">'+del+'</td><td/></tr>';
		} else {
			html = '<tr><td height="1" colspan="12"></td></tr><tr><td height="1" colspan="12" bgcolor="#BFBDB3"></td></tr><tr class="row0" id="id'+j.id+'"><td/><td>'+j.cod+'</td><td style="background: url(\'/images/grid/divisor_content.gif\');"></td><td/><td align="left">'+j.nome+'</td><td style="background: url(\'/images/grid/divisor_content.gif\');"></td><td/><td align="left" style="padding-left: 10px;">'+j.time+'</td><td style="background: url(\'/images/grid/divisor_content.gif\');"></td><td/><td align="center">'+del+'</td><td/></tr>';
		}

		$('#gridAnimal #lastRow').before(html);
		$('#fichario_cod').val('');
	}
	divheight = parseInt($("#gridAnimal").height());
	$("#divGridAnimal").animate({scrollTop: divheight}, 300);
	$("#ajax_loader").fadeOut(30);
}


function deleteAnimal(id)
{
	$('#id'+id).prev().remove();
	if ($('#id'+id).prev().attr('class') != 'head') {
		$('#id'+id).prev().remove();
	}
	$('#id'+id).remove();
//	$()
	return false;
}



/**
 * Funcao que busca animal pelo codigo, depois executa funcao para adicionar na tabela
 */
function searchAnimalByCod(cod)
{
	$("#ajax_loader").html("Buscando dados...").fadeIn(100);
    ajaxUrl = baseUrl + '/movimentacao/json/animalpreventivo';
    $.post(ajaxUrl, {
    	fazenda_id: $('#fazenda_id').val(),
    	cod:		cod,
    	rand:		Math.random()
    }, function(j) {
    	if (typeof(j.error) != 'undefined') {
    		window.alert(j.error);
    		return false;
    	} else {
    		if (j.length > 1) {
    			window.alert("Foi encontrado mais de um registro com o código informado.");
    			$("#ajax_loader").fadeOut(300);
    			return false;
    		} else if (j.length == 1) {
    			addAnimal(j[0]);
    			return false;
    		} else {
    			window.alert('Error inesperado');
    			$("#ajax_loader").fadeOut(300);
    			return false;
    		}
    	}
    }, "json");
}