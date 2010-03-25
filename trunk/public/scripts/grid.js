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
		rows = $(this).parent().parent().find("tr[class*='selected']");
		/*
		 * Se a linha clicada ja estiver selecionada,
		 * mantem a mesma selecionada
		 */
		if (rows.attr('id') == $(this).parent().attr('id')) {
			return;
		}
		$(this).parent().toggleClass('rowon');
		$(this).parent().addClass('selected');
		rows.each(function(i){
			if (rows.attr('id') != $(this).parent().attr('id')) {
				$(rows[i]).removeClass('selected');
			}
		});
	})
	;
});