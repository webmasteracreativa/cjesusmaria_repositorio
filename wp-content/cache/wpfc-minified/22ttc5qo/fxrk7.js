// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/ed-school-plugin/vc-addons/our-process/assets/js/jquery-appear.js 
/*
 * jQuery.appear
 * https://github.com/bas2k/jquery.appear/
 * http://code.google.com/p/jquery-appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function($) {
    $.fn.appear = function(fn, options) {

        var settings = $.extend({

            //arbitrary data to pass to fn
            data: undefined,

            //call fn only on the first appear?
            one: true,

            // X & Y accuracy
            accX: 0,
            accY: 0

        }, options);

        return this.each(function() {

            var t = $(this);

            //whether the element is currently visible
            t.appeared = false;

            if (!fn) {

                //trigger the custom event
                t.trigger('appear', settings.data);
                return;
            }

            var w = $(window);

            //fires the appear event when appropriate
            var check = function() {

                //is the element hidden?
                if (!t.is(':visible')) {

                    //it became hidden
                    t.appeared = false;
                    return;
                }

                //is the element inside the visible window?
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;

                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();

                if (y + th + ay >= b &&
                    y <= b + wh + ay &&
                    x + tw + ax >= a &&
                    x <= a + ww + ax) {

                    //trigger the custom event
                    if (!t.appeared) t.trigger('appear', settings.data);

                } else {

                    //it scrolled out of view
                    t.appeared = false;
                }
            };

            //create a modified fn with some additional logic
            var modifiedFn = function() {

                //mark the element as visible
                t.appeared = true;

                //is this supposed to happen only once?
                if (settings.one) {

                    //remove the check
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.appear.checks);
                    if (i >= 0) $.fn.appear.checks.splice(i, 1);
                }

                //trigger the original fn
                fn.apply(this, arguments);
            };

            //bind the modified fn to the element
            if (settings.one) t.one('appear', settings.data, modifiedFn);
            else t.bind('appear', settings.data, modifiedFn);

            //check whenever the window scrolls
            w.scroll(check);

            //check whenever the dom changes
            $.fn.appear.checks.push(check);

            //check now
            (check)();
        });
    };

    //keep a queue of appearance checks
    $.extend($.fn.appear, {

        checks: [],
        timeout: null,

        //process the queue
        checkAll: function() {
            var length = $.fn.appear.checks.length;
            if (length > 0) while (length--) ($.fn.appear.checks[length])();
        },

        //check the queue asynchronously
        run: function() {
            if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
            $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
        }
    });

    //run checks when these methods are called
    $.each(['append', 'prepend', 'after', 'before', 'attr',
        'removeAttr', 'addClass', 'removeClass', 'toggleClass',
        'remove', 'css', 'show', 'hide'], function(i, n) {
        var old = $.fn[n];
        if (old) {
            $.fn[n] = function() {
                var r = old.apply(this, arguments);
                $.fn.appear.run();
                return r;
            }
        }
    });

})(jQuery);
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/ed-school-plugin/vc-addons/our-process/assets/js/scp-our-process.js 
jQuery(function ($) {

    var breakpoint = ed_school_plugin.data.vcWidgets.ourProcess.breakpoint || 480;
    var $body = $('body');
    var delay = 0;
    var speed = 500;
    var $dots = $('.dots');
    var $dot = $('.dot');
    var $line = $('.line');
    var $dotContainer = $('.dot-container');
    var containerInitialWidth = ( 100 * parseFloat($dotContainer.css('width')) / parseFloat($dotContainer.parent().css('width')) ) + '%';

    function setWidth($bodyWidth, $width) {
        if ($body.width() < $bodyWidth) {
            $dotContainer.each(function () {
                $this = $(this);
                $this.css({width: $width});
            });
        } else {
            $dotContainer.css({width: containerInitialWidth})
        }
    }

    setWidth(breakpoint, '100%');

    $(window).resize(function () {
        setWidth(breakpoint, '100%');
    });

    // just to identify the container
    $dots.each(function (i) {

        $(this).appear(function () {

            $line.each(function (i) {
                $this = $(this);
                delay += 1000;

                $this.delay(delay).animate({
                    width: '100%'
                }, speed, function () {
                    var $this = $(this);

                    $this.siblings('.dot-wrap').css({opacity: 1});
                    $this.siblings('.text').css({opacity: 1});
                    $this.siblings('.triangle').css({opacity: 1});
                });
            });
        });
    });
});
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/testimonial-rotator/js/jquery.cycletwo.js 
/*!
* jQuery cycletwo; build: v20131005
* http://jquery.malsup.com/cycletwo/
* Copyright (c) 2013 M. Alsup; Dual licensed: MIT/GPL
*/

/*! core engine; version: 20131003 */
;(function($) {
"use strict";

var version = '20131003';

$.fn.cycletwo = function( options ) 
{
    // fix mistakes with the ready state
    var o;
    if ( this.length === 0 && !$.isReady ) {
        o = { s: this.selector, c: this.context };
        $.fn.cycletwo.log('requeuing slideshow (dom not ready)');
        $(function() {
            $( o.s, o.c ).cycletwo(options);
        });
        return this;
    }

    return this.each(function() {
        var data, opts, shortName, val;
        var container = $(this);
        var log = $.fn.cycletwo.log;

        if ( container.data('cycletwo.opts') )
            return; // already initialized

        if ( container.data('cycletwo-log') === false || 
            ( options && options.log === false ) ||
            ( opts && opts.log === false) ) {
            log = $.noop;
        }

        log('--c2 init--');
        data = container.data();
        for (var p in data) {
            // allow props to be accessed sans 'cycletwo' prefix and log the overrides
            if (data.hasOwnProperty(p) && /^cycletwo[A-Z]+/.test(p) ) {
                val = data[p];
                shortName = p.match(/^cycletwo(.*)/)[1].replace(/^[A-Z]/, lowerCase);
                log(shortName+':', val, '('+typeof val +')');
                data[shortName] = val;
            }
        }

        opts = $.extend( {}, $.fn.cycletwo.defaults, data, options || {});

        opts.timeoutId = 0;
        opts.paused = opts.paused || false; // #57
        opts.container = container;
        opts._maxZ = opts.maxZ;

        opts.API = $.extend ( { _container: container }, $.fn.cycletwo.API );
        opts.API.log = log;
        opts.API.trigger = function( eventName, args ) {
            opts.container.trigger( eventName, args );
            return opts.API;
        };

        container.data( 'cycletwo.opts', opts );
        container.data( 'cycletwo.API', opts.API );

        // opportunity for plugins to modify opts and API
        opts.API.trigger('cycletwo-bootstrap', [ opts, opts.API ]);

        opts.API.addInitialSlides();
        opts.API.preInitSlideshow();

        if ( opts.slides.length )
            opts.API.initSlideshow();
    });
};

$.fn.cycletwo.API = {
    opts: function() {
        return this._container.data( 'cycletwo.opts' );
    },
    addInitialSlides: function() {
        var opts = this.opts();
        var slides = opts.slides;
        opts.slideCount = 0;
        opts.slides = $(); // empty set
        
        // add slides that already exist
        slides = slides.jquery ? slides : opts.container.find( slides );

        if ( opts.random ) {
            slides.sort(function() {return Math.random() - 0.5;});
        }

        opts.API.add( slides );
    },

    preInitSlideshow: function() {
        var opts = this.opts();
        opts.API.trigger('cycletwo-pre-initialize', [ opts ]);
        var tx = $.fn.cycletwo.transitions[opts.fx];
        if (tx && $.isFunction(tx.preInit))
            tx.preInit( opts );
        opts._preInitialized = true;
    },

    postInitSlideshow: function() {
        var opts = this.opts();
        opts.API.trigger('cycletwo-post-initialize', [ opts ]);
        var tx = $.fn.cycletwo.transitions[opts.fx];
        if (tx && $.isFunction(tx.postInit))
            tx.postInit( opts );
    },

    initSlideshow: function() {
        var opts = this.opts();
        var pauseObj = opts.container;
        var slideOpts;
        opts.API.calcFirstSlide();

        if ( opts.container.css('position') == 'static' )
            opts.container.css('position', 'relative');

        $(opts.slides[opts.currSlide]).css('opacity',1).show();
        opts.API.stackSlides( opts.slides[opts.currSlide], opts.slides[opts.nextSlide], !opts.reverse );

        if ( opts.pauseOnHover ) {
            // allow pauseOnHover to specify an element
            if ( opts.pauseOnHover !== true )
                pauseObj = $( opts.pauseOnHover );

            pauseObj.hover(
                function(){ opts.API.pause( true ); }, 
                function(){ opts.API.resume( true ); }
            );
        }

        // stage initial transition
        if ( opts.timeout ) {
            slideOpts = opts.API.getSlideOpts( opts.currSlide );
            opts.API.queueTransition( slideOpts, slideOpts.timeout + opts.delay );
        }

        opts._initialized = true;
        opts.API.updateView( true );
        opts.API.trigger('cycletwo-initialized', [ opts ]);
        opts.API.postInitSlideshow();
    },

    pause: function( hover ) {
        var opts = this.opts(),
            slideOpts = opts.API.getSlideOpts(),
            alreadyPaused = opts.hoverPaused || opts.paused;

        if ( hover )
            opts.hoverPaused = true; 
        else
            opts.paused = true;

        if ( ! alreadyPaused ) {
            opts.container.addClass('cycletwo-paused');
            opts.API.trigger('cycletwo-paused', [ opts ]).log('cycletwo-paused');

            if ( slideOpts.timeout ) {
                clearTimeout( opts.timeoutId );
                opts.timeoutId = 0;
                
                // determine how much time is left for the current slide
                opts._remainingTimeout -= ( $.now() - opts._lastQueue );
                if ( opts._remainingTimeout < 0 || isNaN(opts._remainingTimeout) )
                    opts._remainingTimeout = undefined;
            }
        }
    },

    resume: function( hover ) {
        var opts = this.opts(),
            alreadyResumed = !opts.hoverPaused && !opts.paused,
            remaining;

        if ( hover )
            opts.hoverPaused = false; 
        else
            opts.paused = false;

    
        if ( ! alreadyResumed ) {
            opts.container.removeClass('cycletwo-paused');
            // #gh-230; if an animation is in progress then don't queue a new transition; it will
            // happen naturally
            if ( opts.slides.filter(':animated').length === 0 )
                opts.API.queueTransition( opts.API.getSlideOpts(), opts._remainingTimeout );
            opts.API.trigger('cycletwo-resumed', [ opts, opts._remainingTimeout ] ).log('cycletwo-resumed');
        }
    },

    add: function( slides, prepend ) {
        var opts = this.opts();
        var oldSlideCount = opts.slideCount;
        var startSlideshow = false;
        var len;

        if ( $.type(slides) == 'string')
            slides = $.trim( slides );

        $( slides ).each(function(i) {
            var slideOpts;
            var slide = $(this);

            if ( prepend )
                opts.container.prepend( slide );
            else
                opts.container.append( slide );

            opts.slideCount++;
            slideOpts = opts.API.buildSlideOpts( slide );

            if ( prepend )
                opts.slides = $( slide ).add( opts.slides );
            else
                opts.slides = opts.slides.add( slide );

            opts.API.initSlide( slideOpts, slide, --opts._maxZ );

            slide.data('cycletwo.opts', slideOpts);
            opts.API.trigger('cycletwo-slide-added', [ opts, slideOpts, slide ]);
        });

        opts.API.updateView( true );

        startSlideshow = opts._preInitialized && (oldSlideCount < 2 && opts.slideCount >= 1);
        if ( startSlideshow ) {
            if ( !opts._initialized )
                opts.API.initSlideshow();
            else if ( opts.timeout ) {
                len = opts.slides.length;
                opts.nextSlide = opts.reverse ? len - 1 : 1;
                if ( !opts.timeoutId ) {
                    opts.API.queueTransition( opts );
                }
            }
        }
    },

    calcFirstSlide: function() {
        var opts = this.opts();
        var firstSlideIndex;
        firstSlideIndex = parseInt( opts.startingSlide || 0, 10 );
        if (firstSlideIndex >= opts.slides.length || firstSlideIndex < 0)
            firstSlideIndex = 0;

        opts.currSlide = firstSlideIndex;
        if ( opts.reverse ) {
            opts.nextSlide = firstSlideIndex - 1;
            if (opts.nextSlide < 0)
                opts.nextSlide = opts.slides.length - 1;
        }
        else {
            opts.nextSlide = firstSlideIndex + 1;
            if (opts.nextSlide == opts.slides.length)
                opts.nextSlide = 0;
        }
    },

    calcNextSlide: function() {
        var opts = this.opts();
        var roll;
        if ( opts.reverse ) {
            roll = (opts.nextSlide - 1) < 0;
            opts.nextSlide = roll ? opts.slideCount - 1 : opts.nextSlide-1;
            opts.currSlide = roll ? 0 : opts.nextSlide+1;
        }
        else {
            roll = (opts.nextSlide + 1) == opts.slides.length;
            opts.nextSlide = roll ? 0 : opts.nextSlide+1;
            opts.currSlide = roll ? opts.slides.length-1 : opts.nextSlide-1;
        }
    },

    calcTx: function( slideOpts, manual ) {
        var opts = slideOpts;
        var tx;
        if ( manual && opts.manualFx )
            tx = $.fn.cycletwo.transitions[opts.manualFx];
        if ( !tx )
            tx = $.fn.cycletwo.transitions[opts.fx];

        if (!tx) {
            tx = $.fn.cycletwo.transitions.fade;
            opts.API.log('Transition "' + opts.fx + '" not found.  Using fade.');
        }
        return tx;
    },

    prepareTx: function( manual, fwd ) {
        var opts = this.opts();
        var after, curr, next, slideOpts, tx;

        if ( opts.slideCount < 2 ) {
            opts.timeoutId = 0;
            return;
        }
        if ( manual && ( !opts.busy || opts.manualTrump ) ) {
            opts.API.stopTransition();
            opts.busy = false;
            clearTimeout(opts.timeoutId);
            opts.timeoutId = 0;
        }
        if ( opts.busy )
            return;
        if ( opts.timeoutId === 0 && !manual )
            return;

        curr = opts.slides[opts.currSlide];
        next = opts.slides[opts.nextSlide];
        slideOpts = opts.API.getSlideOpts( opts.nextSlide );
        tx = opts.API.calcTx( slideOpts, manual );

        opts._tx = tx;

        if ( manual && slideOpts.manualSpeed !== undefined )
            slideOpts.speed = slideOpts.manualSpeed;

        // if ( opts.nextSlide === opts.currSlide )
        //     opts.API.calcNextSlide();

        // ensure that:
        //      1. advancing to a different slide
        //      2. this is either a manual event (prev/next, pager, cmd) or 
        //              a timer event and slideshow is not paused
        if ( opts.nextSlide != opts.currSlide && 
            (manual || (!opts.paused && !opts.hoverPaused && opts.timeout) )) { // #62

            opts.API.trigger('cycletwo-before', [ slideOpts, curr, next, fwd ]);
            if ( tx.before )
                tx.before( slideOpts, curr, next, fwd );

            after = function() {
                opts.busy = false;
                // #76; bail if slideshow has been destroyed
                if (! opts.container.data( 'cycletwo.opts' ) )
                    return;

                if (tx.after)
                    tx.after( slideOpts, curr, next, fwd );
                opts.API.trigger('cycletwo-after', [ slideOpts, curr, next, fwd ]);
                opts.API.queueTransition( slideOpts);
                opts.API.updateView( true );
            };

            opts.busy = true;
            if (tx.transition)
                tx.transition(slideOpts, curr, next, fwd, after);
            else
                opts.API.doTransition( slideOpts, curr, next, fwd, after);

            opts.API.calcNextSlide();
            opts.API.updateView();
        } else {
            opts.API.queueTransition( slideOpts );
        }
    },

    // perform the actual animation
    doTransition: function( slideOpts, currEl, nextEl, fwd, callback) {
        var opts = slideOpts;
        var curr = $(currEl), next = $(nextEl);
        var fn = function() {
            // make sure animIn has something so that callback doesn't trigger immediately
            next.animate(opts.animIn || { opacity: 1}, opts.speed, opts.easeIn || opts.easing, callback);
        };

        next.css(opts.cssBefore || {});
        curr.animate(opts.animOut || {}, opts.speed, opts.easeOut || opts.easing, function() {
            curr.css(opts.cssAfter || {});
            if (!opts.sync) {
                fn();
            }
        });
        if (opts.sync) {
            fn();
        }
    },

    queueTransition: function( slideOpts, specificTimeout ) {
        var opts = this.opts();
        var timeout = specificTimeout !== undefined ? specificTimeout : slideOpts.timeout;
        if (opts.nextSlide === 0 && --opts.loop === 0) {
            opts.API.log('terminating; loop=0');
            opts.timeout = 0;
            if ( timeout ) {
                setTimeout(function() {
                    opts.API.trigger('cycletwo-finished', [ opts ]);
                }, timeout);
            }
            else {
                opts.API.trigger('cycletwo-finished', [ opts ]);
            }
            // reset nextSlide
            opts.nextSlide = opts.currSlide;
            return;
        }
        if ( timeout ) {
            opts._lastQueue = $.now();
            if ( specificTimeout === undefined )
                opts._remainingTimeout = slideOpts.timeout;

            if ( !opts.paused && ! opts.hoverPaused ) {
                opts.timeoutId = setTimeout(function() { 
                    opts.API.prepareTx( false, !opts.reverse ); 
                }, timeout );
            }
        }
    },

    stopTransition: function() {
        var opts = this.opts();
        if ( opts.slides.filter(':animated').length ) {
            opts.slides.stop(false, true);
            opts.API.trigger('cycletwo-transition-stopped', [ opts ]);
        }

        if ( opts._tx && opts._tx.stopTransition )
            opts._tx.stopTransition( opts );
    },

    // advance slide forward or back
    advanceSlide: function( val ) {
        var opts = this.opts();
        clearTimeout(opts.timeoutId);
        opts.timeoutId = 0;
        opts.nextSlide = opts.currSlide + val;
        
        if (opts.nextSlide < 0)
            opts.nextSlide = opts.slides.length - 1;
        else if (opts.nextSlide >= opts.slides.length)
            opts.nextSlide = 0;

        opts.API.prepareTx( true,  val >= 0 );
        return false;
    },

    buildSlideOpts: function( slide ) {
        var opts = this.opts();
        var val, shortName;
        var slideOpts = slide.data() || {};
        for (var p in slideOpts) {
            // allow props to be accessed sans 'cycletwo' prefix and log the overrides
            if (slideOpts.hasOwnProperty(p) && /^cycletwo[A-Z]+/.test(p) ) {
                val = slideOpts[p];
                shortName = p.match(/^cycletwo(.*)/)[1].replace(/^[A-Z]/, lowerCase);
                opts.API.log('['+(opts.slideCount-1)+']', shortName+':', val, '('+typeof val +')');
                slideOpts[shortName] = val;
            }
        }

        slideOpts = $.extend( {}, $.fn.cycletwo.defaults, opts, slideOpts );
        slideOpts.slideNum = opts.slideCount;

        try {
            // these props should always be read from the master state object
            delete slideOpts.API;
            delete slideOpts.slideCount;
            delete slideOpts.currSlide;
            delete slideOpts.nextSlide;
            delete slideOpts.slides;
        } catch(e) {
            // no op
        }
        return slideOpts;
    },

    getSlideOpts: function( index ) {
        var opts = this.opts();
        if ( index === undefined )
            index = opts.currSlide;

        var slide = opts.slides[index];
        var slideOpts = $(slide).data('cycletwo.opts');
        return $.extend( {}, opts, slideOpts );
    },
    
    initSlide: function( slideOpts, slide, suggestedZindex ) {
        var opts = this.opts();
        slide.css( slideOpts.slideCss || {} );
        if ( suggestedZindex > 0 )
            slide.css( 'zIndex', suggestedZindex );

        // ensure that speed settings are sane
        if ( isNaN( slideOpts.speed ) )
            slideOpts.speed = $.fx.speeds[slideOpts.speed] || $.fx.speeds._default;
        if ( !slideOpts.sync )
            slideOpts.speed = slideOpts.speed / 2;

        slide.addClass( opts.slideClass );
    },

    updateView: function( isAfter, isDuring ) {
        var opts = this.opts();
        if ( !opts._initialized )
            return;
        var slideOpts = opts.API.getSlideOpts();
        var currSlide = opts.slides[ opts.currSlide ];

        if ( ! isAfter && isDuring !== true ) {
            opts.API.trigger('cycletwo-update-view-before', [ opts, slideOpts, currSlide ]);
            if ( opts.updateView < 0 )
                return;
        }

        if ( opts.slideActiveClass ) {
            opts.slides.removeClass( opts.slideActiveClass )
                .eq( opts.currSlide ).addClass( opts.slideActiveClass );
        }

        if ( isAfter && opts.hideNonActive )
            opts.slides.filter( ':not(.' + opts.slideActiveClass + ')' ).hide();

        opts.API.trigger('cycletwo-update-view', [ opts, slideOpts, currSlide, isAfter ]);
        
        if ( isAfter )
            opts.API.trigger('cycletwo-update-view-after', [ opts, slideOpts, currSlide ]);
    },

    getComponent: function( name ) {
        var opts = this.opts();
        var selector = opts[name];
        if (typeof selector === 'string') {
            // if selector is a child, sibling combinator, adjancent selector then use find, otherwise query full dom
            return (/^\s*[\>|\+|~]/).test( selector ) ? opts.container.find( selector ) : $( selector );
        }
        if (selector.jquery)
            return selector;
        
        return $(selector);
    },

    stackSlides: function( curr, next, fwd ) {
        var opts = this.opts();
        if ( !curr ) {
            curr = opts.slides[opts.currSlide];
            next = opts.slides[opts.nextSlide];
            fwd = !opts.reverse;
        }

        // reset the zIndex for the common case:
        // curr slide on top,  next slide beneath, and the rest in order to be shown
        $(curr).css('zIndex', opts.maxZ);

        var i;
        var z = opts.maxZ - 2;
        var len = opts.slideCount;
        if (fwd) {
            for ( i = opts.currSlide + 1; i < len; i++ )
                $( opts.slides[i] ).css( 'zIndex', z-- );
            for ( i = 0; i < opts.currSlide; i++ )
                $( opts.slides[i] ).css( 'zIndex', z-- );
        }
        else {
            for ( i = opts.currSlide - 1; i >= 0; i-- )
                $( opts.slides[i] ).css( 'zIndex', z-- );
            for ( i = len - 1; i > opts.currSlide; i-- )
                $( opts.slides[i] ).css( 'zIndex', z-- );
        }

        $(next).css('zIndex', opts.maxZ - 1);
    },

    getSlideIndex: function( el ) {
        return this.opts().slides.index( el );
    }

}; // API

// default logger
$.fn.cycletwo.log = function log() {
    /*global console:true */
    if (window.console && console.log)
        console.log('[cycletwo] ' + Array.prototype.join.call(arguments, ' ') );
};

$.fn.cycletwo.version = function() { return 'cycletwo: ' + version; };

// helper functions

function lowerCase(s) {
    return (s || '').toLowerCase();
}

// expose transition object
$.fn.cycletwo.transitions = {
    custom: {
    },
    none: {
        before: function( opts, curr, next, fwd ) {
            opts.API.stackSlides( next, curr, fwd );
            opts.cssBefore = { opacity: 1, display: 'block' };
        }
    },
    fade: {
        before: function( opts, curr, next, fwd ) {
            var css = opts.API.getSlideOpts( opts.nextSlide ).slideCss || {};
            opts.API.stackSlides( curr, next, fwd );
            opts.cssBefore = $.extend(css, { opacity: 0, display: 'block' });
            opts.animIn = { opacity: 1 };
            opts.animOut = { opacity: 0 };
        }
    },
    fadeout: {
        before: function( opts , curr, next, fwd ) {
            var css = opts.API.getSlideOpts( opts.nextSlide ).slideCss || {};
            opts.API.stackSlides( curr, next, fwd );
            opts.cssBefore = $.extend(css, { opacity: 1, display: 'block' });
            opts.animOut = { opacity: 0 };
        }
    },
    scrollHorz: {
        before: function( opts, curr, next, fwd ) {
            opts.API.stackSlides( curr, next, fwd );
            var w = opts.container.css('overflow','hidden').width();
            opts.cssBefore = { left: fwd ? w : - w, top: 0, opacity: 1, display: 'block' };
            opts.cssAfter = { zIndex: opts._maxZ - 2, left: 0 };
            opts.animIn = { left: 0 };
            opts.animOut = { left: fwd ? -w : w };
        }
    }
};

// @see: http://jquery.malsup.com/cycletwo/api
$.fn.cycletwo.defaults = {
    allowWrap:        true,
    autoSelector:     '.cycletwo-slideshow[data-cycletwo-auto-init!=false]',
    delay:            0,
    easing:           null,
    fx:              'fade',
    hideNonActive:    true,
    loop:             0,
    manualFx:         undefined,
    manualSpeed:      undefined,
    manualTrump:      true,
    maxZ:             100,
    pauseOnHover:     false,
    reverse:          false,
    slideActiveClass: 'cycletwo-slide-active',
    slideClass:       'cycletwo-slide',
    slideCss:         { position: 'absolute', top: 0, left: 0 },
    slides:          '> img',
    speed:            500,
    startingSlide:    0,
    sync:             true,
    timeout:          4000,
    updateView:       -1
};

// automatically find and run slideshows
$(document).ready(function() {
    $( $.fn.cycletwo.defaults.autoSelector ).cycletwo();
});

})(jQuery);

