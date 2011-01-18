$(document).ready(function(){

	var obj			= $('#qwe');
	var opts		= $('option', obj);
	obj.hide();
	createDD(opts);

});





function createDD(opts)
{

	var selected	= $(opts + 'option:selected');

//	_qwe = $('#qwe');
//	$('#qwe').remove();
//	$('body').prepend('<div class="mbm pam uiBoxGray topborder"><div class="clearfix editFriendsSearchHeader"><div class="clearfix"><div class="uiSelector lfloat uiSelectorNormal uiSelectorDynamicLabel"><div class="wrap">'+_qwe);
////	$('#qwe').after('</div></div></div></div></div>');
//	obj = $('.wrap');
//	obj.append('<a class="uiSelectorButton uiButton" href="#"><i class="mrs img sp_epwws3 sx_61e291"></i><span class="uiButtonText">'+ selected.html() +'</span></a>');
//	obj.append('<div class="uiSelectorMenuWrapper uiToggleFlyout"></div>');
//	obj.append('<ul id="menu" class="uiMenu uiSelectorMenu"></ul>');
//
//	opts.each(function(){
//		$('#menu').append(
//			'<li class="uiMenuItem uiMenuItemRadio uiSelectorOption"><a class="itemAnchor"><span class="itemLabel fsm">' + $(this).text() + '</span></a></li>'
//		);
//	});

}







function createDropDown(objId){
    var source = $("#"+objId);
    var selected = source.find("option[selected]");  // get selected <option>
    var options = $("option", source);  // get all <option> elements
    // create <dl> and <dt> with selected value inside it
    $("body").append('<dl id="target" class="dropdown"></dl>');
    $("#target").append('<dt><a href="#">' + selected.text() + 
        '<span class="value">' + selected.val() + 
        '</span></a></dt>');
    $("#target").append('<dd><ul></ul></dd>');
    // iterate through all the <option> elements and create UL
    options.each(function(){
        $("#target dd ul").append('<li><a href="#">' + 
            $(this).text() + '<span class="value">' + 
            $(this).val() + '</span></a></li>');
    });
}