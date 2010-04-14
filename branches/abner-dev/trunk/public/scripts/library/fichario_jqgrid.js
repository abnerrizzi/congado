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
           {name:'rgn', index: 'rgn', width: 80, align: 'right', editable: true},
           {name:'sisbov', index: 'sisbov', width: 76, align: 'right', editable: true},
           {name:'sexo', index: 'sexo', width: 60, align: 'right', editable: true, edittype:"select", editoptions:{value:"M:Masculino;F:Feminino"}},
           {name:'categoria', index: 'categoria', width: 120, editable: true},
           {name:'raça', index: 'raca', editable: true},
           {name:'grsangue', index: 'grausangue.dsc', width: 120, editable: true},
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
		rowList: [10,20,30,50,250],
		sortname: 'id',
		sortorder: 'desc',
		viewrecords: true,
		imgpath: 'themes/basic/images',
		editurl: 'www.google.com',
		caption: 'Fichario Animal'
	})
	.navGrid('#pager', {view: true, del: false}, 
		{}, // use default settings for edit
		{}, // use default settings for add
		{},  // delete instead that del:false we need this
		{multipleSearch : true}, // enable the advanced searching
		{closeOnEscape:true} /* allow the view dialog to be closed when user press ESC key*/
	)
	;





//	$("#list").jqGrid('navGrid','#pager',
//		{}, //options
//		{height:280,reloadAfterSubmit:false}, // edit options
//		{height:280,reloadAfterSubmit:false}, // add options
//		{reloadAfterSubmit:false}, // del options
//		{} // search options
//	);

});

