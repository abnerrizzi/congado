$(document).ready(function(){

	if (!$('#sequencia_cod').attr('readonly')) {
		updateField('#sequencia_cod', 'morte');
		addSearchIcon('sequencia', baseUrl+'/json/morte', 'Causa Mortis', 'showfilter_morte', 600, 240);
	}

	if (!$("#fichario_cod").attr('readonly')) {
		addSearchIcon('fichario', baseUrl+'/json/animal', 'animal', 'showfilter_animal', 600, 240);
		updateField('#fichario_cod', 'animal', 'fichario.cod');
	}

	makeDateField($('#data'), false, new Date());

});





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

