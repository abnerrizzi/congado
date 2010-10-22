function showFilter(title, field, url)
{
	// private 
	var
		title	= title,
		url		= field,
		input	= url,
		modelType
	;

	/*
	if (typeof(title) == 'undefined') {
		throw ('Exception param "title" is not defined');
	} else if (typeof(field) == 'undefined') {
		throw ('Exception param "field" is not defined');
	} else if (typeof(url) == 'undefined') {
		throw ('Exception param "url" is not defined');
	}
	*/

	// private method
	var setTitleExample = function() {
		console.log(this.title);
		this.title = title;
		console.log(this.title);
	};

	// public method
	this.getTitle = function() {
		return title;
	};
	this.getModelType = function() {
		return modelType;
	}

	this.setModelType = function(type)
	{
//		modelType = type;
		if (typeof(eval('showFilter.models.'+type)) == "object") {
			modelType = type;
			return true;
			// set type
			// ????????
		} else {
			throw "Invalid filter type";
			return false;
		}
	};

	this.setURL = function (url) {
		if (url.length > 0) {
			this.url = url;
			return true;
		} else {
			throw "Invalid URL";
			return false;
		}
	}

	this.models = {

		fichario: {
			colModel: [{
				display: 'Animal',
				name : 'cod',
				width : 80,
				sortable : true,
				align: 'left'
			}, {
				display: 'Nome',
				name : 'nome',
				width : 160,
				sortable : true,
				align: 'left'
			}, {
				display: 'RGN',
				name : 'rgn',
				width : 80,
				sortable : true,
				align: 'left'
			}, {
				display: 'SISBOV',
				name : 'sisbov',
				width : 80,
				sortable : true,
				align: 'left'
			}, {
				display: 'Sexo',
				name : 'sexo',
				width : 40,
				sortable : true,
				align: 'left'
			}],
			searchitems : [{
				display: 'Animal',
				name : 'fichario.cod'
			}, {
				display: 'Nome',
				name : 'nome',
				isdefault: true
			}, {
				display: 'RGN',
				name : 'rgn',
				isdefault: true
			}, {
				display: 'SISBOV',
				name : 'fichario.sisbov',
				isdefault: true
			}]
		},


		grausangue: {
			colModel: [{
				display: 'Grau Sangue',
				name : 'cod',
				width : 40,
				sortable : true,
				align: 'left'
			}, {
				display: 'Descrição',
				name : 'dsc',
				width : 180,
				sortable : true,
				align: 'left'
			}],
			searchitems : [{
				display: 'Grau Sangue',
				name : 'cod'
			}, {
				display: 'Descrição',
				name : 'dsc',
				isdefault: true
			}]
		},


		defaults: {
			url: url,
			dataType: 'json',
			colModel : [{
					display: 'Código',
					name : 'cod',
					width : 40,
					sortable : true,
					align: 'left'
				}, {
					display: 'Descrição',
					name : 'dsc',
					width : 180,
					sortable : true,
					align: 'left'
				}],
			searchitems : [{
					display: 'Código',
					name : 'cod'
				}, {
					display: 'Descrição',
					name : 'dsc',
					isdefault: true
				}],
			sortname: "cod",
			sortorder: "asc",
			usepager: true,
			title: false,
			useRp: true,
			fazenda_id: $('#fazenda_id').val(),
			like: true,
			rp: 10,
			showTableToggleBtn: false,
			pagestat: 'Mostrando {from} até {to} de {total} itens',
			width: 600,
			height: (240 + checkBrowser()),
			onSelect: function(row) {
				changeField(row, input);
			}
		}
	};

}







showFilter = new showFilter();

