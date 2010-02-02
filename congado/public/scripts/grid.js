$(document).ready(function() {

	$("#null table tr[class*='row'] td").mouseover(function(){
        if ($(this).parent().hasClass('selected') == false) {
            $(this).parent().addClass('rowon');
        }
	});

	$("#null table tr[class*='row'] td").mouseout(function(){
        if ($(this).parent().hasClass('selected') == false) {
            $(this).parent().removeClass('rowon');
        }
	});

	$("#null table tr[class*='row'] td").dblclick(function(){
		id = $(this).parent().attr('id').substr(2);
		window.location = (baseUrl + editUrl + '/id/'+ id);
	});

	$("#null table tr[class*='row'] td").click(function(){
		/*
		 * Seleciona e deseleciona as linhas quando sao clicadas
		 * caso a linha ja tenha sido selecionada, ao clicar novamente
		 * a mesma perdera a selecao
		 */
		rows = $(this).parent().parent().find("tr[class*='selected']");
		$(this).parent().toggleClass('rowon');
		$(this).parent().addClass('selected');
		rows.each(function(i){
			$(rows[i]).removeClass('selected');
		});
	})
	;
});