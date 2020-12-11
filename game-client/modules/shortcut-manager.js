
export class ShortcutManager {
	constructor() {
		this._keyShortcuts = {};

		this._readShortcut = this._readShortcut.bind(this);

		const t = !!document.attachEvent;
		document[t ? 'attachEvent' : 'addEventListener']((t ? 'on' : '' ) + 'keypress', this._readShortcut, false);
	}

	_getEventCode(evt) {
		let code  = evt.charCode || evt.keyCode;
		const ctrl  = evt.ctrlKey  ? 'c' : '';
		const alt   = evt.altKey   ? 'a' : '';
		const shift = evt.shiftKey ? 's' : '';

		/* Convert upper case chars to lower case. */
		if (code >= 65 && code <= 90) {
			code += 32;
		}

		return ctrl + alt + shift + code;
	}

	register(code, action) {
		/* Do nothing if the code is malformed. */
		if (!/^c?a?s?\d{1,3}$/.test(code)) {
			return false;
		}

		/* Add the new shortcut to the hash. */
		this._keyShortcuts[code] = action;

		return true;
	}

	registerURL(code, url) {
		return self.register(code, function() {
			window.location.href = url;
		});
	}

	registerURLs(bindings) {
		for (const code in bindings) {
			this.registerURL(code, bindings[code]);
		}
	}

	_readShortcut(evt) {
		/* IE does not pass the event as a parameter; Instead, we retrieve it
		 * from the window object. */
		if (!evt) {
			evt = window.event;
		}

		/* If the source element is a form input, etc, ignore event. */
		let element;
		if (evt.target) {
			element = evt.target;
		} else if (evt.srcElement) {
			element = evt.srcElement;
		}

		if (element.nodeType == 3) {
			element = element.parentNode;
		}

		if ((element.tagName == 'INPUT' && element.type != 'button' && element.type != 'submit')
			|| element.tagName == 'TEXTAREA') {
			return;
		}

		/* Generate the code from this event. */
		let code = this._getEventCode(evt);

		document.defaultAction = true;

		/* If the code exists in the hash, invoke the callback. */
		if (this._keyShortcuts[code]) {
			/* Invokes callback. */
			this._keyShortcuts[code]();

			/* Cancel the event to stop its propagation. */
			if (evt.stopPropagation) {
				evt.stopPropagation();
			} else {
				evt.cancelBubble = true;
			}

			if (evt.preventDefault) {
				evt.preventDefault();
			}

			document.defaultAction = evt.returnValue = false;
		}
		return document.defaultAction;
	}
}
