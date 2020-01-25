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
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/Ultimate_VC_Addons/assets/min-js/modernizr-custom.min.js 
window.bsfmodernizr=function(a,b,c){function d(a){o.cssText=a}function e(a,b){return typeof a===b}function f(a,b){return!!~(""+a).indexOf(b)}function g(a,b){for(var d in a){var e=a[d];if(!f(e,"-")&&o[e]!==c)return"pfx"!=b||e}return!1}function h(a,b,d){for(var f in a){var g=b[a[f]];if(g!==c)return!1===d?a[f]:e(g,"function")?g.bind(d||b):g}return!1}function i(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),f=(a+" "+q.join(d+" ")+d).split(" ");return e(b,"string")||e(b,"undefined")?g(f,b):(f=(a+" "+r.join(d+" ")+d).split(" "),h(f,b,c))}var j,k,l={},m=b.documentElement,n=b.createElement("bsfmodernizr"),o=n.style,p="Webkit Moz O ms",q=p.split(" "),r=p.toLowerCase().split(" "),s={},t=[],u=t.slice,v={}.hasOwnProperty;k=e(v,"undefined")||e(v.call,"undefined")?function(a,b){return b in a&&e(a.constructor.prototype[b],"undefined")}:function(a,b){return v.call(a,b)},Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError;var c=u.call(arguments,1),d=function(){if(this instanceof d){var e=function(){};e.prototype=b.prototype;var f=new e,g=b.apply(f,c.concat(u.call(arguments)));return Object(g)===g?g:f}return b.apply(a,c.concat(u.call(arguments)))};return d}),s.csstransitions=function(){return i("transition")};for(var w in s)k(s,w)&&(j=w.toLowerCase(),l[j]=s[w](),t.push((l[j]?"":"no-")+j));return l.addTest=function(a,b){if("object"==typeof a)for(var d in a)k(a,d)&&l.addTest(d,a[d]);else{if(a=a.toLowerCase(),l[a]!==c)return l;b="function"==typeof b?b():b,m.className+=" "+(b?"":"no-")+a,l[a]=b}return l},d(""),n=null,function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=r.elements;return"string"==typeof a?a.split(" "):a}function e(a){var b=q[a[o]];return b||(b={},p++,a[o]=p,q[p]=b),b}function f(a,c,d){if(c||(c=b),k)return c.createElement(a);d||(d=e(c));var f;return f=d.cache[a]?d.cache[a].cloneNode():n.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!f.canHaveChildren||m.test(a)||f.tagUrn?f:d.frag.appendChild(f)}function g(a,c){if(a||(a=b),k)return a.createDocumentFragment();c=c||e(a);for(var f=c.frag.cloneNode(),g=0,h=d(),i=h.length;g<i;g++)f.createElement(h[g]);return f}function h(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?f(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function i(a){a||(a=b);var d=e(a);return r.shivCSS&&!j&&!d.hasCSS&&(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||h(a,d),a}var j,k,l=a.html5||{},m=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,n=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,o="_html5shiv",p=0,q={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",j="hidden"in a,k=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return void 0===a.cloneNode||void 0===a.createDocumentFragment||void 0===a.createElement}()}catch(a){j=!0,k=!0}}();var r={elements:l.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:"3.7.0",shivCSS:!1!==l.shivCSS,supportsUnknownElements:k,shivMethods:!1!==l.shivMethods,type:"default",shivDocument:i,createElement:f,createDocumentFragment:g};a.html5=r,i(b)}(this,b),l._version="2.7.1",l._domPrefixes=r,l._cssomPrefixes=q,l.testProp=function(a){return g([a])},l.testAllProps=i,l.prefixed=function(a,b,c){return b?i(a,b,c):i(a,"pfx")},m.className=m.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+" js "+t.join(" "),l}(0,this.document),function(a,b,c){function d(a){return"[object Function]"==q.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=r.shift();s=1,a?a.t?o(function(){("c"==a.t?m.injectCss:m.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):s=0}function i(a,c,d,e,f,i,j){function k(b){if(!n&&g(l.readyState)&&(t.r=n=1,!s&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&o(function(){v.removeChild(l)},50);for(var d in A[c])A[c].hasOwnProperty(d)&&A[c][d].onload()}}var j=j||m.errorTimeout,l=b.createElement(a),n=0,q=0,t={t:d,s:c,e:f,a:i,x:j};1===A[c]&&(q=1,A[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,q)},r.splice(e,0,t),"img"!=a&&(q||2===A[c]?(v.insertBefore(l,u?null:p),o(k,j)):A[c].push(l))}function j(a,b,c,d,f){return s=0,b=b||"j",e(a)?i("c"==b?x:w,a,b,this.i++,c,d,f):(r.splice(this.i++,0,a),1==r.length&&h()),this}function k(){var a=m;return a.loader={load:j,i:0},a}var l,m,n=b.documentElement,o=a.setTimeout,p=b.getElementsByTagName("script")[0],q={}.toString,r=[],s=0,t="MozAppearance"in n.style,u=t&&!!b.createRange().compareNode,v=u?n:p.parentNode,n=a.opera&&"[object Opera]"==q.call(a.opera),n=!!b.attachEvent&&!n,w=t?"object":n?"script":"img",x=n?"script":w,y=Array.isArray||function(a){return"[object Array]"==q.call(a)},z=[],A={},B={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}};m=function(a){function b(a){var b,c,d,a=a.split("!"),e=z.length,f=a.pop(),g=a.length,f={url:f,origUrl:f,prefixes:a};for(c=0;c<g;c++)d=a[c].split("="),(b=B[d.shift()])&&(f=b(f,d));for(c=0;c<e;c++)f=z[c](f);return f}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(A[i.url]?i.noexec=!0:A[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),A[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(l=function(){var a=[].slice.call(arguments);m.apply(this,a),n()}),g(a,l,b,0,j);else if(Object(a)===a)for(i in h=function(){var b,c=0;for(b in a)a.hasOwnProperty(b)&&c++;return c}(),a)a.hasOwnProperty(i)&&(!c&&!--h&&(d(l)?l=function(){var a=[].slice.call(arguments);m.apply(this,a),n()}:l[i]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),n()}}(m[i])),g(a[i],l,b,i,j))}else!c&&n()}var h,i,j=!!a.test,k=a.load||a.both,l=a.callback||f,m=l,n=a.complete||f;c(j?a.yep:a.nope,!!k),k&&c(k)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(y(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):y(j)?m(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},m.addPrefix=function(a,b){B[a]=b},m.addFilter=function(a){z.push(a)},m.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",l=function(){b.removeEventListener("DOMContentLoaded",l,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k,l,n=b.createElement("script"),e=e||m.errorTimeout;n.src=a;for(l in d)n.setAttribute(l,d[l]);c=j?h:c||f,n.onreadystatechange=n.onload=function(){!k&&g(n.readyState)&&(k=1,c(),n.onload=n.onreadystatechange=null)},o(function(){k||(k=1,c(1))},e),i?n.onload():p.parentNode.insertBefore(n,p)},a.yepnope.injectCss=function(a,c,d,e,g,i){var j,e=b.createElement("link"),c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(p.parentNode.insertBefore(e,p),o(c,0))}}(this,document),bsfmodernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
// source --> https://www.jesusmariamed.edu.co/wp-content/plugins/Ultimate_VC_Addons/assets/min-js/modal-all.min.js 
window.bsfmodernizr=function(a,b,c){function d(a){o.cssText=a}function e(a,b){return typeof a===b}function f(a,b){return!!~(""+a).indexOf(b)}function g(a,b){for(var d in a){var e=a[d];if(!f(e,"-")&&o[e]!==c)return"pfx"!=b||e}return!1}function h(a,b,d){for(var f in a){var g=b[a[f]];if(g!==c)return!1===d?a[f]:e(g,"function")?g.bind(d||b):g}return!1}function i(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),f=(a+" "+q.join(d+" ")+d).split(" ");return e(b,"string")||e(b,"undefined")?g(f,b):(f=(a+" "+r.join(d+" ")+d).split(" "),h(f,b,c))}var j,k,l={},m=b.documentElement,n=b.createElement("bsfmodernizr"),o=n.style,p="Webkit Moz O ms",q=p.split(" "),r=p.toLowerCase().split(" "),s={},t=[],u=t.slice,v={}.hasOwnProperty;k=e(v,"undefined")||e(v.call,"undefined")?function(a,b){return b in a&&e(a.constructor.prototype[b],"undefined")}:function(a,b){return v.call(a,b)},Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError;var c=u.call(arguments,1),d=function(){if(this instanceof d){var e=function(){};e.prototype=b.prototype;var f=new e,g=b.apply(f,c.concat(u.call(arguments)));return Object(g)===g?g:f}return b.apply(a,c.concat(u.call(arguments)))};return d}),s.csstransitions=function(){return i("transition")};for(var w in s)k(s,w)&&(j=w.toLowerCase(),l[j]=s[w](),t.push((l[j]?"":"no-")+j));return l.addTest=function(a,b){if("object"==typeof a)for(var d in a)k(a,d)&&l.addTest(d,a[d]);else{if(a=a.toLowerCase(),l[a]!==c)return l;b="function"==typeof b?b():b,m.className+=" "+(b?"":"no-")+a,l[a]=b}return l},d(""),n=null,function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=r.elements;return"string"==typeof a?a.split(" "):a}function e(a){var b=q[a[o]];return b||(b={},p++,a[o]=p,q[p]=b),b}function f(a,c,d){if(c||(c=b),k)return c.createElement(a);d||(d=e(c));var f;return f=d.cache[a]?d.cache[a].cloneNode():n.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!f.canHaveChildren||m.test(a)||f.tagUrn?f:d.frag.appendChild(f)}function g(a,c){if(a||(a=b),k)return a.createDocumentFragment();c=c||e(a);for(var f=c.frag.cloneNode(),g=0,h=d(),i=h.length;g<i;g++)f.createElement(h[g]);return f}function h(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?f(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function i(a){a||(a=b);var d=e(a);return r.shivCSS&&!j&&!d.hasCSS&&(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||h(a,d),a}var j,k,l=a.html5||{},m=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,n=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,o="_html5shiv",p=0,q={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",j="hidden"in a,k=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return void 0===a.cloneNode||void 0===a.createDocumentFragment||void 0===a.createElement}()}catch(a){j=!0,k=!0}}();var r={elements:l.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:"3.7.0",shivCSS:!1!==l.shivCSS,supportsUnknownElements:k,shivMethods:!1!==l.shivMethods,type:"default",shivDocument:i,createElement:f,createDocumentFragment:g};a.html5=r,i(b)}(this,b),l._version="2.7.1",l._domPrefixes=r,l._cssomPrefixes=q,l.testProp=function(a){return g([a])},l.testAllProps=i,l.prefixed=function(a,b,c){return b?i(a,b,c):i(a,"pfx")},m.className=m.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+" js "+t.join(" "),l}(0,this.document),function(a,b,c){function d(a){return"[object Function]"==q.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=r.shift();s=1,a?a.t?o(function(){("c"==a.t?m.injectCss:m.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):s=0}function i(a,c,d,e,f,i,j){function k(b){if(!n&&g(l.readyState)&&(t.r=n=1,!s&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&o(function(){v.removeChild(l)},50);for(var d in A[c])A[c].hasOwnProperty(d)&&A[c][d].onload()}}var j=j||m.errorTimeout,l=b.createElement(a),n=0,q=0,t={t:d,s:c,e:f,a:i,x:j};1===A[c]&&(q=1,A[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,q)},r.splice(e,0,t),"img"!=a&&(q||2===A[c]?(v.insertBefore(l,u?null:p),o(k,j)):A[c].push(l))}function j(a,b,c,d,f){return s=0,b=b||"j",e(a)?i("c"==b?x:w,a,b,this.i++,c,d,f):(r.splice(this.i++,0,a),1==r.length&&h()),this}function k(){var a=m;return a.loader={load:j,i:0},a}var l,m,n=b.documentElement,o=a.setTimeout,p=b.getElementsByTagName("script")[0],q={}.toString,r=[],s=0,t="MozAppearance"in n.style,u=t&&!!b.createRange().compareNode,v=u?n:p.parentNode,n=a.opera&&"[object Opera]"==q.call(a.opera),n=!!b.attachEvent&&!n,w=t?"object":n?"script":"img",x=n?"script":w,y=Array.isArray||function(a){return"[object Array]"==q.call(a)},z=[],A={},B={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}};m=function(a){function b(a){var b,c,d,a=a.split("!"),e=z.length,f=a.pop(),g=a.length,f={url:f,origUrl:f,prefixes:a};for(c=0;c<g;c++)d=a[c].split("="),(b=B[d.shift()])&&(f=b(f,d));for(c=0;c<e;c++)f=z[c](f);return f}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(A[i.url]?i.noexec=!0:A[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),A[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(l=function(){var a=[].slice.call(arguments);m.apply(this,a),n()}),g(a,l,b,0,j);else if(Object(a)===a)for(i in h=function(){var b,c=0;for(b in a)a.hasOwnProperty(b)&&c++;return c}(),a)a.hasOwnProperty(i)&&(!c&&!--h&&(d(l)?l=function(){var a=[].slice.call(arguments);m.apply(this,a),n()}:l[i]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),n()}}(m[i])),g(a[i],l,b,i,j))}else!c&&n()}var h,i,j=!!a.test,k=a.load||a.both,l=a.callback||f,m=l,n=a.complete||f;c(j?a.yep:a.nope,!!k),k&&c(k)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(y(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):y(j)?m(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},m.addPrefix=function(a,b){B[a]=b},m.addFilter=function(a){z.push(a)},m.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",l=function(){b.removeEventListener("DOMContentLoaded",l,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k,l,n=b.createElement("script"),e=e||m.errorTimeout;n.src=a;for(l in d)n.setAttribute(l,d[l]);c=j?h:c||f,n.onreadystatechange=n.onload=function(){!k&&g(n.readyState)&&(k=1,c(),n.onload=n.onreadystatechange=null)},o(function(){k||(k=1,c(1))},e),i?n.onload():p.parentNode.insertBefore(n,p)},a.yepnope.injectCss=function(a,c,d,e,g,i){var j,e=b.createElement("link"),c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(p.parentNode.insertBefore(e,p),o(c,0))}}(this,document),bsfmodernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},function(a){"use strict";function b(a){return new RegExp("(^|\\s+)"+a+"(\\s+|$)")}function c(a,b){(d(a,b)?f:e)(a,b)}var d,e,f;"classList"in document.documentElement?(d=function(a,b){return a.classList.contains(b)},e=function(a,b){a.classList.add(b)},f=function(a,b){a.classList.remove(b)}):(d=function(a,c){return b(c).test(a.className)},e=function(a,b){d(a,b)||(a.className=a.className+" "+b)},f=function(a,c){a.className=a.className.replace(b(c)," ")});var g={hasClass:d,addClass:e,removeClass:f,toggleClass:c,has:d,add:e,remove:f,toggle:c};"function"==typeof define&&define.amd?define(g):a.classie=g}(window);var Froogaloop=function(){function a(b){return new a.fn.init(b)}function b(a,b,c){if(!c.contentWindow.postMessage)return!1;var d=c.getAttribute("src").split("?")[0],a=JSON.stringify({method:a,value:b});"//"===d.substr(0,2)&&(d=window.location.protocol+d),c.contentWindow.postMessage(a,d)}function c(a){var b,c;try{b=JSON.parse(a.data),c=b.event||b.method}catch(a){}if("ready"==c&&!f&&(f=!0),a.origin!=g)return!1;var a=b.value,d=b.data,h=""===h?null:b.player_id;return b=h?e[h][c]:e[c],c=[],!!b&&(void 0!==a&&c.push(a),d&&c.push(d),h&&c.push(h),0<c.length?b.apply(null,c):b.call())}function d(a,b,c){c?(e[c]||(e[c]={}),e[c][a]=b):e[a]=b}var e={},f=!1,g="";return a.fn=a.prototype={element:null,init:function(a){"string"==typeof a&&(a=document.getElementById(a)),this.element=a,a=this.element.getAttribute("src"),"//"===a.substr(0,2)&&(a=window.location.protocol+a);for(var a=a.split("/"),b="",c=0,d=a.length;c<d&&3>c;c++)b+=a[c],2>c&&(b+="/");return g=b,this},api:function(a,c){if(!this.element||!a)return!1;var e=this.element,f=""!==e.id?e.id:null,g=c&&c.constructor&&c.call&&c.apply?null:c,h=c&&c.constructor&&c.call&&c.apply?c:null;return h&&d(a,h,f),b(a,g,e),this},addEvent:function(a,c){if(!this.element)return!1;var e=this.element,g=""!==e.id?e.id:null;return d(a,c,g),"ready"!=a?b("addEventListener",a,e):"ready"==a&&f&&c.call(null,g),this},removeEvent:function(a){if(!this.element)return!1;var c,d=this.element;a:{if((c=""!==d.id?d.id:null)&&e[c]){if(!e[c][a]){c=!1;break a}e[c][a]=null}else{if(!e[a]){c=!1;break a}e[a]=null}c=!0}"ready"!=a&&c&&b("removeEventListener",a,d)}},a.fn.init.prototype=a.fn,window.addEventListener?window.addEventListener("message",c,!1):window.attachEvent("onmessage",c),window.Froogaloop=window.$f=a}();!function(a){var b,c,d="0.4.2",e="hasOwnProperty",f=/[\.\/]/,g=function(){},h=function(a,b){return a-b},i={n:{}},j=function(a,d){a=String(a);var e,f=c,g=Array.prototype.slice.call(arguments,2),i=j.listeners(a),k=0,l=[],m={},n=[],o=b;b=a,c=0;for(var p=0,q=i.length;q>p;p++)"zIndex"in i[p]&&(l.push(i[p].zIndex),i[p].zIndex<0&&(m[i[p].zIndex]=i[p]));for(l.sort(h);l[k]<0;)if(e=m[l[k++]],n.push(e.apply(d,g)),c)return c=f,n;for(p=0;q>p;p++)if("zIndex"in(e=i[p]))if(e.zIndex==l[k]){if(n.push(e.apply(d,g)),c)break;do{if(k++,e=m[l[k]],e&&n.push(e.apply(d,g)),c)break}while(e)}else m[e.zIndex]=e;else if(n.push(e.apply(d,g)),c)break;return c=f,b=o,n.length?n:null};j._events=i,j.listeners=function(a){var b,c,d,e,g,h,j,k,l=a.split(f),m=i,n=[m],o=[];for(e=0,g=l.length;g>e;e++){for(k=[],h=0,j=n.length;j>h;h++)for(m=n[h].n,c=[m[l[e]],m["*"]],d=2;d--;)(b=c[d])&&(k.push(b),o=o.concat(b.f||[]));n=k}return o},j.on=function(a,b){if(a=String(a),"function"!=typeof b)return function(){};for(var c=a.split(f),d=i,e=0,h=c.length;h>e;e++)d=d.n,d=d.hasOwnProperty(c[e])&&d[c[e]]||(d[c[e]]={n:{}});for(d.f=d.f||[],e=0,h=d.f.length;h>e;e++)if(d.f[e]==b)return g;return d.f.push(b),function(a){+a==+a&&(b.zIndex=+a)}},j.f=function(a){var b=[].slice.call(arguments,1);return function(){j.apply(null,[a,null].concat(b).concat([].slice.call(arguments,0)))}},j.stop=function(){c=1},j.nt=function(a){return a?new RegExp("(?:\\.|\\/|^)"+a+"(?:\\.|\\/|$)").test(b):b},j.nts=function(){return b.split(f)},j.off=j.unbind=function(a,b){if(!a)return void(j._events=i={n:{}});var c,d,g,h,k,l,m,n=a.split(f),o=[i];for(h=0,k=n.length;k>h;h++)for(l=0;l<o.length;l+=g.length-2){if(g=[l,1],c=o[l].n,"*"!=n[h])c[n[h]]&&g.push(c[n[h]]);else for(d in c)c[e](d)&&g.push(c[d]);o.splice.apply(o,g)}for(h=0,k=o.length;k>h;h++)for(c=o[h];c.n;){if(b){if(c.f){for(l=0,m=c.f.length;m>l;l++)if(c.f[l]==b){c.f.splice(l,1);break}!c.f.length&&delete c.f}for(d in c.n)if(c.n[e](d)&&c.n[d].f){var p=c.n[d].f;for(l=0,m=p.length;m>l;l++)if(p[l]==b){p.splice(l,1);break}!p.length&&delete c.n[d].f}}else{delete c.f;for(d in c.n)c.n[e](d)&&c.n[d].f&&delete c.n[d].f}c=c.n}},j.once=function(a,b){var c=function(){return j.unbind(a,c),b.apply(this,arguments)};return j.on(a,c)},j.version=d,j.toString=function(){return"You are running Eve "+d},"undefined"!=typeof module&&module.exports?module.exports=j:"undefined"!=typeof define?define("eve",[],function(){return j}):a.eve=j}(this),function(a,b){"function"==typeof define&&define.amd?define(["eve"],function(c){return b(a,c)}):b(a,a.eve)}(this,function(a,b){var c=function(b){var c={},d=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||function(a){setTimeout(a,16)},e=Array.isArray||function(a){return a instanceof Array||"[object Array]"==Object.prototype.toString.call(a)},f=0,g="M"+(+new Date).toString(36),h=function(){return g+(f++).toString(36)},i=Date.now||function(){return+new Date},j=function(a){var b=this;if(null==a)return b.s;var c=b.s-a;b.b+=b.dur*c,b.B+=b.dur*c,b.s=a},k=function(a){var b=this;return null==a?b.spd:void(b.spd=a)},l=function(a){var b=this;return null==a?b.dur:(b.s=b.s*a/b.dur,void(b.dur=a))},m=function(){var a=this;delete c[a.id],b("mina.stop."+a.id,a)},n=function(){var a=this;a.pdif||(delete c[a.id],a.pdif=a.get()-a.b)},o=function(){var a=this;a.pdif&&(a.b=a.get()-a.pdif,delete a.pdif,c[a.id]=a)},p=function(){var a=0;for(var f in c)if(c.hasOwnProperty(f)){var g,h=c[f],i=h.get();if(a++,h.s=(i-h.b)/(h.dur/h.spd),h.s>=1&&(delete c[f],h.s=1,a--,function(a){setTimeout(function(){b("mina.finish."+a.id,a)})}(h)),e(h.start)){g=[];for(var j=0,k=h.start.length;k>j;j++)g[j]=+h.start[j]+(h.end[j]-h.start[j])*h.easing(h.s)}else g=+h.start+(h.end-h.start)*h.easing(h.s);h.set(g)}a&&d(p)},q=function(a,b,e,f,g,i,r){var s={id:h(),start:a,end:b,b:e,s:0,dur:f-e,spd:1,get:g,set:i,easing:r||q.linear,status:j,speed:k,duration:l,stop:m,pause:n,resume:o};c[s.id]=s;var t,u=0;for(t in c)if(c.hasOwnProperty(t)&&2==++u)break;return 1==u&&d(p),s};return q.time=i,q.getById=function(a){return c[a]||null},q.linear=function(a){return a},q.easeout=function(a){return Math.pow(a,1.7)},q.easein=function(a){return Math.pow(a,.48)},q.easeinout=function(a){if(1==a)return 1;if(0==a)return 0;var b=.48-a/1.04,c=Math.sqrt(.1734+b*b),d=c-b,e=Math.pow(Math.abs(d),1/3)*(0>d?-1:1),f=-c-b,g=Math.pow(Math.abs(f),1/3)*(0>f?-1:1),h=e+g+.5;return 3*(1-h)*h*h+h*h*h},q.backin=function(a){if(1==a)return 1;var b=1.70158;return a*a*((b+1)*a-b)},q.backout=function(a){if(0==a)return 0;a-=1;var b=1.70158;return a*a*((b+1)*a+b)+1},q.elastic=function(a){return a==!!a?a:Math.pow(2,-10*a)*Math.sin(2*(a-.075)*Math.PI/.3)+1},q.bounce=function(a){var b,c=7.5625,d=2.75;return 1/d>a?b=c*a*a:2/d>a?(a-=1.5/d,b=c*a*a+.75):2.5/d>a?(a-=2.25/d,b=c*a*a+.9375):(a-=2.625/d,b=c*a*a+.984375),b},a.mina=q,q}(void 0===b?function(){}:b),d=function(){function d(a,b){if(a){if(a.tagName)return z(a);if(a instanceof u)return a;if(null==b)return a=I.doc.querySelector(a),z(a)}return a=null==a?"100%":a,b=null==b?"100%":b,new y(a,b)}function e(a,b){if(b){if("string"==typeof a&&(a=e(a)),"string"==typeof b)return"xlink:"==b.substring(0,6)?a.getAttributeNS(ea,b.substring(6)):"xml:"==b.substring(0,4)?a.getAttributeNS(fa,b.substring(4)):a.getAttribute(b);for(var c in b)if(b[J](c)){var d=K(b[c]);d?"xlink:"==c.substring(0,6)?a.setAttributeNS(ea,c.substring(6),d):"xml:"==c.substring(0,4)?a.setAttributeNS(fa,c.substring(4),d):a.setAttribute(c,d):a.removeAttribute(c)}}else a=I.doc.createElementNS(fa,a);return a}function f(a,b){return b=K.prototype.toLowerCase.call(b),"finite"==b?isFinite(a):!("array"!=b||!(a instanceof Array||Array.isArray&&Array.isArray(a)))||("null"==b&&null===a||b==typeof a&&null!==a||"object"==b&&a===Object(a)||T.call(a).slice(8,-1).toLowerCase()==b)}function h(a){if("function"==typeof a||Object(a)!==a)return a;var b=new a.constructor;for(var c in a)a[J](c)&&(b[c]=h(a[c]));return b}function i(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return a.push(a.splice(c,1)[0])}function j(a,b,c){function d(){var e=Array.prototype.slice.call(arguments,0),f=e.join("␀"),g=d.cache=d.cache||{},h=d.count=d.count||[];return g[J](f)?(i(h,f),c?c(g[f]):g[f]):(h.length>=1e3&&delete g[h.shift()],h.push(f),g[f]=a.apply(b,e),c?c(g[f]):g[f])}return d}function k(a,b,c,d,e,f){if(null==e){var g=a-c,h=b-d;return g||h?(180+180*N.atan2(-h,-g)/R+360)%360:0}return k(a,b,e,f)-k(c,d,e,f)}function l(a){return a%360*R/180}function m(a){return 180*a/R%360}function n(a,b,c,d,e,f){return null==b&&"[object SVGMatrix]"==T.call(a)?(this.a=a.a,this.b=a.b,this.c=a.c,this.d=a.d,this.e=a.e,void(this.f=a.f)):void(null!=a?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+e,this.f=+f):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0))}function o(a){var b=[];return a=a.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g,function(a,c,d){return d=d.split(/\s*,\s*|\s+/),"rotate"==c&&1==d.length&&d.push(0,0),"scale"==c&&(2==d.length&&d.push(0,0),1==d.length&&d.push(d[0],0,0)),"skewX"==c?b.push(["m",1,0,N.tan(l(d[0])),1,0,0]):"skewY"==c?b.push(["m",1,N.tan(l(d[0])),0,1,0,0]):b.push([c.charAt(0)].concat(d)),a}),b}function p(a,b){var c=pa(a),d=new n;if(c)for(var e=0,f=c.length;f>e;e++){var g,h,i,j,k,l=c[e],m=l.length,o=K(l[0]).toLowerCase(),p=l[0]!=o,q=p?d.invert():0;"t"==o&&2==m?d.translate(l[1],0):"t"==o&&3==m?p?(g=q.x(0,0),h=q.y(0,0),i=q.x(l[1],l[2]),j=q.y(l[1],l[2]),d.translate(i-g,j-h)):d.translate(l[1],l[2]):"r"==o?2==m?(k=k||b,d.rotate(l[1],k.x+k.width/2,k.y+k.height/2)):4==m&&(p?(i=q.x(l[2],l[3]),j=q.y(l[2],l[3]),d.rotate(l[1],i,j)):d.rotate(l[1],l[2],l[3])):"s"==o?2==m||3==m?(k=k||b,d.scale(l[1],l[m-1],k.x+k.width/2,k.y+k.height/2)):4==m?p?(i=q.x(l[2],l[3]),j=q.y(l[2],l[3]),d.scale(l[1],l[1],i,j)):d.scale(l[1],l[1],l[2],l[3]):5==m&&(p?(i=q.x(l[3],l[4]),j=q.y(l[3],l[4]),d.scale(l[1],l[2],i,j)):d.scale(l[1],l[2],l[3],l[4])):"m"==o&&7==m&&d.add(l[1],l[2],l[3],l[4],l[5],l[6])}return d}function q(a,b){if(null==b){var c=!0;if(!(b="linearGradient"==a.type||"radialGradient"==a.type?a.node.getAttribute("gradientTransform"):"pattern"==a.type?a.node.getAttribute("patternTransform"):a.node.getAttribute("transform")))return new n;b=o(b)}else b=d._.rgTransform.test(b)?K(b).replace(/\.{3}|\u2026/g,a._.transform||S):o(b),f(b,"array")&&(b=d.path?d.path.toString.call(b):K(b)),a._.transform=b;var e=p(b,a.getBBox(1));return c?e:void(a.matrix=e)}function r(a){var b=d._.someDefs;if(b&&qa(b.ownerDocument.documentElement,b))return b;var c=a.node.ownerSVGElement&&z(a.node.ownerSVGElement)||a.node.parentNode&&z(a.node.parentNode)||d.select("svg")||d(0,0),e=c.select("defs"),f=null!=e&&e.node;return f||(f=x("defs",c.node).node),d._.someDefs=f,f}function s(a,b,c){function d(a){return null==a?S:a==+a?a:(e(j,{width:a}),j.getBBox().width)}function f(a){return null==a?S:a==+a?a:(e(j,{height:a}),j.getBBox().height)}function g(d,e){null==b?i[d]=e(a.attr(d)):d==b&&(i=e(null==c?a.attr(d):c))}var h=r(a),i={},j=h.querySelector(".svg---mgr");switch(j||(j=e("rect"),e(j,{width:10,height:10,class:"svg---mgr"}),h.appendChild(j)),a.type){case"rect":g("rx",d),g("ry",f);case"image":g("width",d),g("height",f);case"text":g("x",d),g("y",f);break;case"circle":g("cx",d),g("cy",f),g("r",d);break;case"ellipse":g("cx",d),g("cy",f),g("rx",d),g("ry",f);break;case"line":g("x1",d),g("x2",d),g("y1",f),g("y2",f);break;case"marker":g("refX",d),g("markerWidth",d),g("refY",f),g("markerHeight",f);break;case"radialGradient":g("fx",d),g("fy",f);break;case"tspan":g("dx",d),g("dy",f);break;default:g(b,d)}return i}function t(a){f(a,"array")||(a=Array.prototype.slice.call(arguments,0));for(var b=0,c=0,d=this.node;this[b];)delete this[b++];for(b=0;b<a.length;b++)"set"==a[b].type?a[b].forEach(function(a){d.appendChild(a.node)}):d.appendChild(a[b].node);var e=d.childNodes;for(b=0;b<e.length;b++)this[c++]=z(e[b]);return this}function u(a){if(a.snap in ga)return ga[a.snap];var b,c=this.id=da();try{b=a.ownerSVGElement}catch(a){}if(this.node=a,b&&(this.paper=new y(b)),this.type=a.tagName,this.anims={},this._={transform:[]},a.snap=c,ga[c]=this,"g"==this.type){this.add=t;for(var d in y.prototype)y.prototype[J](d)&&(this[d]=y.prototype[d])}}function v(a){for(var b,c=0,d=a.length;d>c;c++)if(b=b||a[c])return b}function w(a){this.node=a}function x(a,b){var c=e(a);b.appendChild(c);var d=z(c);return d.type=a,d}function y(a,b){var c,d,f,g=y.prototype;if(a&&"svg"==a.tagName){if(a.snap in ga)return ga[a.snap];c=new u(a),d=a.getElementsByTagName("desc")[0],f=a.getElementsByTagName("defs")[0],d||(d=e("desc"),d.appendChild(I.doc.createTextNode("Created with Snap")),c.node.appendChild(d)),f||(f=e("defs"),c.node.appendChild(f)),c.defs=f;for(var h in g)g[J](h)&&(c[h]=g[h]);c.paper=c.root=c}else c=x("svg",I.doc.body),e(c.node,{height:b,version:1.1,width:a,xmlns:fa});return c}function z(a){return a?a instanceof u||a instanceof w?a:"svg"==a.tagName?new y(a):new u(a):a}function A(){return this.selectAll("stop")}function B(a,b){var c=e("stop"),f={offset:+b+"%"};return a=d.color(a),f["stop-color"]=a.hex,a.opacity<1&&(f["stop-opacity"]=a.opacity),e(c,f),this.node.appendChild(c),this}function C(){if("linearGradient"==this.type){var a=e(this.node,"x1")||0,b=e(this.node,"x2")||1,c=e(this.node,"y1")||0,f=e(this.node,"y2")||0;return d._.box(a,c,N.abs(b-a),N.abs(f-c))}var g=this.node.cx||.5,h=this.node.cy||.5,i=this.node.r||0;return d._.box(g-i,h-i,2*i,2*i)}function D(a,c){function d(a,b){for(var c=(b-j)/(a-k),d=k;a>d;d++)h[d].offset=+(+j+c*(d-k)).toFixed(2);k=a,j=b}var f,g=v(b("snap.util.grad.parse",null,c));if(!g)return null;g.params.unshift(a),f="l"==g.type.toLowerCase()?E.apply(0,g.params):F.apply(0,g.params),g.type!=g.type.toLowerCase()&&e(f.node,{gradientUnits:"userSpaceOnUse"});var h=g.stops,i=h.length,j=0,k=0;i--;for(var l=0;i>l;l++)"offset"in h[l]&&d(l,h[l].offset);for(h[i].offset=h[i].offset||100,d(i,h[i].offset),l=0;i>=l;l++){var m=h[l];f.addStop(m.color,m.offset)}return f}function E(a,b,c,d,f){var g=x("linearGradient",a);return g.stops=A,g.addStop=B,g.getBBox=C,null!=b&&e(g.node,{x1:b,y1:c,x2:d,y2:f}),g}function F(a,b,c,d,f,g){var h=x("radialGradient",a);return h.stops=A,h.addStop=B,h.getBBox=C,null!=b&&e(h.node,{cx:b,cy:c,r:d}),null!=f&&null!=g&&e(h.node,{fx:f,fy:g}),h}function G(a){return function(c){if(b.stop(),c instanceof w&&1==c.node.childNodes.length&&("radialGradient"==c.node.firstChild.tagName||"linearGradient"==c.node.firstChild.tagName||"pattern"==c.node.firstChild.tagName)&&(c=c.node.firstChild,r(this).appendChild(c),c=z(c)),c instanceof u)if("radialGradient"==c.type||"linearGradient"==c.type||"pattern"==c.type){c.node.id||e(c.node,{id:c.id});var f=ha(c.node.id)}else f=c.attr(a);else if(f=d.color(c),f.error){var g=D(r(this),c);g?(g.node.id||e(g.node,{id:g.id}),f=ha(g.node.id)):f=c}else f=K(f);var h={};h[a]=f,e(this.node,h),this.node.style[a]=S}}function H(a){for(var b=[],c=a.childNodes,d=0,e=c.length;e>d;d++){var f=c[d];3==f.nodeType&&b.push(f.nodeValue),"tspan"==f.tagName&&(1==f.childNodes.length&&3==f.firstChild.nodeType?b.push(f.firstChild.nodeValue):b.push(H(f)))}return b}d.version="0.2.0",d.toString=function(){return"Snap v"+this.version},d._={};var I={win:a,doc:a.document};d._.glob=I;var J="hasOwnProperty",K=String,L=parseFloat,M=parseInt,N=Math,O=N.max,P=N.min,Q=N.abs,R=(N.pow,N.PI),S=(N.round,""),T=Object.prototype.toString,U=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,V=/^url\(#?([^)]+)\)$/,W="\t\n\v\f\r   ᠎             　\u2028\u2029",X=new RegExp("[,"+W+"]+"),Y=(new RegExp("["+W+"]","g"),new RegExp("["+W+"]*,["+W+"]*")),Z={hs:1,rg:1},$=new RegExp("([a-z])["+W+",]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?["+W+"]*,?["+W+"]*)+)","ig"),_=new RegExp("([rstm])["+W+",]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?["+W+"]*,?["+W+"]*)+)","ig"),aa=new RegExp("(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)["+W+"]*,?["+W+"]*","ig"),ba=0,ca="S"+(+new Date).toString(36),da=function(){return ca+(ba++).toString(36)},ea="http://www.w3.org/1999/xlink",fa="http://www.w3.org/2000/svg",ga={},ha=d.url=function(a){return"url('#"+a+"')"};d._.$=e,d._.id=da,d.format=function(){var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(a,c,d){var e=d;return c.replace(b,function(a,b,c,d,f){b=b||d,e&&(b in e&&(e=e[b]),"function"==typeof e&&f&&(e=e()))}),e=(null==e||e==d?a:e)+""};return function(b,d){return K(b).replace(a,function(a,b){return c(a,b,d)})}}();var ia=function(){function a(){this.parentNode.removeChild(this)}return function(b,c){var d=I.doc.createElement("img"),e=I.doc.body;d.style.cssText="position:absolute;left:-9999em;top:-9999em",d.onload=function(){c.call(d),d.onload=d.onerror=null,e.removeChild(d)},d.onerror=a,e.appendChild(d),d.src=b}}();d._.clone=h,d._.cacher=j,d.rad=l,d.deg=m,d.angle=k,d.is=f,d.snapTo=function(a,b,c){if(c=f(c,"finite")?c:10,f(a,"array")){for(var d=a.length;d--;)if(Q(a[d]-b)<=c)return a[d]}else{a=+a;var e=b%a;if(c>e)return b-e;if(e>a-c)return b-e+a}return b},function(a){function b(a){return a[0]*a[0]+a[1]*a[1]}function c(a){var c=N.sqrt(b(a));a[0]&&(a[0]/=c),a[1]&&(a[1]/=c)}a.add=function(a,b,c,d,e,f){var g,h,i,j,k=[[],[],[]],l=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],m=[[a,c,e],[b,d,f],[0,0,1]];for(a&&a instanceof n&&(m=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]]),g=0;3>g;g++)for(h=0;3>h;h++){for(j=0,i=0;3>i;i++)j+=l[g][i]*m[i][h];k[g][h]=j}return this.a=k[0][0],this.b=k[1][0],this.c=k[0][1],this.d=k[1][1],this.e=k[0][2],this.f=k[1][2],this},a.invert=function(){var a=this,b=a.a*a.d-a.b*a.c;return new n(a.d/b,-a.b/b,-a.c/b,a.a/b,(a.c*a.f-a.d*a.e)/b,(a.b*a.e-a.a*a.f)/b)},a.clone=function(){return new n(this.a,this.b,this.c,this.d,this.e,this.f)},a.translate=function(a,b){return this.add(1,0,0,1,a,b)},a.scale=function(a,b,c,d){return null==b&&(b=a),(c||d)&&this.add(1,0,0,1,c,d),this.add(a,0,0,b,0,0),(c||d)&&this.add(1,0,0,1,-c,-d),this},a.rotate=function(a,b,c){a=l(a),b=b||0,c=c||0;var d=+N.cos(a).toFixed(9),e=+N.sin(a).toFixed(9);return this.add(d,e,-e,d,b,c),this.add(1,0,0,1,-b,-c)},a.x=function(a,b){return a*this.a+b*this.c+this.e},a.y=function(a,b){return a*this.b+b*this.d+this.f},a.get=function(a){return+this[K.fromCharCode(97+a)].toFixed(4)},a.toString=function(){return"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")"},a.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},a.split=function(){var a={};a.dx=this.e,a.dy=this.f;var d=[[this.a,this.c],[this.b,this.d]];a.scalex=N.sqrt(b(d[0])),c(d[0]),a.shear=d[0][0]*d[1][0]+d[0][1]*d[1][1],d[1]=[d[1][0]-d[0][0]*a.shear,d[1][1]-d[0][1]*a.shear],a.scaley=N.sqrt(b(d[1])),c(d[1]),a.shear/=a.scaley;var e=-d[0][1],f=d[1][1];return 0>f?(a.rotate=m(N.acos(f)),0>e&&(a.rotate=360-a.rotate)):a.rotate=m(N.asin(e)),a.isSimple=!(+a.shear.toFixed(9)||a.scalex.toFixed(9)!=a.scaley.toFixed(9)&&a.rotate),a.isSuperSimple=!+a.shear.toFixed(9)&&a.scalex.toFixed(9)==a.scaley.toFixed(9)&&!a.rotate,a.noRotation=!+a.shear.toFixed(9)&&!a.rotate,a},a.toTransformString=function(a){var b=a||this.split();return b.isSimple?(b.scalex=+b.scalex.toFixed(4),b.scaley=+b.scaley.toFixed(4),b.rotate=+b.rotate.toFixed(4),(b.dx||b.dy?"t"+[+b.dx.toFixed(4),+b.dy.toFixed(4)]:S)+(1!=b.scalex||1!=b.scaley?"s"+[b.scalex,b.scaley,0,0]:S)+(b.rotate?"r"+[+b.rotate.toFixed(4),0,0]:S)):"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(n.prototype),d.Matrix=n,d.getRGB=j(function(a){if(!a||(a=K(a)).indexOf("-")+1)return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:ma};if("none"==a)return{r:-1,g:-1,b:-1,hex:"none",toString:ma};if(!(Z[J](a.toLowerCase().substring(0,2))||"#"==a.charAt())&&(a=ja(a)),!a)return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:ma};var b,c,e,g,h,i,j=a.match(U);return j?(j[2]&&(e=M(j[2].substring(5),16),c=M(j[2].substring(3,5),16),b=M(j[2].substring(1,3),16)),j[3]&&(e=M((h=j[3].charAt(3))+h,16),c=M((h=j[3].charAt(2))+h,16),b=M((h=j[3].charAt(1))+h,16)),j[4]&&(i=j[4].split(Y),b=L(i[0]),"%"==i[0].slice(-1)&&(b*=2.55),c=L(i[1]),"%"==i[1].slice(-1)&&(c*=2.55),e=L(i[2]),"%"==i[2].slice(-1)&&(e*=2.55),"rgba"==j[1].toLowerCase().slice(0,4)&&(g=L(i[3])),i[3]&&"%"==i[3].slice(-1)&&(g/=100)),j[5]?(i=j[5].split(Y),b=L(i[0]),"%"==i[0].slice(-1)&&(b/=100),c=L(i[1]),"%"==i[1].slice(-1)&&(c/=100),e=L(i[2]),"%"==i[2].slice(-1)&&(e/=100),("deg"==i[0].slice(-3)||"°"==i[0].slice(-1))&&(b/=360),"hsba"==j[1].toLowerCase().slice(0,4)&&(g=L(i[3])),i[3]&&"%"==i[3].slice(-1)&&(g/=100),d.hsb2rgb(b,c,e,g)):j[6]?(i=j[6].split(Y),b=L(i[0]),"%"==i[0].slice(-1)&&(b/=100),c=L(i[1]),"%"==i[1].slice(-1)&&(c/=100),e=L(i[2]),"%"==i[2].slice(-1)&&(e/=100),("deg"==i[0].slice(-3)||"°"==i[0].slice(-1))&&(b/=360),"hsla"==j[1].toLowerCase().slice(0,4)&&(g=L(i[3])),i[3]&&"%"==i[3].slice(-1)&&(g/=100),d.hsl2rgb(b,c,e,g)):(b=P(N.round(b),255),c=P(N.round(c),255),e=P(N.round(e),255),g=P(O(g,0),1),j={r:b,g:c,b:e,toString:ma},j.hex="#"+(16777216|e|c<<8|b<<16).toString(16).slice(1),j.opacity=f(g,"finite")?g:1,j)):{r:-1,g:-1,b:-1,hex:"none",error:1,toString:ma}},d),d.hsb=j(function(a,b,c){return d.hsb2rgb(a,b,c).hex}),d.hsl=j(function(a,b,c){return d.hsl2rgb(a,b,c).hex}),d.rgb=j(function(a,b,c,d){if(f(d,"finite")){var e=N.round;return"rgba("+[e(a),e(b),e(c),+d.toFixed(2)]+")"}return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)});var ja=function(a){var b=I.doc.getElementsByTagName("head")[0],c="rgb(255, 0, 0)";return(ja=j(function(a){if("red"==a.toLowerCase())return c;b.style.color=c,b.style.color=a;var d=I.doc.defaultView.getComputedStyle(b,S).getPropertyValue("color");return d==c?null:d}))(a)},ka=function(){return"hsb("+[this.h,this.s,this.b]+")"},la=function(){return"hsl("+[this.h,this.s,this.l]+")"},ma=function(){return 1==this.opacity||null==this.opacity?this.hex:"rgba("+[this.r,this.g,this.b,this.opacity]+")"},na=function(a,b,c){if(null==b&&f(a,"object")&&"r"in a&&"g"in a&&"b"in a&&(c=a.b,b=a.g,a=a.r),null==b&&f(a,string)){var e=d.getRGB(a);a=e.r,b=e.g,c=e.b}return(a>1||b>1||c>1)&&(a/=255,b/=255,c/=255),[a,b,c]},oa=function(a,b,c,e){a=N.round(255*a),b=N.round(255*b),c=N.round(255*c);var g={r:a,g:b,b:c,opacity:f(e,"finite")?e:1,hex:d.rgb(a,b,c),toString:ma};return f(e,"finite")&&(g.opacity=e),g};d.color=function(a){var b;return f(a,"object")&&"h"in a&&"s"in a&&"b"in a?(b=d.hsb2rgb(a),a.r=b.r,a.g=b.g,a.b=b.b,a.opacity=1,a.hex=b.hex):f(a,"object")&&"h"in a&&"s"in a&&"l"in a?(b=d.hsl2rgb(a),a.r=b.r,a.g=b.g,a.b=b.b,a.opacity=1,a.hex=b.hex):(f(a,"string")&&(a=d.getRGB(a)),f(a,"object")&&"r"in a&&"g"in a&&"b"in a&&!("error"in a)?(b=d.rgb2hsl(a),a.h=b.h,a.s=b.s,a.l=b.l,b=d.rgb2hsb(a),a.v=b.b):(a={hex:"none"},a.r=a.g=a.b=a.h=a.s=a.v=a.l=-1,a.error=1)),a.toString=ma,a},d.hsb2rgb=function(a,b,c,d){f(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o),a*=360;var e,g,h,i,j;return a=a%360/60,j=c*b,i=j*(1-Q(a%2-1)),e=g=h=c-j,a=~~a,e+=[j,i,0,0,i,j][a],g+=[i,j,j,i,0,0][a],h+=[0,0,i,j,j,i][a],oa(e,g,h,d)},d.hsl2rgb=function(a,b,c,d){f(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h),(a>1||b>1||c>1)&&(a/=360,b/=100,c/=100),a*=360;var e,g,h,i,j;return a=a%360/60,j=2*b*(.5>c?c:1-c),i=j*(1-Q(a%2-1)),e=g=h=c-j/2,a=~~a,e+=[j,i,0,0,i,j][a],g+=[i,j,j,i,0,0][a],h+=[0,0,i,j,j,i][a],oa(e,g,h,d)},d.rgb2hsb=function(a,b,c){c=na(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g;return f=O(a,b,c),g=f-P(a,b,c),d=0==g?null:f==a?(b-c)/g:f==b?(c-a)/g+2:(a-b)/g+4,d=(d+360)%6*60/360,e=0==g?0:g/f,{h:d,s:e,b:f,toString:ka}},d.rgb2hsl=function(a,b,c){
c=na(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g,h,i;return g=O(a,b,c),h=P(a,b,c),i=g-h,d=0==i?null:g==a?(b-c)/i:g==b?(c-a)/i+2:(a-b)/i+4,d=(d+360)%6*60/360,f=(g+h)/2,e=0==i?0:.5>f?i/(2*f):i/(2-2*f),{h:d,s:e,l:f,toString:la}},d.parsePathString=function(a){if(!a)return null;var b=d.path(a);if(b.arr)return d.path.clone(b.arr);var c={a:7,c:6,o:2,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,u:3,z:0},e=[];return f(a,"array")&&f(a[0],"array")&&(e=d.path.clone(a)),e.length||K(a).replace($,function(a,b,d){var f=[],g=b.toLowerCase();if(d.replace(aa,function(a,b){b&&f.push(+b)}),"m"==g&&f.length>2&&(e.push([b].concat(f.splice(0,2))),g="l",b="m"==b?"l":"L"),"o"==g&&1==f.length&&e.push([b,f[0]]),"r"==g)e.push([b].concat(f));else for(;f.length>=c[g]&&(e.push([b].concat(f.splice(0,c[g]))),c[g]););}),e.toString=d.path.toString,b.arr=d.path.clone(e),e};var pa=d.parseTransformString=function(a){if(!a)return null;var b=[];return f(a,"array")&&f(a[0],"array")&&(b=d.path.clone(a)),b.length||K(a).replace(_,function(a,c,d){var e=[];c.toLowerCase(),d.replace(aa,function(a,b){b&&e.push(+b)}),b.push([c].concat(e))}),b.toString=d.path.toString,b};d._.svgTransform2string=o,d._.rgTransform=new RegExp("^[a-z]["+W+"]*-?\\.?\\d","i"),d._.transform2matrix=p,d._unit2px=s;var qa=I.doc.contains||I.doc.compareDocumentPosition?function(a,b){var c=9==a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a==d||!(!d||1!=d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)for(;b;)if((b=b.parentNode)==a)return!0;return!1};d._.getSomeDefs=r,d.select=function(a){return z(I.doc.querySelector(a))},d.selectAll=function(a){for(var b=I.doc.querySelectorAll(a),c=(d.set||Array)(),e=0;e<b.length;e++)c.push(z(b[e]));return c},function(a){function g(a){function b(a,b){var c=e(a.node,b);c=c&&c.match(f),(c=c&&c[2])&&"#"==c.charAt()&&(c=c.substring(1))&&(h[c]=(h[c]||[]).concat(function(c){var d={};d[b]=ha(c),e(a.node,d)}))}for(var c,d=a.selectAll("*"),f=/^\s*url\(("|'|)(.*)\1\)\s*$/,g=[],h={},i=0,j=d.length;j>i;i++){c=d[i],b(c,"fill"),b(c,"stroke"),b(c,"filter"),b(c,"mask"),b(c,"clip-path"),function(a){var b=e(a.node,"xlink:href");b&&"#"==b.charAt()&&(b=b.substring(1))&&(h[b]=(h[b]||[]).concat(function(b){a.attr("xlink:href","#"+b)}))}(c);var k=e(c.node,"id");k&&(e(c.node,{id:c.id}),g.push({old:k,id:c.id}))}for(i=0,j=g.length;j>i;i++){var l=h[g[i].old];if(l)for(var m=0,n=l.length;n>m;m++)l[m](g[i].id)}}function h(a,b,c){return function(d){var e=d.slice(a,b);return 1==e.length&&(e=e[0]),c?c(e):e}}function i(a){return function(){var b=a?"<"+this.type:"",c=this.node.attributes,d=this.node.childNodes;if(a)for(var e=0,f=c.length;f>e;e++)b+=" "+c[e].name+'="'+c[e].value.replace(/"/g,'\\"')+'"';if(d.length){for(a&&(b+=">"),e=0,f=d.length;f>e;e++)3==d[e].nodeType?b+=d[e].nodeValue:1==d[e].nodeType&&(b+=z(d[e]).toString());a&&(b+="</"+this.type+">")}else a&&(b+="/>");return b}}a.attr=function(a,c){var d=this;if(d.node,!a)return d;if(f(a,"string")){if(!(arguments.length>1))return v(b("snap.util.getattr."+a,d));var e={};e[a]=c,a=e}for(var g in a)a[J](g)&&b("snap.util.attr."+g,d,a[g]);return d},a.getBBox=function(a){var b=this;if("use"==b.type&&(b=b.original),b.removed)return{};var c=b._;return a?(c.bboxwt=d.path.get[b.type]?d.path.getBBox(b.realPath=d.path.get[b.type](b)):d._.box(b.node.getBBox()),d._.box(c.bboxwt)):(b.realPath=(d.path.get[b.type]||d.path.get.deflt)(b),c.bbox=d.path.getBBox(d.path.map(b.realPath,b.matrix)),d._.box(c.bbox))};var j=function(){return this.string};a.transform=function(a){var b=this._;if(null==a){var c=new n(this.node.getCTM()),d=q(this),f=d.toTransformString();return{string:K(d)==K(this.matrix)?b.transform:f,globalMatrix:c,localMatrix:d,diffMatrix:c.clone().add(d.invert()),global:c.toTransformString(),local:f,toString:j}}return a instanceof n&&(a=a.toTransformString()),q(this,a),this.node&&("linearGradient"==this.type||"radialGradient"==this.type?e(this.node,{gradientTransform:this.matrix}):"pattern"==this.type?e(this.node,{patternTransform:this.matrix}):e(this.node,{transform:this.matrix})),this},a.parent=function(){return z(this.node.parentNode)},a.append=a.add=function(a){if(a){if("set"==a.type){var b=this;return a.forEach(function(a){b.add(a)}),this}a=z(a),this.node.appendChild(a.node),a.paper=this.paper}return this},a.appendTo=function(a){return a&&(a=z(a),a.append(this)),this},a.prepend=function(a){if(a){a=z(a);var b=a.parent();this.node.insertBefore(a.node,this.node.firstChild),this.add&&this.add(),a.paper=this.paper,this.parent()&&this.parent().add(),b&&b.add()}return this},a.prependTo=function(a){return a=z(a),a.prepend(this),this},a.before=function(a){if("set"==a.type){var b=this;return a.forEach(function(a){var c=a.parent();b.node.parentNode.insertBefore(a.node,b.node),c&&c.add()}),this.parent().add(),this}a=z(a);var c=a.parent();return this.node.parentNode.insertBefore(a.node,this.node),this.parent()&&this.parent().add(),c&&c.add(),a.paper=this.paper,this},a.after=function(a){a=z(a);var b=a.parent();return this.node.nextSibling?this.node.parentNode.insertBefore(a.node,this.node.nextSibling):this.node.parentNode.appendChild(a.node),this.parent()&&this.parent().add(),b&&b.add(),a.paper=this.paper,this},a.insertBefore=function(a){a=z(a);var b=this.parent();return a.node.parentNode.insertBefore(this.node,a.node),this.paper=a.paper,b&&b.add(),a.parent()&&a.parent().add(),this},a.insertAfter=function(a){a=z(a);var b=this.parent();return a.node.parentNode.insertBefore(this.node,a.node.nextSibling),this.paper=a.paper,b&&b.add(),a.parent()&&a.parent().add(),this},a.remove=function(){var a=this.parent();return this.node.parentNode&&this.node.parentNode.removeChild(this.node),delete this.paper,this.removed=!0,a&&a.add(),this},a.select=function(a){return z(this.node.querySelector(a))},a.selectAll=function(a){for(var b=this.node.querySelectorAll(a),c=(d.set||Array)(),e=0;e<b.length;e++)c.push(z(b[e]));return c},a.asPX=function(a,b){return null==b&&(b=this.attr(a)),+s(this,a,b)},a.use=function(){var a,b=this.node.id;return b||(b=this.id,e(this.node,{id:b})),a="linearGradient"==this.type||"radialGradient"==this.type||"pattern"==this.type?x(this.type,this.node.parentNode):x("use",this.node.parentNode),e(a.node,{"xlink:href":"#"+b}),a.original=this,a},a.clone=function(){var a=z(this.node.cloneNode(!0));return e(a.node,"id")&&e(a.node,{id:a.id}),g(a),a.insertAfter(this),a},a.toDefs=function(){return r(this).appendChild(this.node),this},a.pattern=function(a,b,c,d){var g=x("pattern",r(this));return null==a&&(a=this.getBBox()),f(a,"object")&&"x"in a&&(b=a.y,c=a.width,d=a.height,a=a.x),e(g.node,{x:a,y:b,width:c,height:d,patternUnits:"userSpaceOnUse",id:g.id,viewBox:[a,b,c,d].join(" ")}),g.node.appendChild(this.node),g},a.marker=function(a,b,c,d,g,h){var i=x("marker",r(this));return null==a&&(a=this.getBBox()),f(a,"object")&&"x"in a&&(b=a.y,c=a.width,d=a.height,g=a.refX||a.cx,h=a.refY||a.cy,a=a.x),e(i.node,{viewBox:[a,b,c,d].join(" "),markerWidth:c,markerHeight:d,orient:"auto",refX:g||0,refY:h||0,id:i.id}),i.node.appendChild(this.node),i};var k=function(a,b,d,e){"function"!=typeof d||d.length||(e=d,d=c.linear),this.attr=a,this.dur=b,d&&(this.easing=d),e&&(this.callback=e)};d.animation=function(a,b,c,d){return new k(a,b,c,d)},a.inAnim=function(){var a=this,b=[];for(var c in a.anims)a.anims[J](c)&&function(a){b.push({anim:new k(a._attrs,a.dur,a.easing,a._callback),curStatus:a.status(),status:function(b){return a.status(b)},stop:function(){a.stop()}})}(a.anims[c]);return b},d.animate=function(a,d,e,f,g,h){"function"!=typeof g||g.length||(h=g,g=c.linear);var i=c.time(),j=c(a,d,i,i+f,c.time,e,g);return h&&b.once("mina.finish."+j.id,h),j},a.stop=function(){for(var a=this.inAnim(),b=0,c=a.length;c>b;b++)a[b].stop();return this},a.animate=function(a,d,e,g){"function"!=typeof e||e.length||(g=e,e=c.linear),a instanceof k&&(g=a.callback,e=a.easing,d=e.dur,a=a.attr);var i,j,l,m,n=[],o=[],p={},q=this;for(var r in a)if(a[J](r)){q.equal?(m=q.equal(r,K(a[r])),i=m.from,j=m.to,l=m.f):(i=+q.attr(r),j=+a[r]);var s=f(i,"array")?i.length:1;p[r]=h(n.length,n.length+s,l),n=n.concat(i),o=o.concat(j)}var t=c.time(),u=c(n,o,t,t+d,c.time,function(a){var b={};for(var c in p)p[J](c)&&(b[c]=p[c](a));q.attr(b)},e);return q.anims[u.id]=u,u._attrs=a,u._callback=g,b.once("mina.finish."+u.id,function(){delete q.anims[u.id],g&&g.call(q)}),b.once("mina.stop."+u.id,function(){delete q.anims[u.id]}),q};var l={};a.data=function(a,c){var e=l[this.id]=l[this.id]||{};if(0==arguments.length)return b("snap.data.get."+this.id,this,e,null),e;if(1==arguments.length){if(d.is(a,"object")){for(var f in a)a[J](f)&&this.data(f,a[f]);return this}return b("snap.data.get."+this.id,this,e[a],a),e[a]}return e[a]=c,b("snap.data.set."+this.id,this,c,a),this},a.removeData=function(a){return null==a?l[this.id]={}:l[this.id]&&delete l[this.id][a],this},a.outerSVG=a.toString=i(1),a.innerSVG=i()}(u.prototype),d.parse=function(a){var b=I.doc.createDocumentFragment(),c=!0,d=I.doc.createElement("div");if(a=K(a),a.match(/^\s*<\s*svg(?:\s|>)/)||(a="<svg>"+a+"</svg>",c=!1),d.innerHTML=a,a=d.getElementsByTagName("svg")[0])if(c)b=a;else for(;a.firstChild;)b.appendChild(a.firstChild);return d.innerHTML=S,new w(b)},w.prototype.select=u.prototype.select,w.prototype.selectAll=u.prototype.selectAll,d.fragment=function(){for(var a=Array.prototype.slice.call(arguments,0),b=I.doc.createDocumentFragment(),c=0,e=a.length;e>c;c++){var f=a[c];f.node&&f.node.nodeType&&b.appendChild(f.node),f.nodeType&&b.appendChild(f),"string"==typeof f&&b.appendChild(d.parse(f).node)}return new w(b)},function(a){a.el=function(a,b){return x(a,this.node).attr(b)},a.rect=function(a,b,c,d,e,g){var h;return null==g&&(g=e),f(a,"object")&&"x"in a?h=a:null!=a&&(h={x:a,y:b,width:c,height:d},null!=e&&(h.rx=e,h.ry=g)),this.el("rect",h)},a.circle=function(a,b,c){var d;return f(a,"object")&&"cx"in a?d=a:null!=a&&(d={cx:a,cy:b,r:c}),this.el("circle",d)},a.image=function(a,b,c,d,g){var h=x("image",this.node);if(f(a,"object")&&"src"in a)h.attr(a);else if(null!=a){var i={"xlink:href":a,preserveAspectRatio:"none"};null!=b&&null!=c&&(i.x=b,i.y=c),null!=d&&null!=g?(i.width=d,i.height=g):ia(a,function(){e(h.node,{width:this.offsetWidth,height:this.offsetHeight})}),e(h.node,i)}return h},a.ellipse=function(a,b,c,d){var e=x("ellipse",this.node);return f(a,"object")&&"cx"in a?e.attr(a):null!=a&&e.attr({cx:a,cy:b,rx:c,ry:d}),e},a.path=function(a){var b=x("path",this.node);return f(a,"object")&&!f(a,"array")?b.attr(a):a&&b.attr({d:a}),b},a.group=a.g=function(b){var c=x("g",this.node);c.add=t;for(var d in a)a[J](d)&&(c[d]=a[d]);return 1==arguments.length&&b&&!b.type?c.attr(b):arguments.length&&c.add(Array.prototype.slice.call(arguments,0)),c},a.text=function(a,b,c){var d=x("text",this.node);return f(a,"object")?d.attr(a):null!=a&&d.attr({x:a,y:b,text:c||""}),d},a.line=function(a,b,c,d){var e=x("line",this.node);return f(a,"object")?e.attr(a):null!=a&&e.attr({x1:a,x2:c,y1:b,y2:d}),e},a.polyline=function(a){arguments.length>1&&(a=Array.prototype.slice.call(arguments,0));var b=x("polyline",this.node);return f(a,"object")&&!f(a,"array")?b.attr(a):null!=a&&b.attr({points:a}),b},a.polygon=function(a){arguments.length>1&&(a=Array.prototype.slice.call(arguments,0));var b=x("polygon",this.node);return f(a,"object")&&!f(a,"array")?b.attr(a):null!=a&&b.attr({points:a}),b},function(){a.gradient=function(a){return D(this.defs,a)},a.gradientLinear=function(a,b,c,d){return E(this.defs,a,b,c,d)},a.gradientRadial=function(a,b,c,d,e){return F(this.defs,a,b,c,d,e)},a.toString=function(){var a,b=I.doc.createDocumentFragment(),c=I.doc.createElement("div"),d=this.node.cloneNode(!0);return b.appendChild(c),c.appendChild(d),e(d,{xmlns:fa}),a=c.innerHTML,b.removeChild(b.firstChild),a},a.clear=function(){for(var a,b=this.node.firstChild;b;)a=b.nextSibling,"defs"!=b.tagName&&b.parentNode.removeChild(b),b=a}}()}(y.prototype),d.ajax=function(a,c,d,e){var g=new XMLHttpRequest,h=da();if(g){if(f(c,"function"))e=d,d=c,c=null;else if(f(c,"object")){var i=[];for(var j in c)c.hasOwnProperty(j)&&i.push(encodeURIComponent(j)+"="+encodeURIComponent(c[j]));c=i.join("&")}return g.open(c?"POST":"GET",a,!0),g.setRequestHeader("X-Requested-With","XMLHttpRequest"),c&&g.setRequestHeader("Content-type","application/x-www-form-urlencoded"),d&&(b.once("snap.ajax."+h+".0",d),b.once("snap.ajax."+h+".200",d),b.once("snap.ajax."+h+".304",d)),g.onreadystatechange=function(){4==g.readyState&&b("snap.ajax."+h+"."+g.status,e,g)},4==g.readyState?g:(g.send(c),g)}},d.load=function(a,b,c){d.ajax(a,function(a){var e=d.parse(a.responseText);c?b.call(c,e):b(e)})},b.on("snap.util.attr.mask",function(a){if(a instanceof u||a instanceof w){if(b.stop(),a instanceof w&&1==a.node.childNodes.length&&(a=a.node.firstChild,r(this).appendChild(a),a=z(a)),"mask"==a.type)var c=a;else c=x("mask",r(this)),c.node.appendChild(a.node),!c.node.id&&e(c.node,{id:c.id});e(this.node,{mask:ha(c.id)})}}),function(a){b.on("snap.util.attr.clip",a),b.on("snap.util.attr.clip-path",a),b.on("snap.util.attr.clipPath",a)}(function(a){if(a instanceof u||a instanceof w){if(b.stop(),"clipPath"==a.type)var c=a;else c=x("clipPath",r(this)),c.node.appendChild(a.node),!c.node.id&&e(c.node,{id:c.id});e(this.node,{"clip-path":ha(c.id)})}}),b.on("snap.util.attr.fill",G("fill")),b.on("snap.util.attr.stroke",G("stroke"));var ra=/^([lr])(?:\(([^)]*)\))?(.*)$/i;b.on("snap.util.grad.parse",function(a){a=K(a);var b=a.match(ra);if(!b)return null;var c=b[1],d=b[2],e=b[3];return d=d.split(/\s*,\s*/).map(function(a){return+a==a?+a:a}),1==d.length&&0==d[0]&&(d=[]),e=e.split("-"),e=e.map(function(a){a=a.split(":");var b={color:a[0]};return a[1]&&(b.offset=a[1]),b}),{type:c,params:d,stops:e}}),b.on("snap.util.attr.d",function(a){b.stop(),f(a,"array")&&f(a[0],"array")&&(a=d.path.toString.call(a)),a=K(a),a.match(/[ruo]/i)&&(a=d.path.toAbsolute(a)),e(this.node,{d:a})})(-1),b.on("snap.util.attr.#text",function(a){b.stop(),a=K(a);for(var c=I.doc.createTextNode(a);this.node.firstChild;)this.node.removeChild(this.node.firstChild);this.node.appendChild(c)})(-1),b.on("snap.util.attr.path",function(a){b.stop(),this.attr({d:a})})(-1),b.on("snap.util.attr.viewBox",function(a){var c;c=f(a,"object")&&"x"in a?[a.x,a.y,a.width,a.height].join(" "):f(a,"array")?a.join(" "):a,e(this.node,{viewBox:c}),b.stop()})(-1),b.on("snap.util.attr.transform",function(a){this.transform(a),b.stop()})(-1),b.on("snap.util.attr.r",function(a){"rect"==this.type&&(b.stop(),e(this.node,{rx:a,ry:a}))})(-1),b.on("snap.util.attr.textpath",function(a){if(b.stop(),"text"==this.type){var c,d,g;if(!a&&this.textPath){for(d=this.textPath;d.node.firstChild;)this.node.appendChild(d.node.firstChild);return d.remove(),void delete this.textPath}if(f(a,"string")){var h=r(this),i=z(h.parentNode).path(a);h.appendChild(i.node),c=i.id,i.attr({id:c})}else(a=z(a))instanceof u&&((c=a.attr("id"))||(c=a.id,a.attr({id:c})));if(c)if(d=this.textPath,g=this.node,d)d.attr({"xlink:href":"#"+c});else{for(d=e("textPath",{"xlink:href":"#"+c});g.firstChild;)d.appendChild(g.firstChild);g.appendChild(d),this.textPath=z(d)}}})(-1),b.on("snap.util.attr.text",function(a){if("text"==this.type){for(var c=this.node,d=function(a){var b=e("tspan");if(f(a,"array"))for(var c=0;c<a.length;c++)b.appendChild(d(a[c]));else b.appendChild(I.doc.createTextNode(a));return b.normalize&&b.normalize(),b};c.firstChild;)c.removeChild(c.firstChild);for(var g=d(a);g.firstChild;)c.appendChild(g.firstChild)}b.stop()})(-1);var sa={"alignment-baseline":0,"baseline-shift":0,clip:0,"clip-path":0,"clip-rule":0,color:0,"color-interpolation":0,"color-interpolation-filters":0,"color-profile":0,"color-rendering":0,cursor:0,direction:0,display:0,"dominant-baseline":0,"enable-background":0,fill:0,"fill-opacity":0,"fill-rule":0,filter:0,"flood-color":0,"flood-opacity":0,font:0,"font-family":0,"font-size":0,"font-size-adjust":0,"font-stretch":0,"font-style":0,"font-variant":0,"font-weight":0,"glyph-orientation-horizontal":0,"glyph-orientation-vertical":0,"image-rendering":0,kerning:0,"letter-spacing":0,"lighting-color":0,marker:0,"marker-end":0,"marker-mid":0,"marker-start":0,mask:0,opacity:0,overflow:0,"pointer-events":0,"shape-rendering":0,"stop-color":0,"stop-opacity":0,stroke:0,"stroke-dasharray":0,"stroke-dashoffset":0,"stroke-linecap":0,"stroke-linejoin":0,"stroke-miterlimit":0,"stroke-opacity":0,"stroke-width":0,"text-anchor":0,"text-decoration":0,"text-rendering":0,"unicode-bidi":0,visibility:0,"word-spacing":0,"writing-mode":0};b.on("snap.util.attr",function(a){var c=b.nt(),d={};c=c.substring(c.lastIndexOf(".")+1),d[c]=a;var f=c.replace(/-(\w)/gi,function(a,b){return b.toUpperCase()}),g=c.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()});sa[J](g)?this.node.style[f]=null==a?S:a:e(this.node,d)}),b.on("snap.util.getattr.transform",function(){return b.stop(),this.transform()})(-1),b.on("snap.util.getattr.textpath",function(){return b.stop(),this.textPath})(-1),function(){function a(a){return function(){b.stop();var c=I.doc.defaultView.getComputedStyle(this.node,null).getPropertyValue("marker-"+a);return"none"==c?c:d(I.doc.getElementById(c.match(V)[1]))}}function c(a){return function(c){b.stop();var d="marker"+a.charAt(0).toUpperCase()+a.substring(1);if(""==c||!c)return void(this.node.style[d]="none");if("marker"==c.type){var f=c.node.id;return f||e(c.node,{id:c.id}),void(this.node.style[d]=ha(f))}}}b.on("snap.util.getattr.marker-end",a("end"))(-1),b.on("snap.util.getattr.markerEnd",a("end"))(-1),b.on("snap.util.getattr.marker-start",a("start"))(-1),b.on("snap.util.getattr.markerStart",a("start"))(-1),b.on("snap.util.getattr.marker-mid",a("mid"))(-1),b.on("snap.util.getattr.markerMid",a("mid"))(-1),b.on("snap.util.attr.marker-end",c("end"))(-1),b.on("snap.util.attr.markerEnd",c("end"))(-1),b.on("snap.util.attr.marker-start",c("start"))(-1),b.on("snap.util.attr.markerStart",c("start"))(-1),b.on("snap.util.attr.marker-mid",c("mid"))(-1),b.on("snap.util.attr.markerMid",c("mid"))(-1)}(),b.on("snap.util.getattr.r",function(){return"rect"==this.type&&e(this.node,"rx")==e(this.node,"ry")?(b.stop(),e(this.node,"rx")):void 0})(-1),b.on("snap.util.getattr.text",function(){if("text"==this.type||"tspan"==this.type){b.stop();var a=H(this.node);return 1==a.length?a[0]:a}})(-1),b.on("snap.util.getattr.#text",function(){return this.node.textContent})(-1),b.on("snap.util.getattr.viewBox",function(){b.stop();var a=e(this.node,"viewBox").split(X);return d._.box(+a[0],+a[1],+a[2],+a[3])})(-1),b.on("snap.util.getattr.points",function(){var a=e(this.node,"points");return b.stop(),a.split(X)}),b.on("snap.util.getattr.path",function(){var a=e(this.node,"d");return b.stop(),a}),b.on("snap.util.getattr",function(){var a=b.nt();a=a.substring(a.lastIndexOf(".")+1);var c=a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()});return sa[J](c)?I.doc.defaultView.getComputedStyle(this.node,null).getPropertyValue(c):e(this.node,a)});var ta=function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,h=e.clientLeft||d.clientLeft||0;return{y:b.top+(g.win.pageYOffset||e.scrollTop||d.scrollTop)-f,x:b.left+(g.win.pageXOffset||e.scrollLeft||d.scrollLeft)-h}};return d.getElementByPoint=function(a,b){var c=this,d=(c.canvas,I.doc.elementFromPoint(a,b));if(I.win.opera&&"svg"==d.tagName){var e=ta(d),f=d.createSVGRect();f.x=a-e.x,f.y=b-e.y,f.width=f.height=1;var g=d.getIntersectionList(f,null);g.length&&(d=g[g.length-1])}return d?z(d):null},d.plugin=function(a){a(d,u,y,I)},I.win.Snap=d,d}();return d.plugin(function(a,b){function c(a){var b=c.ps=c.ps||{};return b[a]?b[a].sleep=100:b[a]={sleep:100},setTimeout(function(){for(var c in b)b[L](c)&&c!=a&&!--b[c].sleep&&delete b[c]}),b[a]}function d(a,b,c,d){return null==a&&(a=b=c=d=0),null==b&&(b=a.y,c=a.width,d=a.height,a=a.x),{x:a,y:b,width:c,w:c,height:d,h:d,x2:a+c,y2:b+d,cx:a+c/2,cy:b+d/2,r1:O.min(c,d)/2,r2:O.max(c,d)/2,r0:O.sqrt(c*c+d*d)/2,path:w(a,b,c,d),vb:[a,b,c,d].join(" ")}}function e(){return this.join(",").replace(M,"$1")}function f(a){var b=K(a);return b.toString=e,b}function g(a,b,c,d,e,f,g,h,j){return null==j?n(a,b,c,d,e,f,g,h):i(a,b,c,d,e,f,g,h,o(a,b,c,d,e,f,g,h,j))}function h(c,d){function e(a){return+(+a).toFixed(3)}return a._.cacher(function(a,f,h){a instanceof b&&(a=a.attr("d")),a=F(a);for(var j,k,l,m,n,o="",p={},q=0,r=0,s=a.length;s>r;r++){if(l=a[r],"M"==l[0])j=+l[1],k=+l[2];else{if(m=g(j,k,l[1],l[2],l[3],l[4],l[5],l[6]),q+m>f){if(d&&!p.start){if(n=g(j,k,l[1],l[2],l[3],l[4],l[5],l[6],f-q),o+=["C"+e(n.start.x),e(n.start.y),e(n.m.x),e(n.m.y),e(n.x),e(n.y)],h)return o;p.start=o,o=["M"+e(n.x),e(n.y)+"C"+e(n.n.x),e(n.n.y),e(n.end.x),e(n.end.y),e(l[5]),e(l[6])].join(),q+=m,j=+l[5],k=+l[6];continue}if(!c&&!d)return n=g(j,k,l[1],l[2],l[3],l[4],l[5],l[6],f-q)}q+=m,j=+l[5],k=+l[6]}o+=l.shift()+l}return p.end=o,n=c?q:d?p:i(j,k,l[0],l[1],l[2],l[3],l[4],l[5],1)},null,a._.clone)}function i(a,b,c,d,e,f,g,h,i){var j=1-i,k=S(j,3),l=S(j,2),m=i*i,n=m*i,o=k*a+3*l*i*c+3*j*i*i*e+n*g,p=k*b+3*l*i*d+3*j*i*i*f+n*h,q=a+2*i*(c-a)+m*(e-2*c+a),r=b+2*i*(d-b)+m*(f-2*d+b),s=c+2*i*(e-c)+m*(g-2*e+c),t=d+2*i*(f-d)+m*(h-2*f+d);return{x:o,y:p,m:{x:q,y:r},n:{x:s,y:t},start:{x:j*a+i*c,y:j*b+i*d},end:{x:j*e+i*g,y:j*f+i*h},alpha:90-180*O.atan2(q-s,r-t)/P}}function j(b,c,e,f,g,h,i,j){a.is(b,"array")||(b=[b,c,e,f,g,h,i,j]);var k=E.apply(null,b);return d(k.min.x,k.min.y,k.max.x-k.min.x,k.max.y-k.min.y)}function k(a,b,c){return b>=a.x&&b<=a.x+a.width&&c>=a.y&&c<=a.y+a.height}function l(a,b){return a=d(a),b=d(b),k(b,a.x,a.y)||k(b,a.x2,a.y)||k(b,a.x,a.y2)||k(b,a.x2,a.y2)||k(a,b.x,b.y)||k(a,b.x2,b.y)||k(a,b.x,b.y2)||k(a,b.x2,b.y2)||(a.x<b.x2&&a.x>b.x||b.x<a.x2&&b.x>a.x)&&(a.y<b.y2&&a.y>b.y||b.y<a.y2&&b.y>a.y)}function m(a,b,c,d,e){return a*(a*(-3*b+9*c-9*d+3*e)+6*b-12*c+6*d)-3*b+3*c}function n(a,b,c,d,e,f,g,h,i){null==i&&(i=1),i=i>1?1:0>i?0:i;for(var j=i/2,k=[-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],l=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],n=0,o=0;12>o;o++){var p=j*k[o]+j,q=m(p,a,c,e,g),r=m(p,b,d,f,h),s=q*q+r*r;n+=l[o]*O.sqrt(s)}return j*n}function o(a,b,c,d,e,f,g,h,i){if(!(0>i||n(a,b,c,d,e,f,g,h)<i)){var j,k=.5,l=1-k;for(j=n(a,b,c,d,e,f,g,h,l);T(j-i)>.01;)k/=2,l+=(i>j?1:-1)*k,j=n(a,b,c,d,e,f,g,h,l);return l}}function p(a,b,c,d,e,f,g,h){if(!(R(a,c)<Q(e,g)||Q(a,c)>R(e,g)||R(b,d)<Q(f,h)||Q(b,d)>R(f,h))){var i=(a*d-b*c)*(e-g)-(a-c)*(e*h-f*g),j=(a*d-b*c)*(f-h)-(b-d)*(e*h-f*g),k=(a-c)*(f-h)-(b-d)*(e-g);if(k){var l=i/k,m=j/k,n=+l.toFixed(2),o=+m.toFixed(2);if(!(n<+Q(a,c).toFixed(2)||n>+R(a,c).toFixed(2)||n<+Q(e,g).toFixed(2)||n>+R(e,g).toFixed(2)||o<+Q(b,d).toFixed(2)||o>+R(b,d).toFixed(2)||o<+Q(f,h).toFixed(2)||o>+R(f,h).toFixed(2)))return{x:l,y:m}}}}function q(a,b,c){if(!l(j(a),j(b)))return c?0:[];for(var d=n.apply(0,a),e=n.apply(0,b),f=~~(d/5),g=~~(e/5),h=[],k=[],m={},o=c?0:[],q=0;f+1>q;q++){var r=i.apply(0,a.concat(q/f));h.push({x:r.x,y:r.y,t:q/f})}for(q=0;g+1>q;q++)r=i.apply(0,b.concat(q/g)),k.push({x:r.x,y:r.y,t:q/g});for(q=0;f>q;q++)for(var s=0;g>s;s++){var t=h[q],u=h[q+1],v=k[s],w=k[s+1],x=T(u.x-t.x)<.001?"y":"x",y=T(w.x-v.x)<.001?"y":"x",z=p(t.x,t.y,u.x,u.y,v.x,v.y,w.x,w.y);if(z){if(m[z.x.toFixed(4)]==z.y.toFixed(4))continue;m[z.x.toFixed(4)]=z.y.toFixed(4);var A=t.t+T((z[x]-t[x])/(u[x]-t[x]))*(u.t-t.t),B=v.t+T((z[y]-v[y])/(w[y]-v[y]))*(w.t-v.t);A>=0&&1>=A&&B>=0&&1>=B&&(c?o++:o.push({x:z.x,y:z.y,t1:A,t2:B}))}}return o}function r(a,b){return t(a,b)}function s(a,b){return t(a,b,1)}function t(a,b,c){a=F(a),b=F(b);for(var d,e,f,g,h,i,j,k,l,m,n=c?0:[],o=0,p=a.length;p>o;o++){var r=a[o];if("M"==r[0])d=h=r[1],e=i=r[2];else{"C"==r[0]?(l=[d,e].concat(r.slice(1)),d=l[6],e=l[7]):(l=[d,e,d,e,h,i,h,i],d=h,e=i);for(var s=0,t=b.length;t>s;s++){var u=b[s];if("M"==u[0])f=j=u[1],g=k=u[2];else{"C"==u[0]?(m=[f,g].concat(u.slice(1)),f=m[6],g=m[7]):(m=[f,g,f,g,j,k,j,k],f=j,g=k);var v=q(l,m,c);if(c)n+=v;else{for(var w=0,x=v.length;x>w;w++)v[w].segment1=o,v[w].segment2=s,v[w].bez1=l,v[w].bez2=m;n=n.concat(v)}}}}}return n}function u(a,b,c){var d=v(a);return k(d,b,c)&&1==t(a,[["M",b,c],["H",d.x2+10]],1)%2}function v(a){var b=c(a);if(b.bbox)return K(b.bbox);if(!a)return d();a=F(a);for(var e,f=0,g=0,h=[],i=[],j=0,k=a.length;k>j;j++)if(e=a[j],"M"==e[0])f=e[1],g=e[2],h.push(f),i.push(g);else{var l=E(f,g,e[1],e[2],e[3],e[4],e[5],e[6]);h=h.concat(l.min.x,l.max.x),i=i.concat(l.min.y,l.max.y),f=e[5],g=e[6]}var m=Q.apply(0,h),n=Q.apply(0,i),o=R.apply(0,h),p=R.apply(0,i),q=d(m,n,o-m,p-n);return b.bbox=K(q),q}function w(a,b,c,d,f){if(f)return[["M",a+f,b],["l",c-2*f,0],["a",f,f,0,0,1,f,f],["l",0,d-2*f],["a",f,f,0,0,1,-f,f],["l",2*f-c,0],["a",f,f,0,0,1,-f,-f],["l",0,2*f-d],["a",f,f,0,0,1,f,-f],["z"]];var g=[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]];return g.toString=e,g}function x(a,b,c,d,f){if(null==f&&null==d&&(d=c),null!=f)var g=Math.PI/180,h=a+c*Math.cos(-d*g),i=a+c*Math.cos(-f*g),j=b+c*Math.sin(-d*g),k=b+c*Math.sin(-f*g),l=[["M",h,j],["A",c,c,0,+(f-d>180),0,i,k]];else l=[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]];return l.toString=e,l}function y(b){var d=c(b),g=String.prototype.toLowerCase;if(d.rel)return f(d.rel);a.is(b,"array")&&a.is(b&&b[0],"array")||(b=a.parsePathString(b));var h=[],i=0,j=0,k=0,l=0,m=0;"M"==b[0][0]&&(i=b[0][1],j=b[0][2],k=i,l=j,m++,h.push(["M",i,j]));for(var n=m,o=b.length;o>n;n++){var p=h[n]=[],q=b[n];if(q[0]!=g.call(q[0]))switch(p[0]=g.call(q[0]),p[0]){case"a":p[1]=q[1],p[2]=q[2],p[3]=q[3],p[4]=q[4],p[5]=q[5],p[6]=+(q[6]-i).toFixed(3),p[7]=+(q[7]-j).toFixed(3);break;case"v":p[1]=+(q[1]-j).toFixed(3);break;case"m":k=q[1],l=q[2];default:for(var r=1,s=q.length;s>r;r++)p[r]=+(q[r]-(r%2?i:j)).toFixed(3)}else{p=h[n]=[],"m"==q[0]&&(k=q[1]+i,l=q[2]+j);for(var t=0,u=q.length;u>t;t++)h[n][t]=q[t]}var v=h[n].length;switch(h[n][0]){case"z":i=k,j=l;break;case"h":i+=+h[n][v-1];break;case"v":j+=+h[n][v-1];break;default:i+=+h[n][v-2],j+=+h[n][v-1]}}return h.toString=e,d.rel=f(h),h}function z(b){var d=c(b);if(d.abs)return f(d.abs);if(J(b,"array")&&J(b&&b[0],"array")||(b=a.parsePathString(b)),!b||!b.length)return[["M",0,0]];var g,h=[],i=0,j=0,k=0,l=0,m=0;"M"==b[0][0]&&(i=+b[0][1],j=+b[0][2],k=i,l=j,m++,h[0]=["M",i,j]);for(var n,o,p=3==b.length&&"M"==b[0][0]&&"R"==b[1][0].toUpperCase()&&"Z"==b[2][0].toUpperCase(),q=m,r=b.length;r>q;q++){if(h.push(n=[]),o=b[q],(g=o[0])!=g.toUpperCase())switch(n[0]=g.toUpperCase(),n[0]){case"A":n[1]=o[1],n[2]=o[2],n[3]=o[3],n[4]=o[4],n[5]=o[5],n[6]=+(o[6]+i),n[7]=+(o[7]+j);break;case"V":n[1]=+o[1]+j;break;case"H":n[1]=+o[1]+i;break;case"R":for(var s=[i,j].concat(o.slice(1)),t=2,u=s.length;u>t;t++)s[t]=+s[t]+i,s[++t]=+s[t]+j;h.pop(),h=h.concat(H(s,p));break;case"O":h.pop(),s=x(i,j,o[1],o[2]),s.push(s[0]),h=h.concat(s);break;case"U":h.pop(),h=h.concat(x(i,j,o[1],o[2],o[3])),n=["U"].concat(h[h.length-1].slice(-2));break;case"M":k=+o[1]+i,l=+o[2]+j;default:for(t=1,u=o.length;u>t;t++)n[t]=+o[t]+(t%2?i:j)}else if("R"==g)s=[i,j].concat(o.slice(1)),h.pop(),h=h.concat(H(s,p)),n=["R"].concat(o.slice(-2));else if("O"==g)h.pop(),s=x(i,j,o[1],o[2]),s.push(s[0]),h=h.concat(s);else if("U"==g)h.pop(),h=h.concat(x(i,j,o[1],o[2],o[3])),n=["U"].concat(h[h.length-1].slice(-2));else for(var v=0,w=o.length;w>v;v++)n[v]=o[v];if("O"!=(g=g.toUpperCase()))switch(n[0]){case"Z":i=k,j=l;break;case"H":i=n[1];break;case"V":j=n[1];break;case"M":k=n[n.length-2],l=n[n.length-1];default:i=n[n.length-2],j=n[n.length-1]}}return h.toString=e,d.abs=f(h),h}function A(a,b,c,d){return[a,b,c,d,c,d]}function B(a,b,c,d,e,f){var g=1/3,h=2/3;return[g*a+h*c,g*b+h*d,g*e+h*c,g*f+h*d,e,f]}function C(b,c,d,e,f,g,h,i,j,k){var l,m=120*P/180,n=P/180*(+f||0),o=[],p=a._.cacher(function(a,b,c){return{x:a*O.cos(c)-b*O.sin(c),y:a*O.sin(c)+b*O.cos(c)}});if(k)y=k[0],z=k[1],w=k[2],x=k[3];else{l=p(b,c,-n),b=l.x,c=l.y,l=p(i,j,-n),i=l.x,j=l.y;var q=(O.cos(P/180*f),O.sin(P/180*f),(b-i)/2),r=(c-j)/2,s=q*q/(d*d)+r*r/(e*e);s>1&&(s=O.sqrt(s),d*=s,e*=s);var t=d*d,u=e*e,v=(g==h?-1:1)*O.sqrt(T((t*u-t*r*r-u*q*q)/(t*r*r+u*q*q))),w=v*d*r/e+(b+i)/2,x=v*-e*q/d+(c+j)/2,y=O.asin(((c-x)/e).toFixed(9)),z=O.asin(((j-x)/e).toFixed(9));y=w>b?P-y:y,z=w>i?P-z:z,0>y&&(y=2*P+y),0>z&&(z=2*P+z),h&&y>z&&(y-=2*P),!h&&z>y&&(z-=2*P)}var A=z-y;if(T(A)>m){var B=z,D=i,E=j;z=y+m*(h&&z>y?1:-1),i=w+d*O.cos(z),j=x+e*O.sin(z),o=C(i,j,d,e,f,0,h,D,E,[z,B,w,x])}A=z-y;var F=O.cos(y),G=O.sin(y),H=O.cos(z),I=O.sin(z),J=O.tan(A/4),K=4/3*d*J,L=4/3*e*J,M=[b,c],N=[b+K*G,c-L*F],Q=[i+K*I,j-L*H],R=[i,j];if(N[0]=2*M[0]-N[0],N[1]=2*M[1]-N[1],k)return[N,Q,R].concat(o);o=[N,Q,R].concat(o).join().split(",");for(var S=[],U=0,V=o.length;V>U;U++)S[U]=U%2?p(o[U-1],o[U],n).y:p(o[U],o[U+1],n).x;return S}function D(a,b,c,d,e,f,g,h,i){var j=1-i;return{x:S(j,3)*a+3*S(j,2)*i*c+3*j*i*i*e+S(i,3)*g,y:S(j,3)*b+3*S(j,2)*i*d+3*j*i*i*f+S(i,3)*h}}function E(a,b,c,d,e,f,g,h){var i,j=e-2*c+a-(g-2*e+c),k=2*(c-a)-2*(e-c),l=a-c,m=(-k+O.sqrt(k*k-4*j*l))/2/j,n=(-k-O.sqrt(k*k-4*j*l))/2/j,o=[b,h],p=[a,g];return T(m)>"1e12"&&(m=.5),T(n)>"1e12"&&(n=.5),m>0&&1>m&&(i=D(a,b,c,d,e,f,g,h,m),p.push(i.x),o.push(i.y)),n>0&&1>n&&(i=D(a,b,c,d,e,f,g,h,n),p.push(i.x),o.push(i.y)),j=f-2*d+b-(h-2*f+d),k=2*(d-b)-2*(f-d),l=b-d,m=(-k+O.sqrt(k*k-4*j*l))/2/j,n=(-k-O.sqrt(k*k-4*j*l))/2/j,T(m)>"1e12"&&(m=.5),T(n)>"1e12"&&(n=.5),m>0&&1>m&&(i=D(a,b,c,d,e,f,g,h,m),p.push(i.x),o.push(i.y)),n>0&&1>n&&(i=D(a,b,c,d,e,f,g,h,n),p.push(i.x),o.push(i.y)),{min:{x:Q.apply(0,p),y:Q.apply(0,o)},max:{x:R.apply(0,p),y:R.apply(0,o)}}}function F(a,b){var d=!b&&c(a);if(!b&&d.curve)return f(d.curve);for(var e=z(a),g=b&&z(b),h={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},i={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},j=(function(a,b){var c,d;if(!a)return["C",b.x,b.y,b.x,b.y,b.x,b.y];switch(!(a[0]in{T:1,Q:1})&&(b.qx=b.qy=null),a[0]){case"M":b.X=a[1],b.Y=a[2];break;case"A":a=["C"].concat(C.apply(0,[b.x,b.y].concat(a.slice(1))));break;case"S":c=b.x+(b.x-(b.bx||b.x)),d=b.y+(b.y-(b.by||b.y)),a=["C",c,d].concat(a.slice(1));break;case"T":b.qx=b.x+(b.x-(b.qx||b.x)),b.qy=b.y+(b.y-(b.qy||b.y)),a=["C"].concat(B(b.x,b.y,b.qx,b.qy,a[1],a[2]));break;case"Q":b.qx=a[1],b.qy=a[2],a=["C"].concat(B(b.x,b.y,a[1],a[2],a[3],a[4]));break;case"L":a=["C"].concat(A(b.x,b.y,a[1],a[2]));break;case"H":a=["C"].concat(A(b.x,b.y,a[1],b.y));break;case"V":a=["C"].concat(A(b.x,b.y,b.x,a[1]));break;case"Z":a=["C"].concat(A(b.x,b.y,b.X,b.Y))}return a}),k=function(a,b){if(a[b].length>7){a[b].shift();for(var c=a[b];c.length;)a.splice(b++,0,["C"].concat(c.splice(0,6)));a.splice(b,1),n=R(e.length,g&&g.length||0)}},l=function(a,b,c,d,f){a&&b&&"M"==a[f][0]&&"M"!=b[f][0]&&(b.splice(f,0,["M",d.x,d.y]),c.bx=0,c.by=0,c.x=a[f][1],c.y=a[f][2],n=R(e.length,g&&g.length||0))},m=0,n=R(e.length,g&&g.length||0);n>m;m++){e[m]=j(e[m],h),k(e,m),g&&(g[m]=j(g[m],i)),g&&k(g,m),l(e,g,h,i,m),l(g,e,i,h,m);var o=e[m],p=g&&g[m],q=o.length,r=g&&p.length;h.x=o[q-2],h.y=o[q-1],h.bx=N(o[q-4])||h.x,h.by=N(o[q-3])||h.y,i.bx=g&&(N(p[r-4])||i.x),i.by=g&&(N(p[r-3])||i.y),i.x=g&&p[r-2],i.y=g&&p[r-1]}return g||(d.curve=f(e)),g?[e,g]:e}function G(a,b){if(!b)return a;var c,d,e,f,g,h,i;for(a=F(a),e=0,g=a.length;g>e;e++)for(i=a[e],f=1,h=i.length;h>f;f+=2)c=b.x(i[f],i[f+1]),d=b.y(i[f],i[f+1]),i[f]=c,i[f+1]=d;return a}function H(a,b){for(var c=[],d=0,e=a.length;e-2*!b>d;d+=2){var f=[{x:+a[d-2],y:+a[d-1]},{x:+a[d],y:+a[d+1]},{x:+a[d+2],y:+a[d+3]},{x:+a[d+4],y:+a[d+5]}];b?d?e-4==d?f[3]={x:+a[0],y:+a[1]}:e-2==d&&(f[2]={x:+a[0],y:+a[1]},f[3]={x:+a[2],y:+a[3]}):f[0]={x:+a[e-2],y:+a[e-1]}:e-4==d?f[3]=f[2]:d||(f[0]={x:+a[d],y:+a[d+1]}),c.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])}return c}var I=b.prototype,J=a.is,K=a._.clone,L="hasOwnProperty",M=/,?([a-z]),?/gi,N=parseFloat,O=Math,P=O.PI,Q=O.min,R=O.max,S=O.pow,T=O.abs,U=h(1),V=h(),W=h(0,1),X=a._unit2px,Y={path:function(a){return a.attr("path")},circle:function(a){var b=X(a);return x(b.cx,b.cy,b.r)},ellipse:function(a){var b=X(a);return x(b.cx,b.cy,b.rx,b.ry)},rect:function(a){var b=X(a)
;return w(b.x,b.y,b.width,b.height,b.rx,b.ry)},image:function(a){var b=X(a);return w(b.x,b.y,b.width,b.height)},text:function(a){var b=a.node.getBBox();return w(b.x,b.y,b.width,b.height)},g:function(a){var b=a.node.getBBox();return w(b.x,b.y,b.width,b.height)},symbol:function(a){var b=a.getBBox();return w(b.x,b.y,b.width,b.height)},line:function(a){return"M"+[a.attr("x1"),a.attr("y1"),a.attr("x2"),a.attr("y2")]},polyline:function(a){return"M"+a.attr("points")},polygon:function(a){return"M"+a.attr("points")+"z"},svg:function(a){var b=a.node.getBBox();return w(b.x,b.y,b.width,b.height)},deflt:function(a){var b=a.node.getBBox();return w(b.x,b.y,b.width,b.height)}};a.path=c,a.path.getTotalLength=U,a.path.getPointAtLength=V,a.path.getSubpath=function(a,b,c){if(this.getTotalLength(a)-c<1e-6)return W(a,b).end;var d=W(a,c,1);return b?W(d,b).end:d},I.getTotalLength=function(){return this.node.getTotalLength?this.node.getTotalLength():void 0},I.getPointAtLength=function(a){return V(this.attr("d"),a)},I.getSubpath=function(b,c){return a.path.getSubpath(this.attr("d"),b,c)},a._.box=d,a.path.findDotsAtSegment=i,a.path.bezierBBox=j,a.path.isPointInsideBBox=k,a.path.isBBoxIntersect=l,a.path.intersection=r,a.path.intersectionNumber=s,a.path.isPointInside=u,a.path.getBBox=v,a.path.get=Y,a.path.toRelative=y,a.path.toAbsolute=z,a.path.toCubic=F,a.path.map=G,a.path.toString=e,a.path.clone=f}),d.plugin(function(a){var b=Math.max,c=Math.min,d=function(a){if(this.items=[],this.length=0,this.type="set",a)for(var b=0,c=a.length;c>b;b++)a[b]&&(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)},e=d.prototype;e.push=function(){for(var a,b,c=0,d=arguments.length;d>c;c++)(a=arguments[c])&&(b=this.items.length,this[b]=this.items[b]=a,this.length++);return this},e.pop=function(){return this.length&&delete this[this.length--],this.items.pop()},e.forEach=function(a,b){for(var c=0,d=this.items.length;d>c;c++)if(!1===a.call(b,this.items[c],c))return this;return this},e.remove=function(){for(;this.length;)this.pop().remove();return this},e.attr=function(a){for(var b=0,c=this.items.length;c>b;b++)this.items[b].attr(a);return this},e.clear=function(){for(;this.length;)this.pop()},e.splice=function(a,e){a=0>a?b(this.length+a,0):a,e=b(0,c(this.length-a,e));var f,g=[],h=[],i=[];for(f=2;f<arguments.length;f++)i.push(arguments[f]);for(f=0;e>f;f++)h.push(this[a+f]);for(;f<this.length-a;f++)g.push(this[a+f]);var j=i.length;for(f=0;f<j+g.length;f++)this.items[a+f]=this[a+f]=j>f?i[f]:g[f-j];for(f=this.items.length=this.length-=e-j;this[f];)delete this[f++];return new d(h)},e.exclude=function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]==a)return this.splice(b,1),!0;return!1},e.insertAfter=function(a){for(var b=this.items.length;b--;)this.items[b].insertAfter(a);return this},e.getBBox=function(){for(var a=[],d=[],e=[],f=[],g=this.items.length;g--;)if(!this.items[g].removed){var h=this.items[g].getBBox();a.push(h.x),d.push(h.y),e.push(h.x+h.width),f.push(h.y+h.height)}return a=c.apply(0,a),d=c.apply(0,d),e=b.apply(0,e),f=b.apply(0,f),{x:a,y:d,x2:e,y2:f,width:e-a,height:f-d,cx:a+(e-a)/2,cy:d+(f-d)/2}},e.clone=function(a){a=new d;for(var b=0,c=this.items.length;c>b;b++)a.push(this.items[b].clone());return a},e.toString=function(){return"Snap‘s set"},e.type="set",a.set=function(){var a=new d;return arguments.length&&a.push.apply(a,Array.prototype.slice.call(arguments,0)),a}}),d.plugin(function(a,b){function c(a){var b=a[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":return 4==a.length?[b,0,a[2],a[3]]:[b,0];case"s":return 5==a.length?[b,1,1,a[3],a[4]]:3==a.length?[b,1,1]:[b,1]}}function d(b,d,e){d=l(d).replace(/\.{3}|\u2026/g,b),b=a.parseTransformString(b)||[],d=a.parseTransformString(d)||[];for(var f,g,j,k,m=Math.max(b.length,d.length),n=[],o=[],p=0;m>p;p++){if(j=b[p]||c(d[p]),k=d[p]||c(j),j[0]!=k[0]||"r"==j[0].toLowerCase()&&(j[2]!=k[2]||j[3]!=k[3])||"s"==j[0].toLowerCase()&&(j[3]!=k[3]||j[4]!=k[4])){b=a._.transform2matrix(b,e()),d=a._.transform2matrix(d,e()),n=[["m",b.a,b.b,b.c,b.d,b.e,b.f]],o=[["m",d.a,d.b,d.c,d.d,d.e,d.f]];break}for(n[p]=[],o[p]=[],f=0,g=Math.max(j.length,k.length);g>f;f++)f in j&&(n[p][f]=j[f]),f in k&&(o[p][f]=k[f])}return{from:i(n),to:i(o),f:h(n)}}function e(a){return a}function f(a){return function(b){return+b.toFixed(3)+a}}function g(b){return a.rgb(b[0],b[1],b[2])}function h(a){var b,c,d,e,f,g,h=0,i=[];for(b=0,c=a.length;c>b;b++){for(f="[",g=['"'+a[b][0]+'"'],d=1,e=a[b].length;e>d;d++)g[d]="val["+h+++"]";f+=g+"]",i[b]=f}return Function("val","return Snap.path.toString.call(["+i+"])")}function i(a){for(var b=[],c=0,d=a.length;d>c;c++)for(var e=1,f=a[c].length;f>e;e++)b.push(a[c][e]);return b}var j={},k=/[a-z]+$/i,l=String;j.stroke=j.fill="colour",b.prototype.equal=function(b,c){var m,n,o=l(this.attr(b)||""),p=this;if(o==+o&&c==+c)return{from:+o,to:+c,f:e};if("colour"==j[b])return m=a.color(o),n=a.color(c),{from:[m.r,m.g,m.b,m.opacity],to:[n.r,n.g,n.b,n.opacity],f:g};if("transform"==b||"gradientTransform"==b||"patternTransform"==b)return c instanceof a.Matrix&&(c=c.toTransformString()),a._.rgTransform.test(c)||(c=a._.svgTransform2string(c)),d(o,c,function(){return p.getBBox(1)});if("d"==b||"path"==b)return m=a.path.toCubic(o,c),{from:i(m[0]),to:i(m[1]),f:h(m[0])};if("points"==b)return m=l(o).split(","),n=l(c).split(","),{from:m,to:n,f:function(a){return a}};var q=o.match(k),r=l(c).match(k);return q&&q==r?{from:parseFloat(o),to:parseFloat(c),f:f(q)}:{from:this.asPX(b),to:this.asPX(b,c),f:e}}}),d.plugin(function(a,c,d,e){for(var f=c.prototype,g=("createTouch"in e.doc),h=["click","dblclick","mousedown","mousemove","mouseout","mouseover","mouseup","touchstart","touchmove","touchend","touchcancel"],i={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},j=function(a){var b="y"==a?"scrollTop":"scrollLeft";return e.doc.documentElement[b]||e.doc.body[b]},k=function(){this.returnValue=!1},l=function(){return this.originalEvent.preventDefault()},m=function(){this.cancelBubble=!0},n=function(){return this.originalEvent.stopPropagation()},o=function(){return e.doc.addEventListener?function(a,b,c,d){var e=g&&i[b]?i[b]:b,f=function(e){var f=j("y"),h=j("x");if(g&&i.hasOwnProperty(b))for(var k=0,m=e.targetTouches&&e.targetTouches.length;m>k;k++)if(e.targetTouches[k].target==a||a.contains(e.targetTouches[k].target)){var o=e;e=e.targetTouches[k],e.originalEvent=o,e.preventDefault=l,e.stopPropagation=n;break}var p=e.clientX+h,q=e.clientY+f;return c.call(d,e,p,q)};return b!==e&&a.addEventListener(b,f,!1),a.addEventListener(e,f,!1),function(){return b!==e&&a.removeEventListener(b,f,!1),a.removeEventListener(e,f,!1),!0}}:e.doc.attachEvent?function(a,b,c,d){var f=function(a){a=a||e.win.event;var b=j("y"),f=j("x"),g=a.clientX+f,h=a.clientY+b;return a.preventDefault=a.preventDefault||k,a.stopPropagation=a.stopPropagation||m,c.call(d,a,g,h)};return a.attachEvent("on"+b,f),function(){return a.detachEvent("on"+b,f),!0}}:void 0}(),p=[],q=function(c){for(var d,e=c.clientX,f=c.clientY,h=j("y"),i=j("x"),k=p.length;k--;){if(d=p[k],g){for(var l,m=c.touches&&c.touches.length;m--;)if(l=c.touches[m],l.identifier==d.el._drag.id||d.el.node.contains(l.target)){e=l.clientX,f=l.clientY,(c.originalEvent?c.originalEvent:c).preventDefault();break}}else c.preventDefault();var n=d.el.node;a._.glob,n.nextSibling,n.parentNode,n.style.display,e+=i,f+=h,b("snap.drag.move."+d.el.id,d.move_scope||d.el,e-d.el._drag.x,f-d.el._drag.y,e,f,c)}},r=function(c){a.unmousemove(q).unmouseup(r);for(var d,e=p.length;e--;)d=p[e],d.el._drag={},b("snap.drag.end."+d.el.id,d.end_scope||d.start_scope||d.move_scope||d.el,c);p=[]},s=h.length;s--;)!function(b){a[b]=f[b]=function(c,d){return a.is(c,"function")&&(this.events=this.events||[],this.events.push({name:b,f:c,unbind:o(this.shape||this.node||e.doc,b,c,d||this)})),this},a["un"+b]=f["un"+b]=function(a){for(var c=this.events||[],d=c.length;d--;)if(c[d].name==b&&(c[d].f==a||!a))return c[d].unbind(),c.splice(d,1),!c.length&&delete this.events,this;return this}}(h[s]);f.hover=function(a,b,c,d){return this.mouseover(a,c).mouseout(b,d||c)},f.unhover=function(a,b){return this.unmouseover(a).unmouseout(b)};var t=[];f.drag=function(c,d,e,f,g,h){function i(i,j,k){(i.originalEvent||i).preventDefault(),this._drag.x=j,this._drag.y=k,this._drag.id=i.identifier,!p.length&&a.mousemove(q).mouseup(r),p.push({el:this,move_scope:f,start_scope:g,end_scope:h}),d&&b.on("snap.drag.start."+this.id,d),c&&b.on("snap.drag.move."+this.id,c),e&&b.on("snap.drag.end."+this.id,e),b("snap.drag.start."+this.id,g||f||this,j,k,i)}if(!arguments.length){var j;return this.drag(function(a,b){this.attr({transform:j+(j?"T":"t")+[a,b]})},function(){j=this.transform().local})}return this._drag={},t.push({el:this,start:i}),this.mousedown(i),this},f.undrag=function(){for(var c=t.length;c--;)t[c].el==this&&(this.unmousedown(t[c].start),t.splice(c,1),b.unbind("snap.drag.*."+this.id));return!t.length&&a.unmousemove(q).unmouseup(r),this}}),d.plugin(function(a,c,d){var e=(c.prototype,d.prototype),f=/^\s*url\((.+)\)/,g=String,h=a._.$;a.filter={},e.filter=function(b){var d=this;"svg"!=d.type&&(d=d.paper);var e=a.parse(g(b)),f=a._.id(),i=(d.node.offsetWidth,d.node.offsetHeight,h("filter"));return h(i,{id:f,filterUnits:"userSpaceOnUse"}),i.appendChild(e.node),d.defs.appendChild(i),new c(i)},b.on("snap.util.getattr.filter",function(){b.stop();var c=h(this.node,"filter");if(c){var d=g(c).match(f);return d&&a.select(d[1])}}),b.on("snap.util.attr.filter",function(d){if(d instanceof c&&"filter"==d.type){b.stop();var e=d.node.id;e||(h(d.node,{id:d.id}),e=d.id),h(this.node,{filter:a.url(e)})}d&&"none"!=d||(b.stop(),this.node.removeAttribute("filter"))}),a.filter.blur=function(b,c){null==b&&(b=2);var d=null==c?b:[b,c];return a.format('<feGaussianBlur stdDeviation="{def}"/>',{def:d})},a.filter.blur.toString=function(){return this()},a.filter.shadow=function(b,c,d,e){return e=e||"#000",null==d&&(d=4),"string"==typeof d&&(e=d,d=4),null==b&&(b=0,c=2),null==c&&(c=b),e=a.color(e),a.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>',{color:e,dx:b,dy:c,blur:d})},a.filter.shadow.toString=function(){return this()},a.filter.grayscale=function(b){return null==b&&(b=1),a.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>',{a:.2126+.7874*(1-b),b:.7152-.7152*(1-b),c:.0722-.0722*(1-b),d:.2126-.2126*(1-b),e:.7152+.2848*(1-b),f:.0722-.0722*(1-b),g:.2126-.2126*(1-b),h:.0722+.9278*(1-b)})},a.filter.grayscale.toString=function(){return this()},a.filter.sepia=function(b){return null==b&&(b=1),a.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>',{a:.393+.607*(1-b),b:.769-.769*(1-b),c:.189-.189*(1-b),d:.349-.349*(1-b),e:.686+.314*(1-b),f:.168-.168*(1-b),g:.272-.272*(1-b),h:.534-.534*(1-b),i:.131+.869*(1-b)})},a.filter.sepia.toString=function(){return this()},a.filter.saturate=function(b){return null==b&&(b=1),a.format('<feColorMatrix type="saturate" values="{amount}"/>',{amount:1-b})},a.filter.saturate.toString=function(){return this()},a.filter.hueRotate=function(b){return b=b||0,a.format('<feColorMatrix type="hueRotate" values="{angle}"/>',{angle:b})},a.filter.hueRotate.toString=function(){return this()},a.filter.invert=function(b){return null==b&&(b=1),a.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>',{amount:b,amount2:1-b})},a.filter.invert.toString=function(){return this()},a.filter.brightness=function(b){return null==b&&(b=1),a.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>',{amount:b})},a.filter.brightness.toString=function(){return this()},a.filter.contrast=function(b){return null==b&&(b=1),a.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>',{amount:b,amount2:.5-b/2})},a.filter.contrast.toString=function(){return this()}}),d}),function(a){function b(b){var c="div.ult-overlay."+b;if(joverlay=document.querySelector(c),i=a(c),i.hasClass("ult-open")){i.removeClass("ult-open"),i.addClass("ult-close");var d=function(a){if(support.transitions){if("visibility"!==a.propertyName)return;this.removeEventListener(transEndEventName,d)}i.removeClass("ult-close")};support.transitions?(joverlay.addEventListener(transEndEventName,d),i.removeClass("ult-close"),f<e&&a("html").css({overflow:"auto"})):d()}else i.hasClass("ult-close")||i.addClass("ult-open");var e=i.find(".ult_modal").outerHeight(),f=a(window).outerHeight();f<e&&a("html").css({overflow:"hidden"})}function c(b){var c="div.overlay-cornershape."+b,d=document.querySelector(c),e=a(c),f=Snap(d.querySelector("svg")),g=f.select("path"),h={from:"m 0,0 1439.999975,0 0,805.99999 0,-805.99999 z ",to:" m 0,0 1439.999975,0 0,805.99999 -1439.999975,0 z  "};if(e.hasClass("ult-open")){e.removeClass("ult-open"),e.addClass("ult-close");var i=function(a){e.removeClass("ult-close")};g.animate({path:h.from},400,mina.linear,i)}else e.hasClass("ult-close")||(e.addClass("ult-open"),g.animate({path:h.to},400,mina.linear))}function d(b){var c="div.overlay-genie."+b,d=document.querySelector(c),e=a(c),f=Snap(d.querySelector("svg")),g=f.select("path"),h=d.getAttribute("data-steps").split(";"),i=h.length;if(e.hasClass("ult-open")){var j=i-1;e.removeClass("ult-open"),e.addClass("ult-close");var k=function(a){e.removeClass("ult-close")},l=function(a){--a<0||g.animate({path:h[a]},60,mina.linear,function(){0===a&&k(),l(a)})};l(j)}else if(!e.hasClass("ult-close")){var j=0;e.addClass("ult-open");var l=function(a){++a>i-1||g.animate({path:h[a]},60,mina.linear,function(){l(a)})};l(j)}}function e(a){for(var b,c,d=a.length;0!==d;)c=Math.floor(Math.random()*d),d-=1,b=a[d],a[d]=a[c],a[c]=b;return a}function f(b){var c="div.overlay-boxes."+b,d=document.querySelector(c),f=a(c),g=[].slice.call(d.querySelectorAll("svg > path")),h=g.length,i=0;e(g),f.hasClass("ult-open")?(f.removeClass("ult-open"),f.addClass("ult-close"),g.forEach(function(a,b){setTimeout(function(){++i,a.style.display="none",i===h&&f.removeClass("ult-close")},30*b)})):f.hasClass("ult-close")||(f.addClass("ult-open"),g.forEach(function(a,b){setTimeout(function(){a.style.display="block"},30*b)}))}function g(b){a("."+b).find(".ult_modal-content").height()>a(window).height()?a("."+b).addClass("ult_modal-auto-top"):a("."+b).removeClass("ult_modal-auto-top"),a("."+b).find("iframe").length>0&&a("."+b).find("iframe").each(function(b,c){a(c).attr("src",a(c).attr("src"))}),a(document).trigger("onUVCModalPopupOpen",b)}function h(){a(".ult_modal-body iframe").each(function(b,c){var d=a(this).parent().width(),e=(a(this).parent().parent().parent().hasClass("ult-small"),a(this).parent().parent().parent().hasClass("ult-medium"),!!a(this).parent().parent().parent().hasClass("ult-container")),f=!!a(this).parent().parent().parent().hasClass("ult-block"),g=d/10,h=d*(9/16)+g;if(!a(this).parent().hasClass("ult-youtube")&&!a(this).parent().hasClass("ult-vimeo"))return!1;if(e){var i=a(window).height();i<h&&(h=i-100)}f&&(d=a(this).attr("width"),h=a(this).attr("height"),void 0!==d&&""!=d||(d=640),void 0!==h&&""!=h||(h=360)),a(this).css({width:d+"px",height:h+"px"})})}var i=(a(".overlay-show"),a("div.ult-overlay"));i.find("div.ult-overlay-close");transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},transEndEventName=transEndEventNames[bsfmodernizr.prefixed("transition")],support={transitions:bsfmodernizr.csstransitions};a(".overlay-show-cornershape").find("path").attr("d");a(window).load(function(){var b=new Array;a(".ult-onload").each(function(c){b.push(a(this)),setTimeout(function(){b[c].trigger("click")},1e3*parseInt(a(this).data("onload-delay")))}),a(".ult-vimeo iframe").each(function(b,c){var d=(a(this).attr("id"),a(this)[0]),e=$f(d);e.addEvent("ready",function(){e.addEvent("pause"),e.addEvent("finish")})})}),a(document).ready(function(){a(".ult-overlay").each(function(){a(this).appendTo(document.body)}),a(".ult-overlay").show(),a(".overlay-show").each(function(b,c){var d=a(this).data("class-id");a("."+d).find(".ult-vimeo iframe").attr("id","video_"+d),a("."+d).find(".ult-youtube iframe").attr("id","video_"+d)});a(document).on("click",".overlay-show",function(c){c.stopPropagation(),c.preventDefault();var d=a(this).data("class-id");1!=a(this).parent().hasClass("modal-hide-mobile")&&1!=a(this).parent().hasClass("modal-hide-tablet")&&(a("."+d).find(".ult_modal-content").removeClass("ult-hide"),a("."+d).find(".ult-vimeo iframe").html(a(".ult-vimeo iframe").html()),a("."+d).addClass(a(this).data("overlay-class")),setTimeout(function(){a("body, html").addClass("ult_modal-body-open"),b(d),g(d)},500),"keypress-control-enable"!=a(this).parent().attr("data-keypress-control")&&"keypress-control-enable"!=a(this).attr("data-keypress-control")||(window.onkeydown=function(b){27==b.keyCode&&a(document).find(".ult-overlay.ult-open."+d).removeClass("ult-open")}))}),a(document).on("click",".overlay-show-cornershape",function(b){b.stopPropagation(),b.preventDefault();var d=a(this).data("class-id");a("."+d).find(".ult_modal-content").removeClass("ult-hide"),setTimeout(function(){a("."+d).addClass("overlay-cornershape"),c(d),a("body, html").addClass("ult_modal-body-open"),g(d)},300)}),a(document).on("click","div.overlay-cornershape div.ult-overlay-close",function(b){b.stopPropagation();var d=a(this).parents("div.overlay-cornershape").data("class");c(d),a("body, html").removeClass("ult_modal-body-open"),a("html").css({overflow:"auto"}),a(document).trigger("onUVCModalPopUpClosed",d)}),a(document).on("click",".overlay-show-boxes",function(b){b.stopPropagation(),b.preventDefault();var c=a(this).data("class-id");a("."+c).find(".ult_modal-content").removeClass("ult-hide"),setTimeout(function(){a("."+c).addClass("overlay-boxes"),f(c),a("body, html").addClass("ult_modal-body-open"),g(c)},300)}),a(document).on("click","div.overlay-boxes div.ult-overlay-close",function(b){b.stopPropagation();var c=a(this).parents("div.overlay-boxes").data("class");f(c),a("body, html").removeClass("ult_modal-body-open"),a("html").css({overflow:"auto"}),a(document).trigger("onUVCModalPopUpClosed",c)}),a(document).on("click",".overlay-show-genie",function(b){b.preventDefault();var c=a(this).data("class-id");a("."+c).find(".ult_modal-content").removeClass("ult-hide"),setTimeout(function(){a("."+c).addClass("overlay-genie"),d(c),a("body, html").addClass("ult_modal-body-open"),g(c),a("html").css({overflow:"auto"})},300)}),a(document).on("click","div.overlay-genie div.ult-overlay-close",function(b){b.stopPropagation();var c=a(this).parents("div.overlay-genie").data("class");d(c),a("body, html").removeClass("ult_modal-body-open"),a("html").css({overflow:"auto"}),a(document).trigger("onUVCModalPopUpClosed",c)}),a(document).on("click",".ult-overlay .ult-overlay-close",function(c){c.stopPropagation(),$this=a(this),b($this.parents(".ult-overlay").data("class")),a("body, html").removeClass("ult_modal-body-open"),$this.parent().find(".ult-vimeo").length&&$this.parent().find(".ult-vimeo iframe").each(function(b,c){var d=a(c),e=a(c).attr("src");a(c).attr("src",""),a(c).attr("src",e);var c=d[0];$f(c).api("pause")}),$this.parent().find(".ult-youtube").length&&$this.parent().find(".ult-youtube iframe").each(function(b,c){var d=a(c).attr("src");a(c).attr("src",""),a(c).attr("src",d)}),$this.parent().find(".ult-video-shortcode").length&&$this.parent().find(".ult-video-shortcode video").each(function(a,b){b.pause()}),a("html").css({overflow:"auto"}),a(document).trigger("onUVCModalPopUpClosed")}),a(document).on("click",".ult-overlay .ult_modal",function(a){a.stopPropagation()}),a(document).on("click",".ult-overlay",function(b){b.stopPropagation(),b.preventDefault(),$this=a(this);var c=$this.data("class");a(document).find(".ult-modal-input-wrapper").children().each(function(){a(this).data("class-id")==c&&"overlay-control-enable"==a(this).parent(".ult-modal-input-wrapper").data("overlay-control")&&($this.find(".ult-overlay-close").trigger("click"),a("html").css({overflow:"auto"}))})})}),a(document).on("onUVCModalPopupOpen",function(){h(),a(window).trigger("resize")})}(jQuery);
// source --> https://www.jesusmariamed.edu.co/wp-content/themes/ed-school/assets/js/vendor/modernizr-2.7.0.min.js 
/* Modernizr 2.7.0 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.7.0",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};