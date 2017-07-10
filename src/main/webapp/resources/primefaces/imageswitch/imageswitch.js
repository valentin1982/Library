(function(i) {
    var l = "2.88";
    if (i.support == undefined) {
        i.support = {
            opacity: !(i.browser.msie)
        }
    }

    function a(r) {
        if (i.fn.cycle.debug) {
            f(r)
        }
    }

    function f() {
        if (window.console && window.console.log) {
            window.console.log("[cycle] " + Array.prototype.join.call(arguments, " "))
        }
    }
    i.fn.cycle = function(s, r) {
        var t = {
            s: this.selector,
            c: this.context
        };
        if (this.length === 0 && s != "stop") {
            if (!i.isReady && t.s) {
                f("DOM not ready, queuing slideshow");
                i(function() {
                    i(t.s, t.c).cycle(s, r)
                });
                return this
            }
            f("terminating; zero elements found by selector" + (i.isReady ? "" : " (DOM not ready)"));
            return this
        }
        return this.each(function() {
            var x = m(this, s, r);
            if (x === false) {
                return
            }
            x.updateActivePagerLink = x.updateActivePagerLink || i.fn.cycle.updateActivePagerLink;
            if (this.cycleTimeout) {
                clearTimeout(this.cycleTimeout)
            }
            this.cycleTimeout = this.cyclePause = 0;
            var y = i(this);
            var z = x.slideExpr ? i(x.slideExpr, this) : y.children();
            var v = z.get();
            if (v.length < 2) {
                f("terminating; too few slides: " + v.length);
                return
            }
            var u = k(y, z, v, x, t);
            if (u === false) {
                return
            }
            var w = u.continuous ? 10 : h(v[u.currSlide], v[u.nextSlide], u, !u.rev);
            if (w) {
                w += (u.delay || 0);
                if (w < 10) {
                    w = 10
                }
                a("first timeout: " + w);
                this.cycleTimeout = setTimeout(function() {
                    e(v, u, 0, (!u.rev && !x.backwards))
                }, w)
            }
        })
    };

    function m(r, u, s) {
        if (r.cycleStop == undefined) {
            r.cycleStop = 0
        }
        if (u === undefined || u === null) {
            u = {}
        }
        if (u.constructor == String) {
            switch (u) {
                case "destroy":
                case "stop":
                    var w = i(r).data("cycle.opts");
                    if (!w) {
                        return false
                    }
                    r.cycleStop++;
                    if (r.cycleTimeout) {
                        clearTimeout(r.cycleTimeout)
                    }
                    r.cycleTimeout = 0;
                    i(r).removeData("cycle.opts");
                    if (u == "destroy") {
                        q(w)
                    }
                    return false;
                case "toggle":
                    r.cyclePause = (r.cyclePause === 1) ? 0 : 1;
                    v(r.cyclePause, s, r);
                    return false;
                case "pause":
                    r.cyclePause = 1;
                    return false;
                case "resume":
                    r.cyclePause = 0;
                    v(false, s, r);
                    return false;
                case "prev":
                case "next":
                    var w = i(r).data("cycle.opts");
                    if (!w) {
                        f('options not found, "prev/next" ignored');
                        return false
                    }
                    i.fn.cycle[u](w);
                    return false;
                default:
                    u = {
                        fx: u
                    }
            }
            return u
        } else {
            if (u.constructor == Number) {
                var t = u;
                u = i(r).data("cycle.opts");
                if (!u) {
                    f("options not found, can not advance slide");
                    return false
                }
                if (t < 0 || t >= u.elements.length) {
                    f("invalid slide index: " + t);
                    return false
                }
                u.nextSlide = t;
                if (r.cycleTimeout) {
                    clearTimeout(r.cycleTimeout);
                    r.cycleTimeout = 0
                }
                if (typeof s == "string") {
                    u.oneTimeFx = s
                }
                e(u.elements, u, 1, t >= u.currSlide);
                return false
            }
        }
        return u;

        function v(y, z, x) {
            if (!y && z === true) {
                var A = i(x).data("cycle.opts");
                if (!A) {
                    f("options not found, can not resume");
                    return false
                }
                if (x.cycleTimeout) {
                    clearTimeout(x.cycleTimeout);
                    x.cycleTimeout = 0
                }
                e(A.elements, A, 1, (!w.rev && !w.backwards))
            }
        }
    }

    function b(r, s) {
        if (!i.support.opacity && s.cleartype && r.style.filter) {
            try {
                r.style.removeAttribute("filter")
            } catch (t) {}
        }
    }

    function q(r) {
        if (r.next) {
            i(r.next).unbind(r.prevNextEvent)
        }
        if (r.prev) {
            i(r.prev).unbind(r.prevNextEvent)
        }
        if (r.pager || r.pagerAnchorBuilder) {
            i.each(r.pagerAnchors || [], function() {
                this.unbind().remove()
            })
        }
        r.pagerAnchors = null;
        if (r.destroy) {
            r.destroy(r)
        }
    }

    function k(z, L, v, u, F) {
        var D = i.extend({}, i.fn.cycle.defaults, u || {}, i.metadata ? z.metadata() : i.meta ? z.data() : {});
        if (D.autostop) {
            D.countdown = D.autostopCount || v.length
        }
        var s = z[0];
        z.data("cycle.opts", D);
        D.$cont = z;
        D.stopCount = s.cycleStop;
        D.elements = v;
        D.before = D.before ? [D.before] : [];
        D.after = D.after ? [D.after] : [];
        D.after.unshift(function() {
            D.busy = 0
        });
        if (!i.support.opacity && D.cleartype) {
            D.after.push(function() {
                b(this, D)
            })
        }
        if (D.continuous) {
            D.after.push(function() {
                e(v, D, 0, (!D.rev && !D.backwards))
            })
        }
        n(D);
        if (!i.support.opacity && D.cleartype && !D.cleartypeNoBg) {
            g(L)
        }
        if (z.css("position") == "static") {
            z.css("position", "relative")
        }
        if (D.width) {
            z.width(D.width)
        }
        if (D.height && D.height != "auto") {
            z.height(D.height)
        }
        if (D.startingSlide) {
            D.startingSlide = parseInt(D.startingSlide)
        } else {
            if (D.backwards) {
                D.startingSlide = v.length - 1
            }
        }
        if (D.random) {
            D.randomMap = [];
            for (var J = 0; J < v.length; J++) {
                D.randomMap.push(J)
            }
            D.randomMap.sort(function(N, w) {
                return Math.random() - 0.5
            });
            D.randomIndex = 1;
            D.startingSlide = D.randomMap[1]
        } else {
            if (D.startingSlide >= v.length) {
                D.startingSlide = 0
            }
        }
        D.currSlide = D.startingSlide || 0;
        var y = D.startingSlide;
        L.css({
            position: "absolute",
            top: 0,
            left: 0
        }).hide().each(function(w) {
            var N;
            if (D.backwards) {
                N = y ? w <= y ? v.length + (w - y) : y - w : v.length - w
            } else {
                N = y ? w >= y ? v.length - (w - y) : y - w : v.length - w
            }
            i(this).css("z-index", N)
        });
        i(v[y]).css("opacity", 1).show();
        b(v[y], D);
        if (D.fit && D.width) {
            L.width(D.width)
        }
        if (D.fit && D.height && D.height != "auto") {
            L.height(D.height)
        }
        var E = D.containerResize && !z.innerHeight();
        if (E) {
            var x = 0,
                C = 0;
            for (var H = 0; H < v.length; H++) {
                var r = i(v[H]),
                    M = r[0],
                    B = r.outerWidth(),
                    K = r.outerHeight();
                if (!B) {
                    B = M.offsetWidth || M.width || r.attr("width")
                }
                if (!K) {
                    K = M.offsetHeight || M.height || r.attr("height")
                }
                x = B > x ? B : x;
                C = K > C ? K : C
            }
            if (x > 0 && C > 0) {
                z.css({
                    width: x + "px",
                    height: C + "px"
                })
            }
        }
        if (D.pause) {
            z.hover(function() {
                this.cyclePause++
            }, function() {
                this.cyclePause--
            })
        }
        if (c(D) === false) {
            return false
        }
        var t = false;
        u.requeueAttempts = u.requeueAttempts || 0;
        L.each(function() {
            var P = i(this);
            this.cycleH = (D.fit && D.height) ? D.height : (P.height() || this.offsetHeight || this.height || P.attr("height") || 0);
            this.cycleW = (D.fit && D.width) ? D.width : (P.width() || this.offsetWidth || this.width || P.attr("width") || 0);
            if (P.is("img")) {
                var N = (i.browser.msie && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
                var Q = (i.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
                var O = (i.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
                var w = (this.cycleH == 0 && this.cycleW == 0 && !this.complete);
                if (N || Q || O || w) {
                    if (F.s && D.requeueOnImageNotLoaded && ++u.requeueAttempts < 100) {
                        f(u.requeueAttempts, " - img slide not loaded, requeuing slideshow: ", this.src, this.cycleW, this.cycleH);
                        setTimeout(function() {
                            i(F.s, F.c).cycle(u)
                        }, D.requeueTimeout);
                        t = true;
                        return false
                    } else {
                        f("could not determine size of image: " + this.src, this.cycleW, this.cycleH)
                    }
                }
            }
            return true
        });
        if (t) {
            return false
        }
        D.cssBefore = D.cssBefore || {};
        D.animIn = D.animIn || {};
        D.animOut = D.animOut || {};
        L.not(":eq(" + y + ")").css(D.cssBefore);
        if (D.cssFirst) {
            i(L[y]).css(D.cssFirst)
        }
        if (D.timeout) {
            D.timeout = parseInt(D.timeout);
            if (D.speed.constructor == String) {
                D.speed = i.fx.speeds[D.speed] || parseInt(D.speed)
            }
            if (!D.sync) {
                D.speed = D.speed / 2
            }
            var G = D.fx == "shuffle" ? 500 : 250;
            while ((D.timeout - D.speed) < G) {
                D.timeout += D.speed
            }
        }
        if (D.easing) {
            D.easeIn = D.easeOut = D.easing
        }
        if (!D.speedIn) {
            D.speedIn = D.speed
        }
        if (!D.speedOut) {
            D.speedOut = D.speed
        }
        D.slideCount = v.length;
        D.currSlide = D.lastSlide = y;
        if (D.random) {
            if (++D.randomIndex == v.length) {
                D.randomIndex = 0
            }
            D.nextSlide = D.randomMap[D.randomIndex]
        } else {
            if (D.backwards) {
                D.nextSlide = D.startingSlide == 0 ? (v.length - 1) : D.startingSlide - 1
            } else {
                D.nextSlide = D.startingSlide >= (v.length - 1) ? 0 : D.startingSlide + 1
            }
        }
        if (!D.multiFx) {
            var I = i.fn.cycle.transitions[D.fx];
            if (i.isFunction(I)) {
                I(z, L, D)
            } else {
                if (D.fx != "custom" && !D.multiFx) {
                    f("unknown transition: " + D.fx, "; slideshow terminating");
                    return false
                }
            }
        }
        var A = L[y];
        if (D.before.length) {
            D.before[0].apply(A, [A, A, D, true])
        }
        if (D.after.length > 1) {
            D.after[1].apply(A, [A, A, D, true])
        }
        if (D.next) {
            i(D.next).bind(D.prevNextEvent, function() {
                return o(D, D.rev ? -1 : 1)
            })
        }
        if (D.prev) {
            i(D.prev).bind(D.prevNextEvent, function() {
                return o(D, D.rev ? 1 : -1)
            })
        }
        if (D.pager || D.pagerAnchorBuilder) {
            d(v, D)
        }
        j(D, v);
        return D
    }

    function n(r) {
        r.original = {
            before: [],
            after: []
        };
        r.original.cssBefore = i.extend({}, r.cssBefore);
        r.original.cssAfter = i.extend({}, r.cssAfter);
        r.original.animIn = i.extend({}, r.animIn);
        r.original.animOut = i.extend({}, r.animOut);
        i.each(r.before, function() {
            r.original.before.push(this)
        });
        i.each(r.after, function() {
            r.original.after.push(this)
        })
    }

    function c(x) {
        var v, t, s = i.fn.cycle.transitions;
        if (x.fx.indexOf(",") > 0) {
            x.multiFx = true;
            x.fxs = x.fx.replace(/\s*/g, "").split(",");
            for (v = 0; v < x.fxs.length; v++) {
                var w = x.fxs[v];
                t = s[w];
                if (!t || !s.hasOwnProperty(w) || !i.isFunction(t)) {
                    f("discarding unknown transition: ", w);
                    x.fxs.splice(v, 1);
                    v--
                }
            }
            if (!x.fxs.length) {
                f("No valid transitions named; slideshow terminating.");
                return false
            }
        } else {
            if (x.fx == "all") {
                x.multiFx = true;
                x.fxs = [];
                for (p in s) {
                    t = s[p];
                    if (s.hasOwnProperty(p) && i.isFunction(t)) {
                        x.fxs.push(p)
                    }
                }
            }
        }
        if (x.multiFx && x.randomizeEffects) {
            var u = Math.floor(Math.random() * 20) + 30;
            for (v = 0; v < u; v++) {
                var r = Math.floor(Math.random() * x.fxs.length);
                x.fxs.push(x.fxs.splice(r, 1)[0])
            }
            a("randomized fx sequence: ", x.fxs)
        }
        return true
    }

    function j(s, r) {
        s.addSlide = function(u, v) {
            var t = i(u),
                w = t[0];
            if (!s.autostopCount) {
                s.countdown++
            }
            r[v ? "unshift" : "push"](w);
            if (s.els) {
                s.els[v ? "unshift" : "push"](w)
            }
            s.slideCount = r.length;
            t.css("position", "absolute");
            t[v ? "prependTo" : "appendTo"](s.$cont);
            if (v) {
                s.currSlide++;
                s.nextSlide++
            }
            if (!i.support.opacity && s.cleartype && !s.cleartypeNoBg) {
                g(t)
            }
            if (s.fit && s.width) {
                t.width(s.width)
            }
            if (s.fit && s.height && s.height != "auto") {
                $slides.height(s.height)
            }
            w.cycleH = (s.fit && s.height) ? s.height : t.height();
            w.cycleW = (s.fit && s.width) ? s.width : t.width();
            t.css(s.cssBefore);
            if (s.pager || s.pagerAnchorBuilder) {
                i.fn.cycle.createPagerAnchor(r.length - 1, w, i(s.pager), r, s)
            }
            if (i.isFunction(s.onAddSlide)) {
                s.onAddSlide(t)
            } else {
                t.hide()
            }
        }
    }
    i.fn.cycle.resetState = function(s, r) {
        r = r || s.fx;
        s.before = [];
        s.after = [];
        s.cssBefore = i.extend({}, s.original.cssBefore);
        s.cssAfter = i.extend({}, s.original.cssAfter);
        s.animIn = i.extend({}, s.original.animIn);
        s.animOut = i.extend({}, s.original.animOut);
        s.fxFn = null;
        i.each(s.original.before, function() {
            s.before.push(this)
        });
        i.each(s.original.after, function() {
            s.after.push(this)
        });
        var t = i.fn.cycle.transitions[r];
        if (i.isFunction(t)) {
            t(s.$cont, i(s.elements), s)
        }
    };

    function e(y, r, x, A) {
        if (x && r.busy && r.manualTrump) {
            a("manualTrump in go(), stopping active transition");
            i(y).stop(true, true);
            r.busy = false
        }
        if (r.busy) {
            a("transition active, ignoring new tx request");
            return
        }
        var v = r.$cont[0],
            C = y[r.currSlide],
            B = y[r.nextSlide];
        if (v.cycleStop != r.stopCount || v.cycleTimeout === 0 && !x) {
            return
        }
        if (!x && !v.cyclePause && !r.bounce && ((r.autostop && (--r.countdown <= 0)) || (r.nowrap && !r.random && r.nextSlide < r.currSlide))) {
            if (r.end) {
                r.end(r)
            }
            return
        }
        var z = false;
        if ((x || !v.cyclePause) && (r.nextSlide != r.currSlide)) {
            z = true;
            var w = r.fx;
            C.cycleH = C.cycleH || i(C).height();
            C.cycleW = C.cycleW || i(C).width();
            B.cycleH = B.cycleH || i(B).height();
            B.cycleW = B.cycleW || i(B).width();
            if (r.multiFx) {
                if (r.lastFx == undefined || ++r.lastFx >= r.fxs.length) {
                    r.lastFx = 0
                }
                w = r.fxs[r.lastFx];
                r.currFx = w
            }
            if (r.oneTimeFx) {
                w = r.oneTimeFx;
                r.oneTimeFx = null
            }
            i.fn.cycle.resetState(r, w);
            if (r.before.length) {
                i.each(r.before, function(D, E) {
                    if (v.cycleStop != r.stopCount) {
                        return
                    }
                    E.apply(B, [C, B, r, A])
                })
            }
            var t = function() {
                i.each(r.after, function(D, E) {
                    if (v.cycleStop != r.stopCount) {
                        return
                    }
                    E.apply(B, [C, B, r, A])
                })
            };
            a("tx firing; currSlide: " + r.currSlide + "; nextSlide: " + r.nextSlide);
            r.busy = 1;
            if (r.fxFn) {
                r.fxFn(C, B, r, t, A, x && r.fastOnEvent)
            } else {
                if (i.isFunction(i.fn.cycle[r.fx])) {
                    i.fn.cycle[r.fx](C, B, r, t, A, x && r.fastOnEvent)
                } else {
                    i.fn.cycle.custom(C, B, r, t, A, x && r.fastOnEvent)
                }
            }
        }
        if (z || r.nextSlide == r.currSlide) {
            r.lastSlide = r.currSlide;
            if (r.random) {
                r.currSlide = r.nextSlide;
                if (++r.randomIndex == y.length) {
                    r.randomIndex = 0
                }
                r.nextSlide = r.randomMap[r.randomIndex];
                if (r.nextSlide == r.currSlide) {
                    r.nextSlide = (r.currSlide == r.slideCount - 1) ? 0 : r.currSlide + 1
                }
            } else {
                if (r.backwards) {
                    var u = (r.nextSlide - 1) < 0;
                    if (u && r.bounce) {
                        r.backwards = !r.backwards;
                        r.nextSlide = 1;
                        r.currSlide = 0
                    } else {
                        r.nextSlide = u ? (y.length - 1) : r.nextSlide - 1;
                        r.currSlide = u ? 0 : r.nextSlide + 1
                    }
                } else {
                    var u = (r.nextSlide + 1) == y.length;
                    if (u && r.bounce) {
                        r.backwards = !r.backwards;
                        r.nextSlide = y.length - 2;
                        r.currSlide = y.length - 1
                    } else {
                        r.nextSlide = u ? 0 : r.nextSlide + 1;
                        r.currSlide = u ? y.length - 1 : r.nextSlide - 1
                    }
                }
            }
        }
        if (z && r.pager) {
            r.updateActivePagerLink(r.pager, r.currSlide, r.activePagerClass)
        }
        var s = 0;
        if (r.timeout && !r.continuous) {
            s = h(y[r.currSlide], y[r.nextSlide], r, A)
        } else {
            if (r.continuous && v.cyclePause) {
                s = 10
            }
        }
        if (s > 0) {
            v.cycleTimeout = setTimeout(function() {
                e(y, r, 0, (!r.rev && !r.backwards))
            }, s)
        }
    }
    i.fn.cycle.updateActivePagerLink = function(r, t, s) {
        i(r).each(function() {
            i(this).children().removeClass(s).eq(t).addClass(s)
        })
    };

    function h(w, u, v, s) {
        if (v.timeoutFn) {
            var r = v.timeoutFn.call(w, w, u, v, s);
            while ((r - v.speed) < 250) {
                r += v.speed
            }
            a("calculated timeout: " + r + "; speed: " + v.speed);
            if (r !== false) {
                return r
            }
        }
        return v.timeout
    }
    i.fn.cycle.next = function(r) {
        o(r, r.rev ? -1 : 1)
    };
    i.fn.cycle.prev = function(r) {
        o(r, r.rev ? 1 : -1)
    };

    function o(t, w) {
        var s = t.elements;
        var v = t.$cont[0],
            u = v.cycleTimeout;
        if (u) {
            clearTimeout(u);
            v.cycleTimeout = 0
        }
        if (t.random && w < 0) {
            t.randomIndex--;
            if (--t.randomIndex == -2) {
                t.randomIndex = s.length - 2
            } else {
                if (t.randomIndex == -1) {
                    t.randomIndex = s.length - 1
                }
            }
            t.nextSlide = t.randomMap[t.randomIndex]
        } else {
            if (t.random) {
                t.nextSlide = t.randomMap[t.randomIndex]
            } else {
                t.nextSlide = t.currSlide + w;
                if (t.nextSlide < 0) {
                    if (t.nowrap) {
                        return false
                    }
                    t.nextSlide = s.length - 1
                } else {
                    if (t.nextSlide >= s.length) {
                        if (t.nowrap) {
                            return false
                        }
                        t.nextSlide = 0
                    }
                }
            }
        }
        var r = t.onPrevNextEvent || t.prevNextClick;
        if (i.isFunction(r)) {
            r(w > 0, t.nextSlide, s[t.nextSlide])
        }
        e(s, t, 1, w >= 0);
        return false
    }

    function d(s, t) {
        var r = i(t.pager);
        i.each(s, function(u, v) {
            i.fn.cycle.createPagerAnchor(u, v, r, s, t)
        });
        t.updateActivePagerLink(t.pager, t.startingSlide, t.activePagerClass)
    }
    i.fn.cycle.createPagerAnchor = function(v, w, t, u, x) {
        var s;
        if (i.isFunction(x.pagerAnchorBuilder)) {
            s = x.pagerAnchorBuilder(v, w);
            a("pagerAnchorBuilder(" + v + ", el) returned: " + s)
        } else {
            s = '<a href="#">' + (v + 1) + "</a>"
        }
        if (!s) {
            return
        }
        var y = i(s);
        if (y.parents("body").length === 0) {
            var r = [];
            if (t.length > 1) {
                t.each(function() {
                    var z = y.clone(true);
                    i(this).append(z);
                    r.push(z[0])
                });
                y = i(r)
            } else {
                y.appendTo(t)
            }
        }
        x.pagerAnchors = x.pagerAnchors || [];
        x.pagerAnchors.push(y);
        y.bind(x.pagerEvent, function(C) {
            C.preventDefault();
            x.nextSlide = v;
            var B = x.$cont[0],
                A = B.cycleTimeout;
            if (A) {
                clearTimeout(A);
                B.cycleTimeout = 0
            }
            var z = x.onPagerEvent || x.pagerClick;
            if (i.isFunction(z)) {
                z(x.nextSlide, u[x.nextSlide])
            }
            e(u, x, 1, x.currSlide < v)
        });
        if (!/^click/.test(x.pagerEvent) && !x.allowPagerClickBubble) {
            y.bind("click.cycle", function() {
                return false
            })
        }
        if (x.pauseOnPagerHover) {
            y.hover(function() {
                x.$cont[0].cyclePause++
            }, function() {
                x.$cont[0].cyclePause--
            })
        }
    };
    i.fn.cycle.hopsFromLast = function(u, t) {
        var s, r = u.lastSlide,
            v = u.currSlide;
        if (t) {
            s = v > r ? v - r : u.slideCount - r
        } else {
            s = v < r ? r - v : r + u.slideCount - v
        }
        return s
    };

    function g(t) {
        a("applying clearType background-color hack");

        function s(u) {
            u = parseInt(u).toString(16);
            return u.length < 2 ? "0" + u : u
        }

        function r(x) {
            for (; x && x.nodeName.toLowerCase() != "html"; x = x.parentNode) {
                var u = i.css(x, "background-color");
                if (u.indexOf("rgb") >= 0) {
                    var w = u.match(/\d+/g);
                    return "#" + s(w[0]) + s(w[1]) + s(w[2])
                }
                if (u && u != "transparent") {
                    return u
                }
            }
            return "#ffffff"
        }
        t.each(function() {
            i(this).css("background-color", r(this))
        })
    }
    i.fn.cycle.commonReset = function(x, u, v, s, t, r) {
        i(v.elements).not(x).hide();
        v.cssBefore.opacity = 1;
        v.cssBefore.display = "block";
        if (s !== false && u.cycleW > 0) {
            v.cssBefore.width = u.cycleW
        }
        if (t !== false && u.cycleH > 0) {
            v.cssBefore.height = u.cycleH
        }
        v.cssAfter = v.cssAfter || {};
        v.cssAfter.display = "none";
        i(x).css("zIndex", v.slideCount + (r === true ? 1 : 0));
        i(u).css("zIndex", v.slideCount + (r === true ? 0 : 1))
    };
    i.fn.cycle.custom = function(D, x, r, u, w, s) {
        var C = i(D),
            y = i(x);
        var t = r.speedIn,
            B = r.speedOut,
            v = r.easeIn,
            A = r.easeOut;
        y.css(r.cssBefore);
        if (s) {
            if (typeof s == "number") {
                t = B = s
            } else {
                t = B = 1
            }
            v = A = null
        }
        var z = function() {
            y.animate(r.animIn, t, v, u)
        };
        C.animate(r.animOut, B, A, function() {
            if (r.cssAfter) {
                C.css(r.cssAfter)
            }
            if (!r.sync) {
                z()
            }
        });
        if (r.sync) {
            z()
        }
    };
    i.fn.cycle.transitions = {
        fade: function(s, t, r) {
            t.not(":eq(" + r.currSlide + ")").css("opacity", 0);
            r.before.push(function(w, u, v) {
                i.fn.cycle.commonReset(w, u, v);
                v.cssBefore.opacity = 0
            });
            r.animIn = {
                opacity: 1
            };
            r.animOut = {
                opacity: 0
            };
            r.cssBefore = {
                top: 0,
                left: 0
            }
        }
    };
    i.fn.cycle.ver = function() {
        return l
    };
    i.fn.cycle.defaults = {
        fx: "fade",
        timeout: 4000,
        timeoutFn: null,
        continuous: 0,
        speed: 3000,
        speedIn: null,
        speedOut: null,
        next: null,
        prev: null,
        onPrevNextEvent: null,
        prevNextEvent: "click.cycle",
        pager: null,
        onPagerEvent: null,
        pagerEvent: "click.cycle",
        allowPagerClickBubble: false,
        pagerAnchorBuilder: null,
        before: null,
        after: null,
        end: null,
        easing: null,
        easeIn: null,
        easeOut: null,
        shuffle: null,
        animIn: null,
        animOut: null,
        cssBefore: null,
        cssAfter: null,
        fxFn: null,
        height: "auto",
        startingSlide: 0,
        sync: 1,
        random: 0,
        fit: 0,
        containerResize: 1,
        pause: 0,
        pauseOnPagerHover: 0,
        autostop: 0,
        autostopCount: 0,
        delay: 0,
        slideExpr: null,
        cleartype: !i.support.opacity,
        cleartypeNoBg: false,
        nowrap: 0,
        fastOnEvent: 0,
        randomizeEffects: 1,
        rev: 0,
        manualTrump: true,
        requeueOnImageNotLoaded: true,
        requeueTimeout: 250,
        activePagerClass: "activeSlide",
        updateActivePagerLink: null,
        backwards: false
    }
})(jQuery);
/*
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.72
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function(a) {
    a.fn.cycle.transitions.none = function(c, d, b) {
        b.fxFn = function(g, e, f, h) {
            a(e).show();
            a(g).hide();
            h()
        }
    };
    a.fn.cycle.transitions.scrollUp = function(d, e, c) {
        d.css("overflow", "hidden");
        c.before.push(a.fn.cycle.commonReset);
        var b = d.height();
        c.cssBefore = {
            top: b,
            left: 0
        };
        c.cssFirst = {
            top: 0
        };
        c.animIn = {
            top: 0
        };
        c.animOut = {
            top: -b
        }
    };
    a.fn.cycle.transitions.scrollDown = function(d, e, c) {
        d.css("overflow", "hidden");
        c.before.push(a.fn.cycle.commonReset);
        var b = d.height();
        c.cssFirst = {
            top: 0
        };
        c.cssBefore = {
            top: -b,
            left: 0
        };
        c.animIn = {
            top: 0
        };
        c.animOut = {
            top: b
        }
    };
    a.fn.cycle.transitions.scrollLeft = function(d, e, c) {
        d.css("overflow", "hidden");
        c.before.push(a.fn.cycle.commonReset);
        var b = d.width();
        c.cssFirst = {
            left: 0
        };
        c.cssBefore = {
            left: b,
            top: 0
        };
        c.animIn = {
            left: 0
        };
        c.animOut = {
            left: 0 - b
        }
    };
    a.fn.cycle.transitions.scrollRight = function(d, e, c) {
        d.css("overflow", "hidden");
        c.before.push(a.fn.cycle.commonReset);
        var b = d.width();
        c.cssFirst = {
            left: 0
        };
        c.cssBefore = {
            left: -b,
            top: 0
        };
        c.animIn = {
            left: 0
        };
        c.animOut = {
            left: b
        }
    };
    a.fn.cycle.transitions.scrollHorz = function(c, d, b) {
        c.css("overflow", "hidden").width();
        b.before.push(function(h, f, g, e) {
            a.fn.cycle.commonReset(h, f, g);
            g.cssBefore.left = e ? (f.cycleW - 1) : (1 - f.cycleW);
            g.animOut.left = e ? -h.cycleW : h.cycleW
        });
        b.cssFirst = {
            left: 0
        };
        b.cssBefore = {
            top: 0
        };
        b.animIn = {
            left: 0
        };
        b.animOut = {
            top: 0
        }
    };
    a.fn.cycle.transitions.scrollVert = function(c, d, b) {
        c.css("overflow", "hidden");
        b.before.push(function(h, f, g, e) {
            a.fn.cycle.commonReset(h, f, g);
            g.cssBefore.top = e ? (1 - f.cycleH) : (f.cycleH - 1);
            g.animOut.top = e ? h.cycleH : -h.cycleH
        });
        b.cssFirst = {
            top: 0
        };
        b.cssBefore = {
            left: 0
        };
        b.animIn = {
            top: 0
        };
        b.animOut = {
            left: 0
        }
    };
    a.fn.cycle.transitions.slideX = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a(f.elements).not(g).hide();
            a.fn.cycle.commonReset(g, e, f, false, true);
            f.animIn.width = e.cycleW
        });
        b.cssBefore = {
            left: 0,
            top: 0,
            width: 0
        };
        b.animIn = {
            width: "show"
        };
        b.animOut = {
            width: 0
        }
    };
    a.fn.cycle.transitions.slideY = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a(f.elements).not(g).hide();
            a.fn.cycle.commonReset(g, e, f, true, false);
            f.animIn.height = e.cycleH
        });
        b.cssBefore = {
            left: 0,
            top: 0,
            height: 0
        };
        b.animIn = {
            height: "show"
        };
        b.animOut = {
            height: 0
        }
    };
    a.fn.cycle.transitions.shuffle = function(e, f, d) {
        var c, b = e.css("overflow", "visible").width();
        f.css({
            left: 0,
            top: 0
        });
        d.before.push(function(i, g, h) {
            a.fn.cycle.commonReset(i, g, h, true, true, true)
        });
        if (!d.speedAdjusted) {
            d.speed = d.speed / 2;
            d.speedAdjusted = true
        }
        d.random = 0;
        d.shuffle = d.shuffle || {
                left: -b,
                top: 15
            };
        d.els = [];
        for (c = 0; c < f.length; c++) {
            d.els.push(f[c])
        }
        for (c = 0; c < d.currSlide; c++) {
            d.els.push(d.els.shift())
        }
        d.fxFn = function(m, j, l, g, i) {
            var h = i ? a(m) : a(j);
            a(j).css(l.cssBefore);
            var k = l.slideCount;
            h.animate(l.shuffle, l.speedIn, l.easeIn, function() {
                var o = a.fn.cycle.hopsFromLast(l, i);
                for (var q = 0; q < o; q++) {
                    i ? l.els.push(l.els.shift()) : l.els.unshift(l.els.pop())
                }
                if (i) {
                    for (var r = 0, n = l.els.length; r < n; r++) {
                        a(l.els[r]).css("z-index", n - r + k)
                    }
                } else {
                    var s = a(m).css("z-index");
                    h.css("z-index", parseInt(s) + 1 + k)
                }
                h.animate({
                    left: 0,
                    top: 0
                }, l.speedOut, l.easeOut, function() {
                    a(i ? this : m).hide();
                    if (g) {
                        g()
                    }
                })
            })
        };
        d.cssBefore = {
            display: "block",
            opacity: 1,
            top: 0,
            left: 0
        }
    };
    a.fn.cycle.transitions.turnUp = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, true, false);
            f.cssBefore.top = e.cycleH;
            f.animIn.height = e.cycleH
        });
        b.cssFirst = {
            top: 0
        };
        b.cssBefore = {
            left: 0,
            height: 0
        };
        b.animIn = {
            top: 0
        };
        b.animOut = {
            height: 0
        }
    };
    a.fn.cycle.transitions.turnDown = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, true, false);
            f.animIn.height = e.cycleH;
            f.animOut.top = g.cycleH
        });
        b.cssFirst = {
            top: 0
        };
        b.cssBefore = {
            left: 0,
            top: 0,
            height: 0
        };
        b.animOut = {
            height: 0
        }
    };
    a.fn.cycle.transitions.turnLeft = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, false, true);
            f.cssBefore.left = e.cycleW;
            f.animIn.width = e.cycleW
        });
        b.cssBefore = {
            top: 0,
            width: 0
        };
        b.animIn = {
            left: 0
        };
        b.animOut = {
            width: 0
        }
    };
    a.fn.cycle.transitions.turnRight = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, false, true);
            f.animIn.width = e.cycleW;
            f.animOut.left = g.cycleW
        });
        b.cssBefore = {
            top: 0,
            left: 0,
            width: 0
        };
        b.animIn = {
            left: 0
        };
        b.animOut = {
            width: 0
        }
    };
    a.fn.cycle.transitions.zoom = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, false, false, true);
            f.cssBefore.top = e.cycleH / 2;
            f.cssBefore.left = e.cycleW / 2;
            f.animIn = {
                top: 0,
                left: 0,
                width: e.cycleW,
                height: e.cycleH
            };
            f.animOut = {
                width: 0,
                height: 0,
                top: g.cycleH / 2,
                left: g.cycleW / 2
            }
        });
        b.cssFirst = {
            top: 0,
            left: 0
        };
        b.cssBefore = {
            width: 0,
            height: 0
        }
    };
    a.fn.cycle.transitions.fadeZoom = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, false, false);
            f.cssBefore.left = e.cycleW / 2;
            f.cssBefore.top = e.cycleH / 2;
            f.animIn = {
                top: 0,
                left: 0,
                width: e.cycleW,
                height: e.cycleH
            }
        });
        b.cssBefore = {
            width: 0,
            height: 0
        };
        b.animOut = {
            opacity: 0
        }
    };
    a.fn.cycle.transitions.blindX = function(d, e, c) {
        var b = d.css("overflow", "hidden").width();
        c.before.push(function(h, f, g) {
            a.fn.cycle.commonReset(h, f, g);
            g.animIn.width = f.cycleW;
            g.animOut.left = h.cycleW
        });
        c.cssBefore = {
            left: b,
            top: 0
        };
        c.animIn = {
            left: 0
        };
        c.animOut = {
            left: b
        }
    };
    a.fn.cycle.transitions.blindY = function(d, e, c) {
        var b = d.css("overflow", "hidden").height();
        c.before.push(function(h, f, g) {
            a.fn.cycle.commonReset(h, f, g);
            g.animIn.height = f.cycleH;
            g.animOut.top = h.cycleH
        });
        c.cssBefore = {
            top: b,
            left: 0
        };
        c.animIn = {
            top: 0
        };
        c.animOut = {
            top: b
        }
    };
    a.fn.cycle.transitions.blindZ = function(e, f, d) {
        var c = e.css("overflow", "hidden").height();
        var b = e.width();
        d.before.push(function(i, g, h) {
            a.fn.cycle.commonReset(i, g, h);
            h.animIn.height = g.cycleH;
            h.animOut.top = i.cycleH
        });
        d.cssBefore = {
            top: c,
            left: b
        };
        d.animIn = {
            top: 0,
            left: 0
        };
        d.animOut = {
            top: c,
            left: b
        }
    };
    a.fn.cycle.transitions.growX = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, false, true);
            f.cssBefore.left = this.cycleW / 2;
            f.animIn = {
                left: 0,
                width: this.cycleW
            };
            f.animOut = {
                left: 0
            }
        });
        b.cssBefore = {
            width: 0,
            top: 0
        }
    };
    a.fn.cycle.transitions.growY = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, true, false);
            f.cssBefore.top = this.cycleH / 2;
            f.animIn = {
                top: 0,
                height: this.cycleH
            };
            f.animOut = {
                top: 0
            }
        });
        b.cssBefore = {
            height: 0,
            left: 0
        }
    };
    a.fn.cycle.transitions.curtainX = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, false, true, true);
            f.cssBefore.left = e.cycleW / 2;
            f.animIn = {
                left: 0,
                width: this.cycleW
            };
            f.animOut = {
                left: g.cycleW / 2,
                width: 0
            }
        });
        b.cssBefore = {
            top: 0,
            width: 0
        }
    };
    a.fn.cycle.transitions.curtainY = function(c, d, b) {
        b.before.push(function(g, e, f) {
            a.fn.cycle.commonReset(g, e, f, true, false, true);
            f.cssBefore.top = e.cycleH / 2;
            f.animIn = {
                top: 0,
                height: e.cycleH
            };
            f.animOut = {
                top: g.cycleH / 2,
                height: 0
            }
        });
        b.cssBefore = {
            left: 0,
            height: 0
        }
    };
    a.fn.cycle.transitions.cover = function(f, g, e) {
        var i = e.direction || "left";
        var b = f.css("overflow", "hidden").width();
        var c = f.height();
        e.before.push(function(j, d, h) {
            a.fn.cycle.commonReset(j, d, h);
            if (i == "right") {
                h.cssBefore.left = -b
            } else {
                if (i == "up") {
                    h.cssBefore.top = c
                } else {
                    if (i == "down") {
                        h.cssBefore.top = -c
                    } else {
                        h.cssBefore.left = b
                    }
                }
            }
        });
        e.animIn = {
            left: 0,
            top: 0
        };
        e.animOut = {
            opacity: 1
        };
        e.cssBefore = {
            top: 0,
            left: 0
        }
    };
    a.fn.cycle.transitions.uncover = function(f, g, e) {
        var i = e.direction || "left";
        var b = f.css("overflow", "hidden").width();
        var c = f.height();
        e.before.push(function(j, d, h) {
            a.fn.cycle.commonReset(j, d, h, true, true, true);
            if (i == "right") {
                h.animOut.left = b
            } else {
                if (i == "up") {
                    h.animOut.top = -c
                } else {
                    if (i == "down") {
                        h.animOut.top = c
                    } else {
                        h.animOut.left = -b
                    }
                }
            }
        });
        e.animIn = {
            left: 0,
            top: 0
        };
        e.animOut = {
            opacity: 1
        };
        e.cssBefore = {
            top: 0,
            left: 0
        }
    };
    a.fn.cycle.transitions.toss = function(e, f, d) {
        var b = e.css("overflow", "visible").width();
        var c = e.height();
        d.before.push(function(i, g, h) {
            a.fn.cycle.commonReset(i, g, h, true, true, true);
            if (!h.animOut.left && !h.animOut.top) {
                h.animOut = {
                    left: b * 2,
                    top: -c / 2,
                    opacity: 0
                }
            } else {
                h.animOut.opacity = 0
            }
        });
        d.cssBefore = {
            left: 0,
            top: 0
        };
        d.animIn = {
            left: 0
        }
    };
    a.fn.cycle.transitions.wipe = function(s, m, e) {
        var q = s.css("overflow", "hidden").width();
        var j = s.height();
        e.cssBefore = e.cssBefore || {};
        var g;
        if (e.clip) {
            if (/l2r/.test(e.clip)) {
                g = "rect(0px 0px " + j + "px 0px)"
            } else {
                if (/r2l/.test(e.clip)) {
                    g = "rect(0px " + q + "px " + j + "px " + q + "px)"
                } else {
                    if (/t2b/.test(e.clip)) {
                        g = "rect(0px " + q + "px 0px 0px)"
                    } else {
                        if (/b2t/.test(e.clip)) {
                            g = "rect(" + j + "px " + q + "px " + j + "px 0px)"
                        } else {
                            if (/zoom/.test(e.clip)) {
                                var o = parseInt(j / 2);
                                var f = parseInt(q / 2);
                                g = "rect(" + o + "px " + f + "px " + o + "px " + f + "px)"
                            }
                        }
                    }
                }
            }
        }
        e.cssBefore.clip = e.cssBefore.clip || g || "rect(0px 0px 0px 0px)";
        var k = e.cssBefore.clip.match(/(\d+)/g);
        var u = parseInt(k[0]),
            c = parseInt(k[1]),
            n = parseInt(k[2]),
            i = parseInt(k[3]);
        e.before.push(function(w, h, t) {
            if (w == h) {
                return
            }
            var d = a(w),
                b = a(h);
            a.fn.cycle.commonReset(w, h, t, true, true, false);
            t.cssAfter.display = "block";
            var r = 1,
                l = parseInt((t.speedIn / 13)) - 1;
            (function v() {
                var y = u ? u - parseInt(r * (u / l)) : 0;
                var z = i ? i - parseInt(r * (i / l)) : 0;
                var A = n < j ? n + parseInt(r * ((j - n) / l || 1)) : j;
                var x = c < q ? c + parseInt(r * ((q - c) / l || 1)) : q;
                b.css({
                    clip: "rect(" + y + "px " + x + "px " + A + "px " + z + "px)"
                });
                (r++ <= l) ? setTimeout(v, 13): d.css("display", "none")
            })()
        });
        e.cssBefore = {
            display: "block",
            opacity: 1,
            top: 0,
            left: 0
        };
        e.animIn = {
            left: 0
        };
        e.animOut = {
            left: 0
        }
    }
})(jQuery);
PrimeFaces.widget.ImageSwitch = PrimeFaces.widget.BaseWidget.extend({
    init: function(a) {
        this._super(a);
        this.jq.cycle(this.cfg)
    },
    startSlideshow: function() {
        this.jq.cycle("start")
    },
    stopSlideshow: function() {
        this.jq.cycle("stop")
    },
    toggleSlideshow: function() {
        this.jq.cycle("toggle")
    },
    pauseSlideshow: function() {
        this.jq.cycle("pause")
    },
    next: function() {
        this.jq.cycle("next")
    },
    previous: function() {
        this.jq.cycle("prev")
    }
});