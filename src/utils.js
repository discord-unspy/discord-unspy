/* Discord unspy
 * Util scripts
 * for version 11.x
 * inculudes;
 * https://github.com/mrdoob/eventdispatcher.js/ (SPDX-License-Identifier: MIT)
 */
    class EventDispatcher {
		addEventListener(type, listener) {
			if (this._listeners === undefined) this._listeners = {};
			const listeners = this._listeners;

			if (listeners[type] === undefined) {
				listeners[type] = [];
			}

			if (listeners[type].indexOf(listener) === -1) {
				listeners[type].push(listener);
			}
		}

		hasEventListener(type, listener) {
			if (this._listeners === undefined) return false;
			const listeners = this._listeners;
			return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
		}

		removeEventListener(type, listener) {
			if (this._listeners === undefined) return;
			const listeners = this._listeners;
			const listenerArray = listeners[type];

			if (listenerArray !== undefined) {
				const index = listenerArray.indexOf(listener);

				if (index !== -1) {
					listenerArray.splice(index, 1);
				}
			}
		}

		dispatchEvent(event) {
			if (this._listeners === undefined) return;
			const listeners = this._listeners;
			const listenerArray = listeners[event.type];

			if (listenerArray !== undefined) {
				event.target = this; // Make a copy, in case listeners are removed while iterating.

				const array = listenerArray.slice(0);

				for (let i = 0, l = array.length; i < l; i++) {
					array[i].call(this, event);
				}

				event.target = null;
			}
		}

	}
/* Unspy utils - console API
     * usage:console.api
    */
  if (typeof console._commandLineAPI !== 'undefined') {
    console.API = console._commandLineAPI;
   } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
    console.API = console._inspectorCommandLineAPI;
   } else if (typeof console.clear !== 'undefined') {
    console.API = console;
 }
 /* Unspy utils - Console warning
  * warns the user
*/
  console.log("%cNya~","color: pink; font-size: 100px");
  console.log("%cHey Qtpie please dont copy or paste anything here~ :3  ","color: purple; font-size: 30px")
