/*1293473890,169776318*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "qZn3d" ]);
}

add_properties('Messaging', {
	getUserThreadURI : function(a) {
		return URI(env_get('www_base')).setPath('/messages/' + a);
	},
	markAsRead : function(a) {
		a = $A(a);
		new AsyncRequest().setURI('/ajax/messaging/async.php').setData( {
			action : 'markRead',
			tids : a
		}).setMethod('POST').setHandler(bagofholding).setErrorHandler(
				bagofholding).send();
		Arbiter.inform('messaging/mark-as-read', {
			tids : a
		});
	},
	markUserThreadAsRead : function(a) {
		new AsyncRequest().setURI('/ajax/messaging/async.php').setData( {
			action : 'chatMarkRead',
			other_user : a
		}).setMethod('POST').setHandler(bagofholding).setErrorHandler(
				bagofholding).send();
		Arbiter.inform('messaging/mark-as-read', {
			other_user : a
		});
	}
});
var MessagingEvents = window.MessagingEvents
		|| (function() {
			onloadRegister(function() {
				Arbiter.subscribe(PresenceMessage
						.getArbiterMessageType('messaging'), function(a, b) {
					var c = copy_properties(b.obj);
					var event = c.event || '';
					delete c.type;
					delete c.event;
					MessagingEvents.inform(event, c);
				});
			});
			return new Arbiter();
		})();

if (window.Bootloader) {
	Bootloader.done( [ "qZn3d" ]);
}