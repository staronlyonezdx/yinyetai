;(function (window, document) {
    function myQuery(selecter) {
        return new init(selecter);
    }

    function init(selecter) {
        if (typeof selecter == "string") {
            this.ele = document.querySelector(selecter);
        } else if (typeof selecter == "object") {
            this.ele = selecter;
        }
    }

    init.prototype = {
        tap: function (callBack) {
            if (typeof callBack != "function") return this;
            var ele = this.ele;
            ele.addEventListener("touchstart", handler);
            ele.addEventListener("touchend", handler);
            var startTime;

            function handler(e) {
                var type = e.type;
                var touch = e.changedTouches[0];
                if (type == "touchstart") {
                    startTime = new Date();
                } else {
                    var deltaTime = new Date() - startTime;
                    if (deltaTime < 200) {
                        callBack.call(ele, {type: "tapstart", clientX: touch.clientX, clientY: touch.clientY});
                    }
                }
            }

            return this;
        },
        pan: function (callBack) {
            if (typeof callBack != "function") return this;
            var ele = this.ele;
            ele.addEventListener("touchstart", handler);
            ele.addEventListener("touchmove", handler);
            ele.addEventListener("touchend", handler);
            var startX = 0, startY = 0, deltaX = 0, deltaY = 0;
            var lastTime = 0, lastDeltaX = 0, lastDeltaY = 0, speedX = 0, speedY = 0;

            function handler(e) {
                var type = e.type;
                var touch = e.changedTouches[0];
                if (type == "touchstart") {
                    deltaX = 0;
                    deltaY = 0;
                    startX = touch.clientX;
                    startY = touch.clientY;
                    lastTime = new Date();
                    callBack.call(ele, {
                        type: "panstart",
                        deltaX: 0,
                        deltaY: 0,
                        speedX: 0,
                        speedY: 0,
                        start: true,
                        end: false
                    });
                } else if (type == "touchmove") {
                    deltaX = touch.clientX - startX;
                    deltaY = touch.clientY - startY;
                    var currentTime = new Date();
                    var deltaTime = currentTime - lastTime;
                    speedX = (deltaX - lastDeltaX) / deltaTime * 1000;
                    speedY = (deltaY - lastDeltaY) / deltaTime * 1000;
                    callBack.call(ele, {
                        type: "panmove",
                        deltaX: deltaX,
                        deltaY: deltaY,
                        speedX: speedX,
                        speedY: speedY
                    });
                    lastDeltaX = deltaX;
                    lastDeltaY = deltaY;
                    lastTime = currentTime;
                } else {
                    callBack.call(ele, {
                        type: "panend",
                        deltaX: deltaX,
                        deltaY: deltaY,
                        speedX: speedX,
                        speedY: speedY,
                        end: true,
                        start: false
                    });
                }
            }

            return this;
        },
        scrollBar: function (color, width) {
            var ele = this.ele;
            var parent = this.ele.parentElement;
            if (ele.offsetHeight <= parent.offsetHeight) return;
            if (getCssValue(parent, "position") == "static") {
                parent.style.position = "relative";
            }

            var span = document.createElement("span");
            span.style.position = "absolute";
            span.style.backgroundColor = color;
            span.style.width = width + "px";
            span.style.top = "0px";
            span.style.right = "2px";
            span.style.opacity = "0";
            span.style.height = parent.offsetHeight / ele.offsetHeight * parent.offsetHeight + "px";
            parent.insertBefore(span, ele.nextElementSibling);
            return this;
        },
        // d1表示内容部分滚动了多少 scrolling表示是否在滚动
        scroll: function (d1, scrolling) {
            var ele = this.ele;
            var bar = this.ele.nextElementSibling;
            if (scrolling) {
                bar.style.transition = "opacity 1s"
            } else {
                bar.style.transition = "opacity 1s 0.5s"
            }
            bar.style.opacity = scrolling ? "1" : "0";
            var parent = this.ele.parentElement;
            var max1 = ele.offsetHeight - parent.offsetHeight;
            var max2 = parent.offsetHeight - bar.offsetHeight;
            var d2 = -d1 / max1 * max2;
            d2 = d2 <= 0 ? 0 : d2;
            d2 = d2 >= max2 ? max2 : d2;
            bar.style.transform = "translateY(" + d2 + "px)";

        },
        toggle: function () {
            var display = window.getComputedStyle(this.ele, null)["display"];
            if (display == "block") {
                this.hide();
            } else if (display == "none") {
                this.show();
            }
            return this;
        },
        show: function () {
            this.ele.style.display = "block";
            return this;
        },
        hide: function () {
            this.ele.style.display = "none";
            return this;
        },
        transform: function (name, X = 0, Y = 0, Z = 0) {
            var ele = this.ele;
            if (name == "translate3d") {
                ele.style.transform = "translate3d(" + X + "px," + Y + "px," + Z + "px)";
            } else if (name == "rotate3d") {
                ele.style.transform = "rotate3d(" + X + "deg," + Y + "deg," + Z + "deg)";
            } else if (name == "scale3d") {
                ele.style.transform = "scale3d(" + X + "," + Y + "," + Z + ")";
            }
            return this;
        },
        tx: function () {
            var transform = window.getComputedStyle(this.ele, null)["transform"];
            var arr = transform.split(",");
            return +arr[arr.length - 2];
        },
        ty: function () {
            var transform = window.getComputedStyle(this.ele, null)["transform"];
            var arr = transform.split(",");
            return +arr[arr.length - 1].replace(")", "");
        },
        /*设置或获取transition的值*/
        transition : function (value){
            if(typeof value == "undefined"){
                return window.getComputedStyle(this.ele, null)["transition"];
            }else{
                this.ele.style.transition = value;
            }
            return this;
        }
    };

// 获取指定css的值
    function getCssValue(ele, name) {
        return window.getComputedStyle(ele, null)[name];
    }

    window.$ = window.myQuery = myQuery;
})(window, document);