/*1294696729,169776317*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "rjOiV" ]);
}

function CIBase(a, b) {
	copy_properties(this, {
		ci_config : a,
		element_ids : b
	});
	return this;
}
copy_properties(CIBase.prototype, {
	getId : function(a) {
		return this.element_ids[a];
	},
	setId : function(a, b) {
		this.element_ids[a] = b;
		return this;
	},
	setAjaxMode : function(a) {
		this.ajax_mode = a;
		return this;
	},
	getConfigData : function() {
		var a = {
			type : this.ci_config.type,
			flow : this.ci_config.flow,
			domain_id : this.ci_config.domain_id,
			import_id : this.ci_config.import_id,
			tracked_params : this.ci_config.tracked_params
		};
		return a;
	}
});
function CICaptcha(a) {
	copy_properties(this, {
		captcha_endpoint : '/contact_importer/ajax/captcha.php',
		callback : a,
		form_name : 'ci_captcha_form'
	});
	return this;
}
copy_properties(CICaptcha.prototype, {
	showDialog : function() {
		var a = new AsyncRequest().setMethod('GET').setReadOnly(true).setURI(
				this.captcha_endpoint).setData( {
			form_name : this.form_name
		}).setHandler(bind(this, 'handleCaptchaRender')).send();
	},
	handleCaptchaRender : function(c) {
		var b = c.getPayload();
		var a = [ {
			name : 'submit',
			label : _tx("Submit"),
			handler : bind(this, 'submitCaptchaResponse')
		}, Dialog.CANCEL ];
		new Dialog().setTitle('').setBody(b.content).setButtons(a)
				.setClickButtonOnEnter('captcha_response', 'submit').show();
	},
	submitCaptchaResponse : function() {
		var a = Form.serialize($(this.form_name));
		new AsyncRequest().setURI(this.captcha_endpoint).setMethod('POST')
				.setData(a).setHandler(this.callback.bind(this)).send();
	}
});
function ProgressBar(a) {
	copy_properties(this, {
		_updateInterval : 100,
		_lastProgress : null,
		_inited : false,
		_innerBar : DOM.find(a, 'div.progress_bar_inner'),
		_outerBar : DOM.find(a, 'div.progress_bar_outer')
	});
	var b = this._innerBar.style.width;
	this._innerBar.style.width = '100%';
	(function() {
		this._inited = true;
		this._width = Vector2.getElementDimensions(this._innerBar).x;
		this._innerBar.style.width = b;
	}.bind(this)).defer();
}
ProgressBar.prototype = {
	setUpdateInterval : function(a) {
		this._updateInterval = a;
		return this;
	},
	setProgress : function(a) {
		if (a < 0 || a > 100)
			return;
		if (!this._inited) {
			this.setProgress.bind(this, a).defer();
			return this;
		}
		animation(this._innerBar).to('width',
				Math.round(this._width * (a / 100))).duration(
				this._updateInterval).go();
		return this;
	}
};
function CIProgressBar(a) {
	this.parent.construct(this, a);
	copy_properties(this, {
		percent : DOM.find(a, 'span.progress_bar_percent'),
		message : DOM.find(a, 'span.progress_bar_message')
	});
	return this;
}
CIProgressBar.extend('ProgressBar');
copy_properties(CIProgressBar.prototype, {
	setProgress : function(b, a) {
		this.parent.setProgress(b);
		DOM.setContent(this.percent, HTML("" + b));
		DOM.setContent(this.message, HTML(a));
	}
});
function CIInputController(b, c, d, a) {
	this.parent.construct(this, b, c);
	this.parent.setAjaxMode(a);
	copy_properties(this, {
		show_captcha : d
	});
	return this;
}
CIInputController.extend('CIBase');
copy_properties(
		CIInputController.prototype,
		{
			onSubmit : function(c) {
				var b = this.getLoginString();
				if (!b)
					return false;
				if (this.show_captcha) {
					var a = new CICaptcha(bind(this, this._submitLoginForm, c));
					a.showDialog();
					return false;
				}
				return this._submitLoginForm(c);
			},
			setProgressData : function(a) {
				this.progress_data = a;
				return this;
			},
			startProgressBar : function() {
				if (!this.progress_data)
					return;
				this.progress_dialog = new Dialog().setTitle(
						this.progress_data.title).setBody(
						this.progress_data.body).setModal(true,
						Dialog.MODALITY.DARK);
				this.progress_dialog.show();
				(function() {
					this.progress_bar = new CIProgressBar(this.progress_dialog
							.getRoot());
				}.bind(this)).defer();
				this.progressCounter = 0;
				setTimeout(bind(this, 'pollForProgress'), 2000);
			},
			hideProgressBar : function() {
				if (this.progress_dialog)
					this.progress_dialog.hide();
				this.progress_bar = null;
				this.progressCounter = 0;
			},
			_submitLoginForm : function(h) {
				var e = this.getForm();
				var a = (e.getAttributeNode('action') || {}).value;
				var d = Form.serialize(e);
				if (h)
					copy_properties(d, h);
				if ((h && h.full_post) || !this.ajax_mode) {
					var c = this.progress_data;
					if (c) {
						this.progress_dialog = new Dialog().setTitle(c.title)
								.setBody(c.body).setModal(true,
										Dialog.MODALITY.DARK);
						this.progress_dialog.show();
					}
					setTimeout(function() {
						Form.post(this.ci_config.full_endpoint, d);
					}.bind(this), 0);
					return false;
				}
				var b = new AsyncRequest();
				if (d.jsonp) {
					var f = this.getId('login_input');
					var i = this.getId('password');
					var g = {};
					g[f] = d[f];
					g[i] = d[i];
					d.creds = Base64.encodeObject(g);
					delete d[f];
					delete d[i];
					b.setOption('jsonp', true).setMethod('GET').setReadOnly(
							true);
				}
				b.setURI(a).setData(d).setHandler(bind(this, function(j) {
					this.handleLoginSubmit(j.getPayload());
				})).setStatusElement(this.getStatus());
				var c = this.progress_data;
				if (c) {
					if (!this.progress_bar)
						this.startProgressBar();
				} else if (d.jsonp)
					b.addStatusIndicator();
				b.send();
				if (this.ci_config.should_log_tti)
					window.ciSubmitTime = new Date().getTime();
				return false;
			},
			MAX_PROG_POLLS : 15,
			pollForProgress : function() {
				if (this.progressCounter < 0
						|| this.progressCounter >= this.MAX_PROG_POLLS)
					return;
				new AsyncRequest().setURI(this.ci_config.progress_endpoint)
						.setHandler(bind(this, 'handleProgressResponse'))
						.setReadOnly(true).send();
				this.progressCounter += 1;
			},
			handleProgressResponse : function(b) {
				if (this.progressCounter < 0
						|| this.progressCounter > this.MAX_PROG_POLLS)
					return;
				var a = b.getPayload().progress;
				if (a && this.progress_bar)
					this.progress_bar.setProgress(a.percent, a.message);
				setTimeout(bind(this, 'pollForProgress'), 2000);
			},
			handleLoginSubmit : function(c) {
				this.progressCounter = -1;
				if (this.progress_bar)
					this.progress_bar.setProgress(100,
							this.progress_data.finish_title);
				var a = this.getContainer();
				if (c.error) {
					ErrorDialog.show(c.error.title, c.error.body);
				} else {
					var b = c.content;
					DOM.replace(a, HTML(c.content));
				}
				setTimeout(bind(this, 'hideProgressBar'), 300);
			},
			getLoginString : function() {
				return trim(this.getLogin().value);
			},
			openAPIPopup : function(a, d) {
				var b = this.getConfigData();
				copy_properties(b, {
					api_instance : a,
					login_str : d
				});
				var i = new URI(this.ci_config.api_endpoint).addQueryData(b);
				var j = 0;
				var c = 0;
				if (a == 1) {
					j = 600;
					c = 400;
				} else if (a == 2) {
					j = 600;
					c = 450;
				} else if (a == 3) {
					j = 500;
					c = 500;
				} else {
					j = 830;
					c = 600;
				}
				var l = window.screenLeft || window.screenX || 0;
				var m = window.screenTop || window.screenY || 0;
				var k = Vector2.getViewportDimensions();
				var g = l + (k.x - j) / 2;
				var h = m + 115;
				var f = 'height=' + c + ',width=' + j + ',left=' + g + ',top='
						+ h + ',resizable=1,scrollbars=1,toolbar=0,status=0';
				var e = 'dialogHeight=' + c + 'px;' + 'dialogWidth=' + j
						+ 'px;' + 'dialogLeft=' + g + 'px;' + 'dialogTop=' + h
						+ 'px;' + 'center=1;resizable=1;status=0;';
				if (this.supportShowModalDialog()) {
					this.apiWindow = window.showModalDialog(i,
							'api_contact_importer', e);
					this.isModal = true;
				} else {
					this.apiWindow = window.open(i, 'api_contact_importer', f);
					if (this.apiWindow)
						this.apiWindow.focus();
				}
			},
			supportShowModalDialog : function() {
				return window.showModalDialog && !ua.ie() && !ua.opera();
			},
			processToken : function(a, b, e) {
				var d = {
					api_instance : a,
					auth_token : b,
					auth_crypt : Boolean(e)
				};
				if (this.show_captcha) {
					var c = new CICaptcha(bind(this, '_submitLoginForm', d));
					c.showDialog();
				} else
					this._submitLoginForm(d);
			},
			getForm : function() {
				return $(this.getId('form'));
			},
			getLogin : function() {
				return $(this.getId('login_input'));
			},
			getStatus : function() {
				return $(this.getId('login_status'));
			},
			getContainer : function() {
				return $(this.getId('contacts_container'));
			},
			logAsync : function(a) {
				a = a || {};
				var b = copy_properties(a, this.getConfigData());
				new AsyncSignal(this.ci_config.log_endpoint, b).send();
			}
		});
var CIWebmailValidator = (function() {
	var d;
	var b;
	var f;
	var c = false;
	var e = false;
	var a = [];
	var g = function(m) {
		var j = m.getPayload();
		var o = j.tokens;
		delete j['tokens'];
		for ( var i in j) {
			var h = j[i];
			for ( var n in o) {
				if (!o.hasOwnProperty(n))
					continue;
				var k = n.replace(/([.?*+\^$\[\]\\(){}\-])/g, "\\$1");
				var l = new RegExp(k, "g");
				h = h.replace(l, o[n]);
			}
			j[i] = h;
		}
		d = j;
		c = true;
		while (a.length > 0)
			(a.shift())();
	};
	return {
		hasFullMapping : function() {
			return c;
		},
		init : function(i, h, j) {
			if (!c && !e) {
				d = i;
				b = h;
				f = j;
			}
		},
		isValidEmail : function(h) {
			var i = new RegExp(
					"[A-Za-z0-9_!#$%&'*+/=?^`{|}~-]+(?:\\.[A-Za-z0-9_!#$%&'*+/=?^`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?");
			return i.test(h);
		},
		getDomain : function(i) {
			var h = i.split('@');
			return h[1];
		},
		getDomainImporterName : function(h) {
			var k = [ 'msft', 'yahoo', 'gmail', 'yahoo_jp', 'other' ];
			var m = h.split(/\./);
			for ( var i = 0; i < m.length - 1; i++) {
				var n = m.slice(i).join('.');
				n = '|' + n.toLowerCase() + '|';
				for ( var l = 0; l < k.length; l++) {
					var j = k[l];
					if (d[j].indexOf(n) != -1)
						return j;
				}
			}
			return null;
		},
		getImporterName : function(h) {
			return this.getDomainImporterName(this.getDomain(h));
		},
		getImporter : function(h) {
			var i = this.getImporterName(h);
			return f[i];
		},
		getAPIInstance : function(h) {
			var i = this.getImporter(h);
			if (b[i])
				return i;
			return null;
		},
		isAPIDomain : function(h) {
			var i = f[this.getDomainImporterName(h)];
			return (b[i]);
		},
		isLiveDomain : function(h) {
			return this.getImporterName(h) == 'msft';
		},
		isGmailDomain : function(h) {
			return this.getImporterName(h) == 'gmail';
		},
		isYahooDomain : function(h) {
			return this.getImporterName(h) == 'yahoo';
		},
		isYahooJpDomain : function(h) {
			return this.getImporterName(h) == 'yahoo_jp';
		},
		isSupportedDomain : function(h) {
			var i = this.getDomainImporterName(this.getDomain(h));
			return i != null;
		},
		downloadDomainMapping : function(h) {
			if (c)
				return;
			if (h)
				a.push(h);
			if (!e) {
				e = true;
				new AsyncRequest().setURI(
						URI('/contact_importer/ajax/get_domains.php'))
						.setMethod('GET').setReadOnly(true).setHandler(
								g.bind(this)).send();
			}
		}
	};
})();
function CIWebmailInputController(b, d, f, a) {
	this.parent.construct(this, b, d, f, a);
	copy_properties(this, {
		login_str : null,
		ms_login : null,
		timer : null
	});
	this.importer_widget = this.getWidget();
	var c = CIWebmailValidator.downloadDomainMapping.bind(CIWebmailValidator,
			null);
	Event.listen(this.importer_widget, 'mouseover', c);
	var e = this.getLogin();
	Event.listen(e, 'focus', c);
	Event.listen(e, 'change', this.validate.bind(this));
	Event.listen(e, 'keydown', this.onKeyDown.bind(this));
	this.form_onsubmit = this.getForm().onsubmit;
	CIInputController.instance = this;
	return this;
}
CIWebmailInputController.extend('CIInputController');
copy_properties(
		CIWebmailInputController.prototype,
		{
			onSubmit : function(a) {
				try {
					return this._onSubmit(a);
				} catch (b) {
					var data = {
						js_error : b.message
					};
					this.logAsync(data);
					return false;
				}
			},
			_onSubmit : function(c) {
				CIInputController.instance = this;
				if (this.deferred)
					clearTimeout(this.deferred);
				if (!this.validate())
					return false;
				var d = this.getLoginString();
				var a = CIWebmailValidator.getAPIInstance(d);
				var e = (this instanceof CINUXToDoWebmailInputController && CIWebmailValidator
						.isGmailDomain(d));
				if (e)
					a = 2;
				if (a) {
					this.openAPIPopup(a, d);
					this.getPassword().value = '';
					return false;
				} else if (Input.isEmpty(this.getPassword()))
					return false;
				var b = CIWebmailValidator.getDomain(d);
				if (b == 'yahoo.co.jp')
					if (this.ci_config.use_applet && navigator.javaEnabled()) {
						this.injectApplet();
						return false;
					}
				return this.parent.onSubmit();
			},
			injectApplet : function() {
				var b = this.getStatus();
				CSS.addClass(b, 'async_saving');
				show(b);
				var a = DOM.create('applet', {
					height : 1,
					width : 1,
					archive : "/contact_importer/CI.jar?rand=" + Math.random(),
					code : "com.facebook.CI"
				});
				a.setAttribute("mayscript", "true");
				a.setAttribute("scriptable", "true");
				a.appendChild(DOM.create('param', {
					name : 'username',
					value : this.getLoginString()
				}));
				a.appendChild(DOM.create('param', {
					name : 'password',
					value : trim(this.getPassword().value)
				}));
				this.importer_widget.appendChild(a);
			},
			validate : function() {
				var b = this.getLoginString();
				this.login_str = b;
				if (!b) {
					this.setDefault();
					return false;
				}
				var c = CIWebmailValidator;
				if (!c.isValidEmail(b)) {
					this.setDefault();
					return false;
				}
				if (c.isSupportedDomain(b)) {
					this.updateSubmitButton(c, b);
					var a = c.getAPIInstance(b);
					if (a) {
						if (c.isYahooJpDomain(b)) {
							this.showBookmarkletDialog();
						} else
							this.setAPI();
					} else
						this.setValid();
					return true;
				} else {
					if (CIWebmailValidator.hasFullMapping()) {
						this.setUnsupported();
					} else {
						this.setWaiting();
						CIWebmailValidator.downloadDomainMapping(this.validate
								.bind(this));
					}
					return false;
				}
			},
			showBookmarkletDialog : function() {
				new Dialog().setAsyncURL(
						'/contact_importer/ajax/bookmarklet_dialog.php').show();
			},
			updateSubmitButton : function(c, a) {
				var b = this.getForm();
				if (c.isYahooJpDomain(a)) {
					b.onsubmit = function(d) {
						this.showBookmarkletDialog();
						Event.kill(d);
						return false;
					}.bind(this);
				} else
					b.onsubmit = this.form_onsubmit;
			},
			setValid : function() {
				this.enablePassword();
				CSS.setClass(this.importer_widget, 'valid');
			},
			setWaiting : function() {
				CSS.setClass(this.importer_widget, 'waiting');
			},
			setUnsupported : function() {
				CSS.setClass(this.importer_widget, 'unsupported');
				this.disablePassword();
				this.logAsync( {
					unsupported_login : this.login_str
				});
			},
			setAPI : function() {
				CSS.setClass(this.importer_widget, 'api');
				this.disablePassword();
			},
			setDefault : function() {
				CSS.setClass(this.importer_widget, 'default');
				this.enablePassword();
			},
			onKeyDown : function(b) {
				if (this.deferred)
					clearTimeout(this.deferred);
				var a = Event.getKeyCode(b);
				if (!a || a == KEYS.RETURN || a == KEYS.TAB)
					return;
				this.deferred = this.updateDisplayOnKeyEvent.bind(this).defer(
						300);
			},
			updateDisplayOnKeyEvent : function() {
				var a = this.getLoginString();
				if (CIWebmailValidator.isValidEmail(a)
						&& CIWebmailValidator.getAPIInstance(a)) {
					this.setAPI();
					return;
				}
				if (CSS.hasClass(this.importer_widget, 'unsupported')) {
					this.setDefault();
					return;
				}
			},
			canHidePassword : function() {
				return !CSS.hasClass(this.importer_widget, 'default');
			},
			disablePassword : function() {
				var b = this.getPassword();
				if (!this.canHidePassword())
					return;
				var a = DOM.find(this.getForm(), '.ci_password_row');
				CSS.hide(a);
			},
			enablePassword : function() {
				var b = this.getPassword();
				var a = DOM.find(this.getForm(), '.ci_password_row');
				CSS.show(a);
			},
			getWidget : function() {
				return $(this.getId('widget'));
			},
			getPassword : function() {
				return $(this.getId('password'));
			}
		});
function CINUXToDoWebmailInputController(b, c, d, a) {
	this.parent.construct(this, b, c, d, a);
	return this;
}
CINUXToDoWebmailInputController.extend('CIWebmailInputController');
copy_properties(CINUXToDoWebmailInputController.prototype, {
	disablePassword : function() {
	},
	enablePassword : function() {
	}
});
function CIEMUWebmailInputController(b, c, d, a) {
	this.parent.construct(this, b, c, d, a);
	return this;
}
CIEMUWebmailInputController.extend('CIWebmailInputController');
copy_properties(CIEMUWebmailInputController.prototype, {
	updateDisplayOnKeyEvent : function() {
		this.validate();
	}
});
function ciImportBegin() {
}
function ciImportEnd() {
}
function ciImportResults(a) {
	var b = {
		scraped_data : a,
		full_post : true
	};
	CIInputController.instance.parent.onSubmit(b);
}
function ciImportError(a, b) {
	ciImportResults('<error>' + a + '</error>');
}
function CIWlmInputController(c, d, e, a, b) {
	this.parent.construct(this, c, d, e, a);
	copy_properties(this, {
		api_instance : b
	});
	return this;
}
CIWlmInputController.extend('CIInputController');
copy_properties(CIWlmInputController.prototype, {
	onSubmit : function() {
		CIInputController.instance = this;
		var a = this.getLoginString();
		this.openAPIPopup(this.api_instance, a);
		return false;
	}
});

if (window.Bootloader) {
	Bootloader.done( [ "rjOiV" ]);
}