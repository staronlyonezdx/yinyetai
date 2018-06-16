;(function(){
     document.addEventListener("touchstart",function (event) {
         event.preventDefault();

     })
})();
(function (designWidth) {
    var size = window.innerWidth * 100 / designWidth;
    document.documentElement.style.fontSize = size + "px";
    document.body.style.fontSize = "14px";
})(1080);
(function () {
    window.onload = function () {
        menuActive();
        handelNav();
        lbthandel();
        barScroll();
        tabHandel();
        handelTabNav();
    };


    function menuActive() {
        var activeMenu = document.querySelector(".header .header-top .active-menu");
        var menu = document.querySelector(".header .menu");
        $(".active-menu").tap(function () {
            var display = window.getComputedStyle(menu, null)["display"];
            if (display == "none") {
                this.style.background = "url('img/menuBtn.png') no-repeat center  -1.2rem";
                this.style.backgroundSize = "0.82rem 2.33rem";
            } else if (display == "block") {
                this.style.background = "url('img/menuBtn.png') no-repeat center  0.16rem";
                this.style.backgroundSize = "0.82rem 2.33rem";
            }
            $(".menu").toggle();
        })
        document.addEventListener("touchstart", function (event) {
            if (event.changedTouches[0].target.id != "active-menu") {
                $(".menu").hide();
                activeMenu.style.background = "url('img/menuBtn.png') no-repeat center  0.16rem";
                activeMenu.style.backgroundSize = "0.82rem 2.33rem";
            }

        })
    }

    function handelNav() {
        var lis = document.querySelectorAll(".content .nav-wrap .nav li");
        var lastIndex = 0;
        for (let i = 0; i < lis.length; i++) {
            $(lis[i]).tap(function () {
                lis[lastIndex].classList.remove("active");
                this.classList.add("active");
                lastIndex = i;
            })
        }
        var initX = 0;
        $(".nav").pan(function (e) {
            this.style.transition = "";
            var disX = e.deltaX;
            $(this).transform("translate3d", initX + disX, 0, 0);
            if (e.end) {
                initX += disX;
                if (initX > 0) {
                    initX = 0;
                    this.style.transition = "transform 0.4s cubic-bezier(.28,.19,.95,1.75)";
                    $(this).transform("translate3d", initX, 0, 0);
                } else if (initX < -this.offsetWidth + this.parentElement.offsetWidth) {
                    initX = -this.offsetWidth + this.parentElement.offsetWidth;
                    this.style.transition = "transform 0.4s cubic-bezier(.28,.19,.95,1.75)";
                    $(this).transform("translate3d", initX, 0, 0);
                }
            }
        })

    }

    /*function lbthandel() {
        var initX = 0;
        var w = window.innerWidth;
        var currentIndex = 0;
        var id;
        var slider = document.querySelector(".content .lbt-wrap .slider");
        var spans = document.querySelectorAll(".content .lbt-wrap .circle span");
        $(".slider").pan(function (e) {
            if (e.start) {
                clearInterval(id);
            }
            this.style.transition = "";
            var disX = e.deltaX;
            $(this).transform("translate3d", initX + disX, 0, 0);
            if (e.end) {
                autoPlay();
                var i = Math.round(disX / w);
                currentIndex -= i;
                initX = -w * currentIndex;
                this.style.transition = "transform 0.4s";
                $(this).transform("translate3d", initX, 0, 0);
            }
        });
        slider.addEventListener("transitionend", function (e) {
            if (currentIndex == 5) {
                currentIndex = 0;
                initX = -w * currentIndex;
                slider.style.transition = "";
                $(".slider").transform("translate3d", initX, 0, 0);

            } else if (currentIndex == -1) {
                currentIndex = 4;
                initX = -w * currentIndex;
                slider.style.transition = "";
                $(".slider").transform("translate3d", initX, 0, 0);
            }

            for (var i = 0; i < spans.length; i++) {
                spans[i].classList.remove("active");
            }
            spans[currentIndex].classList.add("active");
        });

        autoPlay();

        function autoPlay() {
            id = setInterval(function () {
                currentIndex++;
                slider.style.transition = "transform 0.4s";
                $(".slider").transform("translate3d", -w * currentIndex, 0, 0);
            },1000)
        }
    }*/

    function lbthandel() {
        var startX, startIX;
        var w = window.innerWidth;
        var id;
        var slider = document.querySelector(".slider");
        var spans = document.querySelectorAll(".circle span");
        var I = document.querySelector(".circle i");
        var currentIndex = 0;
        var lastIndex = currentIndex;
        var disI;
        $(".slider").pan(function (e) {

            if (!e.start && Math.abs(e.deltaX) < 20) return;
            if (e.start) {
                clearInterval(id);
                startX = $(".slider").tx();
                startIX = $(".circle i").tx();
            }
            $(".slider").transform("translate3d", e.deltaX + startX, 0, 0);
            if ((startIX == 0 && startX > 0) || (startIX == disI * 4 && startX < 0)) {
                $(".circle i").transform("translate3d", startIX + e.deltaX / w * disI * 4);
            } else {
                $(".circle i").transform("translate3d", startIX - e.deltaX / w * disI);
            }
            if (e.end) {
                autoPlay();
                var i = Math.round(e.deltaX / w);
                currentIndex -= i;
                play();
            }
        });

        slider.addEventListener("transitionend", function () {
            slider.style.transition = "";
            if (currentIndex == 5) {
                currentIndex = 0;
                $(".slider").transform("translate3d", -w * currentIndex, 0, 0);
            } else if (currentIndex == -1) {
                currentIndex = 4;
                $(".slider").transform("translate3d", -w * currentIndex, 0, 0);
            }
            lastIndex = currentIndex;
        });

        autoPlay();

        function autoPlay() {
            id = setInterval(function () {
                currentIndex++;
                play();
            }, 1000)
        }

        moveI();

        function moveI() {
            disI = spans[1].offsetLeft - spans[0].offsetLeft;
        }

        function play() {
            slider.style.transition = "transform 0.4s";
            $(".slider").transform("translate3d", -w * currentIndex, 0, 0);

            var j = currentIndex == -1 ? 4 : currentIndex;
            j = j == 5 ? 0 : j;
            I.style.transition = "transform 0.4s";
            $(".circle i").transform("translate3d", disI * j, 0, 0);
        }

    }

    function barScroll() {
        var header = document.querySelector(".header");
        var content = document.querySelector(".content");
        var startY;
        $(".content").scrollBar("gray", 4);
        $(".content").pan(function (e) {
            if (!e.start && !e.end && Math.abs(e.deltaY) < 20) return;
            if (e.start) {
                content.style.transition = "";
                startY = $(this).ty();
            }
            $(this).transform("translate3d", 0, startY + e.deltaY, 0);
            $(this).scroll(startY + e.deltaY, true);
            if (e.end) {
                var ty = $(this).ty();
                $(this).scroll(startY, false);
                if (ty >= 0) {
                    ty = 0;
                    content.style.transition = "transform 0.4s";
                    $(".content").transform("translate3d", 0, ty, 0);
                } else if (ty <= -(this.offsetHeight + header.offsetHeight - this.parentElement.offsetHeight)) {
                    ty = -(this.offsetHeight + header.offsetHeight - this.parentElement.offsetHeight);
                    content.style.transition = "transform 0.4s";
                    $(".content").transform("translate3d", 0, ty, 0);
                }
            }
        })

    }

    function tabHandel() {
        var w = window.innerWidth;
        var startX;
        var currentIndex = 0;
        var tabContent = document.querySelector(".content .tab-wrap .tab-content");
        $(tabContent).pan(function (e) {
            if (!e.start && Math.abs(e.deltaX) < 20) return;
            if (e.start) {
                tabContent.style.transition = "";
                startX = $(tabContent).tx();
            }
            $(tabContent).transform("translate3d", e.deltaX + startX, 0, 0);
            if (e.end) {
                var i = Math.round(e.deltaX / w);
                currentIndex += i;
                tabContent.style.transition = "transform 0.4s";
                $(tabContent).transform("translate3d", w * currentIndex, 0, 0);
                changeTabNav(Math.round(e.deltaX / w));
            }
        });
        tabContent.addEventListener("transitionend", function () {
            setTimeout(function () {
                currentIndex = 0;
                tabContent.style.transition = "";
                $(tabContent).transform("translate3d", 0, 0, 0);
            }, 100)
        })

        function changeTabNav(dir) {
            if (dir == -1) {
                lastIndex++;
                lastIndex = lastIndex >= 6 ? 0 : lastIndex;
            } else if (dir == 1) {
                lastIndex--;
                lastIndex = lastIndex <= -1 ? 5 : lastIndex;
            }
            radios[lastIndex].checked = true;
        }
    }

    var lastIndex = 0;
    var radios = document.querySelectorAll(".tab-nav input");

    function handelTabNav() {
        var w = window.innerWidth;
        for (let i = 0; i < radios.length; i++) {
            radios[i].onchange = function () {
                var currentIndex = i;
                if (currentIndex > lastIndex) {
                    $(".tab-content").transform("translate3d", -w).transition("transform 0.4s");
                } else {
                    $(".tab-content").transform("translate3d", w).transition("transform 0.4s");
                }
                lastIndex = currentIndex;
            }

        }
    }
})();