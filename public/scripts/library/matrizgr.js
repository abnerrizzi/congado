$(document).ready(function() {

	if (checkAddUrl(window.location.href) == true) {
		addSearchIcon('raca', baseUrl+'/json/raca', 'filter.raca', 600, 240);
		addSearchIcon('pai', baseUrl+'/json/grausangue', 'filter.grauSangue', 600, 240);
		addSearchIcon('mae', baseUrl+'/json/grausangue', 'filter.grauSangue', 600, 240);
	}
	addSearchIcon('cria', baseUrl+'/json/grausangue', 'filter.grauSangue', 600, 240);

	$('#raca_cod').change(function(){change.raca(this);});
	$('#pai_cod, #mae_cod, #cria_cod').change(function(){change.grauSangue(this);});

});
