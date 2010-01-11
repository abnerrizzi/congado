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
	submitForm = document.createElement("FORM");
	document.body.appendChild(submitForm);
	submitForm.action = action;
	submitForm.method = 'POST';

	el_id = document.createElement("input");
		el_id.setAttribute("type", "hidden");
		el_id.setAttribute("name", "id");
		el_id.setAttribute("value", id);
	submitForm.appendChild(el_id);
	el_param = document.createElement("input");
		el_param.setAttribute("type", "hidden");
		el_param.setAttribute("name", "param");
		el_param.setAttribute("value", param);
	submitForm.appendChild(el_param);

	submitForm.submit();
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