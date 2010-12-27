var filter = {

	heigth: null,
	width: null,
	like: true,
	dataType: 'json',
	defaultSortName: 'cod',
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
		$('#dlg').bind('dialogbeforeclose', function(event, ui) {
			this.hide_filter;
		});

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
		$("#dlg").fadeOut(200);
		setTimeout(function(){
			$(".flexigrid").remove();
		}, 200);
		$('#dlg').dialog('destroy');
		$("#dlg-grid").remove();
		$("#dlg").append('<div id="dlg-grid"></div>');
	},

	changeFieldCod: function (row, input)
	{
		__id = row.attr("id").substr(3);
		__cod = $("#row"+__id+" td: div")[0].innerHTML;
		__fId = '#' + input + '_id';
		__fCod = '#' + input + '_cod';
		__fSel = '#' + input;
		$(__fId).val(row.attr("id").substr(3));
		$(__fCod).val(__cod);
		$(__fSel).val(row.attr("id").substr(3) + ';' + __cod);
		$("#filter, #filter-bg").fadeOut(200);
		setTimeout(function(){
			$(".flexigrid").remove();
		}, 200);
		$("#filter").append('<div id="filter-grid"></div>');
		this.hide_filter();
	},

	changeField: function (row, input)
	{
		__id = row.attr("id").substr(3);
		__cod = $("#row"+__id+" td: div")[0].innerHTML;
		__dsc = $("#row"+__id+" td: div")[1].innerHTML;
		if (__dsc == '&nbsp;') {
			__dsc = '';
		}

		__fId = '#' + input + '_id';
		__fCod = '#' + input + '_cod';
		__fSel = '#' + input;
		$(__fId).val(row.attr("id").substr(3));
		$(__fCod).val(__cod);
		$(__fSel).val(__dsc);
		$("#dlg").dialog('close');

		setTimeout(function(){
			$(".flexigrid").remove();
		}, 200);
		$("#filter").append('<div id="filter-grid"></div>');
		this.hide_filter();
	},

	createDialog: function(title, w, h, modal)
	{
		this.init();
		// Setting default values
		w = typeof(w) != 'undefined' ? w : 620;
		h = typeof(h) != 'undefined' ? h : (390 + this.heigth);

		modal = typeof(modal) != 'undefined' ? modal : true;

		$("#dlg").dialog({
			modal: modal,
			autoOpen: false,
			resizable: false,
			title: title,
			width: w,
			height: h
		});

		$("#dlg").dialog('open');
		$("#dlg").html('<div id="dlg-grid" style="padding: 0px; margin: 0px"></div>');

		// Workaround to set title forced
		$('#ui-dialog-title-dlg').html(title);

	},

	searchGrauSangue: function(input)
	{
		if ($("#dlg").length) {
			$("#dlg-grid").flexigrid(
			{
				url: this.url,
				dataType: this.dataType,
				colModel : this.defaultColModels,
				searchitems : this.defaultSearchItems,
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
					filter.changeField(row, input);
				},
				params: [{name: 'fazenda_id', value: $("#fazenda_id").val()}]
			});
			$("#dlg").fadeIn(200);
		};
	},

	defaultSearch: function(input)
	{
		if ($("#dlg").length) {
			$("#dlg-grid").flexigrid(
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
					filter.changeField(row, input);
				},
				params: [{name: 'fazenda_id', value: $("#fazenda_id").val()}]
			});
			$("#dlg").fadeIn(200);
		};
	}

};

filter.grauSangue = function(url, input)
{
	this.url = baseUrl + '/json/grausangue';
	this.defaultColModel = this.defaultColModels;
	this.defaultColModel[0].display = 'Gr. Sangue';
	this.defaultColModel[0].width = 60;
	this.createDialog('Grau Sangue');
	this.searchGrauSangue(input);
};

filter.raca = function(url, input)
{
	this.url = baseUrl + '/json/raca';
	this.defaultColModel = this.defaultColModels;
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem[0].display = this.defaultColModel[0].display = 'Raça';
	this.defaultColModel[0].width = 60;
	this.createDialog('Raça');
	this.defaultSearch(input);
};

filter.criador = function(url, input)
{
	this.url = baseUrl + '/json/criador';
	this.defaultColModel = this.defaultColModels;
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem[0].display = this.defaultColModel[0].display = 'Criador';
	this.defaultColModel[0].width = 60;
	this.createDialog('Criador');
	this.defaultSearch(input);
};

filter.pelagem = function(url, input)
{
	this.url = baseUrl + '/json/pelagem';
	this.defaultColModel = this.defaultColModels;
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem[0].display = this.defaultColModel[0].display = 'Pelagem';
	this.defaultColModel[0].width = 60;
	this.createDialog('Pelagem');
	this.defaultSearch(input);
};

filter.rebanho = function(url, input)
{
	this.url = baseUrl + '/json/rebanho';
	this.defaultColModel = this.defaultColModels;
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem[0].display = this.defaultColModel[0].display = 'Rebanho';
	this.defaultColModel[0].width = 60;
	this.createDialog('Rebanho');
	this.defaultSearch(input);
};

filter.acompanhamento = function(url, input)
{
	this.url = baseUrl + '/json/acompanhamento';
	this.defaultColModel = this.defaultColModels;
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem[0].display = this.defaultColModel[0].display = 'Acompanhamento';
	this.defaultColModel[0].width = 60;
	this.createDialog('Acompanhamento');
	this.defaultSearch(input);
};



filter.local = function(url, input)
{
	this.url = baseUrl + '/json/local';
	this.defaultColModel = this.defaultColModels;
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem[0].display = this.defaultColModel[0].display = 'local';
	this.sortName = 'local';
	this.defaultColModel[0].display = 'Local';
	this.defaultColModel[0].width = 60;
	this.createDialog('Local');
	this.defaultSearch(input);
	delete this.sortName;
};

filter.categoria = function(url, input)
{
	this.url = baseUrl + '/json/categoria';
	this.defaultColModel = this.defaultColModels;
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem[0].display = this.defaultColModel[0].display = 'Categoria';
	this.createDialog('Categoria');
	this.defaultSearch(input);
};

filter.lote = function(url, input)
{
	this.url = baseUrl + '/json/lote';
	this.defaultColModel = this.defaultColModels;
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem[0].display = this.defaultColModel[0].display = 'Lote';
	this.createDialog('Lote');
	this.defaultSearch(input);
};

filter.animal = function(url, input)
{

	if ($('#fazenda_id').val() == "") {
		$("#ajax_loader").html("Por favor selecione uma fazenda").fadeIn(100);
		setTimeout(function(){
			$("#ajax_loader").fadeOut(300); }
		, 2000);
		$('#fazenda_id').focus();
		return false;
	}

	if (typeof(url) != '') {
		this.url = url;
	} else {
		this.url = baseUrl + '/json/fichario';
	}
	this.defaultColModel = this.defaultColModels;
	this.defaultColModel = [{
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
	}];
	this.defaultSearchItem = this.defaultSearchItems;
	this.defaultSearchItem = [{
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
	}];
	this.createDialog('Fichário');
	this.defaultSearch(input);
};