$(document).ready(function() {

	updateField('#sequencia_cod', 'morte');

	$("#data").datepicker({

		changeMonth: true,
		changeYear: true,
		showAnim: 'fadeIn',

		dateFormat: 'dd/mm/yy',
		autoSize: true,
		dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
		dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
		monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		],
	    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
	                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
	    ],
	    nextText: 'Próximo',
	    prevText: 'Anterior',
	    maxDate: new Date()
	});

	$("#data").keyup(function(event){
	        val = $(this).val();
	        if (val.length == 2 || val.length == 5) {
	        	val = val +'/';
	        	$(this).val(val);
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

xxx = $('#sequencia').parent().append('<a href="javascript:void(0);">xxxx</a>');
$(xxx).click(function(){ window.alert("ahsiudhaiushdasuid"); });


<a
	href="javascript:void(0);"
	onclick="return showfilter_pelagem('<?=$this->baseUrl();?>/json/pelagem','pelagem');"
>
<img
	alt=""
	src="<?=$this->baseUrl();?>/images/search.png"
/>
</a>
*/
