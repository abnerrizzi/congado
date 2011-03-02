$(document).ready(function() {

	$("form.jqtransform").jqTransform();
	$('p').html('<span class="UIButton UIButton_Large UIFormButton  UIButton_Blue"><input style="display: inline-block;" class="UIButton_Text" type="submit" value="Continuar" name="submit"/></span>');

	$('form #fazenda').change(function(){
		// do nothing
	});

	if (typeof(document.forms[0].username) != "undefined") {
		document.forms[0].username.focus();
	}

	// simple jQuery validation script
	$('#login').submit(function(){

		var valid = true;
		var errormsg = 'This field is required!';
		var errorcn = 'error';

		$('.' + errorcn, this).remove();			

		$('.required', this).each(function(){
			var parent = $(this).parent();
			if( $(this).val() == '' ){
				var msg = $(this).attr('title');
				msg = (msg != '') ? msg : errormsg;
				$('<span class="'+ errorcn +'">'+ msg +'</span>')
					.appendTo(parent)
					.fadeIn('fast')
					.click(function(){ $(this).remove(); })
				valid = false;
			};
		});

		return valid;
	});

});

