$(document).ready(function() {

	$('#nome').css('font-size', '16px');
	$('#nome').css('font-weight', 'bold');
	$('#nome').css('border', '2px solid #f63');
//	$('#nome').css('background-color', '#cacaca');
//	$('#nome').css('color', '#a60');
	$('#dlg').bind('dialogbeforeclose', function(event, ui) {
		hide_filter();
	});

	$("#criador_cod, #pelagem_cod, #raca_cod, #rebanho_cod, #categoria_cod, #local_cod, #grausangue_cod").change(changeSelect);
	$("#pai_cod, #mae_cod, #receptora_cod").change(changeSelectAnimal);
	$("#grausangue_manual").click(changeGrauSangue);
	$("#obs").keyup(function() {this.value = this.value.toUpperCase();});
	$("#fichario:form").submit(function() { toggleFields(false); });
	toggleFields(true);
	changeGrauSangue();

	if (checkAddUrl(window.location.href) == true) {
		$("#fazenda_id").removeAttr('disabled');
		$("#fazenda_id").removeAttr('readonly');
	}
	// if fazenda_id changed, local fields be empty
	$("#fazenda_id").change(function(){
		$("#local_id").val('');
		$("#local").val('');
		$("#local_cod").val('');
	});

	$("#dt_nascimento").datepicker({

		changeMonth: true,
		changeYear: true,
		showAnim: 'fadeIn',

		dateFormat: 'dd/mm/yy',
		autoSize: true,
		dayNames: ['Domingo', 'Segunda', 'Ter�a', 'Quarta', 'Quinta', 'Sexta', 'S�bado'],
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
		dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
		monthNames: ['Janeiro', 'Fevereiro', 'Mar�o', 'Abril', 'Maio', 'Junho',
		             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		],
	    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
	                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
	    ],
	    nextText: 'Pr�ximo',
	    prevText: 'Anterior',
	    maxDate: new Date()
	});

	$("#dt_nascimento").keyup(function(event){
	        val = $(this).val();
	        if (val.length == 2 || val.length == 5) {
	        	val = val +'/';
	        	$(this).val(val);
	        }
	});

	$("#tabs").tabs();

	// if obs exists Dialogs appers
	if ($('#obs').val() != '') {
		createDialog('Animal com observa��o', 400, 300);
		$('#dlg').html($('#obs').val());
	};

	// workaround to adjust size in mozilla
	$.each($.browser, function(i) {
		if ($.browser.mozilla) {
			var _Height = parseInt(20);
		} else {
			var _Height = parseInt(0);
		}
	});

	$('#genealogia a').each(function() {
		$(this).qtip( {
			content : {
				url : baseUrl + '/json/filhos/',
				data : {
					id : $(this).attr('id')
					/*
					 * coloar atributo a ser passado para o json para
					 * montar a url de acordo com os parametros passados
					 * mais isso tem q ser feito no php, para nao permitir
					 * injecao de codigo malicioso
					 * 
					 */
				},
				prerender: false,
				text: 'Carregando...               ',
				method : 'post'
			},
			// styles: cream, dark, green, light, red, blue
			style : {
					name: 'cream',
					border: {
						width: 2,
						radius: 4
					},
					tip: 'topMiddle',
					width: 240
				},
			hide : {
				when : {
					event : 'inactive'
				},
				delay : 2000
			},
			position: {
				corner: {
					target: 'bottomMiddle',
					tooltip: 'topMiddle'
				}
			},
			target: {
				dimensions: {
					height: 100,
					width: 100
				}
			}
			
		});
	});

	// Remover todos os links da genealogia
	$("#main #fichario #genealogia a:href[id*='a']").each(function(i){
		$("#main #fichario #genealogia a:href[id*='a']").attr('href', 'javascript:void(0);');
	});
});

/*
 * funcao responsavel por habilitar/desabilitar os campos para que os dados sejam enviados pelo post
 * e nao precisem ser recuperados depois via ajax novamente.
 */
function toggleFields(opt) {


	objs = Array(
		"#fazenda_id",
		"#criador",
		"#pelagem",
		"#raca",
		"#rebanho",
		"#categoria",
		"#local",
		"#grausangue",
		"#grausangue_cod"
	);

	for (i=0; i < objs.length; i++)
	{
		$(objs[i]).attr('disabled', opt);
		$(objs[i]).attr('readonly', opt);
	}

	if ($("#fichario").length > 0 && $("#fichario").attr('action').split('/')[4] == 'add') {
		$("#fazenda_id").attr('disabled', false);
		$("#fazenda_id").attr('readonly', false);
	}
}

