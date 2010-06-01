/**
 * 
 */
function campoData(fields, __maxDate)
{

	__maxDate = typeof(__maxDate) != 'undefined' ? __maxDate : 'cod';

	$(fields).datepicker({

		changeMonth: true,
		changeYear: true,
		showAnim: 'fadeIn',

		dateFormat: 'dd/mm/yy',
		autoSize: true,
		dayNames: ['Domingo', 'Segunda', 'Ter�a', 'Quarta', 'Quinta', 'Sexta', 'S�bado'],
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
		dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
		monthNames: ['Janeiro', 'Fevereiro', 'Mar�o', 'Abril', 'Maio', 'Junho',
		             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		],
	    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
	                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
	    ],
	    nextText: 'Pr�ximo',
	    prevText: 'Anterior',
	    maxDate: __maxDate
		}).keyup(function(event){
			val = $(this).val();
	        if (val.length == 2 || val.length == 5) {
	        	val = val +'/';
	        	$(this).val(val);
	        }
		});
}


/**
 * Funcao responsavel pela mudanca de paginas atraves do menu
 */
function open_page(page, data)
{
	if (typeof(data) == 'undefined') {
		window.location = baseUrl + '/' + page;
	} else {
		if ($("#open_page").length < 1) {
			$(document.body).append('<form id="open_page" method="post" action="'+baseUrl +'/'+page+'"></form>');
		}
		$.each(data, function(key, value) { 
			$("#open_page").append('<input type="hidden" name="' + key + '" value ="' + value + '"/>');
		});
		$("#open_page").submit();
	}
}


/**
 * Esta funcar permite digitar caracteres numeros alem de
 * permitir o botao backspace e o botao delete.
 * @param e
 * @return
 */
function onlyNumbers(e) {
	if (
			 e.which != 8 &&						/* backspace */
			 e.which != 0 &&						/* */
			 e.which != 13 &&						/* enter */
			(e.which < 48 || e.which > 57)		/* numericos */
	   ) {
		if ($("#ajax_loader")) {
			$("#ajax_loader").html("Campo s� aceita n�meros").show();
			setTimeout(function(){
				$("#ajax_loader").fadeOut(300); }
			, 2000);
		}
		return false;
	}
}

function postToURL(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);    // Not entirely sure if this is necessary
    form.submit();
}

function check_delete(id, param, action)
{

	if (window.confirm('Tem certeza que deseja deletar este registro?')) {
		createFormDeleteAndSubmit(id, param, action);
	}

	return false;
}

function createFormDeleteAndSubmit(id, param, action)
{
	if ($("#deleteform").length == 0) {
		submitForm = $('<form id="deleteform"></form>');
		$("#main").append(submitForm);
		el_id = document.createElement('input');
			el_id.setAttribute("type", "hidden");
			el_id.setAttribute("name", "id");
			el_id.setAttribute("value", id);
		el_param = document.createElement("input");
			el_param.setAttribute("type", "hidden");
			el_param.setAttribute("name", "param");
			el_param.setAttribute("value", param);
		$("#deleteform").append(el_id);
		$("#deleteform").append(el_param);
		$("#deleteform").attr('method', 'post');
		$("#deleteform").attr('action', action);
		$("#deleteform").submit();
	}
}

$(document).ready(function() {
	$(".input_num").keypress(function(e) {
		if (
				 e.which != 8 &&						/* backspace */
				 e.which != 0 &&						/* */
				 e.which != 13 &&						/* enter */
				(e.which < 48 || e.which > 57)		/* numericos */
		   ) {
			if ($("#ajax_loader")) {
				$("#ajax_loader").html("Campo s� aceita n�meros").show();
				setTimeout(function(){
					$("#ajax_loader").fadeOut(300); }
				, 2000);
			}
			return false;
		}
	});
	// Caso exista o campo codigo, o focus eh setado automaticamente.
	if ($("#cod").length > 0) {
		$("#cod").focus();
	}
});

jQuery.fn.centerx = function () {
    this.css("position","absolute");
    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
};


function getRecord(row) {
	__id = row.attr("id").substr(3);
	if (typeof(__module) != 'undefined') {
		url = baseUrl+'/'+__module+'/'+__action+'/edit/id/'+__id;
	} else {
		url = baseUrl+'/'+__action+'/edit/id/'+__id;
	}
	$(location).attr('href', url);
	$("#search").dialog('close');
}

function checkBrowser()
{
	if ($.browser.mozilla) {
		return parseInt(20);
	} else {
		return parseInt(0);
	}
}









