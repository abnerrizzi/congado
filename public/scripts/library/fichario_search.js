$(document).ready(function() {
	$("#add").parent().before(
		'<td width="2%" align="right"><a href="javascript:void(0);" id="search" title="Pesquisar"><img src="' + baseUrl + '/images/search.png" alt="Pesquisar"/></a></td>'
	);

	$('#dialog').dialog(
			{
				modal: true,
				draggable: true,
				closeOnEscape: true,
				autoOpen: false,
				resizable: true,
				width: 600,
				height: 300
//				buttons : {
//					"Ok" : function() {
//						$(this).dialog("close");
//					}
//				}
			});

	$("#search").click(function(){$("#dialog").dialog('open');});


});

