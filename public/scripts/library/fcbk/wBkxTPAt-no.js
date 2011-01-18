/*1292451066,169775812*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "FTssd" ]);
}

UIIntentionalStory = {
	_moreDetails : {},
	morePrivacyDetails : function(b, c, a) {
		if (is_empty(this._moreDetails))
			onleaveRegister(function() {
				this._moreDetails = {};
			}.bind(this));
		if (this._moreDetails[b])
			return;
		this._moreDetails[b] = true;
		new AsyncRequest().setURI('/ajax/privacy/more_details.php').setData( {
			fbid : b,
			privacy_data : c
		}).setHandler(function(d) {
			TooltipLink.setTooltipText(a, d.getPayload().explanation);
		}).setErrorHandler(bagofholding).send();
	}
};

if (window.Bootloader) {
	Bootloader.done( [ "FTssd" ]);
}