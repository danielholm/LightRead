(function() {

	var INDICATOR = "!COMMAND!";
	
	window.py_ctrl = {
		send: function(params, callback) {
			var id = Math.random().toString();
			// console.time(id);
			requests[id] = callback;
			document.title = null;
			document.title = INDICATOR + JSON.stringify({
				id: id,
				command: params
			});
		},
		receive: function(id, reply) {
			// console.timeEnd(id);
			if (typeof (requests[id]) == 'function') {
				requests[id](reply);
				delete requests[id];
			}
		},
		web: {
			send: function(params, callback) {
				py_ctrl.db.transaction(function(tx) {
					tx.executeSql(params.sql, [], function(results) {
						console.log(results);
						if (callback) callback(results);
					});
				});
			}
		},
		use_web: function() {
			py_ctrl.db = openDatabase('lightread', '1.0', 'feeds and item storage', 5 * 1024 * 1024);
			py_ctrl.send = py_ctrl.web.send;
		}
	};
	var requests = py_ctrl.requests = {};

	py_ctrl.use_web();

})();