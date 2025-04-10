(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global = global || self), (global.Lenis = factory()));
})(this, function () {
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false,
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  let createNanoEvents = () => ({
    events: {},
    emit(event, ...args) {
      (this.events[event] || []).forEach((i) => i(...args));
    },
    on(event, cb) {
      (this.events[event] = this.events[event] || []).push(cb);
      return () =>
        (this.events[event] = (this.events[event] || []).filter(
          (i) => i !== cb
        ));
    },
  });

  var version = "1.0.0";

  function clamp(min, input, max) {
    return Math.max(min, Math.min(input, max));
  }
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
  function clampedModulo(dividend, divisor) {
    var remainder = dividend % divisor;
    if ((divisor > 0 && remainder < 0) || (divisor < 0 && remainder > 0)) {
      remainder += divisor;
    }
    return remainder;
  }

  var Animate = /*#__PURE__*/ (function () {
    function Animate() {}
    var _proto = Animate.prototype;
    _proto.advance = function advance(deltaTime) {
      var _this$onUpdate;
      if (!this.isRunning) return;
      var completed = false;
      if (this.lerp) {
        this.value = lerp(this.value, this.to, this.lerp);
        if (Math.round(this.value) === this.to) {
          this.value = this.to;
          completed = true;
        }
      } else {
        this.currentTime += deltaTime;
        var linearProgress = clamp(0, this.currentTime / this.duration, 1);
        completed = linearProgress >= 1;
        var easedProgress = completed ? 1 : this.easing(linearProgress);
        this.value = this.from + (this.to - this.from) * easedProgress;
      }
      (_this$onUpdate = this.onUpdate) == null
        ? void 0
        : _this$onUpdate.call(this, this.value, {
            completed: completed,
          });
      if (completed) {
        this.stop();
      }
    };
    _proto.stop = function stop() {
      this.isRunning = false;
    };
    _proto.fromTo = function fromTo(from, to, _ref) {
      var _ref$lerp = _ref.lerp,
        lerp = _ref$lerp === void 0 ? 0.1 : _ref$lerp,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1 : _ref$duration,
        _ref$easing = _ref.easing,
        easing =
          _ref$easing === void 0
            ? function (t) {
                return t;
              }
            : _ref$easing,
        onUpdate = _ref.onUpdate;
      this.from = this.value = from;
      this.to = to;
      this.lerp = lerp;
      this.duration = duration;
      this.easing = easing;
      this.currentTime = 0;
      this.isRunning = true;
      this.onUpdate = onUpdate;
    };
    return Animate;
  })();

  var ObservedElement = /*#__PURE__*/ (function () {
    function ObservedElement(element) {
      var _this = this;
      this.onResize = function (_ref) {
        var entry = _ref[0];
        if (entry) {
          var _entry$contentRect = entry.contentRect,
            width = _entry$contentRect.width,
            height = _entry$contentRect.height;
          _this.width = width;
          _this.height = height;
        }
      };
      this.onWindowResize = function () {
        _this.width = window.innerWidth;
        _this.height = window.innerHeight;
      };
      this.element = element;
      if (element === window) {
        window.addEventListener("resize", this.onWindowResize);
        this.onWindowResize();
      } else {
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(this.element);
      }
    }
    var _proto = ObservedElement.prototype;
    _proto.destroy = function destroy() {
      window.removeEventListener("resize", this.onWindowResize);
      this.resizeObserver.disconnect();
    };
    return ObservedElement;
  })();

  var VirtualScroll = /*#__PURE__*/ (function () {
    function VirtualScroll(element, _ref) {
      var _this = this;
      var _ref$wheelMultiplier = _ref.wheelMultiplier,
        wheelMultiplier =
          _ref$wheelMultiplier === void 0 ? 1 : _ref$wheelMultiplier,
        _ref$touchMultiplier = _ref.touchMultiplier,
        touchMultiplier =
          _ref$touchMultiplier === void 0 ? 2 : _ref$touchMultiplier,
        _ref$normalizeWheel = _ref.normalizeWheel,
        normalizeWheel =
          _ref$normalizeWheel === void 0 ? false : _ref$normalizeWheel;
      this.onTouchStart = function (event) {
        var _ref2 = event.targetTouches ? event.targetTouches[0] : event,
          pageX = _ref2.pageX,
          pageY = _ref2.pageY;
        _this.touchStart.x = pageX;
        _this.touchStart.y = pageY;
      };
      this.onTouchMove = function (event) {
        var _ref3 = event.targetTouches ? event.targetTouches[0] : event,
          pageX = _ref3.pageX,
          pageY = _ref3.pageY;
        var deltaX = -(pageX - _this.touchStart.x) * _this.touchMultiplier;
        var deltaY = -(pageY - _this.touchStart.y) * _this.touchMultiplier;
        _this.touchStart.x = pageX;
        _this.touchStart.y = pageY;
        _this.emitter.emit("scroll", {
          type: "touch",
          deltaX: deltaX,
          deltaY: deltaY,
          event: event,
        });
      };
      this.onWheel = function (event) {
        var deltaX = event.deltaX,
          deltaY = event.deltaY;
        if (_this.normalizeWheel) {
          deltaX = clamp(-100, deltaX, 100);
          deltaY = clamp(-100, deltaY, 100);
        }
        deltaX *= _this.wheelMultiplier;
        deltaY *= _this.wheelMultiplier;
        _this.emitter.emit("scroll", {
          type: "wheel",
          deltaX: deltaX,
          deltaY: deltaY,
          event: event,
        });
      };
      this.element = element;
      this.wheelMultiplier = wheelMultiplier;
      this.touchMultiplier = touchMultiplier;
      this.normalizeWheel = normalizeWheel;
      this.touchStart = {
        x: null,
        y: null,
      };
      this.emitter = createNanoEvents();
      this.element.addEventListener("wheel", this.onWheel, {
        passive: false,
      });
      this.element.addEventListener("touchstart", this.onTouchStart, {
        passive: false,
      });
      this.element.addEventListener("touchmove", this.onTouchMove, {
        passive: false,
      });
    }
    var _proto = VirtualScroll.prototype;
    _proto.on = function on(event, callback) {
      return this.emitter.on(event, callback);
    };
    _proto.destroy = function destroy() {
      this.emitter.events = {};
      this.element.removeEventListener("wheel", this.onWheel, {
        passive: false,
      });
      this.element.removeEventListener("touchstart", this.onTouchStart, {
        passive: false,
      });
      this.element.removeEventListener("touchmove", this.onTouchMove, {
        passive: false,
      });
    };
    return VirtualScroll;
  })();

  // Technical explaination
  // - listen to 'wheel' events
  // - prevent 'wheel' event to prevent scroll
  // - normalize wheel delta
  // - add delta to targetScroll
  // - animate scroll to targetScroll (smooth context)
  // - if animation is not running, listen to 'scroll' events (native context)
  var Lenis = /*#__PURE__*/ (function () {
    // isScrolling = true when scroll is animating
    // isStopped = true if user should not be able to scroll - enable/disable programatically
    // isSmooth = true if scroll should be animated
    // isLocked = same as isStopped but enabled/disabled when scroll reaches target

    /**
     * @typedef {(t: number) => number} EasingFunction
     * @typedef {'vertical' | 'horizontal'} Orientation
     * @typedef {'vertical' | 'horizontal' | 'both'} GestureOrientation
     *
     * @typedef LenisOptions
     * @property {Orientation} [direction]
     * @property {GestureOrientation} [gestureDirection]
     * @property {number} [mouseMultiplier]
     * @property {boolean} [smooth]
     *
     * @property {Window | HTMLElement} [wrapper]
     * @property {HTMLElement} [content]
     * @property {boolean} [smoothWheel]
     * @property {boolean} [smoothTouch]
     * @property {number} [duration]
     * @property {EasingFunction} [easing]
     * @property {number} [lerp]
     * @property {boolean} [infinite]
     * @property {Orientation} [orientation]
     * @property {GestureOrientation} [gestureOrientation]
     * @property {number} [touchMultiplier]
     * @property {number} [wheelMultiplier]
     * @property {boolean} [normalizeWheel]
     *
     * @param {LenisOptions}
     */
    function Lenis(_temp) {
      var _this = this;
      var _ref = _temp === void 0 ? {} : _temp,
        direction = _ref.direction,
        gestureDirection = _ref.gestureDirection,
        mouseMultiplier = _ref.mouseMultiplier,
        smooth = _ref.smooth,
        _ref$wrapper = _ref.wrapper,
        wrapper = _ref$wrapper === void 0 ? window : _ref$wrapper,
        _ref$content = _ref.content,
        content =
          _ref$content === void 0 ? document.documentElement : _ref$content,
        _ref$smoothWheel = _ref.smoothWheel,
        smoothWheel =
          _ref$smoothWheel === void 0
            ? smooth != null
              ? smooth
              : true
            : _ref$smoothWheel,
        _ref$smoothTouch = _ref.smoothTouch,
        smoothTouch = _ref$smoothTouch === void 0 ? false : _ref$smoothTouch,
        duration = _ref.duration,
        _ref$easing = _ref.easing,
        easing =
          _ref$easing === void 0
            ? function (t) {
                return Math.min(1, 1.001 - Math.pow(2, -10 * t));
              }
            : _ref$easing,
        _ref$lerp = _ref.lerp,
        lerp = _ref$lerp === void 0 ? (duration ? null : 0.1) : _ref$lerp,
        _ref$infinite = _ref.infinite,
        infinite = _ref$infinite === void 0 ? false : _ref$infinite,
        _ref$orientation = _ref.orientation,
        orientation =
          _ref$orientation === void 0
            ? direction != null
              ? direction
              : "vertical"
            : _ref$orientation,
        _ref$gestureOrientati = _ref.gestureOrientation,
        gestureOrientation =
          _ref$gestureOrientati === void 0
            ? gestureDirection != null
              ? gestureDirection
              : "vertical"
            : _ref$gestureOrientati,
        _ref$touchMultiplier = _ref.touchMultiplier,
        touchMultiplier =
          _ref$touchMultiplier === void 0 ? 2 : _ref$touchMultiplier,
        _ref$wheelMultiplier = _ref.wheelMultiplier,
        wheelMultiplier =
          _ref$wheelMultiplier === void 0
            ? mouseMultiplier != null
              ? mouseMultiplier
              : 1
            : _ref$wheelMultiplier,
        _ref$normalizeWheel = _ref.normalizeWheel,
        normalizeWheel =
          _ref$normalizeWheel === void 0 ? true : _ref$normalizeWheel;
      this.onVirtualScroll = function (_ref2) {
        var type = _ref2.type,
          deltaX = _ref2.deltaX,
          deltaY = _ref2.deltaY,
          event = _ref2.event;
        // keep zoom feature
        if (event.ctrlKey) return;

        // keep previous/next page gesture on trackpads
        if (
          (_this.options.gestureOrientation === "vertical" && deltaY === 0) ||
          (_this.options.gestureOrientation === "horizontal" && deltaX === 0)
        )
          return;

        // catch if scrolling on nested scroll elements
        if (
          !!event.composedPath().find(function (node) {
            return node == null
              ? void 0
              : node.hasAttribute == null
              ? void 0
              : node.hasAttribute("data-lenis-prevent");
          })
        )
          return;
        if (_this.isStopped || _this.isLocked) {
          event.preventDefault();
          return;
        }
        _this.isSmooth =
          (_this.options.smoothTouch && type === "touch") ||
          (_this.options.smoothWheel && type === "wheel");
        if (!_this.isSmooth) {
          _this.isScrolling = false;
          _this.animate.stop();
          return;
        }
        event.preventDefault();
        var delta = deltaY;
        if (_this.options.gestureOrientation === "both") {
          delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
        } else if (_this.options.gestureOrientation === "horizontal") {
          delta = deltaX;
        }
        _this.scrollTo(_this.targetScroll + delta, {
          programmatic: false,
        });
      };
      this.onScroll = function () {
        if (!_this.isScrolling) {
          var lastScroll = _this.animatedScroll;
          _this.animatedScroll = _this.targetScroll = _this.actualScroll;
          _this.velocity = 0;
          _this.direction = Math.sign(_this.animatedScroll - lastScroll);
          _this.emit();
        }
      };
      // warn about legacy options
      if (direction) {
        console.warn(
          "Lenis: `direction` option is deprecated, use `orientation` instead"
        );
      }
      if (gestureDirection) {
        console.warn(
          "Lenis: `gestureDirection` option is deprecated, use `gestureOrientation` instead"
        );
      }
      if (mouseMultiplier) {
        console.warn(
          "Lenis: `mouseMultiplier` option is deprecated, use `wheelMultiplier` instead"
        );
      }
      if (smooth) {
        console.warn(
          "Lenis: `smooth` option is deprecated, use `smoothWheel` instead"
        );
      }
      window.lenisVersion = version;

      // if wrapper is html or body, fallback to window
      if (wrapper === document.documentElement || wrapper === document.body) {
        wrapper = window;
      }
      this.options = {
        wrapper: wrapper,
        content: content,
        smoothWheel: smoothWheel,
        smoothTouch: smoothTouch,
        duration: duration,
        easing: easing,
        lerp: lerp,
        infinite: infinite,
        gestureOrientation: gestureOrientation,
        orientation: orientation,
        touchMultiplier: touchMultiplier,
        wheelMultiplier: wheelMultiplier,
        normalizeWheel: normalizeWheel,
      };
      this.wrapper = new ObservedElement(wrapper);
      this.content = new ObservedElement(content);
      this.rootElement.classList.add("lenis");
      this.velocity = 0;
      this.isStopped = false;
      this.isSmooth = smoothWheel || smoothTouch;
      this.isScrolling = false;
      this.targetScroll = this.animatedScroll = this.actualScroll;
      this.animate = new Animate();
      this.emitter = createNanoEvents();
      this.wrapper.element.addEventListener("scroll", this.onScroll, {
        passive: false,
      });
      this.virtualScroll = new VirtualScroll(wrapper, {
        touchMultiplier: touchMultiplier,
        wheelMultiplier: wheelMultiplier,
        normalizeWheel: normalizeWheel,
      });
      this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    var _proto = Lenis.prototype;
    _proto.destroy = function destroy() {
      this.emitter.events = {};
      this.wrapper.element.removeEventListener("scroll", this.onScroll, {
        passive: false,
      });
      this.virtualScroll.destroy();
    };
    _proto.on = function on(event, callback) {
      return this.emitter.on(event, callback);
    };
    _proto.off = function off(event, callback) {
      var _this$emitter$events$;
      this.emitter.events[event] =
        (_this$emitter$events$ = this.emitter.events[event]) == null
          ? void 0
          : _this$emitter$events$.filter(function (i) {
              return callback !== i;
            });
    };
    _proto.setScroll = function setScroll(scroll) {
      // apply scroll value immediately
      if (this.isHorizontal) {
        this.rootElement.scrollLeft = scroll;
      } else {
        this.rootElement.scrollTop = scroll;
      }
    };
    _proto.emit = function emit() {
      this.emitter.emit("scroll", this);
    };
    _proto.reset = function reset() {
      this.isLocked = false;
      this.isScrolling = false;
      this.velocity = 0;
    };
    _proto.start = function start() {
      this.isStopped = false;
      this.reset();
    };
    _proto.stop = function stop() {
      this.isStopped = true;
      this.animate.stop();
      this.reset();
    };
    _proto.raf = function raf(time) {
      var deltaTime = time - (this.time || time);
      this.time = time;
      this.animate.advance(deltaTime * 0.001);
    };
    _proto.scrollTo = function scrollTo(target, _temp2) {
      var _this2 = this;
      var _ref3 = _temp2 === void 0 ? {} : _temp2,
        _ref3$offset = _ref3.offset,
        offset = _ref3$offset === void 0 ? 0 : _ref3$offset,
        _ref3$immediate = _ref3.immediate,
        immediate = _ref3$immediate === void 0 ? false : _ref3$immediate,
        _ref3$lock = _ref3.lock,
        lock = _ref3$lock === void 0 ? false : _ref3$lock,
        _ref3$duration = _ref3.duration,
        duration =
          _ref3$duration === void 0 ? this.options.duration : _ref3$duration,
        _ref3$easing = _ref3.easing,
        easing = _ref3$easing === void 0 ? this.options.easing : _ref3$easing,
        _ref3$lerp = _ref3.lerp,
        lerp =
          _ref3$lerp === void 0 ? !duration && this.options.lerp : _ref3$lerp,
        onComplete = _ref3.onComplete,
        _ref3$force = _ref3.force,
        force = _ref3$force === void 0 ? false : _ref3$force,
        _ref3$programmatic = _ref3.programmatic,
        programmatic =
          _ref3$programmatic === void 0 ? true : _ref3$programmatic;
      if (this.isStopped && !force) return;

      // keywords
      if (["top", "left", "start"].includes(target)) {
        target = 0;
      } else if (["bottom", "right", "end"].includes(target)) {
        target = this.limit;
      } else {
        var _target;
        var node;
        if (typeof target === "string") {
          // CSS selector
          node = document.querySelector(target);
        } else if ((_target = target) != null && _target.nodeType) {
          // Node element
          node = target;
        }
        if (node) {
          if (this.wrapper.element !== window) {
            // nested scroll offset correction
            var wrapperRect = this.wrapper.element.getBoundingClientRect();
            offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
          }
          var rect = node.getBoundingClientRect();
          target =
            (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
        }
      }
      if (typeof target !== "number") return;
      target += offset;
      target = Math.round(target);
      if (this.options.infinite) {
        if (programmatic) {
          this.targetScroll = this.animatedScroll = this.scroll;
        }
      } else {
        target = clamp(0, target, this.limit);
      }
      if (immediate) {
        this.animatedScroll = this.targetScroll = target;
        this.setScroll(this.scroll);
        this.animate.stop();
        this.reset();
        this.emit();
        onComplete == null ? void 0 : onComplete();
        return;
      }
      if (!programmatic) {
        this.targetScroll = target;
      }
      this.animate.fromTo(this.animatedScroll, target, {
        duration: duration,
        easing: easing,
        lerp: lerp,
        onUpdate: function onUpdate(value, _ref4) {
          var completed = _ref4.completed;
          // started
          if (lock) _this2.isLocked = true;
          _this2.isScrolling = true;

          // updated
          _this2.velocity = value - _this2.animatedScroll;
          _this2.direction = Math.sign(_this2.velocity);
          _this2.animatedScroll = value;
          _this2.setScroll(_this2.scroll);
          if (programmatic) {
            // wheel during programmatic should stop it
            _this2.targetScroll = value;
          }

          // completed
          if (completed) {
            if (lock) _this2.isLocked = false;
            requestAnimationFrame(function () {
              //avoid double scroll event
              _this2.isScrolling = false;
            });
            _this2.velocity = 0;
            onComplete == null ? void 0 : onComplete();
          }
          _this2.emit();
        },
      });
    };
    _createClass(Lenis, [
      {
        key: "rootElement",
        get: function get() {
          return this.wrapper.element === window
            ? this.content.element
            : this.wrapper.element;
        },
      },
      {
        key: "limit",
        get: function get() {
          return Math.round(
            this.isHorizontal
              ? this.content.width - this.wrapper.width
              : this.content.height - this.wrapper.height
          );
        },
      },
      {
        key: "isHorizontal",
        get: function get() {
          return this.options.orientation === "horizontal";
        },
      },
      {
        key: "actualScroll",
        get: function get() {
          // value browser takes into account
          return this.isHorizontal
            ? this.rootElement.scrollLeft
            : this.rootElement.scrollTop;
        },
      },
      {
        key: "scroll",
        get: function get() {
          return this.options.infinite
            ? clampedModulo(this.animatedScroll, this.limit)
            : this.animatedScroll;
        },
      },
      {
        key: "progress",
        get: function get() {
          return this.scroll / this.limit;
        },
      },
      {
        key: "isSmooth",
        get: function get() {
          return this.__isSmooth;
        },
        set: function set(value) {
          if (this.__isSmooth !== value) {
            this.rootElement.classList.toggle("lenis-smooth", value);
            this.__isSmooth = value;
          }
        },
      },
      {
        key: "isScrolling",
        get: function get() {
          return this.__isScrolling;
        },
        set: function set(value) {
          if (this.__isScrolling !== value) {
            this.rootElement.classList.toggle("lenis-scrolling", value);
            this.__isScrolling = value;
          }
        },
      },
      {
        key: "isStopped",
        get: function get() {
          return this.__isStopped;
        },
        set: function set(value) {
          if (this.__isStopped !== value) {
            this.rootElement.classList.toggle("lenis-stopped", value);
            this.__isStopped = value;
          }
        },
      },
    ]);
    return Lenis;
  })();

  return Lenis;
});

let lenis = new Lenis({
  duration: 0.8,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    lenis.scrollTo(this.getAttribute("href"));
  });
});

