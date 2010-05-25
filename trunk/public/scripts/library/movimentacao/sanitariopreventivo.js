$(document).ready(function() {

	if (!$('#ocorrencia_cod').attr('readonly')) {
		updateField('#ocorrencia_cod', 'doenca');
		addSearchIcon('ocorrencia', baseUrl+'/json/doenca', 'Doenças', 'showfilter_doenca', 600, 240);
	}

	addSearchIcon('fichario_cod', baseUrl+'/json/animal', 'Doenças', 'showfilter_animalPreventivo', 600, 240);

	campoData("#data", new Date());

//	input_info;

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

            ajaxUrl = baseUrl + '/movimentacao/json/animalpreventivo';
            $.post(ajaxUrl, {
            	fazenda_id: $('#fazenda_id').val(),
            	cod:		this.value,
            	rand:		Math.random()
            }, function(j) {
            	if (typeof(j.error) != 'undefined') {
            		window.alert(j.error);
            		return false;
            	} else {
            		if (j.length > 1) {
            			window.alert("Foi encontrado mais de um registro com o código informado.");
            			return false;
            		} else if (j.length == 1) {
            			addAnimal(j);
            			return false;
            		} else {
            			window.alert('Error inesperado');
            			return false;
            		}
            	}
            }, "json");

            return false;
	}

	});

	$("#fichario_cod").keyup(function() {
		this.value = this.value.toUpperCase();
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
				$("#ajax_loader").fadeOut(100);
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
 * Funcao criada para globalizar o metodo de implementacao do incone de pesquisa
 */
function addSearchIcon(__parent, __jsonUrl, title, function_call, w, h)
{
	__id = __parent+'_search';
	lnk = $('#'+__parent).parent().append(' <a id="'+__id+'"><img alt="" src="'+baseUrl+'/images/search.png"/></a>');
	__id = '#'+__parent+'_search';
	$(__id).attr('href', "javascript:void(0);");
	$('#'+__parent+'_search').click(function() {
		eval(function_call+"('"+__jsonUrl+"', '"+__parent+"');");
	});
}




/**
 * Funcao que adiciona linha na tabela com o retorno do json
 */
function addAnimal(j)
{
	if ($('#id'+j[0].id).length > 0) {
		window.alert('Animal ja inserido anteriormente');
	} else {

		if (j[0].cod == null) {
			j[0].cod = "";
		}
		if (j[0].nome == null) {
			j[0].nome = "";
		}

		del = '<a class="UIObjectListing_RemoveLink" href="javascript:void(0);" onclick="deleteAnimal('+j[0].id+');">&nbsp;</a>';

		if ($('#lastRow').prev().attr('class') == 'head') {
			html = '<tr><td height="1" colspan="12" bgcolor="#BFBDB3"></td></tr><tr class="row0" id="id'+j[0].id+'"><td/><td>'+j[0].cod+'</td><td style="background: url(\'/congado/public/images/grid/divisor_content.gif\');"></td><td/><td align="left">'+j[0].nome+'</td><td style="background: url(\'/congado/public/images/grid/divisor_content.gif\');"></td><td/><td align="left" style="padding-left: 10px;">'+j[0].time+'</td><td style="background: url(\'/congado/public/images/grid/divisor_content.gif\');"></td><td/><td align="center">'+del+'</td><td/></tr>';
		} else {
			html = '<tr class="content"><td height="2" colspan="12"></td></tr><tr><td height="1" colspan="12" bgcolor="#BFBDB3"></td></tr><tr class="row0" id="id'+j[0].id+'"><td/><td>'+j[0].cod+'</td><td style="background: url(\'/congado/public/images/grid/divisor_content.gif\');"></td><td/><td align="left">'+j[0].nome+'</td><td style="background: url(\'/congado/public/images/grid/divisor_content.gif\');"></td><td/><td align="left" style="padding-left: 10px;">'+j[0].time+'</td><td style="background: url(\'/congado/public/images/grid/divisor_content.gif\');"></td><td/><td align="center">'+del+'</td><td/></tr>';
		}

		$('#gridAnimal #lastRow').before(html);
		$('#fichario_cod').val('');
	}
}


function deleteAnimal(id)
{
	$('#id'+id).prev().remove();
	if ($('#id'+id).prev().attr('class') != 'head') {
		$('#id'+id).prev().remove();
	}
	$('#id'+id).remove();
	return false;
}

