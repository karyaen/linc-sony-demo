function bindEvent(type, callback) {
		if (typeof type !== "string") return false;
		if (typeof callback !== "function") return false;

		type = type.toLowerCase();

		if (type.substr(0, 2) !== "on") type = "on" + type;

		if (window.attachEvent) {
				window.attachEvent(type, callback);
		} else if (window.addEventListener) {
				type = type.substr(2);
				window.addEventListener(type, callback);
		} else {
				window[type] = callback;
		}
		return true;
}