const textarea = document.querySelector("textarea");

if (textarea) {
  textarea.addEventListener("input", function () {
    if (textarea.scrollHeight > textarea.clientHeight) {
      textarea.setAttribute("data-lenis-prevent", "");
    } else {
      textarea.removeAttribute("data-lenis-prevent");
    }
  });
}
document.querySelectorAll(".WidgetReviews").forEach((widget) => {
  widget.setAttribute("data-lenis-prevent", "");
});
var privacyFields = document.querySelector(".privacy-fields");
if (privacyFields) {
  privacyFields.setAttribute("data-lenis-prevent", "");
}

/*!
 * Jarallax v2.1.3 (https://github.com/nk-o/jarallax)
 * Copyright 2022 nK <https://nkdev.info>
 * Licensed under MIT (https://github.com/nk-o/jarallax/blob/master/LICENSE)
 */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e =
        "undefined" != typeof globalThis ? globalThis : e || self).jarallax =
        t());
})(this, function () {
  "use strict";
  function e(e) {
    "complete" === document.readyState || "interactive" === document.readyState
      ? e()
      : document.addEventListener("DOMContentLoaded", e, {
          capture: !0,
          once: !0,
          passive: !0,
        });
  }
  let t;
  t =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self
      ? self
      : {};
  var i = t,
    o = {
      type: "scroll",
      speed: 0.5,
      containerClass: "jarallax-container",
      imgSrc: null,
      imgElement: ".jarallax-img",
      imgSize: "cover",
      imgPosition: "50% 50%",
      imgRepeat: "no-repeat",
      keepImg: !1,
      elementInViewport: null,
      zIndex: -100,
      disableParallax: !1,
      onScroll: null,
      onInit: null,
      onDestroy: null,
      onCoverImage: null,
      videoClass: "jarallax-video",
      videoSrc: null,
      videoStartTime: 0,
      videoEndTime: 0,
      videoVolume: 0,
      videoLoop: !0,
      videoPlayOnlyVisible: !0,
      videoLazyLoading: !0,
      disableVideo: !1,
      onVideoInsert: null,
      onVideoWorkerInit: null,
    };
  const { navigator: n } = i,
    a = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      n.userAgent
    );
  let s, l, r;
  function c() {
    (s = i.innerWidth || document.documentElement.clientWidth),
      a
        ? (!r &&
            document.body &&
            ((r = document.createElement("div")),
            (r.style.cssText =
              "position: fixed; top: -9999px; left: 0; height: 100vh; width: 0;"),
            document.body.appendChild(r)),
          (l =
            (r ? r.clientHeight : 0) ||
            i.innerHeight ||
            document.documentElement.clientHeight))
        : (l = i.innerHeight || document.documentElement.clientHeight);
  }
  function m() {
    return {
      width: s,
      height: l,
    };
  }
  c(),
    i.addEventListener("resize", c),
    i.addEventListener("orientationchange", c),
    i.addEventListener("load", c),
    e(() => {
      c();
    });
  const p = [];
  function d() {
    if (!p.length) return;
    const { width: e, height: t } = m();
    p.forEach((i, o) => {
      const { instance: n, oldData: a } = i;
      if (!n.isVisible()) return;
      const s = n.$item.getBoundingClientRect(),
        l = {
          width: s.width,
          height: s.height,
          top: s.top,
          bottom: s.bottom,
          wndW: e,
          wndH: t,
        },
        r =
          !a ||
          a.wndW !== l.wndW ||
          a.wndH !== l.wndH ||
          a.width !== l.width ||
          a.height !== l.height,
        c = r || !a || a.top !== l.top || a.bottom !== l.bottom;
      (p[o].oldData = l), r && n.onResize(), c && n.onScroll();
    }),
      i.requestAnimationFrame(d);
  }
  const g = new i.IntersectionObserver(
    (e) => {
      e.forEach((e) => {
        e.target.jarallax.isElementInViewport = e.isIntersecting;
      });
    },
    {
      rootMargin: "50px",
    }
  );
  const { navigator: u } = i;
  let f = 0;
  class h {
    constructor(e, t) {
      const i = this;
      (i.instanceID = f),
        (f += 1),
        (i.$item = e),
        (i.defaults = {
          ...o,
        });
      const n = i.$item.dataset || {},
        a = {};
      if (
        (Object.keys(n).forEach((e) => {
          const t = e.substr(0, 1).toLowerCase() + e.substr(1);
          t && void 0 !== i.defaults[t] && (a[t] = n[e]);
        }),
        (i.options = i.extend({}, i.defaults, a, t)),
        (i.pureOptions = i.extend({}, i.options)),
        Object.keys(i.options).forEach((e) => {
          "true" === i.options[e]
            ? (i.options[e] = !0)
            : "false" === i.options[e] && (i.options[e] = !1);
        }),
        (i.options.speed = Math.min(
          2,
          Math.max(-1, parseFloat(i.options.speed))
        )),
        "string" == typeof i.options.disableParallax &&
          (i.options.disableParallax = new RegExp(i.options.disableParallax)),
        i.options.disableParallax instanceof RegExp)
      ) {
        const e = i.options.disableParallax;
        i.options.disableParallax = () => e.test(u.userAgent);
      }
      if (
        ("function" != typeof i.options.disableParallax &&
          (i.options.disableParallax = () => !1),
        "string" == typeof i.options.disableVideo &&
          (i.options.disableVideo = new RegExp(i.options.disableVideo)),
        i.options.disableVideo instanceof RegExp)
      ) {
        const e = i.options.disableVideo;
        i.options.disableVideo = () => e.test(u.userAgent);
      }
      "function" != typeof i.options.disableVideo &&
        (i.options.disableVideo = () => !1);
      let s = i.options.elementInViewport;
      s && "object" == typeof s && void 0 !== s.length && ([s] = s),
        s instanceof Element || (s = null),
        (i.options.elementInViewport = s),
        (i.image = {
          src: i.options.imgSrc || null,
          $container: null,
          useImgTag: !1,
          position: "fixed",
        }),
        i.initImg() && i.canInitParallax() && i.init();
    }
    css(e, t) {
      return (function (e, t) {
        return "string" == typeof t
          ? i.getComputedStyle(e).getPropertyValue(t)
          : (Object.keys(t).forEach((i) => {
              e.style[i] = t[i];
            }),
            e);
      })(e, t);
    }
    extend(e, ...t) {
      return (function (e, ...t) {
        return (
          (e = e || {}),
          Object.keys(t).forEach((i) => {
            t[i] &&
              Object.keys(t[i]).forEach((o) => {
                e[o] = t[i][o];
              });
          }),
          e
        );
      })(e, ...t);
    }
    getWindowData() {
      const { width: e, height: t } = m();
      return {
        width: e,
        height: t,
        y: document.documentElement.scrollTop,
      };
    }
    initImg() {
      const e = this;
      let t = e.options.imgElement;
      return (
        t && "string" == typeof t && (t = e.$item.querySelector(t)),
        t instanceof Element ||
          (e.options.imgSrc
            ? ((t = new Image()), (t.src = e.options.imgSrc))
            : (t = null)),
        t &&
          (e.options.keepImg
            ? (e.image.$item = t.cloneNode(!0))
            : ((e.image.$item = t), (e.image.$itemParent = t.parentNode)),
          (e.image.useImgTag = !0)),
        !!e.image.$item ||
          (null === e.image.src &&
            ((e.image.src =
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),
            (e.image.bgImage = e.css(e.$item, "background-image"))),
          !(!e.image.bgImage || "none" === e.image.bgImage))
      );
    }
    canInitParallax() {
      return !this.options.disableParallax();
    }
    init() {
      const e = this,
        t = {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        };
      let o = {
        pointerEvents: "none",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      };
      if (!e.options.keepImg) {
        const t = e.$item.getAttribute("style");
        if (
          (t && e.$item.setAttribute("data-jarallax-original-styles", t),
          e.image.useImgTag)
        ) {
          const t = e.image.$item.getAttribute("style");
          t && e.image.$item.setAttribute("data-jarallax-original-styles", t);
        }
      }
      if (
        ("static" === e.css(e.$item, "position") &&
          e.css(e.$item, {
            position: "relative",
          }),
        "auto" === e.css(e.$item, "z-index") &&
          e.css(e.$item, {
            zIndex: 0,
          }),
        (e.image.$container = document.createElement("div")),
        e.css(e.image.$container, t),
        e.css(e.image.$container, {
          "z-index": e.options.zIndex,
        }),
        "fixed" === this.image.position &&
          e.css(e.image.$container, {
            "-webkit-clip-path": "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            "clip-path": "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          }),
        e.image.$container.setAttribute(
          "id",
          `jarallax-container-${e.instanceID}`
        ),
        e.options.containerClass &&
          e.image.$container.setAttribute("class", e.options.containerClass),
        e.$item.appendChild(e.image.$container),
        e.image.useImgTag
          ? (o = e.extend(
              {
                "object-fit": e.options.imgSize,
                "object-position": e.options.imgPosition,
                "max-width": "none",
              },
              t,
              o
            ))
          : ((e.image.$item = document.createElement("div")),
            e.image.src &&
              (o = e.extend(
                {
                  "background-position": e.options.imgPosition,
                  "background-size": e.options.imgSize,
                  "background-repeat": e.options.imgRepeat,
                  "background-image":
                    e.image.bgImage || `url("${e.image.src}")`,
                },
                t,
                o
              ))),
        ("opacity" !== e.options.type &&
          "scale" !== e.options.type &&
          "scale-opacity" !== e.options.type &&
          1 !== e.options.speed) ||
          (e.image.position = "absolute"),
        "fixed" === e.image.position)
      ) {
        const t = (function (e) {
          const t = [];
          for (; null !== e.parentElement; )
            1 === (e = e.parentElement).nodeType && t.push(e);
          return t;
        })(e.$item).filter((e) => {
          const t = i.getComputedStyle(e),
            o = t["-webkit-transform"] || t["-moz-transform"] || t.transform;
          return (
            (o && "none" !== o) ||
            /(auto|scroll)/.test(t.overflow + t["overflow-y"] + t["overflow-x"])
          );
        });
        e.image.position = t.length ? "absolute" : "fixed";
      }
      var n;
      (o.position = e.image.position),
        e.css(e.image.$item, o),
        e.image.$container.appendChild(e.image.$item),
        e.onResize(),
        e.onScroll(!0),
        e.options.onInit && e.options.onInit.call(e),
        "none" !== e.css(e.$item, "background-image") &&
          e.css(e.$item, {
            "background-image": "none",
          }),
        (n = e),
        p.push({
          instance: n,
        }),
        1 === p.length && i.requestAnimationFrame(d),
        g.observe(n.options.elementInViewport || n.$item);
    }
    destroy() {
      const e = this;
      var t;
      (t = e),
        p.forEach((e, i) => {
          e.instance.instanceID === t.instanceID && p.splice(i, 1);
        }),
        g.unobserve(t.options.elementInViewport || t.$item);
      const i = e.$item.getAttribute("data-jarallax-original-styles");
      if (
        (e.$item.removeAttribute("data-jarallax-original-styles"),
        i ? e.$item.setAttribute("style", i) : e.$item.removeAttribute("style"),
        e.image.useImgTag)
      ) {
        const t = e.image.$item.getAttribute("data-jarallax-original-styles");
        e.image.$item.removeAttribute("data-jarallax-original-styles"),
          t
            ? e.image.$item.setAttribute("style", i)
            : e.image.$item.removeAttribute("style"),
          e.image.$itemParent && e.image.$itemParent.appendChild(e.image.$item);
      }
      e.image.$container &&
        e.image.$container.parentNode.removeChild(e.image.$container),
        e.options.onDestroy && e.options.onDestroy.call(e),
        delete e.$item.jarallax;
    }
    coverImage() {
      const e = this,
        { height: t } = m(),
        i = e.image.$container.getBoundingClientRect(),
        o = i.height,
        { speed: n } = e.options,
        a = "scroll" === e.options.type || "scroll-opacity" === e.options.type;
      let s = 0,
        l = o,
        r = 0;
      return (
        a &&
          (n < 0
            ? ((s = n * Math.max(o, t)), t < o && (s -= n * (o - t)))
            : (s = n * (o + t)),
          n > 1
            ? (l = Math.abs(s - t))
            : n < 0
            ? (l = s / n + Math.abs(s))
            : (l += (t - o) * (1 - n)),
          (s /= 2)),
        (e.parallaxScrollDistance = s),
        (r = a ? (t - l) / 2 : (o - l) / 2),
        e.css(e.image.$item, {
          height: `${l}px`,
          marginTop: `${r}px`,
          left: "fixed" === e.image.position ? `${i.left}px` : "0",
          width: `${i.width}px`,
        }),
        e.options.onCoverImage && e.options.onCoverImage.call(e),
        {
          image: {
            height: l,
            marginTop: r,
          },
          container: i,
        }
      );
    }
    isVisible() {
      return this.isElementInViewport || !1;
    }
    onScroll(e) {
      const t = this;
      if (!e && !t.isVisible()) return;
      const { height: i } = m(),
        o = t.$item.getBoundingClientRect(),
        n = o.top,
        a = o.height,
        s = {},
        l = Math.max(0, n),
        r = Math.max(0, a + n),
        c = Math.max(0, -n),
        p = Math.max(0, n + a - i),
        d = Math.max(0, a - (n + a - i)),
        g = Math.max(0, -n + i - a),
        u = 1 - ((i - n) / (i + a)) * 2;
      let f = 1;
      if (
        (a < i
          ? (f = 1 - (c || p) / a)
          : r <= i
          ? (f = r / i)
          : d <= i && (f = d / i),
        ("opacity" !== t.options.type &&
          "scale-opacity" !== t.options.type &&
          "scroll-opacity" !== t.options.type) ||
          ((s.transform = "translate3d(0,0,0)"), (s.opacity = f)),
        "scale" === t.options.type || "scale-opacity" === t.options.type)
      ) {
        let e = 1;
        t.options.speed < 0
          ? (e -= t.options.speed * f)
          : (e += t.options.speed * (1 - f)),
          (s.transform = `scale(${e}) translate3d(0,0,0)`);
      }
      if ("scroll" === t.options.type || "scroll-opacity" === t.options.type) {
        let e = t.parallaxScrollDistance * u;
        "absolute" === t.image.position && (e -= n),
          (s.transform = `translate3d(0,${e}px,0)`);
      }
      t.css(t.image.$item, s),
        t.options.onScroll &&
          t.options.onScroll.call(t, {
            section: o,
            beforeTop: l,
            beforeTopEnd: r,
            afterTop: c,
            beforeBottom: p,
            beforeBottomEnd: d,
            afterBottom: g,
            visiblePercent: f,
            fromViewportCenter: u,
          });
    }
    onResize() {
      this.coverImage();
    }
  }
  const b = function (e, t, ...i) {
    ("object" == typeof HTMLElement
      ? e instanceof HTMLElement
      : e &&
        "object" == typeof e &&
        null !== e &&
        1 === e.nodeType &&
        "string" == typeof e.nodeName) && (e = [e]);
    const o = e.length;
    let n,
      a = 0;
    for (; a < o; a += 1)
      if (
        ("object" == typeof t || void 0 === t
          ? e[a].jarallax || (e[a].jarallax = new h(e[a], t))
          : e[a].jarallax && (n = e[a].jarallax[t].apply(e[a].jarallax, i)),
        void 0 !== n)
      )
        return n;
    return e;
  };
  b.constructor = h;
  const y = i.jQuery;
  if (void 0 !== y) {
    const e = function (...e) {
      Array.prototype.unshift.call(e, this);
      const t = b.apply(i, e);
      return "object" != typeof t ? t : this;
    };
    e.constructor = b.constructor;
    const t = y.fn.jarallax;
    (y.fn.jarallax = e),
      (y.fn.jarallax.noConflict = function () {
        return (y.fn.jarallax = t), this;
      });
  }
  return (
    e(() => {
      b(document.querySelectorAll("[data-jarallax]"));
    }),
    b
  );
});

jarallax(document.querySelectorAll(".jarallax"), {
  speed: 0.2,
});