function changeField(row, input) {
	__id = row.attr("id").substr(3);
	__cod = $("#row"+__id+" td: div")[0].innerHTML;
	__dsc = $("#row"+__id+" td: div")[1].innerHTML;
	if (__dsc == '&nbsp;') {
		__dsc = '';
	}
	__fId = '#' + input + '_id';
	__fCod = '#' + input + '_cod';
	__fSel = '#' + input;
	$(__fId).val(row.attr("id").substr(3));
	$(__fCod).val(__cod);
	$(__fSel).val(__dsc);
	$("#dlg").dialog('close');
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$("#dlg").append('<div id="dlg-grid"></div>');
	return false;
}

function changeGrauSangue() {
	// se tiver checado ativa os campos
	if ($("#grausangue_manual").attr('checked') == true) {
		$("#grausangue_cod").removeAttr("disabled");
		$("#grausangue_cod").removeAttr("readonly");
		$("#grausangue_search").show();
	} else {
		$("#grausangue_cod").attr("disabled", true);
		$("#grausangue_cod").attr("readonly", true);
		$("#grausangue_search").hide();
	}
}

function hide_filter() {
	$("#dlg").fadeOut(200);
	setTimeout(function(){
		$(".flexigrid").remove();
	}, 200);
	$('#dlg').dialog('destroy');
	$("#dlg-grid").remove();
	$("#dlg").append('<div id="dlg-grid"></div>');
}

function showfilter_animal_OLD(url, input)
{

	$("#filter-bg").show();
	if ($("#dlg").length) {
		$("#filter-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Animal',
					name : 'cod',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Nome',
					name : 'nome',
					width : 160,
					sortable : true,
					align: 'left'
				}, {
					display: 'RGN',
					name : 'rgn',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'SISBOV',
					name : 'sisbov',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Sexo',
					name : 'sexo',
					width : 40,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Animal',
					name : 'fichario.cod'
				}, {
					display: 'Nome',
					name : 'nome',
					isdefault: true
				}, {
					display: 'RGN',
					name : 'rgn',
					isdefault: true
				}, {
					display: 'SISBOV',
					name : 'fichario.sisbov',
					isdefault: true
				}],
			sortname: "nome",
			sortorder: "asc",
			usepager: true,
			title: 'Animal',
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} at� {to} de {total} itens',
			width: 600,
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}
	$("#dlg").centerx();
	$(window).bind('resize', function() {$("#dlg").centerx();});
	$(window).bind('scroll', function() {$("#dlg").centerx();});
}




function showfilter_animal(url, input)
{

	createDialog('Animal');
	if ($("#dlg").length) {
		$("#dlg-grid").flexigrid(
		{
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Animal',
					name : 'cod',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Nome',
					name : 'nome',
					width : 160,
					sortable : true,
					align: 'left'
				}, {
					display: 'RGN',
					name : 'rgn',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'SISBOV',
					name : 'sisbov',
					width : 80,
					sortable : true,
					align: 'left'
				}, {
					display: 'Sexo',
					name : 'sexo',
					width : 40,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Animal',
					name : 'fichario.cod'
				}, {
					display: 'Nome',
					name : 'nome',
					isdefault: true
				}, {
					display: 'RGN',
					name : 'rgn',
					isdefault: true
				}, {
					display: 'SISBOV',
					name : 'fichario.sisbov',
					isdefault: true
				}],
			sortname: "nome",
			sortorder: "asc",
			usepager: true,
			title: false,
			useRp: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} at� {to} de {total} itens',
			width: 600,
			height: (240 + _Height),
			onSelect: function(row) {
				changeField(row, input);
			}
		});
		$("#dlg").fadeIn(200);
	}

}

/**
 * 
 * @param title
 * @param w
 * @param h
 * @param modal
 * @return
 */



/**
 * Mostra a genealogia de um animal dentro de um 'Dialog'
 * 
 * @param id int
 * @return
 */
function showGenealogia(id)
{
	$.post(
		baseUrl+"/fichario/genealogia",
		{
			id: id,
			onlyHTML: true
		},
		function(data) {

			createDialog('Genealogia', 800, 540);
			if ($("#dlg").length) {
				$("#dlg-grid").html(data);

				// Remove all links in genealogia
				/*
				$('#dlg-grid table a').each(function() {
					$(this).after($(this).html()).remove();
				});
				*/

				// Hide menu
				$("#dlg #menu").css('display', 'none');

				$('#genealogia a').each(function() {
					$(this).qtip( {
						content : {
							url : baseUrl + '/json/filhos/',
							data : {
								id : $(this).attr('id'),
								link : true
							},
							prerender: false,
							text: 'Carregando...               ',
							method : 'post'
						},
						// styles: cream, dark, green, light, red, blue
						style : {
								name: 'cream',
								border: {
									width: 2,
									radius: 4
								},
								tip: 'topMiddle',
								width: 240
							},
						hide : {
							when : {
								event : 'inactive'
							},
							delay : 2000
						},
						position: {
							corner: {
								target: 'bottomMiddle',
								tooltip: 'topMiddle'
							}
						},
						target: {
							dimensions: {
								height: 100,
								width: 100
							}
						}
						
					});
				});

			}

		},
		"html"
	);

}