function DumpObject(obj)
{
	var od = new Object;
	var result = "";
	var len = 0;

	for (var property in obj)
	{
		var value = obj[property];
		if (typeof value == 'string')
			value = "'" + value + "'";
		else if (typeof value == 'object')
		{
			if (value instanceof Array)
			{
				value = "[ " + value + " ]";
			} else {
				var ood = DumpObject(value);
				value = "{ " + ood.dump + " }";
			}
		}
		result += "'" + property + "' : " + value + ", ";
		len++;
	}
	od.dump = result.replace(/, $/, "");
	od.len = len;

	return od;
}



function createDialog(title, w, h, modal)
{
	$.each($.browser, function(i) {
		if ($.browser.mozilla) {
			_Height = parseInt(20);
		} else {
			_Height = parseInt(0);
		}
	});

	// Setting default values
	w = typeof(w) != 'undefined' ? w : 620;
	h = typeof(h) != 'undefined' ? h : (390 + _Height);

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

}

function dump(array, level) {
	var dumped_text = "";
	if (!level) {
		level = 0;
	}

	// The padding given at the beginninf of the line.
	var level_padding = "";
	for (var j=0; j < level+1; j++)
	{
		level_padding += "    ";
	}

	if (typeof(array) == 'object') { // Array/Hashes/Objects
		for (var item in array) {
			var value = array[item];

			if (typeof(value) == 'object') { // If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value, level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { // Strings/Chars/Numbers etc.
		dumped_text = "===>"+array+"<===("+typeof(array)+")";
	}

	return dumped_text;
}


(function($) {
	$.debug = {
		dump : function(arr, level, enc) {
			var dumped_text = "";
			if (!level)
				level = 0;
			var level_padding = "";
			for ( var j = 0; j < level + 1; j++)
				level_padding += "    ";
			if (typeof (arr) == 'object') { // Array/Hashes/Objects
				for ( var item in arr) {
					var value = arr[item];

					if (typeof (value) == 'object') { // If it is an array,
						dumped_text += level_padding + "'" + item + "' ...\n";
						dumped_text += $.debug.dump(value, level + 1);
					} else if (typeof (value) == 'string') {
						value = enc == true ? encHTML(value) : value;
						dumped_text += level_padding + "'" + item + "' => \""
								+ value + "\"\n";
					} else {
						dumped_text += level_padding + "'" + item + "' => \""
								+ value + "\"\n";
					}
				}
			} else { // Stings/Chars/Numbers etc.
				dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
			}
			return dumped_text;
		},
		print_r : function(obj, contId) {
			$("#" + contId).removeClass().css( {
				display : "block",
				position : "absolute",
				top : "0px",
				right : "0px",
				padding : "10px",
				width : "700px",
				height : "auto",
				background : "#ddd",
				color : "black",
				border : "solid 1px black",
				zIndex : 1000
			}).html(
					"<pre>" + $.debug.dump(obj)
							+ "</pre><div id='close-debug'>Close</div>");

			$("#close-debug").css( {
				cursor : "pointer"
			}).click(function() {
				$("#" + contId).remove();
			});
		}
	};
})(jQuery);

function changeSelect() {

	this.value = this.value.toUpperCase();
	suffix = '_cod';
	__select = '#' + this.name.substr(0,(this.name.length - suffix.length));
	__hidden = '#' + this.name.substr(0,(this.name.length - suffix.length)) + '_id';

	for (int = 0; int < $("#raca option").length; int++) {
		if (this.value == $(__select + " option")[int].value.split(";")[1]) {
			$(__select).val($(__select + " option")[int].value);
			$(__hidden).val($(__select).val().split(";")[0]);
			$(__select).val(this.value.split(";")[1]);
			__exists = true;
			break;
		} else {
			$(__hidden).val('');
			$(__select).val('');
			__exists = false;
		}

	}
	if (!__exists) {
		if ($("#ajax_loader")) {
			$("#ajax_loader").html("C�digo n�o encontrado").show();
			setTimeout(function(){
				$("#ajax_loader").fadeOut(300); }
			, 2000);
		}
		return false;
	}

}


/**
 * Funcao criada para globalizar o metodo de implementacao do incone de pesquisa
 */
function addSearchIcon(__parent, __jsonUrl, title, function_call, w, h)
{
	__id = __parent+'_search';
	$('#'+__parent).parent().append(' <a id="'+__id+'"><img alt="" src="'+baseUrl+'/images/search.png"/></a>');
	obj = $('#'+__id);
	obj.attr('href', "javascript:void(0);");
	obj.click(function() {
		eval(function_call+"('"+__jsonUrl+"', '"+__parent+"');");
	});
}


