$(document).ready(function() {

	if (!$('#ocorrencia_cod').attr('readonly')) {
		updateField('#ocorrencia_cod', 'doenca');
		addSearchIcon('ocorrencia', baseUrl+'/json/doenca', 'Doenças', 'showfilter_doenca', 600, 240);
	}

	campoData("#data", new Date());

	$("#fichario_grid").parent().css('text-align', 'center');

	$("#fichario_cod").keypress(function(e) {

		if (e.keyCode == 13) {
            window.alert('Enter: ' + e.value);
            return false;
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

