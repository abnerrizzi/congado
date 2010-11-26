var filter = {

	heigth: null,
	width: null,
	dataType: 'json',
	sortName: 'cod',
	sortOrder: 'asc',
	defaultColModels: [{
		display: 'C�digo',
		name : 'cod',
		width : 40,
		sortable : true,
		align: 'left'
	}, {
		display: 'Descri��o',
		name : 'dsc',
		width : 180,
		sortable : true,
		align: 'left'
	}],
	defaultSearchItems: [{
		display: 'C�digo',
		name : 'cod'
	}, {
		display: 'Descri��o',
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
				usepager: true,
				title: false,
				useRp: true,
				rp: 10,
				showTableToggleBtn: false,
				pagestat: 'Mostrando {from} at� {to} de {total} itens',
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
				colModel : this.defaultColModels,
				searchitems : this.defaultSearchItems,
				sortname: this.sortName,
				sortorder: this.sortOrder,
				usepager: true,
				title: false,
				useRp: true,
				rp: 10,
				showTableToggleBtn: false,
				pagestat: 'Mostrando {from} at� {to} de {total} itens',
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
//	this.init();
	this.url = baseUrl + '/json/grausangue';
	this.defaultColModels[0].display = 'Gr. Sangue';
	this.defaultColModels[0].width = 60;
	this.createDialog('Grau Sangue');
	this.searchGrauSangue(input);
};

filter.raca = function(url, input)
{
	this.init();
	this.url = baseUrl + '/json/raca';
	this.defaultColModels[0].display = 'Ra�a';
	this.defaultColModels[0].width = 60;
	this.createDialog('Ra�a', this.width, this.heigth);
	this.defaultSearch(input);
};