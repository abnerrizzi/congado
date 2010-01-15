$(document).ready(function(){

	$("#list").jqGrid({
		url: baseUrl + '/json/animal',
	    datatype: 'json',
	    mtype: 'POST',
	    height: 'auto',
	    colNames:['Animal', 'Nome', 'RGN', 'SISBOV', 'SEXO', 'Categoria', 'Raça', 'GR. Sangue',],
	    colModel :[ 
           {name:'cod', index: 'cod', width: 90, align: 'center'}, 
           {name:'nome', index: 'nome', width: 240, editable: true},
           {name:'rgn', index: 'rgn', width: 80, align: 'right'},
           {name:'sisbov', index: 'sisbov', width: 76, align: 'right'},
           {name:'sexo', index: 'sexo', width: 60, align: 'right'},
           {name:'categoria', index: 'categoria', width: 120},
           {name:'raça', index: 'raca'},
           {name:'grsangue', index: 'grausangue.dsc', width: 120},
        ],
        jsonReader : {
			root: 'rows', 
			page: 'page', 
			total: 'total', 
			records: 'records', 
			repeatitems: true, 
			cell: 'cell', 
			id: 'id', 
			subgrid: { root:'rows', cell:'cell' } 
		},
		pager: jQuery('#pager'),
		rowNum: 10,
		rowList: [10,20,30],
		sortname: 'id',
		sortorder: 'desc',
		viewrecords: true,
		imgpath: 'themes/basic/images',
		caption: 'Fichario Animal'
   }); 


});