/*! cycletwo autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130304 */
(function($) {
"use strict";

$.extend($.fn.cycletwo.defaults, {
    autoHeight: 0 // setting this option to false disables autoHeight logic
});    

$(document).on( 'cycletwo-initialized', function( e, opts ) {
    var autoHeight = opts.autoHeight;
    var t = $.type( autoHeight );
    var resizeThrottle = null;
    var ratio;

    if ( t !== 'string' && t !== 'number' )
        return;

    // bind events
    opts.container.on( 'cycletwo-slide-added cycletwo-slide-removed', initAutoHeight );
    opts.container.on( 'cycletwo-destroyed', onDestroy );

    if ( autoHeight == 'container' ) {
        opts.container.on( 'cycletwo-before', onBefore );
    }
    else if ( t === 'string' && /\d+\:\d+/.test( autoHeight ) ) { 
        // use ratio
        ratio = autoHeight.match(/(\d+)\:(\d+)/);
        ratio = ratio[1] / ratio[2];
        opts._autoHeightRatio = ratio;
    }

    // if autoHeight is a number then we don't need to recalculate the sentinel
    // index on resize
    if ( t !== 'number' ) {
        // bind unique resize handler per slideshow (so it can be 'off-ed' in onDestroy)
        opts._autoHeightOnResize = function () {
            clearTimeout( resizeThrottle );
            resizeThrottle = setTimeout( onResize, 50 );
        };

        $(window).on( 'resize orientationchange', opts._autoHeightOnResize );
    }

    setTimeout( onResize, 30 );

    function onResize() {
        initAutoHeight( e, opts );
    }
});

function initAutoHeight( e, opts ) {
    var clone, height, sentinelIndex;
    var autoHeight = opts.autoHeight;

    if ( autoHeight == 'container' ) {
        height = $( opts.slides[ opts.currSlide ] ).outerHeight();
        opts.container.height( height );
    }
    else if ( opts._autoHeightRatio ) { 
        opts.container.height( opts.container.width() / opts._autoHeightRatio );
    }
    else if ( autoHeight === 'calc' || ( $.type( autoHeight ) == 'number' && autoHeight >= 0 ) ) {
        if ( autoHeight === 'calc' )
            sentinelIndex = calcSentinelIndex( e, opts );
        else if ( autoHeight >= opts.slides.length )
            sentinelIndex = 0;
        else 
            sentinelIndex = autoHeight;

        // only recreate sentinel if index is different
        if ( sentinelIndex == opts._sentinelIndex )
            return;

        opts._sentinelIndex = sentinelIndex;
        if ( opts._sentinel )
            opts._sentinel.remove();

        // clone existing slide as sentinel
        clone = $( opts.slides[ sentinelIndex ].cloneNode(true) );
        
        // #50; remove special attributes from cloned content
        clone.removeAttr( 'id name rel' ).find( '[id],[name],[rel]' ).removeAttr( 'id name rel' );

        clone.css({
            position: 'static',
            visibility: 'hidden',
            display: 'block'
        }).prependTo( opts.container ).addClass('cycletwo-sentinel cycletwo-slide').removeClass('cycletwo-slide-active');
        clone.find( '*' ).css( 'visibility', 'hidden' );

        opts._sentinel = clone;
    }
}    

function calcSentinelIndex( e, opts ) {
    var index = 0, max = -1;

    // calculate tallest slide index
    opts.slides.each(function(i) {
        var h = $(this).height();
        if ( h > max ) {
            max = h;
            index = i;
        }
    });
    return index;
}

function onBefore( e, opts, outgoing, incoming, forward ) {
    var h = $(incoming).outerHeight();
    var duration = opts.sync ? opts.speed / 2 : opts.speed;
    opts.container.animate( { height: h }, duration );
}

function onDestroy( e, opts ) {
    if ( opts._autoHeightOnResize ) {
        $(window).off( 'resize orientationchange', opts._autoHeightOnResize );
        opts._autoHeightOnResize = null;
    }
    opts.container.off( 'cycletwo-slide-added cycletwo-slide-removed', initAutoHeight );
    opts.container.off( 'cycletwo-destroyed', onDestroy );
    opts.container.off( 'cycletwo-before', onBefore );

    if ( opts._sentinel ) {
        opts._sentinel.remove();
        opts._sentinel = null;
    }
}

})(jQuery);

/*! caption plugin for cycletwo;  version: 20130306 */
(function($) {
"use strict";

$.extend($.fn.cycletwo.defaults, {
    caption:          '> .cycletwo-caption',
    captionTemplate:  '{{slideNum}} / {{slideCount}}',
    overlay:          '> .cycletwo-overlay',
    overlayTemplate:  '<div>{{title}}</div><div>{{desc}}</div>',
    captionModule:    'caption'
});    

$(document).on( 'cycletwo-update-view', function( e, opts, slideOpts, currSlide ) {
    if ( opts.captionModule !== 'caption' )
        return;
    var el;
    $.each(['caption','overlay'], function() {
        var name = this; 
        var template = slideOpts[name+'Template'];
        var el = opts.API.getComponent( name );
        if( el.length && template ) {
            el.html( opts.API.tmpl( template, slideOpts, opts, currSlide ) );
            el.show();
        }
        else {
            el.hide();
        }
    });
});

$(document).on( 'cycletwo-destroyed', function( e, opts ) {
    var el;
    $.each(['caption','overlay'], function() {
        var name = this, template = opts[name+'Template'];
        if ( opts[name] && template ) {
            el = opts.API.getComponent( 'caption' );
            el.empty();
        }
    });
});

})(jQuery);

