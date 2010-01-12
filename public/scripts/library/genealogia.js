$(document).ready(function() {
	$('#main table a').each(function() {
		$(this).qtip( {
			content : {
				url : baseUrl + '/json/filhos/',
				data : {
					id : $(this).attr('id')
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
});
