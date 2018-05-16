;(function(win, fn, undefined) {
    "use strict";
    var toString = Object.prototype.toString,
        tplReg = /@\w+@/ig;

    fn();

    var ele = {
        addEvent: window.addEventListener?function(item, type, fn, use) {
            if(!item || !type || !fn) return ;
            item.addEventListener(type, fn, use||false);
        }:function(item, type, fn) {
            if(!item || !type || !fn) return ;
            item.attachEvent("on" + type, fn);
        },
        removeEvent: window.removeEventListener?function(item, type, fn) {
            if(!item || !type || !fn) return ;
            item.removeEventListener(type, fn, use||false);
        }:function(item, type, fn) {
            if(!item || !type || !fn) return ;
            item.detachEvent("on" + type, fn);
        }
    };

    ele.addEvent(document, "readystatechange", function() {
        var args = [].slice.call(arguments, 0),
            e = args.shift() || window.event;
        console.log(e.target.readyState);
    });

    function DragBox() {}

    function DragItem() {}

    win.tpl = {
        init: function(tplStr) {

        }
    };
}(window, function() {
    window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
}));