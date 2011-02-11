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
			verifyConditions(change.animal(this, 'F'));
		});
		$('#dt_diagnostico').change(function(){
			if ($('#dt_diagnostico').length > 0 && $('#fichario_id').length > 0) {
//				console.log('alterou a data');
			}
		});
	}

});






function verifyConditions(xhr)
{

	if ($.browser.mozilla == true) {
	    xhr.onload = xhr.onerror = xhr.onabort = function(){
	        processResponse(xhr);
	    };
	} else {
		xhr_handler = xhr.onreadystatechange;
	    xhr.onreadystatechange = function(){
	        if (xhr.readyState == 4){
	        	xhr_handler();
	        	// $('#fichario_id').val()
	        	/*
	        	 * verificar movimentacoes para encontrar possiveis vendas.
	        	 * verificar origem no fichario se animal eh externo ou nao
	        	 * verificar sexo
	        	 * verificar coberturas ...
	        	 * * verificar se existem coberturas sem diagnostico
	        	 * * verificar se essas coberturas sem diagnosticos estao dentro do prazo
	        	 * * e confirmar se serao automaticamente inseridas no banco de dados como vazia ou sei la como
	        	 */
	        }
	    };
	}


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
