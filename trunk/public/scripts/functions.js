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
			$("#ajax_loader").html("Campo só aceita números").show();
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
				$("#ajax_loader").html("Campo só aceita números").show();
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
