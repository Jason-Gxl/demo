;(function(undefined) {
    "use strict";
    var dragBoxList = [],
        tplReg = /@\w+@/ig,
        toString = Object.prototype.toString;

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

        if("complete"!=this.readyState) return ;
        var dragBoxes = [].slice.call(document.getElementsByClassName("drag-box"), 0);

        dragBoxes.forEach(function(box) {
            var d = new DragBox(box);
            dragBoxList.push(d);
        });
    });

    function DragBox(box) {
        if(!(this instanceof DragBox)) {
            return new DragBox(box);
        }

        box.style.position = "relative";
        this.box = box;
        this.items = [].slice.call(box.getElementsByClassName("drag-item"), 0);
    }

    DragBox.prototype = {
        constructor: DragBox,
        activate: function() {
            var self = this;

            ele.addEvent(self.box, "mousemove", function() {
                console.log(this);
            });
        }
    };

    window.tpl = {
        init: function(tplStr) {

        },
        activate: function(index) {
            if(void(0)===index || isNaN(index) || 0>index) {
                dragBoxList.forEach(function(boxObj) {
                    boxObj.activate();
                });
            } else {
                dragBoxList[index].activate();
            }
        }
    };
}());