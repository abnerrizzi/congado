$(document).ready(function() {
	$("#null table tr[class*='row'] td").mouseover(function(){
		$(this).parent().toggleClass('rowon');
	}).mouseout(function(){
		$(this).parent().toggleClass('rowon');
	}).dblclick(function(){
		id = $(this).parent().attr('id').substr(2);
		params = new Array();
		params['id'] = id;
		postToURL(baseUrl + editUrl + '/id/'+id, '', 'get');
	}).click(function(){
		/*
		 * Seleciona e deseleciona as linhas quando sao clicadas
		 * caso a linha ja tenha sido selecionada, ao clicar novamente
		 * a mesma perdera a selecao
		 */
		rows = $(this).parent().parent().find("tr[class*='selected']");
		$(this).parent().addClass('selected');
		rows.each(function(i){
			$(rows[i]).removeClass('selected');
		});
	})
	;
});