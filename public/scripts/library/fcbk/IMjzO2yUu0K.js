/*1292454621,169776068*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "SuybI" ]);
}

var MegaphoneHelper = {
	hideStory : function(f, e, d, a) {
		var b = {
			mp_id : f,
			location : e,
			context : a
		};
		new AsyncRequest().setURI('/ajax/megaphone/megaphone_hide.php')
				.setMethod('POST').setData(b).setHandler(function(h) {
					if (h.isReplay()) {
						var g = ge(d);
						g && hide(g);
					}
				}).send();
		var c = ge(d);
		if (c)
			animation(c).to('height', 0).duration(500).hide().go();
	},
	createModalStory : function(e, f, d, b) {
		var c;
		if (!e.buttons || !e.buttons.length) {
			e.buttons = Dialog.CLOSE;
			c = this.hideStory.bind(this, f, d, b);
		}
		var a = new Dialog(e);
		if (c)
			a.setHandler(c);
		a.show();
	}
};
function MegaphoneEmailStoriesHelper() {
}
copy_properties(MegaphoneEmailStoriesHelper, {
	_endpoint_uri : '/ajax/emails/email_stories.php',
	submitEmail : function(a, b) {
		form = document.forms[a];
		if (form) {
			email = form.elements[b];
			if (email && email.value != '' && is_email(email.value))
				this._ajaxSubmitForm(a, {
					divid : a
				});
		}
		return false;
	},
	resendEmail : function(a, c, b) {
		if (a != '' && c != '') {
			form = document.forms[a];
			if (form) {
				if (form.elements.newemail)
					form.elements.newemail.value = '';
				this._ajaxSubmitForm(a, {
					resend : 1,
					divid : a
				});
			}
		}
		return false;
	},
	cancelEmail : function(a, b) {
		if (a != '' && b != '') {
			form = document.forms[a];
			if (form) {
				if (form.elements.newemail)
					form.elements.newemail.value = '';
				this._ajaxSubmitForm(a, {
					cancel : 1,
					divid : a
				});
			}
		}
		return false;
	},
	_ajaxSubmitForm : function(c, b) {
		var a = Form.serialize(document.forms[c]);
		copy_properties(a, b);
		new AsyncRequest().setURI(this._endpoint_uri).setData(a).setHandler(
				function(d) {
					var e = d.getPayload();
					if (e.show_msg)
						new Dialog().setTitle(e.title).setBody(e.msg)
								.setButtons( [ Dialog.OK ]).show();
				}).setFinallyHandler(
				function(d) {
					var e = d.getPayload();
					if (e.hide_mp) {
						hide(c);
					} else if (e.replace_mp) {
						var f = DOM.find($('pagelet_roosters'),
								'div.UIContentBox');
						if (e.success) {
							CSS.addClass(f, 'megaphone_story_highlighted');
						} else
							CSS.removeClass(f, 'megaphone_story_highlighted');
						DOM.setContent($('DarkMergeRoosterHeader'),
								HTML(e.new_header));
						DOM.setContent($('DarkMergeRoosterBody'),
								HTML(e.new_body));
					}
				}).send();
	}
});

if (window.Bootloader) {
	Bootloader.done( [ "SuybI" ]);
}