/*! command plugin for cycletwo;  version: 20130707 */
(function($) {
"use strict";

var c2 = $.fn.cycletwo;

$.fn.cycletwo = function( options ) {
    var cmd, cmdFn, opts;
    var args = $.makeArray( arguments );

    if ( $.type( options ) == 'number' ) {
        return this.cycletwo( 'goto', options );
    }

    if ( $.type( options ) == 'string' ) {
        return this.each(function() {
            var cmdArgs;
            cmd = options;
            opts = $(this).data('cycletwo.opts');

            if ( opts === undefined ) {
                c2.log('slideshow must be initialized before sending commands; "' + cmd + '" ignored');
                return;
            }
            else {
                cmd = cmd == 'goto' ? 'jump' : cmd; // issue #3; change 'goto' to 'jump' internally
                cmdFn = opts.API[ cmd ];
                if ( $.isFunction( cmdFn )) {
                    cmdArgs = $.makeArray( args );
                    cmdArgs.shift();
                    return cmdFn.apply( opts.API, cmdArgs );
                }
                else {
                    c2.log( 'unknown command: ', cmd );
                }
            }
        });
    }
    else {
        return c2.apply( this, arguments );
    }
};

// copy props
$.extend( $.fn.cycletwo, c2 );

$.extend( c2.API, {
    next: function() {
        var opts = this.opts();
        if ( opts.busy && ! opts.manualTrump )
            return;
        
        var count = opts.reverse ? -1 : 1;
        if ( opts.allowWrap === false && ( opts.currSlide + count ) >= opts.slideCount )
            return;

        opts.API.advanceSlide( count );
        opts.API.trigger('cycletwo-next', [ opts ]).log('cycletwo-next');
    },

    prev: function() {
        var opts = this.opts();
        if ( opts.busy && ! opts.manualTrump )
            return;
        var count = opts.reverse ? 1 : -1;
        if ( opts.allowWrap === false && ( opts.currSlide + count ) < 0 )
            return;

        opts.API.advanceSlide( count );
        opts.API.trigger('cycletwo-prev', [ opts ]).log('cycletwo-prev');
    },

    destroy: function() {
        this.stop(); //#204

        var opts = this.opts();
        var clean = $.isFunction( $._data ) ? $._data : $.noop;  // hack for #184 and #201
        clearTimeout(opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.stop();
        opts.API.trigger( 'cycletwo-destroyed', [ opts ] ).log('cycletwo-destroyed');
        opts.container.removeData();
        clean( opts.container[0], 'parsedAttrs', false );

        // #75; remove inline styles
        if ( ! opts.retainStylesOnDestroy ) {
            opts.container.removeAttr( 'style' );
            opts.slides.removeAttr( 'style' );
            opts.slides.removeClass( opts.slideActiveClass );
        }
        opts.slides.each(function() {
            $(this).removeData();
            clean( this, 'parsedAttrs', false );
        });
    },

    jump: function( index ) {
        // go to the requested slide
        var fwd;
        var opts = this.opts();
        if ( opts.busy && ! opts.manualTrump )
            return;
        var num = parseInt( index, 10 );
        if (isNaN(num) || num < 0 || num >= opts.slides.length) {
            opts.API.log('goto: invalid slide index: ' + num);
            return;
        }
        if (num == opts.currSlide) {
            opts.API.log('goto: skipping, already on slide', num);
            return;
        }
        opts.nextSlide = num;
        clearTimeout(opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.log('goto: ', num, ' (zero-index)');
        fwd = opts.currSlide < opts.nextSlide;
        opts.API.prepareTx( true, fwd );
    },

    stop: function() {
        var opts = this.opts();
        var pauseObj = opts.container;
        clearTimeout(opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.stopTransition();
        if ( opts.pauseOnHover ) {
            if ( opts.pauseOnHover !== true )
                pauseObj = $( opts.pauseOnHover );
            pauseObj.off('mouseenter mouseleave');
        }
        opts.API.trigger('cycletwo-stopped', [ opts ]).log('cycletwo-stopped');
    },

    reinit: function() {
        var opts = this.opts();
        opts.API.destroy();
        opts.container.cycletwo();
    },

    remove: function( index ) {
        var opts = this.opts();
        var slide, slideToRemove, slides = [], slideNum = 1;
        for ( var i=0; i < opts.slides.length; i++ ) {
            slide = opts.slides[i];
            if ( i == index ) {
                slideToRemove = slide;
            }
            else {
                slides.push( slide );
                $( slide ).data('cycletwo.opts').slideNum = slideNum;
                slideNum++;
            }
        }
        if ( slideToRemove ) {
            opts.slides = $( slides );
            opts.slideCount--;
            $( slideToRemove ).remove();
            if (index == opts.currSlide)
                opts.API.advanceSlide( 1 );
            else if ( index < opts.currSlide )
                opts.currSlide--;
            else
                opts.currSlide++;

            opts.API.trigger('cycletwo-slide-removed', [ opts, index, slideToRemove ]).log('cycletwo-slide-removed');
            opts.API.updateView();
        }
    }

});

// listen for clicks on elements with data-cycle-cmd attribute
$(document).on('click.cycletwo', '[data-cycle-cmd]', function(e) {
    // issue cycletwo command
    e.preventDefault();
    var el = $(this);
    var command = el.data('cycletwo-cmd');
    var context = el.data('cycletwo-context') || '.cycletwo-slideshow';
    $(context).cycletwo(command, el.data('cycletwo-arg'));
});


})(jQuery);

/*! hash plugin for cycletwo;  version: 20130905 */
(function($) {
"use strict";

$(document).on( 'cycletwo-pre-initialize', function( e, opts ) {
    onHashChange( opts, true );

    opts._onHashChange = function() {
        onHashChange( opts, false );
    };

    $( window ).on( 'hashchange', opts._onHashChange);
});

$(document).on( 'cycletwo-update-view', function( e, opts, slideOpts ) {
    if ( slideOpts.hash && ( '#' + slideOpts.hash ) != window.location.hash ) {
        opts._hashFence = true;
        window.location.hash = slideOpts.hash;
    }
});

$(document).on( 'cycletwo-destroyed', function( e, opts) {
    if ( opts._onHashChange ) {
        $( window ).off( 'hashchange', opts._onHashChange );
    }
});

function onHashChange( opts, setStartingSlide ) {
    var hash;
    if ( opts._hashFence ) {
        opts._hashFence = false;
        return;
    }
    
    hash = window.location.hash.substring(1);

    opts.slides.each(function(i) {
        if ( $(this).data( 'cycletwo-hash' ) == hash ) {
            if ( setStartingSlide === true ) {
                opts.startingSlide = i;
            }
            else {
                var fwd = opts.currSlide < i;
                opts.nextSlide = i;
                opts.API.prepareTx( true, fwd );
            }
            return false;
        }
    });
}

})(jQuery);

/*! loader plugin for cycletwo;  version: 20130307 */
(function($) {
"use strict";

$.extend($.fn.cycletwo.defaults, {
    loader: false
});

$(document).on( 'cycletwo-bootstrap', function( e, opts ) {
    var addFn;

    if ( !opts.loader )
        return;

    // override API.add for this slideshow
    addFn = opts.API.add;
    opts.API.add = add;

    function add( slides, prepend ) {
        var slideArr = [];
        if ( $.type( slides ) == 'string' )
            slides = $.trim( slides );
        else if ( $.type( slides) === 'array' ) {
            for (var i=0; i < slides.length; i++ )
                slides[i] = $(slides[i])[0];
        }

        slides = $( slides );
        var slideCount = slides.length;

        if ( ! slideCount )
            return;

        slides.hide().appendTo('body').each(function(i) { // appendTo fixes #56
            var count = 0;
            var slide = $(this);
            var images = slide.is('img') ? slide : slide.find('img');
            slide.data('index', i);
            // allow some images to be marked as unimportant (and filter out images w/o src value)
            images = images.filter(':not(.cycletwo-loader-ignore)').filter(':not([src=""])');
            if ( ! images.length ) {
                --slideCount;
                slideArr.push( slide );
                return;
            }

            count = images.length;
            images.each(function() {
                // add images that are already loaded
                if ( this.complete ) {
                    imageLoaded();
                }
                else {
                    $(this).load(function() {
                        imageLoaded();
                    }).error(function() {
                        if ( --count === 0 ) {
                            // ignore this slide
                            opts.API.log('slide skipped; img not loaded:', this.src);
                            if ( --slideCount === 0 && opts.loader == 'wait') {
                                addFn.apply( opts.API, [ slideArr, prepend ] );
                            }
                        }
                    });
                }
            });

            function imageLoaded() {
                if ( --count === 0 ) {
                    --slideCount;
                    addSlide( slide );
                }
            }
        });

        if ( slideCount )
            opts.container.addClass('cycletwo-loading');
        

        function addSlide( slide ) {
            var curr;
            if ( opts.loader == 'wait' ) {
                slideArr.push( slide );
                if ( slideCount === 0 ) {
                    // #59; sort slides into original markup order
                    slideArr.sort( sorter );
                    addFn.apply( opts.API, [ slideArr, prepend ] );
                    opts.container.removeClass('cycletwo-loading');
                }
            }
            else {
                curr = $(opts.slides[opts.currSlide]);
                addFn.apply( opts.API, [ slide, prepend ] );
                curr.show();
                opts.container.removeClass('cycletwo-loading');
            }
        }

        function sorter(a, b) {
            return a.data('index') - b.data('index');
        }
    }
});

})(jQuery);

/*! pager plugin for cycletwo;  version: 20130525 */
(function($) {
"use strict";

$.extend($.fn.cycletwo.defaults, {
    pager:            '> .cycletwo-pager',
    pagerActiveClass: 'cycletwo-pager-active',
    pagerEvent:       'click.cycletwo',
    pagerTemplate:    '<span>&bull;</span>'
});    

$(document).on( 'cycletwo-bootstrap', function( e, opts, API ) {
    // add method to API
    API.buildPagerLink = buildPagerLink;
});

$(document).on( 'cycletwo-slide-added', function( e, opts, slideOpts, slideAdded ) {
    if ( opts.pager ) {
        opts.API.buildPagerLink ( opts, slideOpts, slideAdded );
        opts.API.page = page;
    }
});

$(document).on( 'cycletwo-slide-removed', function( e, opts, index, slideRemoved ) {
    if ( opts.pager ) {
        var pagers = opts.API.getComponent( 'pager' );
        pagers.each(function() {
            var pager = $(this);
            $( pager.children()[index] ).remove();
        });
    }
});

$(document).on( 'cycletwo-update-view', function( e, opts, slideOpts ) {
    var pagers;

    if ( opts.pager ) {
        pagers = opts.API.getComponent( 'pager' );
        pagers.each(function() {
           $(this).children().removeClass( opts.pagerActiveClass )
            .eq( opts.currSlide ).addClass( opts.pagerActiveClass );
        });
    }
});

$(document).on( 'cycletwo-destroyed', function( e, opts ) {
    var pager = opts.API.getComponent( 'pager' );

    if ( pager ) {
        pager.children().off( opts.pagerEvent ); // #202
        if ( opts.pagerTemplate )
            pager.empty();
    }
});

function buildPagerLink( opts, slideOpts, slide ) {
    var pagerLink;
    var pagers = opts.API.getComponent( 'pager' );
    pagers.each(function() {
        var pager = $(this);
        if ( slideOpts.pagerTemplate ) {
            var markup = opts.API.tmpl( slideOpts.pagerTemplate, slideOpts, opts, slide[0] );
            pagerLink = $( markup ).appendTo( pager );
        }
        else {
            pagerLink = pager.children().eq( opts.slideCount - 1 );
        }
        pagerLink.on( opts.pagerEvent, function(e) {
            e.preventDefault();
            opts.API.page( pager, e.currentTarget);
        });
    });
}

function page( pager, target ) {
    /*jshint validthis:true */
    var opts = this.opts();
    if ( opts.busy && ! opts.manualTrump )
        return;

    var index = pager.children().index( target );
    var nextSlide = index;
    var fwd = opts.currSlide < nextSlide;
    if (opts.currSlide == nextSlide) {
        return; // no op, clicked pager for the currently displayed slide
    }
    opts.nextSlide = nextSlide;
    opts.API.prepareTx( true, fwd );
    opts.API.trigger('cycletwo-pager-activated', [opts, pager, target ]);
}

})(jQuery);


/*! prevnext plugin for cycletwo;  version: 20130709 */
(function($) {
"use strict";

$.extend($.fn.cycletwo.defaults, {
    next:           '> .cycletwo-next',
    nextEvent:      'click.cycletwo',
    disabledClass:  'disabled',
    prev:           '> .cycletwo-prev',
    prevEvent:      'click.cycletwo',
    swipe:          false
});

$(document).on( 'cycletwo-initialized', function( e, opts ) {
    opts.API.getComponent( 'next' ).on( opts.nextEvent, function(e) {
        e.preventDefault();
        opts.API.next();
    });

    opts.API.getComponent( 'prev' ).on( opts.prevEvent, function(e) {
        e.preventDefault();
        opts.API.prev();
    });

    if ( opts.swipe ) {
        var nextEvent = opts.swipeVert ? 'swipeUp.cycletwo' : 'swipeLeft.cycletwo swipeleft.cycletwo';
        var prevEvent = opts.swipeVert ? 'swipeDown.cycletwo' : 'swipeRight.cycletwo swiperight.cycletwo';
        opts.container.on( nextEvent, function(e) {
            opts.API.next();
        });
        opts.container.on( prevEvent, function() {
            opts.API.prev();
        });
    }
});

$(document).on( 'cycletwo-update-view', function( e, opts, slideOpts, currSlide ) {
    if ( opts.allowWrap )
        return;

    var cls = opts.disabledClass;
    var next = opts.API.getComponent( 'next' );
    var prev = opts.API.getComponent( 'prev' );
    var prevBoundry = opts._prevBoundry || 0;
    var nextBoundry = (opts._nextBoundry !== undefined)?opts._nextBoundry:opts.slideCount - 1;

    if ( opts.currSlide == nextBoundry )
        next.addClass( cls ).prop( 'disabled', true );
    else
        next.removeClass( cls ).prop( 'disabled', false );

    if ( opts.currSlide === prevBoundry )
        prev.addClass( cls ).prop( 'disabled', true );
    else
        prev.removeClass( cls ).prop( 'disabled', false );
});


$(document).on( 'cycletwo-destroyed', function( e, opts ) {
    opts.API.getComponent( 'prev' ).off( opts.nextEvent );
    opts.API.getComponent( 'next' ).off( opts.prevEvent );
    opts.container.off( 'swipeleft.cycletwo swiperight.cycletwo swipeLeft.cycletwo swipeRight.cycletwo swipeUp.cycletwo swipeDown.cycletwo' );
});

})(jQuery);

/*! progressive loader plugin for cycletwo;  version: 20130315 */
(function($) {
"use strict";

$.extend($.fn.cycletwo.defaults, {
    progressive: false
});

$(document).on( 'cycletwo-pre-initialize', function( e, opts ) {
    if ( !opts.progressive )
        return;

    var API = opts.API;
    var nextFn = API.next;
    var prevFn = API.prev;
    var prepareTxFn = API.prepareTx;
    var type = $.type( opts.progressive );
    var slides, scriptEl;

    if ( type == 'array' ) {
        slides = opts.progressive;
    }
    else if ($.isFunction( opts.progressive ) ) {
        slides = opts.progressive( opts );
    }
    else if ( type == 'string' ) {
        scriptEl = $( opts.progressive );
        slides = $.trim( scriptEl.html() );
        if ( !slides )
            return;
        // is it json array?
        if ( /^(\[)/.test( slides ) ) {
            try {
                slides = $.parseJSON( slides );
            }
            catch(err) {
                API.log( 'error parsing progressive slides', err );
                return;
            }
        }
        else {
            // plain text, split on delimeter
            slides = slides.split( new RegExp( scriptEl.data('cycletwo-split') || '\n') );
            
            // #95; look for empty slide
            if ( ! slides[ slides.length - 1 ] )
                slides.pop();
        }
    }



    if ( prepareTxFn ) {
        API.prepareTx = function( manual, fwd ) {
            var index, slide;

            if ( manual || slides.length === 0 ) {
                prepareTxFn.apply( opts.API, [ manual, fwd ] );
                return;
            }

            if ( fwd && opts.currSlide == ( opts.slideCount-1) ) {
                slide = slides[ 0 ];
                slides = slides.slice( 1 );
                opts.container.one('cycletwo-slide-added', function(e, opts ) {
                    setTimeout(function() {
                        opts.API.advanceSlide( 1 );
                    },50);
                });
                opts.API.add( slide );
            }
            else if ( !fwd && opts.currSlide === 0 ) {
                index = slides.length-1;
                slide = slides[ index ];
                slides = slides.slice( 0, index );
                opts.container.one('cycletwo-slide-added', function(e, opts ) {
                    setTimeout(function() {
                        opts.currSlide = 1;
                        opts.API.advanceSlide( -1 );
                    },50);
                });
                opts.API.add( slide, true );
            }
            else {
                prepareTxFn.apply( opts.API, [ manual, fwd ] );
            }
        };
    }

    if ( nextFn ) {
        API.next = function() {
            var opts = this.opts();
            if ( slides.length && opts.currSlide == ( opts.slideCount - 1 ) ) {
                var slide = slides[ 0 ];
                slides = slides.slice( 1 );
                opts.container.one('cycletwo-slide-added', function(e, opts ) {
                    nextFn.apply( opts.API );
                    opts.container.removeClass('cycletwo-loading');
                });
                opts.container.addClass('cycletwo-loading');
                opts.API.add( slide );
            }
            else {
                nextFn.apply( opts.API );    
            }
        };
    }
    
    if ( prevFn ) {
        API.prev = function() {
            var opts = this.opts();
            if ( slides.length && opts.currSlide === 0 ) {
                var index = slides.length-1;
                var slide = slides[ index ];
                slides = slides.slice( 0, index );
                opts.container.one('cycletwo-slide-added', function(e, opts ) {
                    opts.currSlide = 1;
                    opts.API.advanceSlide( -1 );
                    opts.container.removeClass('cycletwo-loading');
                });
                opts.container.addClass('cycletwo-loading');
                opts.API.add( slide, true );
            }
            else {
                prevFn.apply( opts.API );
            }
        };
    }
});

})(jQuery);

/*! tmpl plugin for cycletwo;  version: 20121227 */
(function($) {
"use strict";

$.extend($.fn.cycletwo.defaults, {
    tmplRegex: '{{((.)?.*?)}}'
});

$.extend($.fn.cycletwo.API, {
    tmpl: function( str, opts /*, ... */) {
        var regex = new RegExp( opts.tmplRegex || $.fn.cycletwo.defaults.tmplRegex, 'g' );
        var args = $.makeArray( arguments );
        args.shift();
        return str.replace(regex, function(_, str) {
            var i, j, obj, prop, names = str.split('.');
            for (i=0; i < args.length; i++) {
                obj = args[i];
                if ( ! obj )
                    continue;
                if (names.length > 1) {
                    prop = obj;
                    for (j=0; j < names.length; j++) {
                        obj = prop;
                        prop = prop[ names[j] ] || str;
                    }
                } else {
                    prop = obj[str];
                }

                if ($.isFunction(prop))
                    return prop.apply(obj, args);
                if (prop !== undefined && prop !== null && prop != str)
                    return prop;
            }
            return str;
        });
    }
});    

})(jQuery);
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/testimonial-rotator/js/jquery.cycletwo.addons.js 


/*! 
	ADDON: scrollVert
	Plugin for cycletwo2; Copyright (c) 2012 M. Alsup; ver: 20121120 
*/
(function(a){"use strict",a.fn.cycletwo.transitions.scrollVert={before:function(a,b,c,d){a.API.stackSlides(a,b,c,d);var e=a.container.css("overflow","hidden").height();a.cssBefore={top:d?-e:e,left:0,opacity:1,display:"block"},a.animIn={top:0},a.animOut={top:d?e:-e}}}})(jQuery);


/*!
	ADDON: IE-Fade
	Plugin for cycletwo2; Copyright (c) 2012 M. Alsup; ver: 20121120 
*/
(function(a){function b(a,b,c){if(a&&c.style.filter){b._filter=c.style.filter;try{c.style.removeAttribute("filter")}catch(d){}}else!a&&b._filter&&(c.style.filter=b._filter)}"use strict",a.extend(a.fn.cycletwo.transitions,{fade:{before:function(c,d,e,f){var g=c.API.getSlideOpts(c.nextSlide).slideCss||{};c.API.stackSlides(d,e,f),c.cssBefore=a.extend(g,{opacity:0,display:"block"}),c.animIn={opacity:1},c.animOut={opacity:0},b(!0,c,e)},after:function(a,c,d){b(!1,a,d)}},fadeout:{before:function(c,d,e,f){var g=c.API.getSlideOpts(c.nextSlide).slideCss||{};c.API.stackSlides(d,e,f),c.cssBefore=a.extend(g,{opacity:1,display:"block"}),c.animOut={opacity:0},b(!0,c,e)},after:function(a,c,d){b(!1,a,d)}}})})(jQuery);


/*! 
	ADDON: swipe
	Plugin for cycletwo2; Copyright (c) 2012 M. Alsup; ver: 20121120 
*/
(function(a){"use strict";var b="ontouchend"in document;a.event.special.swipe=a.event.special.swipe||{scrollSupressionThreshold:10,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,setup:function(){var b=a(this);b.bind("touchstart",function(c){function g(b){if(!f)return;var c=b.originalEvent.touches?b.originalEvent.touches[0]:b;e={time:(new Date).getTime(),coords:[c.pageX,c.pageY]},Math.abs(f.coords[0]-e.coords[0])>a.event.special.swipe.scrollSupressionThreshold&&b.preventDefault()}var d=c.originalEvent.touches?c.originalEvent.touches[0]:c,e,f={time:(new Date).getTime(),coords:[d.pageX,d.pageY],origin:a(c.target)};b.bind("touchmove",g).one("touchend",function(c){b.unbind("touchmove",g),f&&e&&e.time-f.time<a.event.special.swipe.durationThreshold&&Math.abs(f.coords[0]-e.coords[0])>a.event.special.swipe.horizontalDistanceThreshold&&Math.abs(f.coords[1]-e.coords[1])<a.event.special.swipe.verticalDistanceThreshold&&f.origin.trigger("swipe").trigger(f.coords[0]>e.coords[0]?"swipeleft":"swiperight"),f=e=undefined})})}},a.event.special.swipeleft=a.event.special.swipeleft||{setup:function(){a(this).bind("swipe",a.noop)}},a.event.special.swiperight=a.event.special.swiperight||a.event.special.swipeleft})(jQuery);


/*! 
	ADDON: center
	Plugin for cycletwo2; Copyright (c) 2012 M. Alsup; ver: 20140128 
*/
(function(e){"use strict";e.extend(e.fn.cycletwo.defaults,{centerHorz:!1,centerVert:!1}),e(document).on("cycletwo-pre-initialize",function(i,t){function n(){clearTimeout(c),c=setTimeout(l,50)}function s(){clearTimeout(c),clearTimeout(a),e(window).off("resize orientationchange",n)}function o(){t.slides.each(r)}function l(){r.apply(t.container.find("."+t.slideActiveClass)),clearTimeout(a),a=setTimeout(o,50)}function r(){var i=e(this),n=t.container.width(),s=t.container.height(),o=i.outerWidth(),l=i.outerHeight();o&&(t.centerHorz&&n>=o&&i.css("marginLeft",(n-o)/2),t.centerVert&&s>=l&&i.css("marginTop",(s-l)/2))}if(t.centerHorz||t.centerVert){var c,a;e(window).on("resize orientationchange load",n),t.container.on("cycletwo-destroyed",s),t.container.on("cycletwo-initialized cycletwo-slide-added cycletwo-slide-removed",function(){n()}),l()}})})(jQuery);


/* ADDON: Flip
	Plugin for cycletwo2; Copyright (c) 2012 M. Alsup; v20141007 */
!function(a){"use strict";function b(b){return{preInit:function(a){a.slides.css(d)},transition:function(c,d,e,f,g){var h=c,i=a(d),j=a(e),k=h.speed/2;b.call(j,-90),j.css({display:"block",visibility:"visible","background-position":"-90px",opacity:1}),i.css("background-position","0px"),i.animate({backgroundPosition:90},{step:b,duration:k,easing:h.easeOut||h.easing,complete:function(){c.API.updateView(!1,!0),j.animate({backgroundPosition:0},{step:b,duration:k,easing:h.easeIn||h.easing,complete:g})}})}}}function c(b){return function(c){var d=a(this);d.css({"-webkit-transform":"rotate"+b+"("+c+"deg)","-moz-transform":"rotate"+b+"("+c+"deg)","-ms-transform":"rotate"+b+"("+c+"deg)","-o-transform":"rotate"+b+"("+c+"deg)",transform:"rotate"+b+"("+c+"deg)"})}}var d,e=document.createElement("div").style,f=a.fn.cycletwo.transitions,g=void 0!==e.transform||void 0!==e.MozTransform||void 0!==e.webkitTransform||void 0!==e.oTransform||void 0!==e.msTransform;g&&void 0!==e.msTransform&&(e.msTransform="rotateY(0deg)",e.msTransform||(g=!1)),g?(f.flipHorz=b(c("Y")),f.flipVert=b(c("X")),d={"-webkit-backface-visibility":"hidden","-moz-backface-visibility":"hidden","-o-backface-visibility":"hidden","backface-visibility":"hidden"}):(f.flipHorz=f.scrollHorz,f.flipVert=f.scrollVert||f.scrollHorz)}(jQuery);


/* ADDON: Carousel
	Plugin for Cycle2; Copyright (c) 2012 M. Alsup; v20141007 */
!function(a){"use strict";a(document).on("cycletwo-bootstrap",function(a,b,c){"carousel"===b.fx&&(c.getSlideIndex=function(a){var b=this.opts()._carouselWrap.children(),c=b.index(a);return c%b.length},c.next=function(){var a=b.reverse?-1:1;b.allowWrap===!1&&b.currSlide+a>b.slideCount-b.carouselVisible||(b.API.advanceSlide(a),b.API.trigger("cycletwo-next",[b]).log("cycletwo-next"))})}),a.fn.cycletwo.transitions.carousel={preInit:function(b){b.hideNonActive=!1,b.container.on("cycletwo-destroyed",a.proxy(this.onDestroy,b.API)),b.API.stopTransition=this.stopTransition;for(var c=0;c<b.startingSlide;c++)b.container.append(b.slides[0])},postInit:function(b){var c,d,e,f,g=b.carouselVertical;b.carouselVisible&&b.carouselVisible>b.slideCount&&(b.carouselVisible=b.slideCount-1);var h=b.carouselVisible||b.slides.length,i={display:g?"block":"inline-block",position:"static"};if(b.container.css({position:"relative",overflow:"hidden"}),b.slides.css(i),b._currSlide=b.currSlide,f=a('<div class="cycletwo-carousel-wrap"></div>').prependTo(b.container).css({margin:0,padding:0,top:0,left:0,position:"absolute"}).append(b.slides),b._carouselWrap=f,g||f.css("white-space","nowrap"),b.allowWrap!==!1){for(d=0;d<(void 0===b.carouselVisible?2:1);d++){for(c=0;c<b.slideCount;c++)f.append(b.slides[c].cloneNode(!0));for(c=b.slideCount;c--;)f.prepend(b.slides[c].cloneNode(!0))}f.find(".cycletwo-slide-active").removeClass("cycletwo-slide-active"),b.slides.eq(b.startingSlide).addClass("cycletwo-slide-active")}b.pager&&b.allowWrap===!1&&(e=b.slideCount-h,a(b.pager).children().filter(":gt("+e+")").hide()),b._nextBoundry=b.slideCount-b.carouselVisible,this.prepareDimensions(b)},prepareDimensions:function(b){var c,d,e,f,g=b.carouselVertical,h=b.carouselVisible||b.slides.length;if(b.carouselFluid&&b.carouselVisible?b._carouselResizeThrottle||this.fluidSlides(b):b.carouselVisible&&b.carouselSlideDimension?(c=h*b.carouselSlideDimension,b.container[g?"height":"width"](c)):b.carouselVisible&&(c=h*a(b.slides[0])[g?"outerHeight":"outerWidth"](!0),b.container[g?"height":"width"](c)),d=b.carouselOffset||0,b.allowWrap!==!1)if(b.carouselSlideDimension)d-=(b.slideCount+b.currSlide)*b.carouselSlideDimension;else for(e=b._carouselWrap.children(),f=0;f<b.slideCount+b.currSlide;f++)d-=a(e[f])[g?"outerHeight":"outerWidth"](!0);b._carouselWrap.css(g?"top":"left",d)},fluidSlides:function(b){function c(){clearTimeout(e),e=setTimeout(d,20)}function d(){b._carouselWrap.stop(!1,!0);var a=b.container.width()/b.carouselVisible;a=Math.ceil(a-g),b._carouselWrap.children().width(a),b._sentinel&&b._sentinel.width(a),h(b)}var e,f=b.slides.eq(0),g=f.outerWidth()-f.width(),h=this.prepareDimensions;a(window).on("resize",c),b._carouselResizeThrottle=c,d()},transition:function(b,c,d,e,f){var g,h={},i=b.nextSlide-b.currSlide,j=b.carouselVertical,k=b.speed;if(b.allowWrap===!1){e=i>0;var l=b._currSlide,m=b.slideCount-b.carouselVisible;i>0&&b.nextSlide>m&&l==m?i=0:i>0&&b.nextSlide>m?i=b.nextSlide-l-(b.nextSlide-m):0>i&&b.currSlide>m&&b.nextSlide>m?i=0:0>i&&b.currSlide>m?i+=b.currSlide-m:l=b.currSlide,g=this.getScroll(b,j,l,i),b.API.opts()._currSlide=b.nextSlide>m?m:b.nextSlide}else e&&0===b.nextSlide?(g=this.getDim(b,b.currSlide,j),f=this.genCallback(b,e,j,f)):e||b.nextSlide!=b.slideCount-1?g=this.getScroll(b,j,b.currSlide,i):(g=this.getDim(b,b.currSlide,j),f=this.genCallback(b,e,j,f));h[j?"top":"left"]=e?"-="+g:"+="+g,b.throttleSpeed&&(k=g/a(b.slides[0])[j?"height":"width"]()*b.speed),b._carouselWrap.animate(h,k,b.easing,f)},getDim:function(b,c,d){var e=a(b.slides[c]);return e[d?"outerHeight":"outerWidth"](!0)},getScroll:function(a,b,c,d){var e,f=0;if(d>0)for(e=c;c+d>e;e++)f+=this.getDim(a,e,b);else for(e=c;e>c+d;e--)f+=this.getDim(a,e,b);return f},genCallback:function(b,c,d,e){return function(){var c=a(b.slides[b.nextSlide]).position(),f=0-c[d?"top":"left"]+(b.carouselOffset||0);b._carouselWrap.css(b.carouselVertical?"top":"left",f),e()}},stopTransition:function(){var a=this.opts();a.slides.stop(!1,!0),a._carouselWrap.stop(!1,!0)},onDestroy:function(){var b=this.opts();b._carouselResizeThrottle&&a(window).off("resize",b._carouselResizeThrottle),b.slides.prependTo(b.container),b._carouselWrap.remove()}}}(jQuery);
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/Ultimate_VC_Addons/assets/min-js/ultimate-params.min.js 
jQuery(document).ready(function(a){var b="",c="",d="",e="",f="",g="";jQuery(".ult-responsive").each(function(h,i){var j=jQuery(this),k=j.attr("data-responsive-json-new"),l=j.data("ultimate-target"),m="",n="",o="",p="",q="",r="";void 0===k&&null==k||a.each(a.parseJSON(k),function(a,b){var c=a;if(void 0!==b&&null!=b){var d=b.split(";");jQuery.each(d,function(a,b){if(void 0!==b||null!=b){var d=b.split(":");switch(d[0]){case"large_screen":m+=c+":"+d[1]+";";break;case"desktop":n+=c+":"+d[1]+";";break;case"tablet":o+=c+":"+d[1]+";";break;case"tablet_portrait":p+=c+":"+d[1]+";";break;case"mobile_landscape":q+=c+":"+d[1]+";";break;case"mobile":r+=c+":"+d[1]+";"}}})}}),""!=r&&(g+=l+"{"+r+"}"),""!=q&&(f+=l+"{"+q+"}"),""!=p&&(e+=l+"{"+p+"}"),""!=o&&(d+=l+"{"+o+"}"),""!=n&&(c+=l+"{"+n+"}"),""!=m&&(b+=l+"{"+m+"}")});var h="<style>/** Ultimate: Media Responsive **/ ";h+=c,h+="@media (max-width: 1199px) { "+d+"}",h+="@media (max-width: 991px)  { "+e+"}",h+="@media (max-width: 767px)  { "+f+"}",h+="@media (max-width: 479px)  { "+g+"}",h+="/** Ultimate: Media Responsive - **/</style>",jQuery("head").append(h)});
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/Ultimate_VC_Addons/assets/min-js/jquery-appear.min.js 
!function(a){a.fn.bsf_appear=function(b,c){var d=a.extend({data:void 0,one:!0,accX:0,accY:0},c);return this.each(function(){var c=a(this);if(c.bsf_appeared=!1,!b)return void c.trigger("bsf_appear",d.data);var e=a(window),f=function(){if(!c.is(":visible"))return void(c.bsf_appeared=!1);var a=e.scrollLeft(),b=e.scrollTop(),f=c.offset(),g=f.left,h=f.top,i=d.accX,j=d.accY,k=c.height(),l=e.height(),m=c.width(),n=e.width();h+k+j>=b&&h<=b+l+j&&g+m+i>=a&&g<=a+n+i?c.bsf_appeared||c.trigger("bsf_appear",d.data):c.bsf_appeared=!1},g=function(){if(c.bsf_appeared=!0,d.one){e.unbind("scroll",f);var g=a.inArray(f,a.fn.bsf_appear.checks);g>=0&&a.fn.bsf_appear.checks.splice(g,1)}b.apply(this,arguments)};d.one?c.one("bsf_appear",d.data,g):c.bind("bsf_appear",d.data,g),e.scroll(f),a.fn.bsf_appear.checks.push(f),f()})},a.extend(a.fn.bsf_appear,{checks:[],timeout:null,checkAll:function(){var b=a.fn.bsf_appear.checks.length;if(b>0)for(;b--;)a.fn.bsf_appear.checks[b]()},run:function(){a.fn.bsf_appear.timeout?(clearTimeout(a.fn.bsf_appear.timeout),a.fn.bsf_appear.timeout=setTimeout(a.fn.bsf_appear.checkAll,20)):a.fn.bsf_appear.timeout=setTimeout(a.fn.bsf_appear.checkAll,20)}}),a.each(["append","prepend","after","before","attr","removeAttr","addClass","removeClass","toggleClass","remove","css","show","hide"],function(b,c){var d=a.fn[c];d&&(a.fn[c]=function(){var b=d.apply(this,arguments);return a.fn.bsf_appear.run(),b})})}(jQuery);
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/Ultimate_VC_Addons/assets/min-js/custom.min.js 
!function(a){"use strict";function b(a,b,c){if("img"===c){var d=parseInt(b.outerHeight()),e=d/2;a.css("padding-top",e+"px"),a.parent().css("margin-top",e+20+"px"),b.css("top",-d+"px")}else{var d=parseInt(b.outerHeight()),e=d/2;a.css("padding-top",e+"px"),a.parent().css("margin-top",e+20+"px"),b.css("top",-d+"px")}}function c(b){b.find(".timeline-icon-block").length>0&&a(".timeline-block").each(function(b,c){var d=a(this).find(".timeline-header-block"),e=a(this).find(".timeline-icon-block");e.css({position:"absolute"});var f=e.outerHeight(),g=e.outerWidth(),h=-g/2;parseInt(d.find(".timeline-header").css("padding-left").replace(/[^\d.]/g,""));a(this).hasClass("timeline-post-left")?e.css({left:h,right:"auto"}):a(this).hasClass("timeline-post-right")&&e.css({left:"auto",right:h});var i=d.height(),j=i/2,k=f/2,l=j-k;e.css({top:l});var m=e.offset().left,n=a(window).width();(0>m||n<m+g)&&(e.css({position:"relative",top:"auto",left:"auto",right:"auto","text-align":"center"}),e.children().children().css({margin:"10px auto"}),d.css({padding:"0"}))})}function d(){jQuery(".ult-animation").each(function(){if(jQuery(this).attr("data-animate")){var a=jQuery(this).children("*"),b=jQuery(this).attr("data-animate"),c=jQuery(this).attr("data-animation-duration")+"s",d=jQuery(this).attr("data-animation-iteration"),f=jQuery(this).attr("data-animation-delay"),g=(jQuery(this).attr("data-opacity_start_effect"),"opacity:1;-webkit-animation-delay:"+f+"s;-webkit-animation-duration:"+c+";-webkit-animation-iteration-count:"+d+"; -moz-animation-delay:"+f+"s;-moz-animation-duration:"+c+";-moz-animation-iteration-count:"+d+"; animation-delay:"+f+"s;animation-duration:"+c+";animation-iteration-count:"+d+";"),h="opacity:1;-webkit-transition-delay: "+f+"s; -moz-transition-delay: "+f+"s; transition-delay: "+f+"s;";if(e(jQuery(this))){var i=jQuery(this).attr("style");void 0===i&&(i="test"),i=i.replace(/ /g,""),"opacity:0;"==i&&0!==i.indexOf(h)&&jQuery(this).attr("style",h),jQuery.each(a,function(a,c){var d=jQuery(c),f=d.attr("style");void 0===f&&(f="test");var h="";h=0==f.indexOf(g)?f:g+f,d.attr("style",h),e(d)&&d.addClass("animated").addClass(b)})}}})}function e(a){var b=jQuery(window).scrollTop(),c=jQuery(window).height();if(jQuery(a).hasClass("ult-animate-viewport"))var d=jQuery(a).data("opacity_start_effect");if(void 0===d||""==d)var e=2;else var e=100-d;jQuery(a).outerHeight();return jQuery(a).offset().top-b<=c-c*(e/100)}function f(){jQuery(".ult-new-ib").each(function(a,b){var c=jQuery(this);if(c.hasClass("ult-ib-resp")){var d=jQuery(document).width(),e=c.data("min-width");d<=c.data("max-width")&&d>=e?c.find(".ult-new-ib-content").hide():c.find(".ult-new-ib-content").show()}})}function g(){var b="";a(".ult-spacer").each(function(c,d){var e=a(d).data("id"),f=(a("body").width(),a(d).data("height-mobile")),g=a(d).data("height-mobile-landscape"),h=a(d).data("height-tab"),i=a(d).data("height-tab-portrait"),j=a(d).data("height");""!=j&&(b+=" .spacer-"+e+" { height:"+j+"px } "),""==h&&"0"!=h&&0!=h||(b+=" @media (max-width: 1199px) { .spacer-"+e+" { height:"+h+"px } } "),void 0===i||""==i&&"0"!=i&&0!=i||(b+=" @media (max-width: 991px) { .spacer-"+e+" { height:"+i+"px } } "),void 0===g||""==g&&"0"!=g&&0!=g||(b+=" @media (max-width: 767px) { .spacer-"+e+" { height:"+g+"px } } "),""==f&&"0"!=f&&0!=f||(b+=" @media (max-width: 479px) { .spacer-"+e+" { height:"+f+"px } } ")}),""!=b&&(b="<style>"+b+"</style>",a("head").append(b))}a.fn.vc_translate_row=function(){var b=a(window).scrollTop(),c=a(window).height();a(this).each(function(d,e){var f=a(e).attr("data-row-effect-mobile-disable");if(f=void 0===f?"false":f.toString(),/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))var g="true";else var g="false";if("true"==g&&"true"==f)var h="true";else var h="false";if("false"==h){var i=a(e).outerHeight(),j=a(e).offset().top,k=j-b,l=k+i,m=a(e).attr("data-parallax-content-sense"),n=m/100,o=0;if(l<=c-0*c&&k<=0){if(i>c)var o=(c-l)*n;else var o=-k*n;o<0&&(o=0)}else o=0;a(e).find(".vc-row-translate-wrapper").children().each(function(b,c){jQuery(c).is(".upb_row_bg,.upb_video-wrapper,.ult-vc-seperator,.ult-easy-separator-wrapper")||a(c).css({transform:"translate3d(0,"+o+"px,0)","-webkit-transform":"translate3d(0,"+o+"px,0)","-ms-transform":"translate3d(0,"+o+"px,0)"})})}})},a.fn.vc_fade_row=function(){var b=a(window).scrollTop(),c=a(window).height();a(this).each(function(d,e){var f=a(e).attr("data-row-effect-mobile-disable");if(f=void 0===f?"false":f.toString(),/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))var g="true";else var g="false";if("true"==g&&"true"==f)var h="true";else var h="false";if("false"==h){var i=a(e).data("fadeout-percentage");i=100-i;var j=a(e).outerHeight(),k=a(e).offset().top,l=k-b,m=l+j,n=1,o=c-c*(i/100),p=(o-m)/o*1;p>0&&(n=1-p),m<=o?(n<0?n=0:n>1&&(n=1),a(e).children().each(function(b,c){a(c).is(".upb_row_bg,.upb_video-wrapper,.ult-vc-seperator")||a(c).css({opacity:n})})):a(e).children().each(function(b,c){a(c).css({opacity:n})})}})},jQuery(document).ready(function(){g()}),jQuery(window).scroll(function(){var b=jQuery(".ult-no-mobile").length;/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&b>=1?jQuery(".ult-animation").css("opacity",1):d(),a(".vc-row-fade").vc_fade_row(),a(".vc-row-translate").vc_translate_row()}),jQuery(window).load(function(){function b(){return"ontouchstart"in window||navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0}jQuery(".ult-banner-block-custom-height").each(function(a,b){var c=jQuery(this).find("img"),d=jQuery(this).width(),e=jQuery(this).height();c.width();d>e&&c.css({width:"100%",height:"auto"})}),jQuery(".ult-new-ib").each(function(a,c){b()&&jQuery(this).find(".ult-new-ib-link").click(function(a){a.preventDefault();var b=jQuery(this).attr("href"),c=jQuery(this).data("touch-delay");null==c&&(c=200),setTimeout(function(){window.location=b},c)})});var d=0,e=0,g=function(){jQuery(".ifb-jq-height").each(function(){jQuery(this).find(".ifb-back").css("height","auto"),jQuery(this).find(".ifb-front").css("height","auto");var a=parseInt(jQuery(this).find(".ifb-front > div").outerHeight(!0)),b=parseInt(jQuery(this).find(".ifb-back > div").outerHeight(!0)),c=a>b?a:b;jQuery(this).find(".ifb-front").css("height",c+"px"),jQuery(this).find(".ifb-back").css("height",c+"px"),jQuery(this).hasClass("vertical_door_flip")?jQuery(this).find(".ifb-flip-box").css("height",c+"px"):jQuery(this).hasClass("horizontal_door_flip")?jQuery(this).find(".ifb-flip-box").css("height",c+"px"):jQuery(this).hasClass("style_9")&&jQuery(this).find(".ifb-flip-box").css("height",c+"px")}),jQuery(".ifb-auto-height").each(function(){if(jQuery(this).hasClass("horizontal_door_flip")||jQuery(this).hasClass("vertical_door_flip")){var a=parseInt(jQuery(this).find(".ifb-front > div").outerHeight()),b=parseInt(jQuery(this).find(".ifb-back > div").outerHeight()),c=a>b?a:b;jQuery(this).find(".ifb-flip-box").css("height",c+"px")}})};-1!=navigator.userAgent.indexOf("Safari")&&-1==navigator.userAgent.indexOf("Chrome")?setTimeout(function(){g()},500):g(),jQuery(document).on("ultAdvancedTabClicked",function(a,b){g()}),jQuery(window).resize(function(){d++,setTimeout(function(){e++,d==e&&g()},500)});var h=0;jQuery(window).resize(function(){f(),jQuery(".csstime.smile-icon-timeline-wrap").each(function(){c(jQuery(this))}),a(".jstime .timeline-wrapper").each(function(){c(jQuery(this))}),"none"==jQuery(".smile-icon-timeline-wrap.jstime .timeline-line").css("display")?0===h&&(a(".jstime .timeline-wrapper").masonry("destroy"),h=1):1==h&&(jQuery(".jstime .timeline-wrapper").masonry({itemSelector:".timeline-block"}),setTimeout(function(){jQuery(".jstime .timeline-wrapper").masonry({itemSelector:".timeline-block",width:"401px"}),jQuery(this).find(".timeline-block").each(function(){jQuery(this).css("left","initial"),"0px"==jQuery(this).css("left")?jQuery(this).addClass("timeline-post-left"):jQuery(this).addClass("timeline-post-right")}),h=0},300))}),a(".smile-icon-timeline-wrap").each(function(){var b=jQuery(this).data("timeline-cutom-width");b&&jQuery(this).css("width",2*b+40+"px");var d=parseInt(jQuery(this).width()),e=parseInt(jQuery(this).find(".timeline-block").width()),f=d-2*e-40;f=f/d*100,a(".jstime .timeline-wrapper").each(function(){jQuery(this).masonry({itemSelector:".timeline-block"})}),setTimeout(function(){a(".jstime .timeline-wrapper").each(function(){jQuery(this).find(".timeline-block").each(function(){"0px"==jQuery(this).css("left")?jQuery(this).addClass("timeline-post-left"):jQuery(this).addClass("timeline-post-right"),c(jQuery(this))}),jQuery(".timeline-block").each(function(){var a=parseInt(jQuery(this).css("top"))-parseInt(jQuery(this).next().css("top"));a<14&&a>0||0==a?jQuery(this).next().addClass("time-clash-right"):a>-14&&jQuery(this).next().addClass("time-clash-left")})}),jQuery(".timeline-post-right").each(function(){var a=jQuery(this).find(".timeline-icon-block").clone();jQuery(this).find(".timeline-icon-block").remove(),jQuery(this).find(".timeline-header-block").after(a)}),jQuery(".smile-icon-timeline-wrap").each(function(){var a=jQuery(this).data("time_block_bg_color");jQuery(this).find(".timeline-block").css("background-color",a),jQuery(this).find(".timeline-post-left.timeline-block l").css("border-left-color",a),jQuery(this).find(".timeline-post-right.timeline-block l").css("border-right-color",a),jQuery(this).find(".feat-item").css("background-color",a),jQuery(this).find(".feat-item").find(".feat-top").length>0?jQuery(this).find(".feat-item l").css("border-top-color",a):jQuery(this).find(".feat-item l").css("border-bottom-color",a),jQuery(".jstime.timeline_preloader").remove(),jQuery(this).find("div").hasClass("timeline-wrapper")?jQuery(this).css("opacity","1"):jQuery(this).remove()})},1e3),jQuery(this).find(".timeline-line ").next().hasClass("timeline-separator-text")||jQuery(this).find(".timeline-line").prepend("<span></span>");var g=jQuery(this).data("time_sep_color"),h=jQuery(this).data("time_sep_bg_color"),i=jQuery(".smile-icon-timeline-wrap .timeline-line").css("border-right-color");jQuery(this).find(".timeline-dot").css("background-color",h),jQuery(this).find(".timeline-line span").css("background-color",h),jQuery(this).find(".timeline-line span").css("background-color",h),jQuery(this).find(".timeline-separator-text").css("color",g),jQuery(this).find(".timeline-separator-text .sep-text").css("background-color",h),jQuery(this).find(".ult-timeline-arrow s").css("border-color","rgba(255, 255, 255, 0) "+i),jQuery(this).find(".feat-item .ult-timeline-arrow s").css("border-color",i+" rgba(255, 255, 255, 0)"),jQuery(this).find(".timeline-block").css("border-color",i),jQuery(this).find(".feat-item").css("border-color",i)})}),jQuery(document).ready(function(a){var e=jQuery(".ult-no-mobile").length;/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&e>=1?jQuery(".ult-animation").css("opacity",1):d(),f(),jQuery(".ubtn").hover(function(){var a=jQuery(this);a.find(".ubtn-text").css("color",a.data("hover")),a.find(".ubtn-hover").css("background",a.data("hover-bg")).addClass("ubtn-hover-active");var b=""!=a.data("hover-bg")&&a.data("hover-bg");setTimeout(function(){!1!==b&&a.hasClass(".ubtn-fade-bg")&&a.css("background",a.data("hover-bg"))},150);var c=a.attr("style");if(""!=a.data("shadow-hover")){a.css("box-shadow");c+="box-shadow:"+a.data("shadow-hover")}if(a.attr("style",c),""!=a.data("border-hover")&&a.css("border-color",a.data("border-hover")),"none"!=a.data("shadow-click")){var d=a.data("shd-shadow")-3;""!=a.is(".shd-left")?a.css({right:d}):""!=a.is(".shd-right")?a.css({left:d}):""!=a.is(".shd-top")?a.css({bottom:d}):""!=a.is(".shd-bottom")&&a.css({top:d})}},function(){var a=jQuery(this);a.find(".ubtn-text").removeAttr("style"),a.find(".ubtn-hover").removeClass("ubtn-hover-active"),a.css("background",a.data("bg"));var b=a.data("border-color"),c=a.attr("style");""!=a.data("shadow-hover")&&(c+="box-shadow:"+a.data("shadow")),a.attr("style",c),""!=a.data("border-hover")&&a.css("border-color",b),"none"!=a.data("shadow-click")&&(a.removeClass("no-ubtn-shadow"),""!=a.is(".shd-left")?a.css({right:"auto"}):""!=a.is(".shd-right")?a.css({left:"auto"}):""!=a.is(".shd-top")?a.css({bottom:"auto"}):""!=a.is(".shd-bottom")&&a.css({top:"auto"}))}),jQuery(".ubtn").on("focus blur mousedown mouseup",function(a){var b=jQuery(this);"none"!=b.data("shadow-click")&&setTimeout(function(){b.is(":focus")?(b.addClass("no-ubtn-shadow"),""!=b.is(".shd-left")?b.css({right:b.data("shd-shadow")+"px"}):""!=b.is(".shd-right")?b.css({left:b.data("shd-shadow")+"px"}):""!=b.is(".shd-top")?b.css({bottom:b.data("shd-shadow")+"px"}):""!=b.is(".shd-bottom")&&b.css({top:b.data("shd-shadow")+"px"})):(b.removeClass("no-ubtn-shadow"),""!=b.is(".shd-left")?b.css({right:"auto"}):""!=b.is(".shd-right")?b.css({left:"auto"}):""!=b.is(".shd-top")?b.css({bottom:"auto"}):""!=b.is(".shd-bottom")&&b.css({top:"auto"}))},0)}),jQuery(".ubtn").focusout(function(){var a=jQuery(this);a.removeClass("no-ubtn-shadow"),""!=a.is(".shd-left")?a.css({right:"auto"}):""!=a.is(".shd-right")?a.css({left:"auto"}):""!=a.is(".shd-top")?a.css({bottom:"auto"}):""!=a.is(".shd-bottom")&&a.css({top:"auto"})}),jQuery(".smile-icon-timeline-wrap.jstime").css("opacity","0"),jQuery(".jstime.timeline_preloader").css("opacity","1"),jQuery(".smile-icon-timeline-wrap.csstime .timeline-wrapper").each(function(){jQuery(".csstime .timeline-block:even").addClass("timeline-post-left"),jQuery(".csstime .timeline-block:odd").addClass("timeline-post-right")}),jQuery(".csstime .timeline-post-right").each(function(){jQuery(this).css("float","right"),jQuery("<div style='clear:both'></div>").insertAfter(jQuery(this))}),jQuery(".csstime.smile-icon-timeline-wrap").each(function(){var a=jQuery(this).data("time_block_bg_color");jQuery(this).find(".timeline-block").css("background-color",a),jQuery(this).find(".timeline-post-left.timeline-block l").css("border-left-color",a),jQuery(this).find(".timeline-post-right.timeline-block l").css("border-right-color",a),jQuery(this).find(".feat-item").css("background-color",a),jQuery(this).find(".feat-item").find(".feat-top").length>0?jQuery(this).find(".feat-item l").css("border-top-color",a):jQuery(this).find(".feat-item l").css("border-bottom-color",a),c(jQuery(this))}),jQuery(".aio-icon, .aio-icon-img, .flip-box, .ultb3-info, .icon_list_icon, .ult-banner-block, .uavc-list-icon, .ult_tabs, .icon_list_connector").each(function(){if(jQuery(this).attr("data-animation")){var b=jQuery(this).attr("data-animation"),c="delay-"+jQuery(this).attr("data-animation-delay");if(void 0===b||""===b)return!1;a(this).bsf_appear(function(){var a=jQuery(this);a.addClass("animated").addClass(b),a.addClass("animated").addClass(c)})}}),jQuery(".stats-block").each(function(){a(this).bsf_appear(function(){var a=parseFloat(jQuery(this).find(".stats-number").data("counter-value")),b=jQuery(this).find(".stats-number").data("counter-value")+" ",c=parseInt(jQuery(this).find(".stats-number").data("speed")),d=jQuery(this).find(".stats-number").data("id"),e=jQuery(this).find(".stats-number").data("separator"),f=jQuery(this).find(".stats-number").data("decimal"),g=b.split(".");g=g[1]?g[1].length-1:0;var h=!0;"none"==f&&(f=""),h="none"!=e;var i={useEasing:!0,useGrouping:h,separator:e,decimal:f},j=new countUp(d,0,a,g,c,i);setTimeout(function(){j.start()},500)})}),/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?jQuery(".ifb-flip-box").on("click",function(a){var b=jQuery(this);b.hasClass("ifb-hover")?b.removeClass("ifb-hover"):b.addClass("ifb-hover")}):jQuery(document).on("mouseenter mouseleave hover",".ifb-flip-box",function(a){var b=jQuery(this);b.hasClass("ifb-hover")?b.removeClass("ifb-hover"):b.addClass("ifb-hover")}),jQuery(".ifb-flip-box").each(function(a,b){jQuery(this).parent().hasClass("style_9")&&(jQuery(this).hover(function(){jQuery(this).addClass("ifb-door-hover")},function(){jQuery(this).removeClass("ifb-door-hover")}),jQuery(this).on("click",function(){jQuery(this).toggleClass("ifb-door-right-open"),jQuery(this).removeClass("ifb-door-hover")}))}),jQuery(document).on("click",".ifb-flip-box",function(a){a.stopPropagation(),jQuery(document).trigger("ultFlipBoxClicked",jQuery(this))}),jQuery(".vertical_door_flip .ifb-front").each(function(){jQuery(this).wrap('<div class="v_door ifb-multiple-front ifb-front-1"></div>'),jQuery(this).parent().clone().removeClass("ifb-front-1").addClass("ifb-front-2").insertAfter(jQuery(this).parent())}),jQuery(".reverse_vertical_door_flip .ifb-back").each(function(){jQuery(this).wrap('<div class="rv_door ifb-multiple-back ifb-back-1"></div>'),jQuery(this).parent().clone().removeClass("ifb-back-1").addClass("ifb-back-2").insertAfter(jQuery(this).parent())}),jQuery(".horizontal_door_flip .ifb-front").each(function(){jQuery(this).wrap('<div class="h_door ifb-multiple-front ifb-front-1"></div>'),jQuery(this).parent().clone().removeClass("ifb-front-1").addClass("ifb-front-2").insertAfter(jQuery(this).parent())}),jQuery(".reverse_horizontal_door_flip .ifb-back").each(function(){jQuery(this).wrap('<div class="rh_door ifb-multiple-back ifb-back-1"></div>'),jQuery(this).parent().clone().removeClass("ifb-back-1").addClass("ifb-back-2").insertAfter(jQuery(this).parent())}),jQuery(".style_9 .ifb-front").each(function(){jQuery(this).wrap('<div class="new_style_9 ifb-multiple-front ifb-front-1"></div>'),jQuery(this).parent().clone().removeClass("ifb-front-1").addClass("ifb-front-2").insertAfter(jQuery(this).parent())}),jQuery(".style_9 .ifb-back").each(function(){jQuery(this).wrap('<div class="new_style_9 ifb-multiple-back ifb-back-1"></div>'),jQuery(this).parent().clone().removeClass("ifb-back-1").addClass("ifb-back-2").insertAfter(jQuery(this).parent())}),/^((?!chrome).)*safari/i.test(navigator.userAgent)&&(jQuery(".vertical_door_flip").each(function(a,b){var c=jQuery(this).find(".flip_link").outerHeight();jQuery(this).find(".flip_link").css("top",-c/2+"px"),jQuery(this).find(".ifb-multiple-front").css("width","50.2%")}),jQuery(".horizontal_door_flip").each(function(a,b){var c=jQuery(this).find(".flip_link").outerHeight();jQuery(this).find(".flip_link").css("top",-c/2+"px"),jQuery(this).find(".ifb-multiple-front").css("height","50.2%")}),jQuery(".reverse_vertical_door_flip").each(function(a,b){var c=jQuery(this).find(".flip_link").outerHeight();jQuery(this).find(".flip_link").css("top",-c/2+"px")}),jQuery(".reverse_horizontal_door_flip").each(function(a,b){var c=jQuery(this).find(".flip_link").outerHeight();jQuery(this).find(".flip_link").css("top",-c/2+"px"),jQuery(this).find(".ifb-back").css("position","inherit")})),jQuery(".square_box-icon").each(function(a,c){var d=jQuery(this);if(jQuery(this).find(".aio-icon-img").length>0){var e=jQuery(this).find(".aio-icon-img");b(d,e,"img"),e.find(".img-icon").load(function(){b(d,e,"icon")})}else{var e=jQuery(this).find(".aio-icon");b(d,e,"icon"),jQuery(window).load(function(){b(d,e,"icon")})}})})}(jQuery),jQuery(document).ready(function(){function a(){jQuery(".ult-new-ib").each(function(a,b){var c=jQuery(this).data("min-height")||"";jQuery(this).find(".ult-new-ib-img").data("min-height"),jQuery(this).find(".ult-new-ib-img").data("max-width");if(""!=c){jQuery(this).addClass("ult-ib2-min-height"),jQuery(this).css("height",c),jQuery(this).find(".ult-new-ib-img").removeClass("ult-ib2-toggle-size");var d=(jQuery(this).find(".ult-new-ib-img").width(),jQuery(this).find(".ult-new-ib-img").height());(jQuery(this).width()<=c||d<c)&&jQuery(this).find(".ult-new-ib-img").addClass("ult-ib2-toggle-size")}jQuery(this).hover(function(){jQuery(this).find(".ult-new-ib-img").css("opacity",jQuery(this).data("hover-opacity"))},function(){jQuery(this).find(".ult-new-ib-img").css("opacity",jQuery(this).data("opacity"))})})}a(),jQuery(window).load(function(){a()}),jQuery(window).resize(function(){a()})}),jQuery(document).ready(function(){function a(){jQuery(".ultimate-map-wrapper").each(function(a,b){var c=jQuery(b).attr("id");if(void 0===c||""===c)return!1;var d=jQuery(b).find(".ultimate_google_map").attr("id"),e=jQuery("#"+d).attr("data-map_override");jQuery("#"+d).css({"margin-left":0}),jQuery("#"+d).css({right:0});var f=jQuery("#"+c).parent();if("full"==e&&(f=jQuery("body"),"false"),"ex-full"==e&&(f=jQuery("html"),"false"),!isNaN(e))for(var a=0;a<e&&"HTML"!=f.prop("tagName");a++)f=f.parent();if(0==e||"0"==e)var g=f.width();else var g=f.outerWidth();var h=f.offset().left,i=jQuery("#"+d).offset().left,j=h-i;if(jQuery("#"+d).css({width:g}),0==e&&"0"==e||jQuery("#"+d).css({"margin-left":j}),"full"==e&&jQuery("body").hasClass("rtl")){var k=jQuery("#"+d),l=jQuery(window).width()-(k.offset().left+k.outerWidth());jQuery("#"+d).css({right:-l})}})}a(),jQuery(window).load(function(){a()}),jQuery(window).resize(function(){a()}),jQuery(".ui-tabs").bind("tabsactivate",function(b,c){jQuery(this).find(".ultimate-map-wrapper").length>0&&a()}),jQuery(".ui-accordion").bind("accordionactivate",function(b,c){jQuery(this).find(".ultimate-map-wrapper").length>0&&a()}),jQuery(document).on("onUVCModalPopupOpen",function(){a()}),jQuery(document).on("UVCMapResize",function(){a()})});
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/Ultimate_VC_Addons/assets/min-js/headings.min.js 
!function(a){function b(){var a=0;$jh(".uvc-heading").each(function(){var b,c,d,e=$jh(this).outerWidth(),f=$jh(this).attr("data-hline_width"),g=$jh(this).attr("data-hicon_type"),h=$jh(this).attr("data-halign"),i=$jh(this).attr("data-hspacer");if(left_rtl="left",right_rtl="right",jQuery("body").hasClass("rtl")&&(left_rtl="right",right_rtl="left"),"line_with_icon"==i){var j=$jh(this).attr("id");a=$jh(this).attr("data-hfixer"),a=void 0===a||""===a?0:parseInt(a);var k=e/2;$jh(this).find(".dynamic_ultimate_heading_css").remove(),d="auto"==f||f>e?e:f;var l=d/2;"selector"==g?(c=$jh(this).find(".aio-icon").outerWidth(),b=$jh(this).find(".aio-icon").outerHeight()):(c=$jh(this).find(".aio-icon-img").outerWidth(),b=$jh(this).find(".aio-icon-img").outerHeight());var m=c/2,n=k-m+c+a,o=l;if(b+=3,$jh(this).find(".uvc-heading-spacer").height(b),"center"==h){$jh(this).find(".aio-icon-img").css({margin:"0 auto"});var p="#"+j+" .uvc-heading-spacer.line_with_icon:before{"+right_rtl+":"+n+"px;}#"+j+" .uvc-heading-spacer.line_with_icon:after{"+left_rtl+":"+n+"px;}"}else if("left"==h){$jh(this).find(".aio-icon-img").css({float:h});var p="";p=""!=d?"#"+j+" .uvc-heading-spacer.line_with_icon:before{left:"+(c+a)+"px;right:auto;}#"+j+" .uvc-heading-spacer.line_with_icon:after{left:"+(o+c+a)+"px;right:auto;}":"#"+j+" .uvc-heading-spacer.line_with_icon:before{right:"+(n-c-2*a)+"px;}#"+j+" .uvc-heading-spacer.line_with_icon:after{left:"+(n-a)+"px;}"}else if("right"==h){$jh(this).find(".aio-icon-img").css({float:h});var p="";p=""!=d?"#"+j+" .uvc-heading-spacer.line_with_icon:before{right:"+(c+a)+"px;left:auto;}#"+j+" .uvc-heading-spacer.line_with_icon:after{right:"+(o+c+a)+"px;left:auto;}":"#"+j+" .uvc-heading-spacer.line_with_icon:before{right:"+(n-a)+"px;}#"+j+" .uvc-heading-spacer.line_with_icon:after{left:"+(n-c-2*a)+"px;}"}var q=$jh(this).attr("data-hborder_style"),r=$jh(this).attr("data-hborder_color"),s=$jh(this).attr("data-hborder_height");"auto"==f&&"center"==h&&(o=Math.floor(o-c+a));var t='<div class="dynamic_ultimate_heading_css"><style>#'+j+" .uvc-heading-spacer.line_with_icon:before, #"+j+" .uvc-heading-spacer.line_with_icon:after{width:"+o+"px;border-style:"+q+";border-color:"+r+";border-bottom-width:"+s+"px;}"+p+"</style></div>";$jh(this).prepend(t)}else"line_only"==i&&("right"==h||"left"==h?$jh(this).find(".uvc-heading-spacer").find(".uvc-headings-line").css({float:h}):$jh(this).find(".uvc-heading-spacer").find(".uvc-headings-line").css({margin:"0 auto"}))})}$jh=a.noConflict(),$jh(document).ready(function(a){b(),$jh(window).resize(function(a){b()})}),a(window).load(function(a){b(),jQuery(".ult_exp_section").select(function(){jQuery(this).parent().find(".uvc-heading").length>0&&b()})})}(jQuery);
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/Ultimate_VC_Addons/assets/min-js/slick.min.js 
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function b(b,d){var e,f=this;f.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(b),appendDots:a(b),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(b,c){return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},f.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(f,f.initials),f.activeBreakpoint=null,f.animType=null,f.animProp=null,f.breakpoints=[],f.breakpointSettings=[],f.cssTransitions=!1,f.focussed=!1,f.interrupted=!1,f.hidden="hidden",f.paused=!0,f.positionProp=null,f.respondTo=null,f.rowCount=1,f.shouldClick=!0,f.$slider=a(b),f.$slidesCache=null,f.transformType=null,f.transitionType=null,f.visibilityChange="visibilitychange",f.windowWidth=0,f.windowTimer=null,e=a(b).data("slick")||{},f.options=a.extend({},f.defaults,d,e),f.currentSlide=f.options.initialSlide,f.originalSettings=f.options,void 0!==document.mozHidden?(f.hidden="mozHidden",f.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(f.hidden="webkitHidden",f.visibilityChange="webkitvisibilitychange"),f.autoPlay=a.proxy(f.autoPlay,f),f.autoPlayClear=a.proxy(f.autoPlayClear,f),f.autoPlayIterator=a.proxy(f.autoPlayIterator,f),f.changeSlide=a.proxy(f.changeSlide,f),f.clickHandler=a.proxy(f.clickHandler,f),f.selectHandler=a.proxy(f.selectHandler,f),f.setPosition=a.proxy(f.setPosition,f),f.swipeHandler=a.proxy(f.swipeHandler,f),f.dragHandler=a.proxy(f.dragHandler,f),f.keyHandler=a.proxy(f.keyHandler,f),f.instanceUid=c++,f.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,f.registerBreakpoints(),f.init(!0)}var c=0;return b}(),b.prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):!0===d?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&!0===a.options.adaptiveHeight&&!1===a.options.vertical){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),!0===e.options.rtl&&!1===e.options.vertical&&(b=-b),!1===e.transformsEnabled?!1===e.options.vertical?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):!1===e.cssTransitions?(!0===e.options.rtl&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),!1===e.options.vertical?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),!1===e.options.vertical?d[e.animType]="translate3d("+b+"px, 0px, 0px)":d[e.animType]="translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.getNavTarget=function(){var b=this,c=b.options.asNavFor;return c&&null!==c&&(c=a(c).not(b.$slider)),c},b.prototype.asNavFor=function(b){var c=this,d=c.getNavTarget();null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};!1===b.options.fade?c[b.transitionType]=b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:c[b.transitionType]="opacity "+b.options.speed+"ms "+b.options.cssEase,!1===b.options.fade?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayClear(),a.slideCount>a.options.slidesToShow&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this,b=a.currentSlide+a.options.slidesToScroll;a.paused||a.interrupted||a.focussed||(!1===a.options.infinite&&(1===a.direction&&a.currentSlide+1===a.slideCount-1?a.direction=0:0===a.direction&&(b=a.currentSlide-a.options.slidesToScroll,a.currentSlide-1==0&&(a.direction=1))),a.slideHandler(b))},b.prototype.buildArrows=function(){var b=this;!0===b.options.arrows&&(b.$prevArrow=a(b.options.prevArrow).addClass("slick-arrow"),b.$nextArrow=a(b.options.nextArrow).addClass("slick-arrow"),b.slideCount>b.options.slidesToShow?(b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.prependTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),!0!==b.options.infinite&&b.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},b.prototype.buildDots=function(){var b,c,d=this;if(!0===d.options.dots&&d.slideCount>d.options.slidesToShow){for(d.$slider.addClass("slick-dotted"),c=a("<ul />").addClass(d.options.dotsClass),b=0;b<=d.getDotCount();b+=1)c.append(a("<li />").append(d.options.customPaging.call(this,d,b)));d.$dots=c.appendTo(d.options.appendDots),d.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b).data("originalStyling",a(c).attr("style")||"")}),b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(!0===b.options.centerMode||!0===b.options.swipeToSlide)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),!0===b.options.draggable&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var a,b,c,d,e,f,g,h=this;if(d=document.createDocumentFragment(),f=h.$slider.children(),h.options.rows>1){for(g=h.options.slidesPerRow*h.options.rows,e=Math.ceil(f.length/g),a=0;e>a;a++){var i=document.createElement("div");for(b=0;b<h.options.rows;b++){var j=document.createElement("div");for(c=0;c<h.options.slidesPerRow;c++){var k=a*g+(b*h.options.slidesPerRow+c);f.get(k)&&j.appendChild(f.get(k))}i.appendChild(j)}d.appendChild(i)}h.$slider.empty().append(d),h.$slider.children().children().children().css({width:100/h.options.slidesPerRow+"%",display:"inline-block"})}},b.prototype.checkResponsive=function(b,c){var d,e,f,g=this,h=!1,i=g.$slider.width(),j=window.innerWidth||a(window).width();if("window"===g.respondTo?f=j:"slider"===g.respondTo?f=i:"min"===g.respondTo&&(f=Math.min(j,i)),g.options.responsive&&g.options.responsive.length&&null!==g.options.responsive){e=null;for(d in g.breakpoints)g.breakpoints.hasOwnProperty(d)&&(!1===g.originalSettings.mobileFirst?f<g.breakpoints[d]&&(e=g.breakpoints[d]):f>g.breakpoints[d]&&(e=g.breakpoints[d]));null!==e?null!==g.activeBreakpoint?(e!==g.activeBreakpoint||c)&&(g.activeBreakpoint=e,"unslick"===g.breakpointSettings[e]?g.unslick(e):(g.options=a.extend({},g.originalSettings,g.breakpointSettings[e]),!0===b&&(g.currentSlide=g.options.initialSlide),g.refresh(b)),h=e):(g.activeBreakpoint=e,"unslick"===g.breakpointSettings[e]?g.unslick(e):(g.options=a.extend({},g.originalSettings,g.breakpointSettings[e]),!0===b&&(g.currentSlide=g.options.initialSlide),g.refresh(b)),h=e):null!==g.activeBreakpoint&&(g.activeBreakpoint=null,g.options=g.originalSettings,!0===b&&(g.currentSlide=g.options.initialSlide),g.refresh(b),h=e),b||!1===h||g.$slider.trigger("breakpoint",[g,h])}},b.prototype.changeSlide=function(b,c){var d,e,f,g=this,h=a(b.currentTarget);switch(h.is("a")&&b.preventDefault(),h.is("li")||(h=h.closest("li")),f=g.slideCount%g.options.slidesToScroll!=0,d=f?0:(g.slideCount-g.currentSlide)%g.options.slidesToScroll,b.data.message){case"previous":e=0===d?g.options.slidesToScroll:g.options.slidesToShow-d,g.slideCount>g.options.slidesToShow&&g.slideHandler(g.currentSlide-e,!1,c);break;case"next":e=0===d?g.options.slidesToScroll:d,g.slideCount>g.options.slidesToShow&&g.slideHandler(g.currentSlide+e,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||h.index()*g.options.slidesToScroll;g.slideHandler(g.checkNavigable(i),!1,c),h.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var b,c;if(b=this.getNavigableIndexes(),c=0,a>b[b.length-1])a=b[b.length-1];else for(var d in b){if(a<b[d]){a=c;break}c=b[d]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots&&null!==b.$dots&&a("li",b.$dots).off("click.slick",b.changeSlide).off("mouseenter.slick",a.proxy(b.interrupt,b,!0)).off("mouseleave.slick",a.proxy(b.interrupt,b,!1)),b.$slider.off("focus.slick blur.slick"),!0===b.options.arrows&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.cleanUpSlideEvents(),!0===b.options.accessibility&&b.$list.off("keydown.slick",b.keyHandler),!0===b.options.focusOnSelect&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpSlideEvents=function(){var b=this;b.$list.off("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.cleanUpRows=function(){var a,b=this;b.options.rows>1&&(a=b.$slides.children().children(),a.removeAttr("style"),b.$slider.empty().append(a))},b.prototype.clickHandler=function(a){!1===this.shouldClick&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(b){var c=this;c.autoPlayClear(),c.touchObject={},c.cleanUpEvents(),a(".slick-cloned",c.$slider).detach(),c.$dots&&c.$dots.remove(),c.$prevArrow&&c.$prevArrow.length&&(c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.prevArrow)&&c.$prevArrow.remove()),c.$nextArrow&&c.$nextArrow.length&&(c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.nextArrow)&&c.$nextArrow.remove()),c.$slides&&(c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){a(this).attr("style",a(this).data("originalStyling"))}),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.detach(),c.$list.detach(),c.$slider.append(c.$slides)),c.cleanUpRows(),c.$slider.removeClass("slick-slider"),c.$slider.removeClass("slick-initialized"),c.$slider.removeClass("slick-dotted"),c.unslicked=!0,b||c.$slider.trigger("destroy",[c])},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",!1===b.options.fade?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;!1===c.cssTransitions?(c.$slides.eq(a).css({zIndex:c.options.zIndex}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:c.options.zIndex}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.fadeSlideOut=function(a){var b=this;!1===b.cssTransitions?b.$slides.eq(a).animate({opacity:0,zIndex:b.options.zIndex-2},b.options.speed,b.options.easing):(b.applyTransition(a),b.$slides.eq(a).css({opacity:0,zIndex:b.options.zIndex-2}))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.$slidesCache=b.$slides,b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.focusHandler=function(){var b=this;b.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*:not(.slick-arrow)",function(c){c.stopImmediatePropagation();var d=a(this);setTimeout(function(){b.options.pauseOnFocus&&(b.focussed=d.is(":focus"),b.autoPlay())},0)})},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){return this.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(!0===a.options.infinite)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(!0===a.options.centerMode)d=a.slideCount;else if(a.options.asNavFor)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else d=1+Math.ceil((a.slideCount-a.options.slidesToShow)/a.options.slidesToScroll);return d-1},b.prototype.getLeft=function(a){var b,c,d,e=this,f=0;return e.slideOffset=0,c=e.$slides.first().outerHeight(!0),!0===e.options.infinite?(e.slideCount>e.options.slidesToShow&&(e.slideOffset=e.slideWidth*e.options.slidesToShow*-1,f=c*e.options.slidesToShow*-1),e.slideCount%e.options.slidesToScroll!=0&&a+e.options.slidesToScroll>e.slideCount&&e.slideCount>e.options.slidesToShow&&(a>e.slideCount?(e.slideOffset=(e.options.slidesToShow-(a-e.slideCount))*e.slideWidth*-1,f=(e.options.slidesToShow-(a-e.slideCount))*c*-1):(e.slideOffset=e.slideCount%e.options.slidesToScroll*e.slideWidth*-1,f=e.slideCount%e.options.slidesToScroll*c*-1))):a+e.options.slidesToShow>e.slideCount&&(e.slideOffset=(a+e.options.slidesToShow-e.slideCount)*e.slideWidth,f=(a+e.options.slidesToShow-e.slideCount)*c),e.slideCount<=e.options.slidesToShow&&(e.slideOffset=0,f=0),!0===e.options.centerMode&&!0===e.options.infinite?e.slideOffset+=e.slideWidth*Math.floor(e.options.slidesToShow/2)-e.slideWidth:!0===e.options.centerMode&&(e.slideOffset=0,e.slideOffset+=e.slideWidth*Math.floor(e.options.slidesToShow/2)),b=!1===e.options.vertical?a*e.slideWidth*-1+e.slideOffset:a*c*-1+f,!0===e.options.variableWidth&&(d=e.slideCount<=e.options.slidesToShow||!1===e.options.infinite?e.$slideTrack.children(".slick-slide").eq(a):e.$slideTrack.children(".slick-slide").eq(a+e.options.slidesToShow),b=!0===e.options.rtl?d[0]?-1*(e.$slideTrack.width()-d[0].offsetLeft-d.width()):0:d[0]?-1*d[0].offsetLeft:0,!0===e.options.centerMode&&(d=e.slideCount<=e.options.slidesToShow||!1===e.options.infinite?e.$slideTrack.children(".slick-slide").eq(a):e.$slideTrack.children(".slick-slide").eq(a+e.options.slidesToShow+1),b=!0===e.options.rtl?d[0]?-1*(e.$slideTrack.width()-d[0].offsetLeft-d.width()):0:d[0]?-1*d[0].offsetLeft:0,b+=(e.$list.width()-d.outerWidth())/2)),b},b.prototype.getOption=b.prototype.slickGetOption=function(a){return this.options[a]},b.prototype.getNavigableIndexes=function(){var a,b=this,c=0,d=0,e=[];for(!1===b.options.infinite?a=b.slideCount:(c=-1*b.options.slidesToScroll,d=-1*b.options.slidesToScroll,a=2*b.slideCount);a>c;)e.push(c),c=d+b.options.slidesToScroll,d+=b.options.slidesToScroll<=b.options.slidesToShow?b.options.slidesToScroll:b.options.slidesToShow;return e},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var b,c,d=this;return c=!0===d.options.centerMode?d.slideWidth*Math.floor(d.options.slidesToShow/2):0,!0===d.options.swipeToSlide?(d.$slideTrack.find(".slick-slide").each(function(e,f){return f.offsetLeft-c+a(f).outerWidth()/2>-1*d.swipeLeft?(b=f,!1):void 0}),Math.abs(a(b).attr("data-slick-index")-d.currentSlide)||1):d.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){this.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots(),c.checkResponsive(!0),c.focusHandler()),b&&c.$slider.trigger("init",[c]),!0===c.options.accessibility&&c.initADA(),c.options.autoplay&&(c.paused=!1,c.autoPlay())},b.prototype.initADA=function(){var b=this;b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),b.$slideTrack.attr("role","listbox"),b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c){a(this).attr({role:"option","aria-describedby":"slick-slide"+b.instanceUid+c})}),null!==b.$dots&&b.$dots.attr("role","tablist").find("li").each(function(c){a(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+b.instanceUid+c,id:"slick-slide"+b.instanceUid+c})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),b.activateADA()},b.prototype.initArrowEvents=function(){var a=this;!0===a.options.arrows&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.off("click.slick").on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;!0===b.options.dots&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),!0===b.options.dots&&!0===b.options.pauseOnDotsHover&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.interrupt,b,!0)).on("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.initSlideEvents=function(){var b=this;b.options.pauseOnHover&&(b.$list.on("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.interrupt,b,!1)))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.initSlideEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),!0===b.options.accessibility&&b.$list.on("keydown.slick",b.keyHandler),!0===b.options.focusOnSelect&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;!0===a.options.arrows&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),!0===a.options.dots&&a.slideCount>a.options.slidesToShow&&a.$dots.show()},b.prototype.keyHandler=function(a){var b=this;a.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===a.keyCode&&!0===b.options.accessibility?b.changeSlide({data:{message:!0===b.options.rtl?"next":"previous"}}):39===a.keyCode&&!0===b.options.accessibility&&b.changeSlide({data:{message:!0===b.options.rtl?"previous":"next"}}))},b.prototype.lazyLoad=function(){function b(b){a("img[data-lazy]",b).each(function(){var b=a(this),c=a(this).attr("data-lazy"),d=document.createElement("img");d.onload=function(){b.animate({opacity:0},100,function(){b.attr("src",c).animate({opacity:1},200,function(){b.removeAttr("data-lazy").removeClass("slick-loading")}),g.$slider.trigger("lazyLoaded",[g,b,c])})},d.onerror=function(){b.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),g.$slider.trigger("lazyLoadError",[g,b,c])},d.src=c})}var c,d,e,f,g=this;!0===g.options.centerMode?!0===g.options.infinite?(e=g.currentSlide+(g.options.slidesToShow/2+1),f=e+g.options.slidesToShow+2):(e=Math.max(0,g.currentSlide-(g.options.slidesToShow/2+1)),f=g.options.slidesToShow/2+1+2+g.currentSlide):(e=g.options.infinite?g.options.slidesToShow+g.currentSlide:g.currentSlide,f=Math.ceil(e+g.options.slidesToShow),!0===g.options.fade&&(e>0&&e--,f<=g.slideCount&&f++)),c=g.$slider.find(".slick-slide").slice(e,f),b(c),g.slideCount<=g.options.slidesToShow?(d=g.$slider.find(".slick-slide"),b(d)):g.currentSlide>=g.slideCount-g.options.slidesToShow?(d=g.$slider.find(".slick-cloned").slice(0,g.options.slidesToShow),b(d)):0===g.currentSlide&&(d=g.$slider.find(".slick-cloned").slice(-1*g.options.slidesToShow),b(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.autoPlay(),a.options.autoplay=!0,a.paused=!1,a.focussed=!1,a.interrupted=!1},b.prototype.postSlide=function(a){var b=this;b.unslicked||(b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay&&b.autoPlay(),!0===b.options.accessibility&&b.initADA())},b.prototype.prev=b.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(b){b=b||1;var c,d,e,f=this,g=a("img[data-lazy]",f.$slider);g.length?(c=g.first(),d=c.attr("data-lazy"),e=document.createElement("img"),e.onload=function(){c.attr("src",d).removeAttr("data-lazy").removeClass("slick-loading"),!0===f.options.adaptiveHeight&&f.setPosition(),f.$slider.trigger("lazyLoaded",[f,c,d]),f.progressiveLazyLoad()},e.onerror=function(){3>b?setTimeout(function(){f.progressiveLazyLoad(b+1)},500):(c.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),f.$slider.trigger("lazyLoadError",[f,c,d]),f.progressiveLazyLoad())},e.src=d):f.$slider.trigger("allImagesLoaded",[f])},b.prototype.refresh=function(b){var c,d,e=this;d=e.slideCount-e.options.slidesToShow,!e.options.infinite&&e.currentSlide>d&&(e.currentSlide=d),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),c=e.currentSlide,e.destroy(!0),a.extend(e,e.initials,{currentSlide:c}),e.init(),b||e.changeSlide({data:{message:"index",index:c}},!1)},b.prototype.registerBreakpoints=function(){var b,c,d,e=this,f=e.options.responsive||null;if("array"===a.type(f)&&f.length){e.respondTo=e.options.respondTo||"window";for(b in f)if(d=e.breakpoints.length-1,c=f[b].breakpoint,f.hasOwnProperty(b)){for(;d>=0;)e.breakpoints[d]&&e.breakpoints[d]===c&&e.breakpoints.splice(d,1),d--;e.breakpoints.push(c),e.breakpointSettings[c]=f[b].settings}e.breakpoints.sort(function(a,b){return e.options.mobileFirst?a-b:b-a})}},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.registerBreakpoints(),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.cleanUpSlideEvents(),b.initSlideEvents(),b.checkResponsive(!1,!0),!0===b.options.focusOnSelect&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.setPosition(),b.focusHandler(),b.paused=!b.options.autoplay,b.autoPlay(),b.$slider.trigger("reInit",[b])},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.unslicked||b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=!0===b?0:d.slideCount-1):a=!0===b?--a:a,!(d.slideCount<1||0>a||a>d.slideCount-1)&&(d.unload(),!0===c?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,void d.reinit())},b.prototype.setCSS=function(a){var b,c,d=this,e={};!0===d.options.rtl&&(a=-a),b="left"==d.positionProp?Math.ceil(a)+"px":"0px",c="top"==d.positionProp?Math.ceil(a)+"px":"0px",e[d.positionProp]=a,!1===d.transformsEnabled?d.$slideTrack.css(e):(e={},!1===d.cssTransitions?(e[d.animType]="translate("+b+", "+c+")",d.$slideTrack.css(e)):(e[d.animType]="translate3d("+b+", "+c+", 0px)",d.$slideTrack.css(e)))},b.prototype.setDimensions=function(){var a=this;!1===a.options.vertical?!0===a.options.centerMode&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),!0===a.options.centerMode&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),!1===a.options.vertical&&!1===a.options.variableWidth?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):!0===a.options.variableWidth?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();!1===a.options.variableWidth&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var b,c=this;c.$slides.each(function(d,e){b=c.slideWidth*d*-1,!0===c.options.rtl?a(e).css({position:"relative",right:b,top:0,zIndex:c.options.zIndex-2,opacity:0}):a(e).css({position:"relative",left:b,top:0,zIndex:c.options.zIndex-2,opacity:0})}),c.$slides.eq(c.currentSlide).css({zIndex:c.options.zIndex-1,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&!0===a.options.adaptiveHeight&&!1===a.options.vertical){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(){var b,c,d,e,f,g=this,h=!1;if("object"===a.type(arguments[0])?(d=arguments[0],h=arguments[1],f="multiple"):"string"===a.type(arguments[0])&&(d=arguments[0],e=arguments[1],h=arguments[2],"responsive"===arguments[0]&&"array"===a.type(arguments[1])?f="responsive":void 0!==arguments[1]&&(f="single")),"single"===f)g.options[d]=e;else if("multiple"===f)a.each(d,function(a,b){g.options[a]=b});else if("responsive"===f)for(c in e)if("array"!==a.type(g.options.responsive))g.options.responsive=[e[c]];else{for(b=g.options.responsive.length-1;b>=0;)g.options.responsive[b].breakpoint===e[c].breakpoint&&g.options.responsive.splice(b,1),b--;g.options.responsive.push(e[c])}h&&(g.unload(),g.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),!1===a.options.fade?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=!0===a.options.vertical?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&!0===a.options.useCSS&&(a.cssTransitions=!0),a.options.fade&&("number"==typeof a.options.zIndex?a.options.zIndex<3&&(a.options.zIndex=3):a.options.zIndex=a.defaults.zIndex),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&!1!==a.animType&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=a.options.useTransform&&null!==a.animType&&!1!==a.animType},b.prototype.setSlideClasses=function(a){var b,c,d,e,f=this;c=f.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),f.$slides.eq(a).addClass("slick-current"),!0===f.options.centerMode?(b=Math.floor(f.options.slidesToShow/2),!0===f.options.infinite&&(a>=b&&a<=f.slideCount-1-b?f.$slides.slice(a-b,a+b+1).addClass("slick-active").attr("aria-hidden","false"):(d=f.options.slidesToShow+a,
c.slice(d-b+1,d+b+2).addClass("slick-active").attr("aria-hidden","false")),0===a?c.eq(c.length-1-f.options.slidesToShow).addClass("slick-center"):a===f.slideCount-1&&c.eq(f.options.slidesToShow).addClass("slick-center")),f.$slides.eq(a).addClass("slick-center")):a>=0&&a<=f.slideCount-f.options.slidesToShow?f.$slides.slice(a,a+f.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):c.length<=f.options.slidesToShow?c.addClass("slick-active").attr("aria-hidden","false"):(e=f.slideCount%f.options.slidesToShow,d=!0===f.options.infinite?f.options.slidesToShow+a:a,f.options.slidesToShow==f.options.slidesToScroll&&f.slideCount-a<f.options.slidesToShow?c.slice(d-(f.options.slidesToShow-e),d+e).addClass("slick-active").attr("aria-hidden","false"):c.slice(d,d+f.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===f.options.lazyLoad&&f.lazyLoad()},b.prototype.setupInfinite=function(){var b,c,d,e=this;if(!0===e.options.fade&&(e.options.centerMode=!1),!0===e.options.infinite&&!1===e.options.fade&&(c=null,e.slideCount>e.options.slidesToShow)){for(d=!0===e.options.centerMode?e.options.slidesToShow+1:e.options.slidesToShow,b=e.slideCount;b>e.slideCount-d;b-=1)c=b-1,a(e.$slides[c]).clone(!0).attr("id","").attr("data-slick-index",c-e.slideCount).prependTo(e.$slideTrack).addClass("slick-cloned");for(b=0;d>b;b+=1)c=b,a(e.$slides[c]).clone(!0).attr("id","").attr("data-slick-index",c+e.slideCount).appendTo(e.$slideTrack).addClass("slick-cloned");e.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.interrupt=function(a){var b=this;a||b.autoPlay(),b.interrupted=a},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.setSlideClasses(e),void c.asNavFor(e)):void c.slideHandler(e)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,h,i=null,j=this;return b=b||!1,!0===j.animating&&!0===j.options.waitForAnimate||!0===j.options.fade&&j.currentSlide===a||j.slideCount<=j.options.slidesToShow?void 0:(!1===b&&j.asNavFor(a),d=a,i=j.getLeft(d),g=j.getLeft(j.currentSlide),j.currentLeft=null===j.swipeLeft?g:j.swipeLeft,!1===j.options.infinite&&!1===j.options.centerMode&&(0>a||a>j.getDotCount()*j.options.slidesToScroll)?void(!1===j.options.fade&&(d=j.currentSlide,!0!==c?j.animateSlide(g,function(){j.postSlide(d)}):j.postSlide(d))):!1===j.options.infinite&&!0===j.options.centerMode&&(0>a||a>j.slideCount-j.options.slidesToScroll)?void(!1===j.options.fade&&(d=j.currentSlide,!0!==c?j.animateSlide(g,function(){j.postSlide(d)}):j.postSlide(d))):(j.options.autoplay&&clearInterval(j.autoPlayTimer),e=0>d?j.slideCount%j.options.slidesToScroll!=0?j.slideCount-j.slideCount%j.options.slidesToScroll:j.slideCount+d:d>=j.slideCount?j.slideCount%j.options.slidesToScroll!=0?0:d-j.slideCount:d,j.animating=!0,j.$slider.trigger("beforeChange",[j,j.currentSlide,e]),f=j.currentSlide,j.currentSlide=e,j.setSlideClasses(j.currentSlide),j.options.asNavFor&&(h=j.getNavTarget(),h=h.slick("getSlick"),h.slideCount<=h.options.slidesToShow&&h.setSlideClasses(j.currentSlide)),j.updateDots(),j.updateArrows(),!0===j.options.fade?(!0!==c?(j.fadeSlideOut(f),j.fadeSlide(e,function(){j.postSlide(e)})):j.postSlide(e),void j.animateHeight()):void(!0!==c?j.animateSlide(i,function(){j.postSlide(e)}):j.postSlide(e))))},b.prototype.startLoad=function(){var a=this;!0===a.options.arrows&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),!0===a.options.dots&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?!1===e.options.rtl?"left":"right":360>=d&&d>=315?!1===e.options.rtl?"left":"right":d>=135&&225>=d?!1===e.options.rtl?"right":"left":!0===e.options.verticalSwiping?d>=35&&135>=d?"down":"up":"vertical"},b.prototype.swipeEnd=function(a){var b,c,d=this;if(d.dragging=!1,d.interrupted=!1,d.shouldClick=!(d.touchObject.swipeLength>10),void 0===d.touchObject.curX)return!1;if(!0===d.touchObject.edgeHit&&d.$slider.trigger("edge",[d,d.swipeDirection()]),d.touchObject.swipeLength>=d.touchObject.minSwipe){switch(c=d.swipeDirection()){case"left":case"down":b=d.options.swipeToSlide?d.checkNavigable(d.currentSlide+d.getSlideCount()):d.currentSlide+d.getSlideCount(),d.currentDirection=0;break;case"right":case"up":b=d.options.swipeToSlide?d.checkNavigable(d.currentSlide-d.getSlideCount()):d.currentSlide-d.getSlideCount(),d.currentDirection=1}"vertical"!=c&&(d.slideHandler(b),d.touchObject={},d.$slider.trigger("swipe",[d,c]))}else d.touchObject.startX!==d.touchObject.curX&&(d.slideHandler(d.currentSlide),d.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(!1===b.options.swipe||"ontouchend"in document&&!1===b.options.swipe||!1===b.options.draggable&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,!0===b.options.verticalSwiping&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var b,c,d,e,f,g=this;return f=void 0!==a.originalEvent?a.originalEvent.touches:null,!(!g.dragging||f&&1!==f.length)&&(b=g.getLeft(g.currentSlide),g.touchObject.curX=void 0!==f?f[0].pageX:a.clientX,g.touchObject.curY=void 0!==f?f[0].pageY:a.clientY,g.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(g.touchObject.curX-g.touchObject.startX,2))),!0===g.options.verticalSwiping&&(g.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(g.touchObject.curY-g.touchObject.startY,2)))),c=g.swipeDirection(),"vertical"!==c?(void 0!==a.originalEvent&&g.touchObject.swipeLength>4&&a.preventDefault(),e=(!1===g.options.rtl?1:-1)*(g.touchObject.curX>g.touchObject.startX?1:-1),!0===g.options.verticalSwiping&&(e=g.touchObject.curY>g.touchObject.startY?1:-1),d=g.touchObject.swipeLength,g.touchObject.edgeHit=!1,!1===g.options.infinite&&(0===g.currentSlide&&"right"===c||g.currentSlide>=g.getDotCount()&&"left"===c)&&(d=g.touchObject.swipeLength*g.options.edgeFriction,g.touchObject.edgeHit=!0),!1===g.options.vertical?g.swipeLeft=b+d*e:g.swipeLeft=b+d*(g.$list.height()/g.listWidth)*e,!0===g.options.verticalSwiping&&(g.swipeLeft=b+d*e),!0!==g.options.fade&&!1!==g.options.touchMove&&(!0===g.animating?(g.swipeLeft=null,!1):void g.setCSS(g.swipeLeft))):void 0)},b.prototype.swipeStart=function(a){var b,c=this;return c.interrupted=!0,1!==c.touchObject.fingerCount||c.slideCount<=c.options.slidesToShow?(c.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(b=a.originalEvent.touches[0]),c.touchObject.startX=c.touchObject.curX=void 0!==b?b.pageX:a.clientX,c.touchObject.startY=c.touchObject.curY=void 0!==b?b.pageY:a.clientY,void(c.dragging=!0))},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.remove(),b.$nextArrow&&b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var a=this;Math.floor(a.options.slidesToShow/2),!0===a.options.arrows&&a.slideCount>a.options.slidesToShow&&!a.options.infinite&&(a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&!1===a.options.centerMode?(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-1&&!0===a.options.centerMode&&(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;a.options.autoplay&&(document[a.hidden]?a.interrupted=!0:a.interrupted=!1)},a.fn.slick=function(){var a,c,d=this,e=arguments[0],f=Array.prototype.slice.call(arguments,1),g=d.length;for(a=0;g>a;a++)if("object"==typeof e||void 0===e?d[a].slick=new b(d[a],e):c=d[a].slick[e].apply(d[a].slick,f),void 0!==c)return c;return d}});
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/Ultimate_VC_Addons/assets/min-js/slick-custom.min.js 
!function(a){a(document).ready(function(){a(".ult-carousel-wrapper").each(function(){var b=a(this);if(b.hasClass("ult_full_width")){b.css("left",0),b.css("right",0);var c=b.attr("data-rtl"),d=a("html").outerWidth(),e=b.offset().left,f=Math.abs(0-e),g=f;"true"===c||!0===c?b.css({position:"relative",right:"-"+g+"px",width:d+"px"}):b.css({position:"relative",left:"-"+g+"px",width:d+"px"})}}),a(".ult-carousel-wrapper").each(function(b,c){var d=a(c).data("gutter"),e=a(c).attr("id");if(""!=d){var f="<style>#"+e+" .slick-slide { margin:0 "+d+"px; } </style>";a("head").append(f)}}),a(".ult-carousel-wrapper").on("init",function(b){b.preventDefault(),a(".ult-carousel-wrapper .ult-item-wrap.slick-active").each(function(b,c){$this=a(this),$this.addClass($this.data("animation"))})}),a(".ult-carousel-wrapper").on("beforeChange",function(b,c,d){$inViewPort=a("[data-slick-index='"+d+"']"),$inViewPort.siblings().removeClass($inViewPort.data("animation"))}),a(".ult-carousel-wrapper").on("afterChange",function(b,c,d,e){if(slidesScrolled=c.options.slidesToScroll,slidesToShow=c.options.slidesToShow,centerMode=c.options.centerMode,windowWidth=jQuery(window).width(),windowWidth<1025&&(slidesToShow=c.options.responsive[0].settings.slidesToShow),windowWidth<769&&(slidesToShow=c.options.responsive[1].settings.slidesToShow),windowWidth<481&&(slidesToShow=c.options.responsive[2].settings.slidesToShow),$currentParent=c.$slider[0].parentElement.id,slideToAnimate=d+slidesToShow-1,1==slidesScrolled)1==centerMode?(animate=slideToAnimate-2,$inViewPort=a("#"+$currentParent+" [data-slick-index='"+animate+"']"),$inViewPort.addClass($inViewPort.data("animation"))):($inViewPort=a("#"+$currentParent+" [data-slick-index='"+slideToAnimate+"']"),$inViewPort.addClass($inViewPort.data("animation")));else for(var f=slidesScrolled+d;f>=0;f--)$inViewPort=a("#"+$currentParent+" [data-slick-index='"+f+"']"),$inViewPort.addClass($inViewPort.data("animation"))}),a(window).resize(function(){a(".ult-carousel-wrapper").each(function(){var b=a(this);if(b.hasClass("ult_full_width")){var c=b.attr("data-rtl");b.removeAttr("style");var d=a("html").outerWidth(),e=b.offset().left,f=Math.abs(0-e),g=f;"true"===c||!0===c?b.css({position:"relative",right:"-"+g+"px",width:d+"px"}):b.css({position:"relative",left:"-"+g+"px",width:d+"px"})}})})}),a(window).load(function(){a(".ult-carousel-wrapper").each(function(){var b=a(this);if(b.hasClass("ult_full_width")){b.css("left",0),b.css("right",0);var c=b.offset().left,d=Math.abs(0-c),e=b.attr("data-rtl"),f=a("html").outerWidth(),g=d;"true"===e||!0===e?b.css({position:"relative",right:"-"+g+"px",width:f+"px"}):b.css({position:"relative",left:"-"+g+"px",width:f+"px"})}})}),jQuery(document).on("ultAdvancedTabClickedCarousel",function(b,c){a(c).find(".ult-carousel-wrapper").each(function(){var b=a(this);if(b.hasClass("ult_full_width")){b.css("left",0),b.css("right",0);var c=b.offset().left,d=Math.abs(0-c),e=b.attr("data-rtl"),f=a("html").outerWidth(),g=d;"true"===e||!0===e?b.css({position:"relative",right:"-"+g+"px",width:f+"px"}):b.css({position:"relative",left:"-"+g+"px",width:f+"px"})}})})}(jQuery);
// source --> https://www.jesusmariamed.edu.co/wp-content/themes/ed-school/assets/js/vendor/modernizr-2.7.0.min.js 
/* Modernizr 2.7.0 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.7.0",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};