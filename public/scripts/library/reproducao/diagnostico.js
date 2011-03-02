$(document).ready(function() {

	$("#add>a").before(
		'<a class="UIButton UIButton_Gray UIActionButton" href="javascript:void(0);" id="search" title="Pesquisar">\n'+
		'<span class="UIButton_Text">\n'+
		'<span class="UIButton_Search UIButton_IconNoSpriteMap_Search UIButton_IconSmallMonochromatic""></span>\n'+
		'Pesquisar\n'+
		'</span></a>\n'+
		'\n'
	);

	$('#add a#search').click(function(){search.diagnostico();});

	if (checkAddUrl(location.href)) {
		makeDateField("#dt_diagnostico", null, new Date());
		addSearchIcon('fichario', baseUrl+'/json/fichario/sexo/f', 'filter.animal', 600, 240);
		$("#fichario_cod").change(function(){
			change.animal_diagnostico(this, 'F');
			$('#ajax_loader').one('change.done', function()
			{
				console.log('change.done ok');

				// gera um field pra mostrar a ultima cobertura
				// pega a ultima cobertura

			});
		});
//		$('#dt_diagnostico').change(function(){
//			if ($('#dt_diagnostico').length > 0 && $('#fichario_id').length > 0) {
//			}
//		});
//		$('#ajax_loader').bind('change.done', verifyDiagnostico());
	}

});


function verifyDiagnostico()
{

	__url = baseUrl + '/reproducao/json/diagnostico';

	$("#ajax_loader").html("Processando");
	$("#ajax_loader").show();

	$.post(__url, {
		fazenda_id:	$('#fazenda_id').val(),
		id:			$('#fichario_id').val()
	}, function(j) {
		$('ajax_loader').unbind("change.done");
		console.log(j);
		if (j.error) {
			window.alert(j.error);
			$("#ajax_loader").fadeOut(30);
			return;
		}
		$('#ajax_loader').trigger('change.done');
	}, "json");
}






/*
SELECT m.data, f.cod, f.nome, m.tipo_id, t.dsc, m.*
FROM movimentacao m
join fichario f on m.fichario_id = f.id
join movimentacao_tipo t on m.tipo_id = t.id
where f.cod like '1003'




select

if(
  origem = 'e',
  false,
  true
)

from fichario

where fazenda_id = 1
and cod = '93'





select *
  from
    cobertura c,
    diagnostico d


-- join diagnostico d
--   on c.fichario_id = d.fichario_id




where
      c.fazenda_id = 1
--  and date_format(d.dt_cobertura, '%Y%m%d') = date_format(c.dt_cobertura, '%Y%m%d')
  and c.fichario_id = 1625
  
  
  
  
  
  
  
  
  
  select * from diagnostico d
left join cobertura c on (
  d.fichario_id = c.fichario_id
    and
  date_format(d.dt_cobertura, '%d/%m/%Y') = date_format(c.dt_cobertura, '%d/%m/%Y')
)
join fichario f on (
  d.fichario_id = f.id
)

where d.id is null
 */
