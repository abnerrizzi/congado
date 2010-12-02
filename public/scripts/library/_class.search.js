var search = {

	heigth: null,
	width: null,
	like: true,
	dataType: 'json',
	defaultSortName: 'id',
	sortOrder: 'asc',
	defaultColModels: [{
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
	defaultSearchItems: [{
		display: 'Código',
		name : 'cod'
	}, {
		display: 'Descrição',
		name : 'dsc',
		isdefault: true
	}],

	init: function()
	{
		$('#search').bind('dialogbeforeclose', function(event, ui) {
			this.hide_filter;
		});

		if (typeof(__module) == 'undefined') {
			__action = editUrl.split("/")[1];
			__module = '';
		} else {
			__action = editUrl.split("/")[2];
		}

		// workaround to adjust size in mozilla
		$.each($.browser, function(i) {
			if ($.browser.mozilla) {
				this.heigth = parseInt(20);
			} else {
				this.heigth = parseInt(0);
			}
		});
		if (typeof(filter.sortName) == 'undefined') {
			this.sortName = this.defaultSortName;
		}
	},

	hide_filter: function()
	{
		$("#search").fadeOut(200);
		setTimeout(function(){
			$(".flexigrid").remove();
		}, 200);
		$('#search').dialog('destroy');
		$("#search-grid").remove();
		$("#search").append('<div id="search-grid"></div>');
	},


	createDialog: function(title, w, h, modal)
	{
		this.init();
		// Setting default values
		w = typeof(w) != 'undefined' ? w : 620;
		h = typeof(h) != 'undefined' ? h : (390 + this.heigth);

		modal = typeof(modal) != 'undefined' ? modal : true;

		var $dialog = $('<div></div>').dialog({
			modal: modal,
			autoOpen: false,
			resizable: false,
			title: title,
			width: w,
			height: h
		}).attr('id', 'dlg-search');
		$dialog.html('<div id="dlg-search-grid"></div>');

		$("#dlg-search");

		$("#dlg-search").dialog('open');
		$("#dlg-search").html('<div id="dlg-search-grid" style="padding: 0px; margin: 0px"></div>');

		// Workaround to set title forced
		$('#ui-dialog-title-dlg-search').html(title);

	},

	gotoRecord: function(row)
	{
		__id = row.attr("id").substr(3);
		if (typeof(editUrl) == 'undefined') {
			window.alert('editUrl is not defined');
			return false;
		} else {
			url = editUrl + '/id/'+ __id;
			window.location.href = url;
		}
		$("#search").dialog('close');
	},

	defaultSearch: function()
	{
		if ($("#dlg-search").length) {
			$("#dlg-search-grid").flexigrid(
			{
				url: this.url,
				dataType: this.dataType,
				colModel : this.defaultColModel,
				searchitems : this.defaultSearchItem,
				sortname: this.sortName,
				sortorder: this.sortOrder,
				like: this.like,
				usepager: true,
				title: false,
				useRp: true,
				rp: 10,
				showTableToggleBtn: false,
				pagestat: 'Mostrando {from} até {to} de {total} itens',
				width: 600,
				height: (240 + this.heigth),
				onSelect: function(row) {
					search.gotoRecord(row);
				},
				params: [{name: 'fazenda_id', value: $("#fazenda_id").val()}]
			});
			$("#dlg-search").fadeIn(200);
		};
	}

};

search.estoqueEmbriao = function()
{
	this.url = baseUrl + '/json/embriao';
	this.defaultColModel = [{
		display: 'Coleta',
		name : 'data_coleta',
		width : 70,
		sortable : true,
		align: 'left'
	}, {
		display: 'Embrião',
		name : 'd.cod',
		width : 70,
		sortable : true,
		align: 'left'
	}, {
		display: 'Doadora',
		name : 'd.cod',
		width : 100,
		sortable : true,
		align: 'left'
	}, {
		display: 'Touro',
		name : 't.cod',
		width : 100,
		sortable : true,
		align: 'left'
	}, {
		display: 'Criador',
		name : 'criador',
		width : 70,
		sortable : true,
		align: 'left'
	}];
	this.defaultSearchItem = [{
		display: 'Embrião',
		name : 'e.embriao',
		isdefault: true
	}, {
		display: 'Doadora',
		name : 'd.cod',
		isdefault: true
	}, {
		display: 'Touro',
		name : 't.cod',
		isdefault: true
	}];
	this.createDialog('Embrião');
	this.defaultSearch();

};

search.coletaEmbriao = function()
{
	this.url = baseUrl + '/json/coleta';
	this.defaultColModel = [{
		display: 'Coleta',
		name : 'data_coleta',
		width : 70,
		sortable : true,
		align: 'left'
	}, {
		display: 'Vaca',
		name : 'v.cod',
		width : 100,
		sortable : true,
		align: 'left'
	}, {
		display: 'Touro',
		name : 't.cod',
		width : 100,
		sortable : true,
		align: 'left'
	}, {
		display: 'Fecundados',
		name : 'fecundada',
		width : 70,
		sortable : true,
		align: 'left'
	}, {
		display: 'Viaveis',
		name : 'viavel',
		width : 70,
		sortable : true,
		align: 'left'
	}];
	this.defaultSearchItem = [{
		display: 'Animal',
		name : 'v.cod',
		isdefault: true
	}, {
		display: 'Touro',
		name : 't.cod'
	}];
	this.createDialog('Coleta');
	this.defaultSearch();

};
