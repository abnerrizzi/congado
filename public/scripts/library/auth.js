$(document).ready(function() {
	$('.uiSelectorButton,.uiButton').click(function(){

		$(this).parent().toggleClass('openToggler');
		$(this).toggleClass('selected');

		if ($('button:.hideToggler').length > 0) {
			$('button:.hideToggler').remove();
		} else {
			$(this).parent().prepend('<button class="hideToggler"></button>');
			$(this).parent().append('<button class="hideToggler"></button>');
		}

		$('li:.uiMenuItem:.uiMenuItemRadio:.uiSelectorOption').mouseover(function(){
			$(this).addClass('selected');
		});

		$('li:.uiMenuItem:.uiMenuItemRadio:.uiSelectorOption').mouseout(function(){
			$(this).removeClass('selected');
		});

		return false;

	});
});





