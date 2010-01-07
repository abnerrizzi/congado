$(document).ready(function() {
	$('#main table a').each(function() {
		$(this).qtip( {
			content : {
				url : baseUrl + '/json/filhos/',
				data : {
					id : $(this).attr('id')
				},
				method : 'post'
			},
			// styles: cream, dark, green, light, red, blue
			style : 'light',
			hide : {
				when : {
					event : 'inactive'
				},
				delay : 2000
			}
		});
	});
});