(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/app"],{

/***/ "./node_modules/alertifyjs/build/alertify.js":
/*!***************************************************!*\
  !*** ./node_modules/alertifyjs/build/alertify.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * alertifyjs 1.13.1 http://alertifyjs.com
 * AlertifyJS is a javascript framework for developing pretty browser dialogs and notifications.
 * Copyright 2019 Mohammad Younes <Mohammad@alertifyjs.com> (http://alertifyjs.com) 
 * Licensed under GPL 3 <https://opensource.org/licenses/gpl-3.0>*/
( function ( window ) {
    'use strict';
    var NOT_DISABLED_NOT_RESET = ':not(:disabled):not(.ajs-reset)';
    /**
     * Keys enum
     * @type {Object}
     */
    var keys = {
        ENTER: 13,
        ESC: 27,
        F1: 112,
        F12: 123,
        LEFT: 37,
        RIGHT: 39,
        TAB: 9
    };
    /**
     * Default options 
     * @type {Object}
     */
    var defaults = {
        autoReset:true,
        basic:false,
        closable:true,
        closableByDimmer:true,
        invokeOnCloseOff:false,
        frameless:false,
        defaultFocusOff:false,
        maintainFocus:true, //global default not per instance, applies to all dialogs
        maximizable:true,
        modal:true,
        movable:true,
        moveBounded:false,
        overflow:true,
        padding: true,
        pinnable:true,
        pinned:true,
        preventBodyShift:false, //global default not per instance, applies to all dialogs
        resizable:true,
        startMaximized:false,
        transition:'pulse',
        transitionOff:false,
        tabbable:['button', '[href]', 'input', 'select', 'textarea', '[tabindex]:not([tabindex^="-"])'+NOT_DISABLED_NOT_RESET].join(NOT_DISABLED_NOT_RESET+','),//global
        notifier:{
            delay:5,
            position:'bottom-right',
            closeButton:false,
            classes: {
                base: 'alertify-notifier',
                prefix:'ajs-',
                message: 'ajs-message',
                top: 'ajs-top',
                right: 'ajs-right',
                bottom: 'ajs-bottom',
                left: 'ajs-left',
                center: 'ajs-center',
                visible: 'ajs-visible',
                hidden: 'ajs-hidden',
                close: 'ajs-close'
            }
        },
        glossary:{
            title:'AlertifyJS',
            ok: 'OK',
            cancel: 'Cancel',
            acccpt: 'Accept',
            deny: 'Deny',
            confirm: 'Confirm',
            decline: 'Decline',
            close: 'Close',
            maximize: 'Maximize',
            restore: 'Restore',
        },
        theme:{
            input:'ajs-input',
            ok:'ajs-ok',
            cancel:'ajs-cancel',
        },
        hooks:{
            preinit:function(){},
            postinit:function(){}
        }
    };
    
    //holds open dialogs instances
    var openDialogs = [];

    /**
     * [Helper]  Adds the specified class(es) to the element.
     *
     * @element {node}      The element
     * @className {string}  One or more space-separated classes to be added to the class attribute of the element.
     * 
     * @return {undefined}
     */
    function addClass(element,classNames){
        element.className += ' ' + classNames;
    }
    
    /**
     * [Helper]  Removes the specified class(es) from the element.
     *
     * @element {node}      The element
     * @className {string}  One or more space-separated classes to be removed from the class attribute of the element.
     * 
     * @return {undefined}
     */
    function removeClass(element, classNames) {
        var original = element.className.split(' ');
        var toBeRemoved = classNames.split(' ');
        for (var x = 0; x < toBeRemoved.length; x += 1) {
            var index = original.indexOf(toBeRemoved[x]);
            if (index > -1){
                original.splice(index,1);
            }
        }
        element.className = original.join(' ');
    }

    /**
     * [Helper]  Checks if the document is RTL
     *
     * @return {Boolean} True if the document is RTL, false otherwise.
     */
    function isRightToLeft(){
        return window.getComputedStyle(document.body).direction === 'rtl';
    }
    /**
     * [Helper]  Get the document current scrollTop
     *
     * @return {Number} current document scrollTop value
     */
    function getScrollTop(){
        return ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);
    }

    /**
     * [Helper]  Get the document current scrollLeft
     *
     * @return {Number} current document scrollLeft value
     */
    function getScrollLeft(){
        return ((document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft);
    }

    /**
    * Helper: clear contents
    *
    */
    function clearContents(element){
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }
    /**
     * Extends a given prototype by merging properties from base into sub.
     *
     * @sub {Object} sub The prototype being overwritten.
     * @base {Object} base The prototype being written.
     *
     * @return {Object} The extended prototype.
     */
    function copy(src) {
        if(null === src){
            return src;
        }
        var cpy;
        if(Array.isArray(src)){
            cpy = [];
            for(var x=0;x<src.length;x+=1){
                cpy.push(copy(src[x]));
            }
            return cpy;
        }
      
        if(src instanceof Date){
            return new Date(src.getTime());
        }
      
        if(src instanceof RegExp){
            cpy = new RegExp(src.source);
            cpy.global = src.global;
            cpy.ignoreCase = src.ignoreCase;
            cpy.multiline = src.multiline;
            cpy.lastIndex = src.lastIndex;
            return cpy;
        }
        
        if(typeof src === 'object'){
            cpy = {};
            // copy dialog pototype over definition.
            for (var prop in src) {
                if (src.hasOwnProperty(prop)) {
                    cpy[prop] = copy(src[prop]);
                }
            }
            return cpy;
        }
        return src;
    }
    /**
      * Helper: destruct the dialog
      *
      */
    function destruct(instance, initialize){
        if(instance.elements){
            //delete the dom and it's references.
            var root = instance.elements.root;
            root.parentNode.removeChild(root);
            delete instance.elements;
            //copy back initial settings.
            instance.settings = copy(instance.__settings);
            //re-reference init function.
            instance.__init = initialize;
            //delete __internal variable to allow re-initialization.
            delete instance.__internal;
        }
    }

    /**
     * Test to check if passive event listeners are supported.
     */
    var IsPassiveSupported = false;
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                IsPassiveSupported = true;
            }
        });
        window.addEventListener('test', options, options);
        window.removeEventListener('test', options, options);
    } catch (e) {}

     /**
     * Removes an event listener
     *
     * @param {HTMLElement} el The EventTarget to register the listenr on.
     * @param {string} event The event type to listen for.
     * @param {Function} handler The function to handle the event.
     * @param {boolean} useCapture Specifices if the event to be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
     * @param {boolean} passive A Boolean which, if true, indicates that the function specified by listener will never call preventDefault().
     */
    var on = function (el, event, fn, useCapture, passive) {
        el.addEventListener(event, fn, IsPassiveSupported ? { capture: useCapture, passive: passive } : useCapture === true);
    };

    /**
     * Removes an event listener
     *
     * @param {HTMLElement} el The EventTarget to unregister the listenr from.
     * @param {string} event The event type to remove.
     * @param {Function} fn The event handler to remove.
     * @param {boolean} useCapture Specifices if the event to be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
     * @param {boolean} passive A Boolean which, if true, indicates that the function specified by listener will never call preventDefault().
     */
    var off = function (el, event, fn, useCapture, passive) {
        el.removeEventListener(event, fn, IsPassiveSupported ? { capture: useCapture, passive: passive } : useCapture === true);
    };

    /**
     * Prevent default event from firing
     *
     * @param  {Event} event Event object
     * @return {undefined}

    function prevent ( event ) {
        if ( event ) {
            if ( event.preventDefault ) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    }
    */
    var transition = (function () {
        var t, type;
        var supported = false;
        var transitions = {
            'animation'        : 'animationend',
            'OAnimation'       : 'oAnimationEnd oanimationend',
            'msAnimation'      : 'MSAnimationEnd',
            'MozAnimation'     : 'animationend',
            'WebkitAnimation'  : 'webkitAnimationEnd'
        };

        for (t in transitions) {
            if (document.documentElement.style[t] !== undefined) {
                type = transitions[t];
                supported = true;
                break;
            }
        }

        return {
            type: type,
            supported: supported
        };
    }());

    /**
    * Creates event handler delegate that sends the instance as last argument.
    * 
    * @return {Function}    a function wrapper which sends the instance as last argument.
    */
    function delegate(context, method) {
        return function () {
            if (arguments.length > 0) {
                var args = [];
                for (var x = 0; x < arguments.length; x += 1) {
                    args.push(arguments[x]);
                }
                args.push(context);
                return method.apply(context, args);
            }
            return method.apply(context, [null, context]);
        };
    }
    /**
    * Helper for creating a dialog close event.
    * 
    * @return {object}
    */
    function createCloseEvent(index, button) {
        return {
            index: index,
            button: button,
            cancel: false
        };
    }
    /**
    * Helper for dispatching events.
    *
    * @param  {string} evenType The type of the event to disptach.
    * @param  {object} instance The dialog instance disptaching the event.
    *
    * @return   {any}   The result of the invoked function.
    */
    function dispatchEvent(eventType, instance) {
        if ( typeof instance.get(eventType) === 'function' ) {
            return instance.get(eventType).call(instance);
        }
    }


    /**
     * Super class for all dialogs
     *
     * @return {Object}		base dialog prototype
     */
    var dialog = (function () {
        var //holds the list of used keys.
            usedKeys = [],
            //dummy variable, used to trigger dom reflow.
            reflow = null,
            //holds body tab index in case it has any.
            tabindex = false,
            //condition for detecting safari
            isSafari = window.navigator.userAgent.indexOf('Safari') > -1 && window.navigator.userAgent.indexOf('Chrome') < 0,
            //dialog building blocks
            templates = {
                dimmer:'<div class="ajs-dimmer"></div>',
                /*tab index required to fire click event before body focus*/
                modal: '<div class="ajs-modal" tabindex="0"></div>',
                dialog: '<div class="ajs-dialog" tabindex="0"></div>',
                reset: '<button class="ajs-reset"></button>',
                commands: '<div class="ajs-commands"><button class="ajs-pin"></button><button class="ajs-maximize"></button><button class="ajs-close"></button></div>',
                header: '<div class="ajs-header"></div>',
                body: '<div class="ajs-body"></div>',
                content: '<div class="ajs-content"></div>',
                footer: '<div class="ajs-footer"></div>',
                buttons: { primary: '<div class="ajs-primary ajs-buttons"></div>', auxiliary: '<div class="ajs-auxiliary ajs-buttons"></div>' },
                button: '<button class="ajs-button"></button>',
                resizeHandle: '<div class="ajs-handle"></div>',
            },
            //common class names
            classes = {
                animationIn: 'ajs-in',
                animationOut: 'ajs-out',
                base: 'alertify',
                basic:'ajs-basic',
                capture: 'ajs-capture',
                closable:'ajs-closable',
                fixed: 'ajs-fixed',
                frameless:'ajs-frameless',
                hidden: 'ajs-hidden',
                maximize: 'ajs-maximize',
                maximized: 'ajs-maximized',
                maximizable:'ajs-maximizable',
                modeless: 'ajs-modeless',
                movable: 'ajs-movable',
                noSelection: 'ajs-no-selection',
                noOverflow: 'ajs-no-overflow',
                noPadding:'ajs-no-padding',
                pin:'ajs-pin',
                pinnable:'ajs-pinnable',
                prefix: 'ajs-',
                resizable: 'ajs-resizable',
                restore: 'ajs-restore',
                shake:'ajs-shake',
                unpinned:'ajs-unpinned',
                noTransition:'ajs-no-transition'
            };

        /**
         * Helper: initializes the dialog instance
         * 
         * @return	{Number}	The total count of currently open modals.
         */
        function initialize(instance){
            
            if(!instance.__internal){
                //invoke preinit global hook
                alertify.defaults.hooks.preinit(instance);
                //no need to expose init after this.
                delete instance.__init;
              
                //keep a copy of initial dialog settings
                if(!instance.__settings){
                    instance.__settings = copy(instance.settings);
                }
                
                //get dialog buttons/focus setup
                var setup;
                if(typeof instance.setup === 'function'){
                    setup = instance.setup();
                    setup.options = setup.options  || {};
                    setup.focus = setup.focus  || {};
                }else{
                    setup = {
                        buttons:[],
                        focus:{
                            element:null,
                            select:false
                        },
                        options:{
                        }
                    };
                }
                
                //initialize hooks object.
                if(typeof instance.hooks !== 'object'){
                    instance.hooks = {};
                }

                //copy buttons defintion
                var buttonsDefinition = [];
                if(Array.isArray(setup.buttons)){
                    for(var b=0;b<setup.buttons.length;b+=1){
                        var ref  = setup.buttons[b],
                            cpy = {};
                        for (var i in ref) {
                            if (ref.hasOwnProperty(i)) {
                                cpy[i] = ref[i];
                            }
                        }
                        buttonsDefinition.push(cpy);
                    }
                }

                var internal = instance.__internal = {
                    /**
                     * Flag holding the open state of the dialog
                     * 
                     * @type {Boolean}
                     */
                    isOpen:false,
                    /**
                     * Active element is the element that will receive focus after
                     * closing the dialog. It defaults as the body tag, but gets updated
                     * to the last focused element before the dialog was opened.
                     *
                     * @type {Node}
                     */
                    activeElement:document.body,
                    timerIn:undefined,
                    timerOut:undefined,
                    buttons: buttonsDefinition,
                    focus: setup.focus,
                    options: {
                        title: undefined,
                        modal: undefined,
                        basic:undefined,
                        frameless:undefined,
                        defaultFocusOff:undefined,
                        pinned: undefined,
                        movable: undefined,
                        moveBounded:undefined,
                        resizable: undefined,
                        autoReset: undefined,
                        closable: undefined,
                        closableByDimmer: undefined,
                        invokeOnCloseOff:undefined,
                        maximizable: undefined,
                        startMaximized: undefined,
                        pinnable: undefined,
                        transition: undefined,
                        transitionOff: undefined,
                        padding:undefined,
                        overflow:undefined,
                        onshow:undefined,
                        onclosing:undefined,
                        onclose:undefined,
                        onfocus:undefined,
                        onmove:undefined,
                        onmoved:undefined,
                        onresize:undefined,
                        onresized:undefined,
                        onmaximize:undefined,
                        onmaximized:undefined,
                        onrestore:undefined,
                        onrestored:undefined
                    },
                    resetHandler:undefined,
                    beginMoveHandler:undefined,
                    beginResizeHandler:undefined,
                    bringToFrontHandler:undefined,
                    modalClickHandler:undefined,
                    buttonsClickHandler:undefined,
                    commandsClickHandler:undefined,
                    transitionInHandler:undefined,
                    transitionOutHandler:undefined,
                    destroy:undefined
                };

                var elements = {};
                //root node
                elements.root = document.createElement('div');
                //prevent FOUC in case of async styles loading.
                elements.root.style.display = 'none';
                elements.root.className = classes.base + ' ' + classes.hidden + ' ';

                elements.root.innerHTML = templates.dimmer + templates.modal;
                
                //dimmer
                elements.dimmer = elements.root.firstChild;

                //dialog
                elements.modal = elements.root.lastChild;
                elements.modal.innerHTML = templates.dialog;
                elements.dialog = elements.modal.firstChild;
                elements.dialog.innerHTML = templates.reset + templates.commands + templates.header + templates.body + templates.footer + templates.resizeHandle + templates.reset;

                //reset links
                elements.reset = [];
                elements.reset.push(elements.dialog.firstChild);
                elements.reset.push(elements.dialog.lastChild);
                
                //commands
                elements.commands = {};
                elements.commands.container = elements.reset[0].nextSibling;
                elements.commands.pin = elements.commands.container.firstChild;
                elements.commands.maximize = elements.commands.pin.nextSibling;
                elements.commands.close = elements.commands.maximize.nextSibling;
                
                //header
                elements.header = elements.commands.container.nextSibling;

                //body
                elements.body = elements.header.nextSibling;
                elements.body.innerHTML = templates.content;
                elements.content = elements.body.firstChild;

                //footer
                elements.footer = elements.body.nextSibling;
                elements.footer.innerHTML = templates.buttons.auxiliary + templates.buttons.primary;
                
                //resize handle
                elements.resizeHandle = elements.footer.nextSibling;

                //buttons
                elements.buttons = {};
                elements.buttons.auxiliary = elements.footer.firstChild;
                elements.buttons.primary = elements.buttons.auxiliary.nextSibling;
                elements.buttons.primary.innerHTML = templates.button;
                elements.buttonTemplate = elements.buttons.primary.firstChild;
                //remove button template
                elements.buttons.primary.removeChild(elements.buttonTemplate);
                               
                for(var x=0; x < instance.__internal.buttons.length; x+=1) {
                    var button = instance.__internal.buttons[x];
                    
                    // add to the list of used keys.
                    if(usedKeys.indexOf(button.key) < 0){
                        usedKeys.push(button.key);
                    }

                    button.element = elements.buttonTemplate.cloneNode();
                    button.element.innerHTML = button.text;
                    if(typeof button.className === 'string' &&  button.className !== ''){
                        addClass(button.element, button.className);
                    }
                    for(var key in button.attrs){
                        if(key !== 'className' && button.attrs.hasOwnProperty(key)){
                            button.element.setAttribute(key, button.attrs[key]);
                        }
                    }
                    if(button.scope === 'auxiliary'){
                        elements.buttons.auxiliary.appendChild(button.element);
                    }else{
                        elements.buttons.primary.appendChild(button.element);
                    }
                }
                //make elements pubic
                instance.elements = elements;
                
                //save event handlers delegates
                internal.resetHandler = delegate(instance, onReset);
                internal.beginMoveHandler = delegate(instance, beginMove);
                internal.beginResizeHandler = delegate(instance, beginResize);
                internal.bringToFrontHandler = delegate(instance, bringToFront);
                internal.modalClickHandler = delegate(instance, modalClickHandler);
                internal.buttonsClickHandler = delegate(instance, buttonsClickHandler);
                internal.commandsClickHandler = delegate(instance, commandsClickHandler);
                internal.transitionInHandler = delegate(instance, handleTransitionInEvent);
                internal.transitionOutHandler = delegate(instance, handleTransitionOutEvent);

                //settings
                for(var opKey in internal.options){
                    if(setup.options[opKey] !== undefined){
                        // if found in user options
                        instance.set(opKey, setup.options[opKey]);
                    }else if(alertify.defaults.hasOwnProperty(opKey)) {
                        // else if found in defaults options
                        instance.set(opKey, alertify.defaults[opKey]);
                    }else if(opKey === 'title' ) {
                        // else if title key, use alertify.defaults.glossary
                        instance.set(opKey, alertify.defaults.glossary[opKey]);
                    }
                }

                // allow dom customization
                if(typeof instance.build === 'function'){
                    instance.build();
                }

                //invoke postinit global hook
                alertify.defaults.hooks.postinit(instance);
            }

            //add to the end of the DOM tree.
            document.body.appendChild(instance.elements.root);
        }

        /**
         * Helper: maintains scroll position
         *
         */
        var scrollX, scrollY;
        function saveScrollPosition(){
            scrollX = getScrollLeft();
            scrollY = getScrollTop();
        }
        function restoreScrollPosition(){
            window.scrollTo(scrollX, scrollY);
        }

        /**
         * Helper: adds/removes no-overflow class from body
         *
         */
        function ensureNoOverflow(){
            var requiresNoOverflow = 0;
            for(var x=0;x<openDialogs.length;x+=1){
                var instance = openDialogs[x];
                if(instance.isModal() || instance.isMaximized()){
                    requiresNoOverflow+=1;
                }
            }
            if(requiresNoOverflow === 0 && document.body.className.indexOf(classes.noOverflow) >= 0){
                //last open modal or last maximized one
                removeClass(document.body, classes.noOverflow);
                preventBodyShift(false);
            }else if(requiresNoOverflow > 0 && document.body.className.indexOf(classes.noOverflow) < 0){
                //first open modal or first maximized one
                preventBodyShift(true);
                addClass(document.body, classes.noOverflow);
            }
        }
        var top = '', topScroll = 0;
        /**
         * Helper: prevents body shift.
         *
         */
        function preventBodyShift(add){
            if(alertify.defaults.preventBodyShift){
                if(add && document.documentElement.scrollHeight > document.documentElement.clientHeight ){//&& openDialogs[openDialogs.length-1].elements.dialog.clientHeight <= document.documentElement.clientHeight){
                    topScroll = scrollY;
                    top = window.getComputedStyle(document.body).top;
                    addClass(document.body, classes.fixed);
                    document.body.style.top = -scrollY + 'px';
                } else if(!add) {
                    scrollY = topScroll;
                    document.body.style.top = top;
                    removeClass(document.body, classes.fixed);
                    restoreScrollPosition();
                }
            }
        }
		
        /**
         * Sets the name of the transition used to show/hide the dialog
         * 
         * @param {Object} instance The dilog instance.
         *
         */
        function updateTransition(instance, value, oldValue){
            if(typeof oldValue === 'string'){
                removeClass(instance.elements.root,classes.prefix +  oldValue);
            }
            addClass(instance.elements.root, classes.prefix + value);
            reflow = instance.elements.root.offsetWidth;
        }

        /**
         * Toggles the dialog no transition 
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateTransitionOff(instance){
            if (instance.get('transitionOff')) {
                // add class
                addClass(instance.elements.root, classes.noTransition);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.noTransition);
            }
        }

        /**
         * Toggles the dialog display mode
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateDisplayMode(instance){
            if(instance.get('modal')){

                //make modal
                removeClass(instance.elements.root, classes.modeless);

                //only if open
                if(instance.isOpen()){
                    unbindModelessEvents(instance);

                    //in case a pinned modless dialog was made modal while open.
                    updateAbsPositionFix(instance);

                    ensureNoOverflow();
                }
            }else{
                //make modelss
                addClass(instance.elements.root, classes.modeless);

                //only if open
                if(instance.isOpen()){
                    bindModelessEvents(instance);

                    //in case pin/unpin was called while a modal is open
                    updateAbsPositionFix(instance);

                    ensureNoOverflow();
                }
            }
        }

        /**
         * Toggles the dialog basic view mode 
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateBasicMode(instance){
            if (instance.get('basic')) {
                // add class
                addClass(instance.elements.root, classes.basic);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.basic);
            }
        }

        /**
         * Toggles the dialog frameless view mode 
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateFramelessMode(instance){
            if (instance.get('frameless')) {
                // add class
                addClass(instance.elements.root, classes.frameless);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.frameless);
            }
        }
		
        /**
         * Helper: Brings the modeless dialog to front, attached to modeless dialogs.
         *
         * @param {Event} event Focus event
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bringToFront(event, instance){
            
            // Do not bring to front if preceeded by an open modal
            var index = openDialogs.indexOf(instance);
            for(var x=index+1;x<openDialogs.length;x+=1){
                if(openDialogs[x].isModal()){
                    return;
                }
            }
			
            // Bring to front by making it the last child.
            if(document.body.lastChild !== instance.elements.root){
                document.body.appendChild(instance.elements.root);
                //also make sure its at the end of the list
                openDialogs.splice(openDialogs.indexOf(instance),1);
                openDialogs.push(instance);
                setFocus(instance);
            }
			
            return false;
        }
		
        /**
         * Helper: reflects dialogs options updates
         *
         * @param {Object} instance The dilog instance.
         * @param {String} option The updated option name.
         *
         * @return	{undefined}	
         */
        function optionUpdated(instance, option, oldValue, newValue){
            switch(option){
            case 'title':
                instance.setHeader(newValue);
                break;
            case 'modal':
                updateDisplayMode(instance);
                break;
            case 'basic':
                updateBasicMode(instance);
                break;
            case 'frameless':
                updateFramelessMode(instance);
                break;
            case 'pinned':
                updatePinned(instance);
                break;
            case 'closable':
                updateClosable(instance);
                break;
            case 'maximizable':
                updateMaximizable(instance);
                break;
            case 'pinnable':
                updatePinnable(instance);
                break;
            case 'movable':
                updateMovable(instance);
                break;
            case 'resizable':
                updateResizable(instance);
                break;
            case 'padding':
                if(newValue){
                    removeClass(instance.elements.root, classes.noPadding);
                }else if(instance.elements.root.className.indexOf(classes.noPadding) < 0){
                    addClass(instance.elements.root, classes.noPadding);
                }
                break;
            case 'overflow':
                if(newValue){
                    removeClass(instance.elements.root, classes.noOverflow);
                }else if(instance.elements.root.className.indexOf(classes.noOverflow) < 0){
                    addClass(instance.elements.root, classes.noOverflow);
                }
                break;
            case 'transition':
                updateTransition(instance,newValue, oldValue);
                break;
            case 'transitionOff':
                updateTransitionOff(instance);
                break;
            }

            // internal on option updated event
            if(typeof instance.hooks.onupdate === 'function'){
                instance.hooks.onupdate.call(instance, option, oldValue, newValue);
            }
        }
		
        /**
         * Helper: reflects dialogs options updates
         *
         * @param {Object} instance The dilog instance.
         * @param {Object} obj The object to set/get a value on/from.
         * @param {Function} callback The callback function to call if the key was found.
         * @param {String|Object} key A string specifying a propery name or a collection of key value pairs.
         * @param {Object} value Optional, the value associated with the key (in case it was a string).
         * @param {String} option The updated option name.
         *
         * @return	{Object} result object 
         *	The result objects has an 'op' property, indicating of this is a SET or GET operation.
         *		GET: 
         *		- found: a flag indicating if the key was found or not.
         *		- value: the property value.
         *		SET:
         *		- items: a list of key value pairs of the properties being set.
         *				each contains:
         *					- found: a flag indicating if the key was found or not.
         *					- key: the property key.
         *					- value: the property value.
         */
        function update(instance, obj, callback, key, value){
            var result = {op:undefined, items: [] };
            if(typeof value === 'undefined' && typeof key === 'string') {
                //get
                result.op = 'get';
                if(obj.hasOwnProperty(key)){
                    result.found = true;
                    result.value = obj[key];
                }else{
                    result.found = false;
                    result.value = undefined;
                }
            }
            else
            {
                var old;
                //set
                result.op = 'set';
                if(typeof key === 'object'){
                    //set multiple
                    var args = key;
                    for (var prop in args) {
                        if (obj.hasOwnProperty(prop)) {
                            if(obj[prop] !== args[prop]){
                                old = obj[prop];
                                obj[prop] = args[prop];
                                callback.call(instance,prop, old, args[prop]);
                            }
                            result.items.push({ 'key': prop, 'value': args[prop], 'found':true});
                        }else{
                            result.items.push({ 'key': prop, 'value': args[prop], 'found':false});
                        }
                    }
                } else if (typeof key === 'string'){
                    //set single
                    if (obj.hasOwnProperty(key)) {
                        if(obj[key] !== value){
                            old  = obj[key];
                            obj[key] = value;
                            callback.call(instance,key, old, value);
                        }
                        result.items.push({'key': key, 'value': value , 'found':true});

                    }else{
                        result.items.push({'key': key, 'value': value , 'found':false});
                    }
                } else {
                    //invalid params
                    throw new Error('args must be a string or object');
                }
            }
            return result;
        }


        /**
         * Triggers a close event.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function triggerClose(instance) {
            var found;
            triggerCallback(instance, function (button) {
                return found = instance.get('invokeOnCloseOff') !== true && (button.invokeOnClose === true);
            });
            //none of the buttons registered as onclose callback
            //close the dialog
            if (!found && instance.isOpen()) {
                instance.close();
            }
        }

        /**
         * Dialogs commands event handler, attached to the dialog commands element.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function commandsClickHandler(event, instance) {
            var target = event.srcElement || event.target;
            switch (target) {
            case instance.elements.commands.pin:
                if (!instance.isPinned()) {
                    pin(instance);
                } else {
                    unpin(instance);
                }
                break;
            case instance.elements.commands.maximize:
                if (!instance.isMaximized()) {
                    maximize(instance);
                } else {
                    restore(instance);
                }
                break;
            case instance.elements.commands.close:
                triggerClose(instance);
                break;
            }
            return false;
        }

        /**
         * Helper: pins the modeless dialog.
         *
         * @param {Object} instance	The dialog instance.
         * 
         * @return {undefined}
         */
        function pin(instance) {
            //pin the dialog
            instance.set('pinned', true);
        }

        /**
         * Helper: unpins the modeless dialog.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function unpin(instance) {
            //unpin the dialog 
            instance.set('pinned', false);
        }


        /**
         * Helper: enlarges the dialog to fill the entire screen.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function maximize(instance) {
            // allow custom `onmaximize` method
            dispatchEvent('onmaximize', instance);
            //maximize the dialog 
            addClass(instance.elements.root, classes.maximized);
            if (instance.isOpen()) {
                ensureNoOverflow();
            }
            // allow custom `onmaximized` method
            dispatchEvent('onmaximized', instance);
        }

        /**
         * Helper: returns the dialog to its former size.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function restore(instance) {
            // allow custom `onrestore` method
            dispatchEvent('onrestore', instance);
            //maximize the dialog 
            removeClass(instance.elements.root, classes.maximized);
            if (instance.isOpen()) {
                ensureNoOverflow();
            }
            // allow custom `onrestored` method
            dispatchEvent('onrestored', instance);
        }

        /**
         * Show or hide the maximize box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updatePinnable(instance) {
            if (instance.get('pinnable')) {
                // add class
                addClass(instance.elements.root, classes.pinnable);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.pinnable);
            }
        }

        /**
         * Helper: Fixes the absolutly positioned modal div position.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function addAbsPositionFix(instance) {
            var scrollLeft = getScrollLeft();
            instance.elements.modal.style.marginTop = getScrollTop() + 'px';
            instance.elements.modal.style.marginLeft = scrollLeft + 'px';
            instance.elements.modal.style.marginRight = (-scrollLeft) + 'px';
        }

        /**
         * Helper: Removes the absolutly positioned modal div position fix.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function removeAbsPositionFix(instance) {
            var marginTop = parseInt(instance.elements.modal.style.marginTop, 10);
            var marginLeft = parseInt(instance.elements.modal.style.marginLeft, 10);
            instance.elements.modal.style.marginTop = '';
            instance.elements.modal.style.marginLeft = '';
            instance.elements.modal.style.marginRight = '';

            if (instance.isOpen()) {
                var top = 0,
                    left = 0
                ;
                if (instance.elements.dialog.style.top !== '') {
                    top = parseInt(instance.elements.dialog.style.top, 10);
                }
                instance.elements.dialog.style.top = (top + (marginTop - getScrollTop())) + 'px';

                if (instance.elements.dialog.style.left !== '') {
                    left = parseInt(instance.elements.dialog.style.left, 10);
                }
                instance.elements.dialog.style.left = (left + (marginLeft - getScrollLeft())) + 'px';
            }
        }
        /**
         * Helper: Adds/Removes the absolutly positioned modal div position fix based on its pinned setting.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function updateAbsPositionFix(instance) {
            // if modeless and unpinned add fix
            if (!instance.get('modal') && !instance.get('pinned')) {
                addAbsPositionFix(instance);
            } else {
                removeAbsPositionFix(instance);
            }
        }
        /**
         * Toggles the dialog position lock | modeless only.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to make it modal, false otherwise.
         *
         * @return {undefined}
         */
        function updatePinned(instance) {
            if (instance.get('pinned')) {
                removeClass(instance.elements.root, classes.unpinned);
                if (instance.isOpen()) {
                    removeAbsPositionFix(instance);
                }
            } else {
                addClass(instance.elements.root, classes.unpinned);
                if (instance.isOpen() && !instance.isModal()) {
                    addAbsPositionFix(instance);
                }
            }
        }

        /**
         * Show or hide the maximize box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateMaximizable(instance) {
            if (instance.get('maximizable')) {
                // add class
                addClass(instance.elements.root, classes.maximizable);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.maximizable);
            }
        }

        /**
         * Show or hide the close box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateClosable(instance) {
            if (instance.get('closable')) {
                // add class
                addClass(instance.elements.root, classes.closable);
                bindClosableEvents(instance);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.closable);
                unbindClosableEvents(instance);
            }
        }

        
        var cancelClick = false,// flag to cancel click event if already handled by end resize event (the mousedown, mousemove, mouseup sequence fires a click event.).
            modalClickHandlerTS=0 // stores last click timestamp to prevent executing the handler twice on double click.
            ;

        /**
         * Helper: closes the modal dialog when clicking the modal
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function modalClickHandler(event, instance) {
            if(event.timeStamp - modalClickHandlerTS > 200 && (modalClickHandlerTS = event.timeStamp) && !cancelClick){
                var target = event.srcElement || event.target;
                if (instance.get('closableByDimmer') === true && target === instance.elements.modal) {
                    triggerClose(instance);
                }
            }
            cancelClick = false;
        }

        // stores last call timestamp to prevent triggering the callback twice.
        var callbackTS = 0;
        // flag to cancel keyup event if already handled by click event (pressing Enter on a focusted button).
        var cancelKeyup = false;
        /** 
         * Helper: triggers a button callback
         *
         * @param {Object}		The dilog instance.
         * @param {Function}	Callback to check which button triggered the event.
         *
         * @return {undefined}
         */
        function triggerCallback(instance, check) {
            if(Date.now() - callbackTS > 200 && (callbackTS = Date.now())){
                for (var idx = 0; idx < instance.__internal.buttons.length; idx += 1) {
                    var button = instance.__internal.buttons[idx];
                    if (!button.element.disabled && check(button)) {
                        var closeEvent = createCloseEvent(idx, button);
                        if (typeof instance.callback === 'function') {
                            instance.callback.apply(instance, [closeEvent]);
                        }
                        //close the dialog only if not canceled.
                        if (closeEvent.cancel === false) {
                            instance.close();
                        }
                        break;
                    }
                }
            }
        }

        /**
         * Clicks event handler, attached to the dialog footer.
         *
         * @param {Event}		DOM event object.
         * @param {Object}		The dilog instance.
         * 
         * @return {undefined}
         */
        function buttonsClickHandler(event, instance) {
            var target = event.srcElement || event.target;
            triggerCallback(instance, function (button) {
                // if this button caused the click, cancel keyup event
                return button.element === target && (cancelKeyup = true);
            });
        }

        /**
         * Keyup event handler, attached to the document.body
         *
         * @param {Event}		DOM event object.
         * @param {Object}		The dilog instance.
         * 
         * @return {undefined}
         */
        function keyupHandler(event) {
            //hitting enter while button has focus will trigger keyup too.
            //ignore if handled by clickHandler
            if (cancelKeyup) {
                cancelKeyup = false;
                return;
            }
            var instance = openDialogs[openDialogs.length - 1];
            var keyCode = event.keyCode;
            if (instance.__internal.buttons.length === 0 && keyCode === keys.ESC && instance.get('closable') === true) {
                triggerClose(instance);
                return false;
            }else if (usedKeys.indexOf(keyCode) > -1) {
                triggerCallback(instance, function (button) {
                    return button.key === keyCode;
                });
                return false;
            }
        }
        /**
        * Keydown event handler, attached to the document.body
        *
        * @param {Event}		DOM event object.
        * @param {Object}		The dilog instance.
        * 
        * @return {undefined}
        */
        function keydownHandler(event) {
            var instance = openDialogs[openDialogs.length - 1];
            var keyCode = event.keyCode;
            if (keyCode === keys.LEFT || keyCode === keys.RIGHT) {
                var buttons = instance.__internal.buttons;
                for (var x = 0; x < buttons.length; x += 1) {
                    if (document.activeElement === buttons[x].element) {
                        switch (keyCode) {
                        case keys.LEFT:
                            buttons[(x || buttons.length) - 1].element.focus();
                            return;
                        case keys.RIGHT:
                            buttons[(x + 1) % buttons.length].element.focus();
                            return;
                        }
                    }
                }
            }else if (keyCode < keys.F12 + 1 && keyCode > keys.F1 - 1 && usedKeys.indexOf(keyCode) > -1) {
                event.preventDefault();
                event.stopPropagation();
                triggerCallback(instance, function (button) {
                    return button.key === keyCode;
                });
                return false;
            }
        }


        /**
         * Sets focus to proper dialog element
         *
         * @param {Object} instance The dilog instance.
         * @param {Node} [resetTarget=undefined] DOM element to reset focus to.
         *
         * @return {undefined}
         */
        function setFocus(instance, resetTarget) {
            // reset target has already been determined.
            if (resetTarget) {
                resetTarget.focus();
            } else {
                // current instance focus settings
                var focus = instance.__internal.focus;
                // the focus element.
                var element = focus.element;

                switch (typeof focus.element) {
                // a number means a button index
                case 'number':
                    if (instance.__internal.buttons.length > focus.element) {
                        //in basic view, skip focusing the buttons.
                        if (instance.get('basic') === true) {
                            element = instance.elements.reset[0];
                        } else {
                            element = instance.__internal.buttons[focus.element].element;
                        }
                    }
                    break;
                // a string means querySelector to select from dialog body contents.
                case 'string':
                    element = instance.elements.body.querySelector(focus.element);
                    break;
                // a function should return the focus element.
                case 'function':
                    element = focus.element.call(instance);
                    break;
                }

                // if no focus element, default to first reset element.
                if (instance.get('defaultFocusOff') === true || ((typeof element === 'undefined' || element === null) && instance.__internal.buttons.length === 0)) {
                    element = instance.elements.reset[0];
                }
                // focus
                if (element && element.focus) {
                    element.focus();
                    // if selectable
                    if (focus.select && element.select) {
                        element.select();
                    }
                }
            }
        }

        /**
         * Focus event handler, attached to document.body and dialogs own reset links.
         * handles the focus for modal dialogs only.
         *
         * @param {Event} event DOM focus event object.
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function onReset(event, instance) {

            // should work on last modal if triggered from document.body 
            if (!instance) {
                for (var x = openDialogs.length - 1; x > -1; x -= 1) {
                    if (openDialogs[x].isModal()) {
                        instance = openDialogs[x];
                        break;
                    }
                }
            }

            if(instance) {
                // if modal
                if (instance.isModal()) {
                    // determine reset target to enable forward/backward tab cycle.
                    var firstReset = instance.elements.reset[0],
                        lastReset = instance.elements.reset[1],
                        lastFocusedElement = event.relatedTarget,
                        within = instance.elements.root.contains(lastFocusedElement),
                        target = event.srcElement || event.target,
                        resetTarget;

                    //if the previous focused element element was outside the modal do nthing
                    if(  /*first show */
                        (target === firstReset && !within) ||
                         /*focus cycle */
                        (target === lastReset && lastFocusedElement === firstReset)){
                        return;
                    }else if(target === lastReset || target === document.body){
                        resetTarget = firstReset;
                    }else if(target === firstReset && lastFocusedElement === lastReset){
                        resetTarget = findTabbable(instance);
                    }else if(target === firstReset && within){
                        resetTarget = findTabbable(instance, true);
                    }
                    // focus
                    setFocus(instance, resetTarget);
                }
            }
        }
        function findTabbable(instance, last){
            var tabbables = [].slice.call(instance.elements.dialog.querySelectorAll(defaults.tabbable));
            if(last){
                tabbables.reverse();
            }
            for(var x=0;x<tabbables.length;x+=1){
                var tabbable = tabbables[x];
                //check if visible
                if(!!(tabbable.offsetParent || tabbable.offsetWidth || tabbable.offsetHeight || tabbable.getClientRects().length)){
                    return tabbable;
                }
            }
        }
        function recycleTab(event) {
            var instance = openDialogs[openDialogs.length - 1];
            if (instance && event.shiftKey && event.keyCode === keys.TAB) {
                instance.elements.reset[1].focus();
            }
        }
        /**
         * Transition in transitionend event handler. 
         *
         * @param {Event}		TransitionEnd event object.
         * @param {Object}		The dilog instance.
         *
         * @return {undefined}
         */
        function handleTransitionInEvent(event, instance) {
            // clear the timer
            clearTimeout(instance.__internal.timerIn);

            // once transition is complete, set focus
            setFocus(instance);

            // allow handling key up after transition ended.
            cancelKeyup = false;

            // allow custom `onfocus` method
            dispatchEvent('onfocus', instance);

            // unbind the event
            off(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);

            removeClass(instance.elements.root, classes.animationIn);
        }

        /**
         * Transition out transitionend event handler. 
         *
         * @param {Event}		TransitionEnd event object.
         * @param {Object}		The dilog instance.
         *
         * @return {undefined}
         */
        function handleTransitionOutEvent(event, instance) {
            // clear the timer
            clearTimeout(instance.__internal.timerOut);
            // unbind the event
            off(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);

            // reset move updates
            resetMove(instance);
            // reset resize updates
            resetResize(instance);

            // restore if maximized
            if (instance.isMaximized() && !instance.get('startMaximized')) {
                restore(instance);
            }

            //destory the instance
            if (typeof instance.__internal.destroy === 'function') {
                instance.__internal.destroy.apply(instance);
            }
        }
        /* Controls moving a dialog around */
        //holde the current moving instance
        var movable = null,
            //holds the current X offset when move starts
            offsetX = 0,
            //holds the current Y offset when move starts
            offsetY = 0,
            xProp = 'pageX',
            yProp = 'pageY',
            bounds = null,
            refreshTop = false,
            moveDelegate = null
        ;

        /**
         * Helper: sets the element top/left coordinates
         *
         * @param {Event} event	DOM event object.
         * @param {Node} element The element being moved.
         * 
         * @return {undefined}
         */
        function moveElement(event, element) {
            var left = (event[xProp] - offsetX),
                top  = (event[yProp] - offsetY);

            if(refreshTop){
                top -= document.body.scrollTop;
            }
           
            element.style.left = left + 'px';
            element.style.top = top + 'px';
           
        }
        /**
         * Helper: sets the element top/left coordinates within screen bounds
         *
         * @param {Event} event	DOM event object.
         * @param {Node} element The element being moved.
         * 
         * @return {undefined}
         */
        function moveElementBounded(event, element) {
            var left = (event[xProp] - offsetX),
                top  = (event[yProp] - offsetY);

            if(refreshTop){
                top -= document.body.scrollTop;
            }
            
            element.style.left = Math.min(bounds.maxLeft, Math.max(bounds.minLeft, left)) + 'px';
            if(refreshTop){
                element.style.top = Math.min(bounds.maxTop, Math.max(bounds.minTop, top)) + 'px';
            }else{
                element.style.top = Math.max(bounds.minTop, top) + 'px';
            }
        }
            

        /**
         * Triggers the start of a move event, attached to the header element mouse down event.
         * Adds no-selection class to the body, disabling selection while moving.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         * 
         * @return {Boolean} false
         */
        function beginMove(event, instance) {
            if (resizable === null && !instance.isMaximized() && instance.get('movable')) {
                var eventSrc, left=0, top=0;
                if (event.type === 'touchstart') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                    xProp = 'clientX';
                    yProp = 'clientY';
                } else if (event.button === 0) {
                    eventSrc = event;
                }

                if (eventSrc) {

                    var element = instance.elements.dialog;
                    addClass(element, classes.capture);

                    if (element.style.left) {
                        left = parseInt(element.style.left, 10);
                    }

                    if (element.style.top) {
                        top = parseInt(element.style.top, 10);
                    }
                    
                    offsetX = eventSrc[xProp] - left;
                    offsetY = eventSrc[yProp] - top;

                    if(instance.isModal()){
                        offsetY += instance.elements.modal.scrollTop;
                    }else if(instance.isPinned()){
                        offsetY -= document.body.scrollTop;
                    }
                    
                    if(instance.get('moveBounded')){
                        var current = element,
                            offsetLeft = -left,
                            offsetTop = -top;
                        
                        //calc offset
                        do {
                            offsetLeft += current.offsetLeft;
                            offsetTop += current.offsetTop;
                        } while (current = current.offsetParent);
                        
                        bounds = {
                            maxLeft : offsetLeft,
                            minLeft : -offsetLeft,
                            maxTop  : document.documentElement.clientHeight - element.clientHeight - offsetTop,
                            minTop  : -offsetTop
                        };
                        moveDelegate = moveElementBounded;
                    }else{
                        bounds = null;
                        moveDelegate = moveElement;
                    }
                    
                    // allow custom `onmove` method
                    dispatchEvent('onmove', instance);

                    refreshTop = !instance.isModal() && instance.isPinned();
                    movable = instance;
                    moveDelegate(eventSrc, element);
                    addClass(document.body, classes.noSelection);
                    return false;
                }
            }
        }

        /**
         * The actual move handler,  attached to document.body mousemove event.
         *
         * @param {Event} event	DOM event object.
         * 
         * @return {undefined}
         */
        function move(event) {
            if (movable) {
                var eventSrc;
                if (event.type === 'touchmove') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    moveDelegate(eventSrc, movable.elements.dialog);
                }
            }
        }

        /**
         * Triggers the end of a move event,  attached to document.body mouseup event.
         * Removes no-selection class from document.body, allowing selection.
         *
         * @return {undefined}
         */
        function endMove() {
            if (movable) {
                var instance = movable;
                movable = bounds = null;
                removeClass(document.body, classes.noSelection);
                removeClass(instance.elements.dialog, classes.capture);
                // allow custom `onmoved` method
                dispatchEvent('onmoved', instance);
            }
        }

        /**
         * Resets any changes made by moving the element to its original state,
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function resetMove(instance) {
            movable = null;
            var element = instance.elements.dialog;
            element.style.left = element.style.top = '';
        }

        /**
         * Updates the dialog move behavior.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateMovable(instance) {
            if (instance.get('movable')) {
                // add class
                addClass(instance.elements.root, classes.movable);
                if (instance.isOpen()) {
                    bindMovableEvents(instance);
                }
            } else {

                //reset
                resetMove(instance);
                // remove class
                removeClass(instance.elements.root, classes.movable);
                if (instance.isOpen()) {
                    unbindMovableEvents(instance);
                }
            }
        }

        /* Controls moving a dialog around */
        //holde the current instance being resized		
        var resizable = null,
            //holds the staring left offset when resize starts.
            startingLeft = Number.Nan,
            //holds the staring width when resize starts.
            startingWidth = 0,
            //holds the initial width when resized for the first time.
            minWidth = 0,
            //holds the offset of the resize handle.
            handleOffset = 0
        ;

        /**
         * Helper: sets the element width/height and updates left coordinate if neccessary.
         *
         * @param {Event} event	DOM mousemove event object.
         * @param {Node} element The element being moved.
         * @param {Boolean} pinned A flag indicating if the element being resized is pinned to the screen.
         * 
         * @return {undefined}
         */
        function resizeElement(event, element, pageRelative) {

            //calculate offsets from 0,0
            var current = element;
            var offsetLeft = 0;
            var offsetTop = 0;
            do {
                offsetLeft += current.offsetLeft;
                offsetTop += current.offsetTop;
            } while (current = current.offsetParent);

            // determine X,Y coordinates.
            var X, Y;
            if (pageRelative === true) {
                X = event.pageX;
                Y = event.pageY;
            } else {
                X = event.clientX;
                Y = event.clientY;
            }
            // rtl handling
            var isRTL = isRightToLeft();
            if (isRTL) {
                // reverse X 
                X = document.body.offsetWidth - X;
                // if has a starting left, calculate offsetRight
                if (!isNaN(startingLeft)) {
                    offsetLeft = document.body.offsetWidth - offsetLeft - element.offsetWidth;
                }
            }

            // set width/height
            element.style.height = (Y - offsetTop + handleOffset) + 'px';
            element.style.width = (X - offsetLeft + handleOffset) + 'px';

            // if the element being resized has a starting left, maintain it.
            // the dialog is centered, divide by half the offset to maintain the margins.
            if (!isNaN(startingLeft)) {
                var diff = Math.abs(element.offsetWidth - startingWidth) * 0.5;
                if (isRTL) {
                    //negate the diff, why?
                    //when growing it should decrease left
                    //when shrinking it should increase left
                    diff *= -1;
                }
                if (element.offsetWidth > startingWidth) {
                    //growing
                    element.style.left = (startingLeft + diff) + 'px';
                } else if (element.offsetWidth >= minWidth) {
                    //shrinking
                    element.style.left = (startingLeft - diff) + 'px';
                }
            }
        }

        /**
         * Triggers the start of a resize event, attached to the resize handle element mouse down event.
         * Adds no-selection class to the body, disabling selection while moving.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         * 
         * @return {Boolean} false
         */
        function beginResize(event, instance) {
            if (!instance.isMaximized()) {
                var eventSrc;
                if (event.type === 'touchstart') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    // allow custom `onresize` method
                    dispatchEvent('onresize', instance);
                    
                    resizable = instance;
                    handleOffset = instance.elements.resizeHandle.offsetHeight / 2;
                    var element = instance.elements.dialog;
                    addClass(element, classes.capture);
                    startingLeft = parseInt(element.style.left, 10);
                    element.style.height = element.offsetHeight + 'px';
                    element.style.minHeight = instance.elements.header.offsetHeight + instance.elements.footer.offsetHeight + 'px';
                    element.style.width = (startingWidth = element.offsetWidth) + 'px';

                    if (element.style.maxWidth !== 'none') {
                        element.style.minWidth = (minWidth = element.offsetWidth) + 'px';
                    }
                    element.style.maxWidth = 'none';
                    addClass(document.body, classes.noSelection);
                    return false;
                }
            }
        }

        /**
         * The actual resize handler,  attached to document.body mousemove event.
         *
         * @param {Event} event	DOM event object.
         * 
         * @return {undefined}
         */
        function resize(event) {
            if (resizable) {
                var eventSrc;
                if (event.type === 'touchmove') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    resizeElement(eventSrc, resizable.elements.dialog, !resizable.get('modal') && !resizable.get('pinned'));
                }
            }
        }

        /**
         * Triggers the end of a resize event,  attached to document.body mouseup event.
         * Removes no-selection class from document.body, allowing selection.
         *
         * @return {undefined}
         */
        function endResize() {
            if (resizable) {
                var instance = resizable;
                resizable = null;
                removeClass(document.body, classes.noSelection);
                removeClass(instance.elements.dialog, classes.capture);
                cancelClick = true;
                // allow custom `onresized` method
                dispatchEvent('onresized', instance);
            }
        }

        /**
         * Resets any changes made by resizing the element to its original state.
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function resetResize(instance) {
            resizable = null;
            var element = instance.elements.dialog;
            if (element.style.maxWidth === 'none') {
                //clear inline styles.
                element.style.maxWidth = element.style.minWidth = element.style.width = element.style.height = element.style.minHeight = element.style.left = '';
                //reset variables.
                startingLeft = Number.Nan;
                startingWidth = minWidth = handleOffset = 0;
            }
        }


        /**
         * Updates the dialog move behavior.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateResizable(instance) {
            if (instance.get('resizable')) {
                // add class
                addClass(instance.elements.root, classes.resizable);
                if (instance.isOpen()) {
                    bindResizableEvents(instance);
                }
            } else {
                //reset
                resetResize(instance);
                // remove class
                removeClass(instance.elements.root, classes.resizable);
                if (instance.isOpen()) {
                    unbindResizableEvents(instance);
                }
            }
        }

        /**
         * Reset move/resize on window resize.
         *
         * @param {Event} event	window resize event object.
         *
         * @return {undefined}
         */
        function windowResize(/*event*/) {
            for (var x = 0; x < openDialogs.length; x += 1) {
                var instance = openDialogs[x];
                if (instance.get('autoReset')) {
                    resetMove(instance);
                    resetResize(instance);
                }
            }
        }
        /**
         * Bind dialogs events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindEvents(instance) {
            // if first dialog, hook global handlers
            if (openDialogs.length === 1) {
                //global
                on(window, 'resize', windowResize);
                on(document.body, 'keyup', keyupHandler);
                on(document.body, 'keydown', keydownHandler);
                on(document.body, 'focus', onReset);

                //move
                on(document.documentElement, 'mousemove', move);
                on(document.documentElement, 'touchmove', move, false, false);
                on(document.documentElement, 'mouseup', endMove);
                on(document.documentElement, 'touchend', endMove);
                //resize
                on(document.documentElement, 'mousemove', resize);
                on(document.documentElement, 'touchmove', resize, false, false);
                on(document.documentElement, 'mouseup', endResize);
                on(document.documentElement, 'touchend', endResize);
            }

            // common events
            on(instance.elements.commands.container, 'click', instance.__internal.commandsClickHandler);
            on(instance.elements.footer, 'click', instance.__internal.buttonsClickHandler);
            on(instance.elements.reset[0], 'focusin', instance.__internal.resetHandler);
            on(instance.elements.reset[0], 'keydown', recycleTab);
            on(instance.elements.reset[1], 'focusin', instance.__internal.resetHandler);

            //prevent handling key up when dialog is being opened by a key stroke.
            cancelKeyup = true;
            // hook in transition handler
            on(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);

            // modelss only events
            if (!instance.get('modal')) {
                bindModelessEvents(instance);
            }

            // resizable
            if (instance.get('resizable')) {
                bindResizableEvents(instance);
            }

            // movable
            if (instance.get('movable')) {
                bindMovableEvents(instance);
            }
        }

        /**
         * Unbind dialogs events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindEvents(instance) {
            // if last dialog, remove global handlers
            if (openDialogs.length === 1) {
                //global
                off(window, 'resize', windowResize);
                off(document.body, 'keyup', keyupHandler);
                off(document.body, 'keydown', keydownHandler);
                off(document.body, 'focus', onReset);
                //move
                off(document.documentElement, 'mousemove', move);
                off(document.documentElement, 'mouseup', endMove);
                //resize
                off(document.documentElement, 'mousemove', resize);
                off(document.documentElement, 'mouseup', endResize);
            }

            // common events
            off(instance.elements.commands.container, 'click', instance.__internal.commandsClickHandler);
            off(instance.elements.footer, 'click', instance.__internal.buttonsClickHandler);
            off(instance.elements.reset[0], 'focusin', instance.__internal.resetHandler);
            off(instance.elements.reset[0], 'keydown', recycleTab);
            off(instance.elements.reset[1], 'focusin', instance.__internal.resetHandler);

            // hook out transition handler
            on(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);

            // modelss only events
            if (!instance.get('modal')) {
                unbindModelessEvents(instance);
            }

            // movable
            if (instance.get('movable')) {
                unbindMovableEvents(instance);
            }

            // resizable
            if (instance.get('resizable')) {
                unbindResizableEvents(instance);
            }

        }

        /**
         * Bind modeless specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindModelessEvents(instance) {
            on(instance.elements.dialog, 'focus', instance.__internal.bringToFrontHandler, true);
        }

        /**
         * Unbind modeless specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindModelessEvents(instance) {
            off(instance.elements.dialog, 'focus', instance.__internal.bringToFrontHandler, true);
        }



        /**
         * Bind movable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindMovableEvents(instance) {
            on(instance.elements.header, 'mousedown', instance.__internal.beginMoveHandler);
            on(instance.elements.header, 'touchstart', instance.__internal.beginMoveHandler, false, false);
        }

        /**
         * Unbind movable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindMovableEvents(instance) {
            off(instance.elements.header, 'mousedown', instance.__internal.beginMoveHandler);
            off(instance.elements.header, 'touchstart', instance.__internal.beginMoveHandler, false, false);
        }



        /**
         * Bind resizable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindResizableEvents(instance) {
            on(instance.elements.resizeHandle, 'mousedown', instance.__internal.beginResizeHandler);
            on(instance.elements.resizeHandle, 'touchstart', instance.__internal.beginResizeHandler, false, false);
        }

        /**
         * Unbind resizable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindResizableEvents(instance) {
            off(instance.elements.resizeHandle, 'mousedown', instance.__internal.beginResizeHandler);
            off(instance.elements.resizeHandle, 'touchstart', instance.__internal.beginResizeHandler, false, false);
        }

        /**
         * Bind closable events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindClosableEvents(instance) {
            on(instance.elements.modal, 'click', instance.__internal.modalClickHandler);
        }

        /**
         * Unbind closable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindClosableEvents(instance) {
            off(instance.elements.modal, 'click', instance.__internal.modalClickHandler);
        }
        // dialog API
        return {
            __init:initialize,
            /**
             * Check if dialog is currently open
             *
             * @return {Boolean}
             */
            isOpen: function () {
                return this.__internal.isOpen;
            },
            isModal: function (){
                return this.elements.root.className.indexOf(classes.modeless) < 0;
            },
            isMaximized:function(){
                return this.elements.root.className.indexOf(classes.maximized) > -1;
            },
            isPinned:function(){
                return this.elements.root.className.indexOf(classes.unpinned) < 0;
            },
            maximize:function(){
                if(!this.isMaximized()){
                    maximize(this);
                }
                return this;
            },
            restore:function(){
                if(this.isMaximized()){
                    restore(this);
                }
                return this;
            },
            pin:function(){
                if(!this.isPinned()){
                    pin(this);
                }
                return this;
            },
            unpin:function(){
                if(this.isPinned()){
                    unpin(this);
                }
                return this;
            },
            bringToFront:function(){
                bringToFront(null, this);
                return this;
            },
            /**
             * Move the dialog to a specific x/y coordinates
             *
             * @param {Number} x    The new dialog x coordinate in pixels.
             * @param {Number} y    The new dialog y coordinate in pixels.
             *
             * @return {Object} The dialog instance.
             */
            moveTo:function(x,y){
                if(!isNaN(x) && !isNaN(y)){
                    // allow custom `onmove` method
                    dispatchEvent('onmove', this);
                    
                    var element = this.elements.dialog,
                        current = element,
                        offsetLeft = 0,
                        offsetTop = 0;
                    
                    //subtract existing left,top
                    if (element.style.left) {
                        offsetLeft -= parseInt(element.style.left, 10);
                    }
                    if (element.style.top) {
                        offsetTop -= parseInt(element.style.top, 10);
                    }
                    //calc offset
                    do {
                        offsetLeft += current.offsetLeft;
                        offsetTop += current.offsetTop;
                    } while (current = current.offsetParent);

                    //calc left, top
                    var left = (x - offsetLeft);
                    var top  = (y - offsetTop);

                    //// rtl handling
                    if (isRightToLeft()) {
                        left *= -1;
                    }

                    element.style.left = left + 'px';
                    element.style.top = top + 'px';
                    
                    // allow custom `onmoved` method
                    dispatchEvent('onmoved', this);
                }
                return this;
            },
            /**
             * Resize the dialog to a specific width/height (the dialog must be 'resizable').
             * The dialog can be resized to:
             *  A minimum width equal to the initial display width
             *  A minimum height equal to the sum of header/footer heights.
             *
             *
             * @param {Number or String} width    The new dialog width in pixels or in percent.
             * @param {Number or String} height   The new dialog height in pixels or in percent.
             *
             * @return {Object} The dialog instance.
             */
            resizeTo:function(width,height){
                var w = parseFloat(width),
                    h = parseFloat(height),
                    regex = /(\d*\.\d+|\d+)%/
                ;

                if(!isNaN(w) && !isNaN(h) && this.get('resizable') === true){
                    
                    // allow custom `onresize` method
                    dispatchEvent('onresize', this);
                    
                    if(('' + width).match(regex)){
                        w = w / 100 * document.documentElement.clientWidth ;
                    }

                    if(('' + height).match(regex)){
                        h = h / 100 * document.documentElement.clientHeight;
                    }

                    var element = this.elements.dialog;
                    if (element.style.maxWidth !== 'none') {
                        element.style.minWidth = (minWidth = element.offsetWidth) + 'px';
                    }
                    element.style.maxWidth = 'none';
                    element.style.minHeight = this.elements.header.offsetHeight + this.elements.footer.offsetHeight + 'px';
                    element.style.width = w + 'px';
                    element.style.height = h + 'px';
                    
                    // allow custom `onresized` method
                    dispatchEvent('onresized', this);
                }
                return this;
            },
            /**
             * Gets or Sets dialog settings/options 
             *
             * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
             * @param {Object} value Optional, the value associated with the key (in case it was a string).
             *
             * @return {undefined}
             */
            setting : function (key, value) {
                var self = this;
                var result = update(this, this.__internal.options, function(k,o,n){ optionUpdated(self,k,o,n); }, key, value);
                if(result.op === 'get'){
                    if(result.found){
                        return result.value;
                    }else if(typeof this.settings !== 'undefined'){
                        return update(this, this.settings, this.settingUpdated || function(){}, key, value).value;
                    }else{
                        return undefined;
                    }
                }else if(result.op === 'set'){
                    if(result.items.length > 0){
                        var callback = this.settingUpdated || function(){};
                        for(var x=0;x<result.items.length;x+=1){
                            var item = result.items[x];
                            if(!item.found && typeof this.settings !== 'undefined'){
                                update(this, this.settings, callback, item.key, item.value);
                            }
                        }
                    }
                    return this;
                }
            },
            /**
             * [Alias] Sets dialog settings/options 
             */
            set:function(key, value){
                this.setting(key,value);
                return this;
            },
            /**
             * [Alias] Gets dialog settings/options 
             */
            get:function(key){
                return this.setting(key);
            },
            /**
            * Sets dialog header
            * @content {string or element}
            *
            * @return {undefined}
            */
            setHeader:function(content){
                if(typeof content === 'string'){
                    clearContents(this.elements.header);
                    this.elements.header.innerHTML = content;
                }else if (content instanceof window.HTMLElement && this.elements.header.firstChild !== content){
                    clearContents(this.elements.header);
                    this.elements.header.appendChild(content);
                }
                return this;
            },
            /**
            * Sets dialog contents
            * @content {string or element}
            *
            * @return {undefined}
            */
            setContent:function(content){
                if(typeof content === 'string'){
                    clearContents(this.elements.content);
                    this.elements.content.innerHTML = content;
                }else if (content instanceof window.HTMLElement && this.elements.content.firstChild !== content){
                    clearContents(this.elements.content);
                    this.elements.content.appendChild(content);
                }
                return this;
            },
            /**
             * Show the dialog as modal
             *
             * @return {Object} the dialog instance.
             */
            showModal: function(className){
                return this.show(true, className);
            },
            /**
             * Show the dialog
             *
             * @return {Object} the dialog instance.
             */
            show: function (modal, className) {
                
                // ensure initialization
                initialize(this);

                if ( !this.__internal.isOpen ) {

                    // add to open dialogs
                    this.__internal.isOpen = true;
                    openDialogs.push(this);

                    // save last focused element
                    if(alertify.defaults.maintainFocus){
                        this.__internal.activeElement = document.activeElement;
                    }

                    // set tabindex attribute on body element this allows script to give it focusable
                    if(!document.body.hasAttribute('tabindex')) {
                        document.body.setAttribute( 'tabindex', tabindex = '0');
                    }

                    //allow custom dom manipulation updates before showing the dialog.
                    if(typeof this.prepare === 'function'){
                        this.prepare();
                    }

                    bindEvents(this);

                    if(modal !== undefined){
                        this.set('modal', modal);
                    }

                    //save scroll to prevent document jump
                    saveScrollPosition();

                    ensureNoOverflow();

                    // allow custom dialog class on show
                    if(typeof className === 'string' && className !== ''){
                        this.__internal.className = className;
                        addClass(this.elements.root, className);
                    }

                    // maximize if start maximized
                    if ( this.get('startMaximized')) {
                        this.maximize();
                    }else if(this.isMaximized()){
                        restore(this);
                    }

                    updateAbsPositionFix(this);
                    this.elements.root.removeAttribute('style');
                    removeClass(this.elements.root, classes.animationOut);
                    addClass(this.elements.root, classes.animationIn);

                    // set 1s fallback in case transition event doesn't fire
                    clearTimeout( this.__internal.timerIn);
                    this.__internal.timerIn = setTimeout( this.__internal.transitionInHandler, transition.supported ? 1000 : 100 );

                    if(isSafari){
                        // force desktop safari reflow
                        var root = this.elements.root;
                        root.style.display  = 'none';
                        setTimeout(function(){root.style.display  = 'block';}, 0);
                    }

                    //reflow
                    reflow = this.elements.root.offsetWidth;
                  
                    // show dialog
                    removeClass(this.elements.root, classes.hidden);

                    //restore scroll to prevent document jump
                    restoreScrollPosition();

                    // internal on show event
                    if(typeof this.hooks.onshow === 'function'){
                        this.hooks.onshow.call(this);
                    }

                    // allow custom `onshow` method
                    dispatchEvent('onshow', this);

                }else{
                    // reset move updates
                    resetMove(this);
                    // reset resize updates
                    resetResize(this);
                    // shake the dialog to indicate its already open
                    addClass(this.elements.dialog, classes.shake);
                    var self = this;
                    setTimeout(function(){
                        removeClass(self.elements.dialog, classes.shake);
                    },200);
                }
                return this;
            },
            /**
             * Close the dialog
             *
             * @return {Object} The dialog instance
             */
            close: function () {
                if (this.__internal.isOpen ) {
                    // custom `onclosing` event
                    if(dispatchEvent('onclosing', this) !== false){

                        unbindEvents(this);

                        removeClass(this.elements.root, classes.animationIn);
                        addClass(this.elements.root, classes.animationOut);

                        // set 1s fallback in case transition event doesn't fire
                        clearTimeout( this.__internal.timerOut );
                        this.__internal.timerOut = setTimeout( this.__internal.transitionOutHandler, transition.supported ? 1000 : 100 );
                        // hide dialog
                        addClass(this.elements.root, classes.hidden);
                        //reflow
                        reflow = this.elements.modal.offsetWidth;

                        // return focus to the last active element
                        if (alertify.defaults.maintainFocus && this.__internal.activeElement) {
                            this.__internal.activeElement.focus();
                            this.__internal.activeElement = null;
                        }

                        // remove custom dialog class on hide
                        if (typeof this.__internal.className !== 'undefined' && this.__internal.className !== '') {
                            removeClass(this.elements.root, this.__internal.className);
                        }

                        // internal on close event
                        if(typeof this.hooks.onclose === 'function'){
                            this.hooks.onclose.call(this);
                        }

                        // allow custom `onclose` method
                        dispatchEvent('onclose', this);

                        //remove from open dialogs
                        openDialogs.splice(openDialogs.indexOf(this),1);
                        this.__internal.isOpen = false;

                        ensureNoOverflow();
                    }

                }
                // last dialog and tab index was set by us, remove it.
                if(!openDialogs.length && tabindex === '0'){
                    document.body.removeAttribute('tabindex');
                }
                return this;
            },
            /**
             * Close all open dialogs except this.
             *
             * @return {undefined}
             */
            closeOthers:function(){
                alertify.closeAll(this);
                return this;
            },
            /**
             * Destroys this dialog instance
             *
             * @return {undefined}
             */
            destroy:function(){
                if(this.__internal) {
                    if (this.__internal.isOpen ) {
                        //mark dialog for destruction, this will be called on tranistionOut event.
                        this.__internal.destroy = function(){
                            destruct(this, initialize);
                        };
                        //close the dialog to unbind all events.
                        this.close();
                    }else if(!this.__internal.destroy){
                        destruct(this, initialize);
                    }
                }
                return this;
            },
        };
	} () );
    var notifier = (function () {
        var reflow,
            element,
            openInstances = [],
            classes = defaults.notifier.classes,
            baseClass = classes.base;
        /**
         * Helper: initializes the notifier instance
         *
         */
        function initialize(instance) {

            if (!instance.__internal) {
                instance.__internal = {
                    position: alertify.defaults.notifier.position,
                    delay: alertify.defaults.notifier.delay,
                };

                element = document.createElement('DIV');
                var transitionOff = 'transitionOff' in defaults.notifier ? defaults.notifier.transitionOff : defaults.transitionOff;
                if(transitionOff){
                    baseClass = classes.base + ' ajs-no-transition';
                }
                updatePosition(instance);
            }

            //add to DOM tree.
            if (element.parentNode !== document.body) {
                document.body.appendChild(element);
            }
        }

        function pushInstance(instance) {
            instance.__internal.pushed = true;
            openInstances.push(instance);
        }
        function popInstance(instance) {
            openInstances.splice(openInstances.indexOf(instance), 1);
            instance.__internal.pushed = false;
        }
        /**
         * Helper: update the notifier instance position
         *
         */
        function updatePosition(instance) {
            element.className = baseClass;
            switch (instance.__internal.position) {
            case 'top-right':
                addClass(element, classes.top + ' ' + classes.right);
                break;
            case 'top-left':
                addClass(element, classes.top + ' ' + classes.left);
                break;
            case 'top-center':
                addClass(element, classes.top + ' ' + classes.center);
                break;
            case 'bottom-left':
                addClass(element, classes.bottom + ' ' + classes.left);
                break;
            case 'bottom-center':
                addClass(element, classes.bottom + ' ' + classes.center);
                break;

            default:
            case 'bottom-right':
                addClass(element, classes.bottom + ' ' + classes.right);
                break;
            }
        }

        /**
        * creates a new notification message
        *
        * @param  {DOMElement} message	The notifier message element
        * @param  {Number} wait   Time (in ms) to wait before the message is dismissed, a value of 0 means keep open till clicked.
        * @param  {Function} callback A callback function to be invoked when the message is dismissed.
        *
        * @return {undefined}
        */
        function create(div, callback) {

            function clickDelegate(event, instance) {
                if(!instance.__internal.closeButton || event.target.getAttribute('data-close') === 'true'){
                    instance.dismiss(true);
                }
            }

            function transitionDone(event, instance) {
                // unbind event
                off(instance.element, transition.type, transitionDone);
                // remove the message
                element.removeChild(instance.element);
            }

            function initialize(instance) {
                if (!instance.__internal) {
                    instance.__internal = {
                        pushed: false,
                        delay : undefined,
                        timer: undefined,
                        clickHandler: undefined,
                        transitionEndHandler: undefined,
                        transitionTimeout: undefined
                    };
                    instance.__internal.clickHandler = delegate(instance, clickDelegate);
                    instance.__internal.transitionEndHandler = delegate(instance, transitionDone);
                }
                return instance;
            }
            function clearTimers(instance) {
                clearTimeout(instance.__internal.timer);
                clearTimeout(instance.__internal.transitionTimeout);
            }
            return initialize({
                /* notification DOM element*/
                element: div,
                /*
                 * Pushes a notification message
                 * @param {string or DOMElement} content The notification message content
                 * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
                 *
                 */
                push: function (_content, _wait) {
                    if (!this.__internal.pushed) {

                        pushInstance(this);
                        clearTimers(this);

                        var content, wait;
                        switch (arguments.length) {
                        case 0:
                            wait = this.__internal.delay;
                            break;
                        case 1:
                            if (typeof (_content) === 'number') {
                                wait = _content;
                            } else {
                                content = _content;
                                wait = this.__internal.delay;
                            }
                            break;
                        case 2:
                            content = _content;
                            wait = _wait;
                            break;
                        }
                        this.__internal.closeButton = alertify.defaults.notifier.closeButton;
                        // set contents
                        if (typeof content !== 'undefined') {
                            this.setContent(content);
                        }
                        // append or insert
                        if (notifier.__internal.position.indexOf('top') < 0) {
                            element.appendChild(this.element);
                        } else {
                            element.insertBefore(this.element, element.firstChild);
                        }
                        reflow = this.element.offsetWidth;
                        addClass(this.element, classes.visible);
                        // attach click event
                        on(this.element, 'click', this.__internal.clickHandler);
                        return this.delay(wait);
                    }
                    return this;
                },
                /*
                 * {Function} callback function to be invoked before dismissing the notification message.
                 * Remarks: A return value === 'false' will cancel the dismissal
                 *
                 */
                ondismiss: function () { },
                /*
                 * {Function} callback function to be invoked when the message is dismissed.
                 *
                 */
                callback: callback,
                /*
                 * Dismisses the notification message
                 * @param {Boolean} clicked A flag indicating if the dismissal was caused by a click.
                 *
                 */
                dismiss: function (clicked) {
                    if (this.__internal.pushed) {
                        clearTimers(this);
                        if (!(typeof this.ondismiss === 'function' && this.ondismiss.call(this) === false)) {
                            //detach click event
                            off(this.element, 'click', this.__internal.clickHandler);
                            // ensure element exists
                            if (typeof this.element !== 'undefined' && this.element.parentNode === element) {
                                //transition end or fallback
                                this.__internal.transitionTimeout = setTimeout(this.__internal.transitionEndHandler, transition.supported ? 1000 : 100);
                                removeClass(this.element, classes.visible);

                                // custom callback on dismiss
                                if (typeof this.callback === 'function') {
                                    this.callback.call(this, clicked);
                                }
                            }
                            popInstance(this);
                        }
                    }
                    return this;
                },
                /*
                 * Delays the notification message dismissal
                 * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
                 *
                 */
                delay: function (wait) {
                    clearTimers(this);
                    this.__internal.delay = typeof wait !== 'undefined' && !isNaN(+wait) ? +wait : notifier.__internal.delay;
                    if (this.__internal.delay > 0) {
                        var  self = this;
                        this.__internal.timer = setTimeout(function () { self.dismiss(); }, this.__internal.delay * 1000);
                    }
                    return this;
                },
                /*
                 * Sets the notification message contents
                 * @param {string or DOMElement} content The notification message content
                 *
                 */
                setContent: function (content) {
                    if (typeof content === 'string') {
                        clearContents(this.element);
                        this.element.innerHTML = content;
                    } else if (content instanceof window.HTMLElement && this.element.firstChild !== content) {
                        clearContents(this.element);
                        this.element.appendChild(content);
                    }
                    if(this.__internal.closeButton){
                        var close = document.createElement('span');
                        addClass(close, classes.close);
                        close.setAttribute('data-close', true);
                        this.element.appendChild(close);
                    }
                    return this;
                },
                /*
                 * Dismisses all open notifications except this.
                 *
                 */
                dismissOthers: function () {
                    notifier.dismissAll(this);
                    return this;
                }
            });
        }

        //notifier api
        return {
            /**
             * Gets or Sets notifier settings.
             *
             * @param {string} key The setting name
             * @param {Variant} value The setting value.
             *
             * @return {Object}	if the called as a setter, return the notifier instance.
             */
            setting: function (key, value) {
                //ensure init
                initialize(this);

                if (typeof value === 'undefined') {
                    //get
                    return this.__internal[key];
                } else {
                    //set
                    switch (key) {
                    case 'position':
                        this.__internal.position = value;
                        updatePosition(this);
                        break;
                    case 'delay':
                        this.__internal.delay = value;
                        break;
                    }
                }
                return this;
            },
            /**
             * [Alias] Sets dialog settings/options
             */
            set:function(key,value){
                this.setting(key,value);
                return this;
            },
            /**
             * [Alias] Gets dialog settings/options
             */
            get:function(key){
                return this.setting(key);
            },
            /**
             * Creates a new notification message
             *
             * @param {string} type The type of notification message (simply a CSS class name 'ajs-{type}' to be added).
             * @param {Function} callback  A callback function to be invoked when the message is dismissed.
             *
             * @return {undefined}
             */
            create: function (type, callback) {
                //ensure notifier init
                initialize(this);
                //create new notification message
                var div = document.createElement('div');
                div.className = classes.message + ((typeof type === 'string' && type !== '') ? ' ' + classes.prefix + type : '');
                return create(div, callback);
            },
            /**
             * Dismisses all open notifications.
             *
             * @param {Object} excpet [optional] The notification object to exclude from dismissal.
             *
             */
            dismissAll: function (except) {
                var clone = openInstances.slice(0);
                for (var x = 0; x < clone.length; x += 1) {
                    var  instance = clone[x];
                    if (except === undefined || except !== instance) {
                        instance.dismiss();
                    }
                }
            }
        };
    })();

    /**
     * Alertify public API
     * This contains everything that is exposed through the alertify object.
     *
     * @return {Object}
     */
    function Alertify() {

        // holds a references of created dialogs
        var dialogs = {};

        /**
         * Extends a given prototype by merging properties from base into sub.
         *
         * @sub {Object} sub The prototype being overwritten.
         * @base {Object} base The prototype being written.
         *
         * @return {Object} The extended prototype.
         */
        function extend(sub, base) {
            // copy dialog pototype over definition.
            for (var prop in base) {
                if (base.hasOwnProperty(prop)) {
                    sub[prop] = base[prop];
                }
            }
            return sub;
        }


        /**
        * Helper: returns a dialog instance from saved dialogs.
        * and initializes the dialog if its not already initialized.
        *
        * @name {String} name The dialog name.
        *
        * @return {Object} The dialog instance.
        */
        function get_dialog(name) {
            var dialog = dialogs[name].dialog;
            //initialize the dialog if its not already initialized.
            if (dialog && typeof dialog.__init === 'function') {
                dialog.__init(dialog);
            }
            return dialog;
        }

        /**
         * Helper:  registers a new dialog definition.
         *
         * @name {String} name The dialog name.
         * @Factory {Function} Factory a function resposible for creating dialog prototype.
         * @transient {Boolean} transient True to create a new dialog instance each time the dialog is invoked, false otherwise.
         * @base {String} base the name of another dialog to inherit from.
         *
         * @return {Object} The dialog definition.
         */
        function register(name, Factory, transient, base) {
            var definition = {
                dialog: null,
                factory: Factory
            };

            //if this is based on an existing dialog, create a new definition
            //by applying the new protoype over the existing one.
            if (base !== undefined) {
                definition.factory = function () {
                    return extend(new dialogs[base].factory(), new Factory());
                };
            }

            if (!transient) {
                //create a new definition based on dialog
                definition.dialog = extend(new definition.factory(), dialog);
            }
            return dialogs[name] = definition;
        }

        return {
            /**
             * Alertify defaults
             * 
             * @type {Object}
             */
            defaults: defaults,
            /**
             * Dialogs factory 
             *
             * @param {string}      Dialog name.
             * @param {Function}    A Dialog factory function.
             * @param {Boolean}     Indicates whether to create a singleton or transient dialog.
             * @param {String}      The name of the base type to inherit from.
             */
            dialog: function (name, Factory, transient, base) {

                // get request, create a new instance and return it.
                if (typeof Factory !== 'function') {
                    return get_dialog(name);
                }

                if (this.hasOwnProperty(name)) {
                    throw new Error('alertify.dialog: name already exists');
                }

                // register the dialog
                var definition = register(name, Factory, transient, base);

                if (transient) {

                    // make it public
                    this[name] = function () {
                        //if passed with no params, consider it a get request
                        if (arguments.length === 0) {
                            return definition.dialog;
                        } else {
                            var instance = extend(new definition.factory(), dialog);
                            //ensure init
                            if (instance && typeof instance.__init === 'function') {
                                instance.__init(instance);
                            }
                            instance['main'].apply(instance, arguments);
                            return instance['show'].apply(instance);
                        }
                    };
                } else {
                    // make it public
                    this[name] = function () {
                        //ensure init
                        if (definition.dialog && typeof definition.dialog.__init === 'function') {
                            definition.dialog.__init(definition.dialog);
                        }
                        //if passed with no params, consider it a get request
                        if (arguments.length === 0) {
                            return definition.dialog;
                        } else {
                            var dialog = definition.dialog;
                            dialog['main'].apply(definition.dialog, arguments);
                            return dialog['show'].apply(definition.dialog);
                        }
                    };
                }
            },
            /**
             * Close all open dialogs.
             *
             * @param {Object} excpet [optional] The dialog object to exclude from closing.
             *
             * @return {undefined}
             */
            closeAll: function (except) {
                var clone = openDialogs.slice(0);
                for (var x = 0; x < clone.length; x += 1) {
                    var instance = clone[x];
                    if (except === undefined || except !== instance) {
                        instance.close();
                    }
                }
            },
            /**
             * Gets or Sets dialog settings/options. if the dialog is transient, this call does nothing.
             *
             * @param {string} name The dialog name.
             * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
             * @param {Variant} value Optional, the value associated with the key (in case it was a string).
             *
             * @return {undefined}
             */
            setting: function (name, key, value) {

                if (name === 'notifier') {
                    return notifier.setting(key, value);
                }

                var dialog = get_dialog(name);
                if (dialog) {
                    return dialog.setting(key, value);
                }
            },
            /**
             * [Alias] Sets dialog settings/options 
             */
            set: function(name,key,value){
                return this.setting(name, key,value);
            },
            /**
             * [Alias] Gets dialog settings/options 
             */
            get: function(name, key){
                return this.setting(name, key);
            },
            /**
             * Creates a new notification message.
             * If a type is passed, a class name "ajs-{type}" will be added.
             * This allows for custom look and feel for various types of notifications.
             *
             * @param  {String | DOMElement}    [message=undefined]		Message text
             * @param  {String}                 [type='']				Type of log message
             * @param  {String}                 [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}               [callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            notify: function (message, type, wait, callback) {
                return notifier.create(type, callback).push(message, wait);
            },
            /**
             * Creates a new notification message.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            message: function (message, wait, callback) {
                return notifier.create(null, callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'success'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            success: function (message, wait, callback) {
                return notifier.create('success', callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'error'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            error: function (message, wait, callback) {
                return notifier.create('error', callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'warning'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            warning: function (message, wait, callback) {
                return notifier.create('warning', callback).push(message, wait);
            },
            /**
             * Dismisses all open notifications
             *
             * @return {undefined}
             */
            dismissAll: function () {
                notifier.dismissAll();
            }
        };
    }
    var alertify = new Alertify();

    /**
    * Alert dialog definition
    *
    * invoked by:
    *	alertify.alert(message);
    *	alertify.alert(title, message);
    *	alertify.alert(message, onok);
    *	alertify.alert(title, message, onok);
     */
    alertify.dialog('alert', function () {
        return {
            main: function (_title, _message, _onok) {
                var title, message, onok;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    if (typeof _message === 'function') {
                        message = _title;
                        onok = _message;
                    } else {
                        title = _title;
                        message = _message;
                    }
                    break;
                case 3:
                    title = _title;
                    message = _message;
                    onok = _onok;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('onok', onok);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.ok,
                        }
                    ],
                    focus: {
                        element: 0,
                        select: false
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                // nothing
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                this.setContent(message);
            },
            settings: {
                message: undefined,
                onok: undefined,
                label: undefined,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'label':
                    if (this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].element.innerHTML = newValue;
                    }
                    break;
                }
            },
            callback: function (closeEvent) {
                if (typeof this.get('onok') === 'function') {
                    var returnValue = this.get('onok').call(this, closeEvent);
                    if (typeof returnValue !== 'undefined') {
                        closeEvent.cancel = !returnValue;
                    }
                }
            }
        };
    });
    /**
     * Confirm dialog object
     *
     *	alertify.confirm(message);
     *	alertify.confirm(message, onok);
     *	alertify.confirm(message, onok, oncancel);
     *	alertify.confirm(title, message, onok, oncancel);
     */
    alertify.dialog('confirm', function () {

        var autoConfirm = {
            timer: null,
            index: null,
            text: null,
            duration: null,
            task: function (event, self) {
                if (self.isOpen()) {
                    self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text + ' (&#8207;' + autoConfirm.duration + '&#8207;) ';
                    autoConfirm.duration -= 1;
                    if (autoConfirm.duration === -1) {
                        clearAutoConfirm(self);
                        var button = self.__internal.buttons[autoConfirm.index];
                        var closeEvent = createCloseEvent(autoConfirm.index, button);

                        if (typeof self.callback === 'function') {
                            self.callback.apply(self, [closeEvent]);
                        }
                        //close the dialog.
                        if (closeEvent.close !== false) {
                            self.close();
                        }
                    }
                } else {
                    clearAutoConfirm(self);
                }
            }
        };

        function clearAutoConfirm(self) {
            if (autoConfirm.timer !== null) {
                clearInterval(autoConfirm.timer);
                autoConfirm.timer = null;
                self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text;
            }
        }

        function startAutoConfirm(self, index, duration) {
            clearAutoConfirm(self);
            autoConfirm.duration = duration;
            autoConfirm.index = index;
            autoConfirm.text = self.__internal.buttons[index].element.innerHTML;
            autoConfirm.timer = setInterval(delegate(self, autoConfirm.task), 1000);
            autoConfirm.task(null, self);
        }


        return {
            main: function (_title, _message, _onok, _oncancel) {
                var title, message, onok, oncancel;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    message = _title;
                    onok = _message;
                    break;
                case 3:
                    message = _title;
                    onok = _message;
                    oncancel = _onok;
                    break;
                case 4:
                    title = _title;
                    message = _message;
                    onok = _onok;
                    oncancel = _oncancel;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('onok', onok);
                this.set('oncancel', oncancel);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ENTER,
                            className: alertify.defaults.theme.ok,
                        },
                        {
                            text: alertify.defaults.glossary.cancel,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.cancel,
                        }
                    ],
                    focus: {
                        element: 0,
                        select: false
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                //nothing
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                this.setContent(message);
            },
            settings: {
                message: null,
                labels: null,
                onok: null,
                oncancel: null,
                defaultFocus: null,
                reverseButtons: null,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'labels':
                    if ('ok' in newValue && this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].text = newValue.ok;
                        this.__internal.buttons[0].element.innerHTML = newValue.ok;
                    }
                    if ('cancel' in newValue && this.__internal.buttons[1].element) {
                        this.__internal.buttons[1].text = newValue.cancel;
                        this.__internal.buttons[1].element.innerHTML = newValue.cancel;
                    }
                    break;
                case 'reverseButtons':
                    if (newValue === true) {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
                    } else {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
                    }
                    break;
                case 'defaultFocus':
                    this.__internal.focus.element = newValue === 'ok' ? 0 : 1;
                    break;
                }
            },
            callback: function (closeEvent) {
                clearAutoConfirm(this);
                var returnValue;
                switch (closeEvent.index) {
                case 0:
                    if (typeof this.get('onok') === 'function') {
                        returnValue = this.get('onok').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                case 1:
                    if (typeof this.get('oncancel') === 'function') {
                        returnValue = this.get('oncancel').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                }
            },
            autoOk: function (duration) {
                startAutoConfirm(this, 0, duration);
                return this;
            },
            autoCancel: function (duration) {
                startAutoConfirm(this, 1, duration);
                return this;
            }
        };
    });
    /**
     * Prompt dialog object
     *
     * invoked by:
     *	alertify.prompt(message);
     *	alertify.prompt(message, value);
     *	alertify.prompt(message, value, onok);
     *	alertify.prompt(message, value, onok, oncancel);
     *	alertify.prompt(title, message, value, onok, oncancel);
     */
    alertify.dialog('prompt', function () {
        var input = document.createElement('INPUT');
        var p = document.createElement('P');
        return {
            main: function (_title, _message, _value, _onok, _oncancel) {
                var title, message, value, onok, oncancel;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    message = _title;
                    value = _message;
                    break;
                case 3:
                    message = _title;
                    value = _message;
                    onok = _value;
                    break;
                case 4:
                    message = _title;
                    value = _message;
                    onok = _value;
                    oncancel = _onok;
                    break;
                case 5:
                    title = _title;
                    message = _message;
                    value = _value;
                    onok = _onok;
                    oncancel = _oncancel;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('value', value);
                this.set('onok', onok);
                this.set('oncancel', oncancel);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ENTER,
                            className: alertify.defaults.theme.ok,
                        },
                        {
                            text: alertify.defaults.glossary.cancel,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.cancel,
                        }
                    ],
                    focus: {
                        element: input,
                        select: true
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                input.className = alertify.defaults.theme.input;
                input.setAttribute('type', 'text');
                input.value = this.get('value');
                this.elements.content.appendChild(p);
                this.elements.content.appendChild(input);
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                if (typeof message === 'string') {
                    clearContents(p);
                    p.innerHTML = message;
                } else if (message instanceof window.HTMLElement && p.firstChild !== message) {
                    clearContents(p);
                    p.appendChild(message);
                }
            },
            settings: {
                message: undefined,
                labels: undefined,
                onok: undefined,
                oncancel: undefined,
                value: '',
                type:'text',
                reverseButtons: undefined,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'value':
                    input.value = newValue;
                    break;
                case 'type':
                    switch (newValue) {
                    case 'text':
                    case 'color':
                    case 'date':
                    case 'datetime-local':
                    case 'email':
                    case 'month':
                    case 'number':
                    case 'password':
                    case 'search':
                    case 'tel':
                    case 'time':
                    case 'week':
                        input.type = newValue;
                        break;
                    default:
                        input.type = 'text';
                        break;
                    }
                    break;
                case 'labels':
                    if (newValue.ok && this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].element.innerHTML = newValue.ok;
                    }
                    if (newValue.cancel && this.__internal.buttons[1].element) {
                        this.__internal.buttons[1].element.innerHTML = newValue.cancel;
                    }
                    break;
                case 'reverseButtons':
                    if (newValue === true) {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
                    } else {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
                    }
                    break;
                }
            },
            callback: function (closeEvent) {
                var returnValue;
                switch (closeEvent.index) {
                case 0:
                    this.settings.value = input.value;
                    if (typeof this.get('onok') === 'function') {
                        returnValue = this.get('onok').call(this, closeEvent, this.settings.value);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                case 1:
                    if (typeof this.get('oncancel') === 'function') {
                        returnValue = this.get('oncancel').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    if(!closeEvent.cancel){
                        input.value = this.settings.value;
                    }
                    break;
                }
            }
        };
    });

    // CommonJS
    if (  true && typeof module.exports === 'object' ) {
        module.exports = alertify;
    // AMD
    } else if ( true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return alertify;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    // window
    } else {}

} ( typeof window !== 'undefined' ? window : this ) );


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/App.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/App.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _layout_NavbarVue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout/NavbarVue */ "./resources/js/components/layout/NavbarVue.vue");
/* harmony import */ var _layout_FooterVue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout/FooterVue */ "./resources/js/components/layout/FooterVue.vue");
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    Navbar: _layout_NavbarVue__WEBPACK_IMPORTED_MODULE_0__["default"],
    Footer: _layout_FooterVue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  mounted: function mounted() {
    var body = document.querySelector("body");
    body.classList.remove("is-loading");
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/Menu.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/admin/Menu.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

//
//
//
//
//
//
//
//

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/orders/Index.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/admin/orders/Index.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Menu */ "./resources/js/components/admin/Menu.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      orders: []
    };
  },
  components: {
    Menu: _Menu__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {
    this.loadOrders();
  },
  methods: {
    loadOrders: function loadOrders() {
      var _this = this;

      axios.get('/api/admin/orders').then(function (res) {
        if (res.status == 200) {
          _this.orders = res.data;
        }
      })["catch"](function (err) {
        console.log(err);
      });
    }
  },
  computed: {
    loggedUser: function loggedUser() {
      return this.$store.state.loggedUser;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Login.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/Login.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/jwt */ "./resources/js/utils/jwt.js");
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/helpers */ "./resources/js/helpers/helpers.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      email: "",
      password: "",
      remember: false,
      errors: {},
      isSubmitting: false
    };
  },
  computed: {
    submitBtnText: function submitBtnText() {
      return this.isSubmitting ? "Logowanie..." : "Zaloguj";
    }
  },
  methods: {
    submit: function submit() {
      var _this = this;

      this.isSubmitting = true;
      axios.post("/api/login", {
        email: this.email,
        password: this.password,
        remember: this.remember
      }).then(function (_ref) {
        var data = _ref.data;
        Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["login"])(data);
        window.location.replace("/");
      })["catch"](function (_ref2) {
        var response = _ref2.response;
        _this.errors = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_1__["getErrorsOrAlert"])(response);
        _this.isSubmitting = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Register.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/Register.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/jwt */ "./resources/js/utils/jwt.js");
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/helpers */ "./resources/js/helpers/helpers.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      email: "",
      password: "",
      password_confirmation: "",
      errors: {},
      isSubmitting: false
    };
  },
  computed: {
    submitBtnText: function submitBtnText() {
      return this.isSubmitting ? "Rejestrowanie..." : "Zarejestruj";
    }
  },
  methods: {
    submit: function submit() {
      var _this = this;

      this.isSubmitting = true;
      axios.post("/api/register", {
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }).then(function (_ref) {
        var data = _ref.data;
        Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["login"])(data);
        window.location.replace("/");
      })["catch"](function (_ref2) {
        var response = _ref2.response;
        _this.errors = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_1__["getErrorsOrAlert"])(response);
        _this.isSubmitting = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Verify.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/Verify.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/helpers */ "./resources/js/helpers/helpers.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: ["id", "hash", "email"],
  components: {},
  data: function data() {
    return {
      isSubmitting: true,
      verifyMode: false
    };
  },
  methods: {
    submit: function submit() {
      var _this = this;

      this.isSubmitting = true;
      axios.post("/api/email/resend").then(function (_ref) {
        var data = _ref.data;
        return alertify.success(data);
      })["catch"](function (_ref2) {
        var response = _ref2.response;
        Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["getErrorsOrAlert"])(response);
        _this.isSubmitting = false;
      }).then(function () {
        _this.isSubmitting = false;
      });
    },
    verifyEmail: function verifyEmail() {
      var _this2 = this;

      axios.get("/api/email/verify/".concat(this.id, "/").concat(this.hash, "/").concat(this.email)).then(function (_ref3) {
        var data = _ref3.data;

        _this2.$store.dispatch("getLoggedUser").then(function () {
          alertify.success(data);

          _this2.$router.push({
            name: "home"
          });
        });
      })["catch"](function (_ref4) {
        var response = _ref4.response;
        Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["getErrorsOrAlert"])(response);
        _this2.isSubmitting = false;
      });
    },
    refreshApp: function refreshApp() {
      window.location.reload();
    }
  },
  created: function created() {
    if (this.id !== undefined && this.hash !== undefined && this.email !== undefined) {
      this.verifyMode = true;
      this.verifyEmail();
    } else {
      this.isSubmitting = false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/helpers */ "./resources/js/helpers/helpers.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      email: "",
      errors: {},
      msg: "",
      isSubmitting: false
    };
  },
  computed: {
    submitBtnText: function submitBtnText() {
      return this.isSubmitting ? "Wysyłanie linku..." : "Wyślij link do zresetowania hasła";
    }
  },
  methods: {
    submit: function submit() {
      var _this = this;

      this.isSubmitting = true;
      axios.post("/api/password/email", {
        email: this.email
      }).then(function (_ref) {
        var data = _ref.data;
        _this.msg = data;
        _this.errors = {};
      })["catch"](function (_ref2) {
        var response = _ref2.response;
        _this.errors = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["getErrorsOrAlert"])(response);
      }).then(function () {
        _this.isSubmitting = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/helpers */ "./resources/js/helpers/helpers.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: ["token"],
  components: {},
  data: function data() {
    return {
      password: "",
      password_confirmation: "",
      email: this.$route.query.email,
      errors: {},
      msg: "",
      isSubmitting: false,
      isReseted: false
    };
  },
  computed: {
    submitBtnText: function submitBtnText() {
      return this.isSubmitting ? "Resetowanie hasła..." : "Zresetuj hasło";
    }
  },
  methods: {
    submit: function submit() {
      var _this = this;

      this.isSubmitting = true;
      axios.post("/api/password/reset", {
        email: this.email,
        token: this.token,
        password: this.password,
        password_confirmation: this.password_confirmation
      }).then(function (_ref) {
        var data = _ref.data;
        _this.msg = data;
        _this.isReseted = true;
      })["catch"](function (_ref2) {
        var response = _ref2.response;
        _this.errors = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["getErrorsOrAlert"])(response);
      }).then(function () {
        _this.isSubmitting = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/cart/Index.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/cart/Index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/jwt */ "./resources/js/utils/jwt.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      cart: {},
      tables: [],
      table_id: '',
      additional_informations: '',
      signature: ''
    };
  },
  mounted: function mounted() {
    this.loadCart();
    this.loadTables();
    this.loadSignature();
  },
  computed: {
    isLoggedIn: function isLoggedIn() {
      return Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["isLoggedIn"])();
    }
  },
  methods: {
    onChangeTables: function onChangeTables(event) {
      axios.post('/api/updateTables', {
        table_id: event.target.value
      }).then(function (response) {});
    },
    updateAdditionalInformations: function updateAdditionalInformations() {
      axios.post('/api/updateAdditionalInformations', {
        additional_informations: this.additional_informations
      }).then(function (response) {});
    },
    loadCart: function loadCart() {
      var _this = this;

      axios.get("/api/cart").then(function (res) {
        if (res.status == 200) {
          _this.cart = res.data;
        }
      })["catch"](function (err) {
        console.log(err);
      });
    },
    loadTables: function loadTables() {
      var _this2 = this;

      axios.get("/api/tables").then(function (res) {
        if (res.status == 200) {
          _this2.tables = res.data;
        }
      })["catch"](function (err) {
        console.log(err);
      });
    },
    removeFromCart: function removeFromCart(id) {
      var _this3 = this;

      axios.post('/api/remove-from-cart/' + id).then(function (response) {
        $('#success').css("display", "block");
        $('#success').html(response.data.message);

        _this3.loadCart();
      });
    },
    storeCarts: function storeCarts() {
      var _this4 = this;

      axios.post('/api/store-cart').then(function (response) {
        _this4.$router.push('/');
      })["catch"](function (error) {
        console.log(error);
      });
    },
    loadSignature: function loadSignature() {
      var _this5 = this;

      axios.get("/api/signature").then(function (res) {
        if (res.status == 200) {
          _this5.signature = res.data;
        }
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/cart/Summary.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/cart/Summary.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/jwt */ "./resources/js/utils/jwt.js");
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      error: ''
    };
  },
  mounted: function mounted() {
    this.storeCart();
    this.getErrorCode();
  },
  computed: {
    isLoggedIn: function isLoggedIn() {
      return Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["isLoggedIn"])();
    }
  },
  methods: {
    storeCart: function storeCart() {
      axios.post('/api/store-cart').then(function (response) {})["catch"](function (error) {
        console.log(error);
      });
    },
    getErrorCode: function getErrorCode() {
      if (this.$route.query.error) {
        this.error = this.$route.query.error;
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/layout/FooterVue.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/layout/FooterVue.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {};
  },
  methods: {
    moment: function moment() {
      return window.moment();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/layout/NavbarVue.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/layout/NavbarVue.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/jwt */ "./resources/js/utils/jwt.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {};
  },
  computed: {
    loggedUser: function loggedUser() {
      return this.$store.state.loggedUser;
    },
    isLoggedIn: function isLoggedIn() {
      return Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["isLoggedIn"])();
    }
  },
  methods: {
    logout: function logout() {
      Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["logout"])();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/products/Details.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/products/Details.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/jwt */ "./resources/js/utils/jwt.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      product: {},
      quantity: '',
      product_id: ''
    };
  },
  mounted: function mounted() {
    this.loadProduct();
  },
  computed: {
    isLoggedIn: function isLoggedIn() {
      return Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["isLoggedIn"])();
    }
  },
  methods: {
    loadProduct: function loadProduct() {
      var _this = this;

      axios.get("/api/product/" + this.$route.params.id).then(function (res) {
        if (res.status == 200) {
          _this.product = res.data;
        }
      })["catch"](function (err) {
        console.log(err);
      });
    },
    addToCart: function addToCart() {
      axios.post('/api/add-to-cart', {
        product_id: this.product.id,
        quantity: this.quantity
      }).then(function (response) {
        $('#success').css("display", "block");
        $('#success').html(response.data.message);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/products/Main.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/products/Main.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/jwt */ "./resources/js/utils/jwt.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      categories: []
    };
  },
  mounted: function mounted() {
    this.loadCategories();
  },
  computed: {
    isLoggedIn: function isLoggedIn() {
      return Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["isLoggedIn"])();
    }
  },
  methods: {
    loadCategories: function loadCategories() {
      var _this = this;

      axios.get('/api/categories').then(function (res) {
        if (res.status == 200) {
          _this.categories = res.data;
        }
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Menu.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/profile/Menu.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

//
//
//
//
//
//
//
//

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Orders.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/profile/Orders.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Menu */ "./resources/js/components/profile/Menu.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      orders: []
    };
  },
  components: {
    Menu: _Menu__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {
    this.loadOrders();
  },
  methods: {
    loadOrders: function loadOrders() {
      var _this = this;

      axios.get('/api/user/orders').then(function (res) {
        if (res.status == 200) {
          _this.orders = res.data;
        }
      })["catch"](function (err) {
        console.log(err);
      });
    }
  },
  computed: {
    loggedUser: function loggedUser() {
      return this.$store.state.loggedUser;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/static/Home.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/static/Home.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/jwt */ "./resources/js/utils/jwt.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {};
  },
  computed: {
    isLoggedIn: function isLoggedIn() {
      return Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_0__["isLoggedIn"])();
    },
    startBtnRoute: function startBtnRoute() {
      return this.isLoggedIn ? "products" : "login";
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".fade-enter-active[data-v-332fccf4],\n.fade-leave-active[data-v-332fccf4] {\n  transition: opacity 0.3s;\n}\n.fade-enter[data-v-332fccf4],\n.fade-leave-to[data-v-332fccf4] {\n  opacity: 0;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".menu[data-v-1fff8d6c] {\n  background-color: azure;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "html,\nbody {\n  height: 100%;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".menu[data-v-8ca6f120] {\n  background-color: azure;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".btn-start[data-v-61e10305] {\n  left: 0;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  width: 100%;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/moment/locale sync recursive ^\\.\\/.*$":
/*!**************************************************!*\
  !*** ./node_modules/moment/locale sync ^\.\/.*$ ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "./node_modules/moment/locale/af.js",
	"./af.js": "./node_modules/moment/locale/af.js",
	"./ar": "./node_modules/moment/locale/ar.js",
	"./ar-dz": "./node_modules/moment/locale/ar-dz.js",
	"./ar-dz.js": "./node_modules/moment/locale/ar-dz.js",
	"./ar-kw": "./node_modules/moment/locale/ar-kw.js",
	"./ar-kw.js": "./node_modules/moment/locale/ar-kw.js",
	"./ar-ly": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ly.js": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ma": "./node_modules/moment/locale/ar-ma.js",
	"./ar-ma.js": "./node_modules/moment/locale/ar-ma.js",
	"./ar-sa": "./node_modules/moment/locale/ar-sa.js",
	"./ar-sa.js": "./node_modules/moment/locale/ar-sa.js",
	"./ar-tn": "./node_modules/moment/locale/ar-tn.js",
	"./ar-tn.js": "./node_modules/moment/locale/ar-tn.js",
	"./ar.js": "./node_modules/moment/locale/ar.js",
	"./az": "./node_modules/moment/locale/az.js",
	"./az.js": "./node_modules/moment/locale/az.js",
	"./be": "./node_modules/moment/locale/be.js",
	"./be.js": "./node_modules/moment/locale/be.js",
	"./bg": "./node_modules/moment/locale/bg.js",
	"./bg.js": "./node_modules/moment/locale/bg.js",
	"./bm": "./node_modules/moment/locale/bm.js",
	"./bm.js": "./node_modules/moment/locale/bm.js",
	"./bn": "./node_modules/moment/locale/bn.js",
	"./bn-bd": "./node_modules/moment/locale/bn-bd.js",
	"./bn-bd.js": "./node_modules/moment/locale/bn-bd.js",
	"./bn.js": "./node_modules/moment/locale/bn.js",
	"./bo": "./node_modules/moment/locale/bo.js",
	"./bo.js": "./node_modules/moment/locale/bo.js",
	"./br": "./node_modules/moment/locale/br.js",
	"./br.js": "./node_modules/moment/locale/br.js",
	"./bs": "./node_modules/moment/locale/bs.js",
	"./bs.js": "./node_modules/moment/locale/bs.js",
	"./ca": "./node_modules/moment/locale/ca.js",
	"./ca.js": "./node_modules/moment/locale/ca.js",
	"./cs": "./node_modules/moment/locale/cs.js",
	"./cs.js": "./node_modules/moment/locale/cs.js",
	"./cv": "./node_modules/moment/locale/cv.js",
	"./cv.js": "./node_modules/moment/locale/cv.js",
	"./cy": "./node_modules/moment/locale/cy.js",
	"./cy.js": "./node_modules/moment/locale/cy.js",
	"./da": "./node_modules/moment/locale/da.js",
	"./da.js": "./node_modules/moment/locale/da.js",
	"./de": "./node_modules/moment/locale/de.js",
	"./de-at": "./node_modules/moment/locale/de-at.js",
	"./de-at.js": "./node_modules/moment/locale/de-at.js",
	"./de-ch": "./node_modules/moment/locale/de-ch.js",
	"./de-ch.js": "./node_modules/moment/locale/de-ch.js",
	"./de.js": "./node_modules/moment/locale/de.js",
	"./dv": "./node_modules/moment/locale/dv.js",
	"./dv.js": "./node_modules/moment/locale/dv.js",
	"./el": "./node_modules/moment/locale/el.js",
	"./el.js": "./node_modules/moment/locale/el.js",
	"./en-au": "./node_modules/moment/locale/en-au.js",
	"./en-au.js": "./node_modules/moment/locale/en-au.js",
	"./en-ca": "./node_modules/moment/locale/en-ca.js",
	"./en-ca.js": "./node_modules/moment/locale/en-ca.js",
	"./en-gb": "./node_modules/moment/locale/en-gb.js",
	"./en-gb.js": "./node_modules/moment/locale/en-gb.js",
	"./en-ie": "./node_modules/moment/locale/en-ie.js",
	"./en-ie.js": "./node_modules/moment/locale/en-ie.js",
	"./en-il": "./node_modules/moment/locale/en-il.js",
	"./en-il.js": "./node_modules/moment/locale/en-il.js",
	"./en-in": "./node_modules/moment/locale/en-in.js",
	"./en-in.js": "./node_modules/moment/locale/en-in.js",
	"./en-nz": "./node_modules/moment/locale/en-nz.js",
	"./en-nz.js": "./node_modules/moment/locale/en-nz.js",
	"./en-sg": "./node_modules/moment/locale/en-sg.js",
	"./en-sg.js": "./node_modules/moment/locale/en-sg.js",
	"./eo": "./node_modules/moment/locale/eo.js",
	"./eo.js": "./node_modules/moment/locale/eo.js",
	"./es": "./node_modules/moment/locale/es.js",
	"./es-do": "./node_modules/moment/locale/es-do.js",
	"./es-do.js": "./node_modules/moment/locale/es-do.js",
	"./es-mx": "./node_modules/moment/locale/es-mx.js",
	"./es-mx.js": "./node_modules/moment/locale/es-mx.js",
	"./es-us": "./node_modules/moment/locale/es-us.js",
	"./es-us.js": "./node_modules/moment/locale/es-us.js",
	"./es.js": "./node_modules/moment/locale/es.js",
	"./et": "./node_modules/moment/locale/et.js",
	"./et.js": "./node_modules/moment/locale/et.js",
	"./eu": "./node_modules/moment/locale/eu.js",
	"./eu.js": "./node_modules/moment/locale/eu.js",
	"./fa": "./node_modules/moment/locale/fa.js",
	"./fa.js": "./node_modules/moment/locale/fa.js",
	"./fi": "./node_modules/moment/locale/fi.js",
	"./fi.js": "./node_modules/moment/locale/fi.js",
	"./fil": "./node_modules/moment/locale/fil.js",
	"./fil.js": "./node_modules/moment/locale/fil.js",
	"./fo": "./node_modules/moment/locale/fo.js",
	"./fo.js": "./node_modules/moment/locale/fo.js",
	"./fr": "./node_modules/moment/locale/fr.js",
	"./fr-ca": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ca.js": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ch": "./node_modules/moment/locale/fr-ch.js",
	"./fr-ch.js": "./node_modules/moment/locale/fr-ch.js",
	"./fr.js": "./node_modules/moment/locale/fr.js",
	"./fy": "./node_modules/moment/locale/fy.js",
	"./fy.js": "./node_modules/moment/locale/fy.js",
	"./ga": "./node_modules/moment/locale/ga.js",
	"./ga.js": "./node_modules/moment/locale/ga.js",
	"./gd": "./node_modules/moment/locale/gd.js",
	"./gd.js": "./node_modules/moment/locale/gd.js",
	"./gl": "./node_modules/moment/locale/gl.js",
	"./gl.js": "./node_modules/moment/locale/gl.js",
	"./gom-deva": "./node_modules/moment/locale/gom-deva.js",
	"./gom-deva.js": "./node_modules/moment/locale/gom-deva.js",
	"./gom-latn": "./node_modules/moment/locale/gom-latn.js",
	"./gom-latn.js": "./node_modules/moment/locale/gom-latn.js",
	"./gu": "./node_modules/moment/locale/gu.js",
	"./gu.js": "./node_modules/moment/locale/gu.js",
	"./he": "./node_modules/moment/locale/he.js",
	"./he.js": "./node_modules/moment/locale/he.js",
	"./hi": "./node_modules/moment/locale/hi.js",
	"./hi.js": "./node_modules/moment/locale/hi.js",
	"./hr": "./node_modules/moment/locale/hr.js",
	"./hr.js": "./node_modules/moment/locale/hr.js",
	"./hu": "./node_modules/moment/locale/hu.js",
	"./hu.js": "./node_modules/moment/locale/hu.js",
	"./hy-am": "./node_modules/moment/locale/hy-am.js",
	"./hy-am.js": "./node_modules/moment/locale/hy-am.js",
	"./id": "./node_modules/moment/locale/id.js",
	"./id.js": "./node_modules/moment/locale/id.js",
	"./is": "./node_modules/moment/locale/is.js",
	"./is.js": "./node_modules/moment/locale/is.js",
	"./it": "./node_modules/moment/locale/it.js",
	"./it-ch": "./node_modules/moment/locale/it-ch.js",
	"./it-ch.js": "./node_modules/moment/locale/it-ch.js",
	"./it.js": "./node_modules/moment/locale/it.js",
	"./ja": "./node_modules/moment/locale/ja.js",
	"./ja.js": "./node_modules/moment/locale/ja.js",
	"./jv": "./node_modules/moment/locale/jv.js",
	"./jv.js": "./node_modules/moment/locale/jv.js",
	"./ka": "./node_modules/moment/locale/ka.js",
	"./ka.js": "./node_modules/moment/locale/ka.js",
	"./kk": "./node_modules/moment/locale/kk.js",
	"./kk.js": "./node_modules/moment/locale/kk.js",
	"./km": "./node_modules/moment/locale/km.js",
	"./km.js": "./node_modules/moment/locale/km.js",
	"./kn": "./node_modules/moment/locale/kn.js",
	"./kn.js": "./node_modules/moment/locale/kn.js",
	"./ko": "./node_modules/moment/locale/ko.js",
	"./ko.js": "./node_modules/moment/locale/ko.js",
	"./ku": "./node_modules/moment/locale/ku.js",
	"./ku.js": "./node_modules/moment/locale/ku.js",
	"./ky": "./node_modules/moment/locale/ky.js",
	"./ky.js": "./node_modules/moment/locale/ky.js",
	"./lb": "./node_modules/moment/locale/lb.js",
	"./lb.js": "./node_modules/moment/locale/lb.js",
	"./lo": "./node_modules/moment/locale/lo.js",
	"./lo.js": "./node_modules/moment/locale/lo.js",
	"./lt": "./node_modules/moment/locale/lt.js",
	"./lt.js": "./node_modules/moment/locale/lt.js",
	"./lv": "./node_modules/moment/locale/lv.js",
	"./lv.js": "./node_modules/moment/locale/lv.js",
	"./me": "./node_modules/moment/locale/me.js",
	"./me.js": "./node_modules/moment/locale/me.js",
	"./mi": "./node_modules/moment/locale/mi.js",
	"./mi.js": "./node_modules/moment/locale/mi.js",
	"./mk": "./node_modules/moment/locale/mk.js",
	"./mk.js": "./node_modules/moment/locale/mk.js",
	"./ml": "./node_modules/moment/locale/ml.js",
	"./ml.js": "./node_modules/moment/locale/ml.js",
	"./mn": "./node_modules/moment/locale/mn.js",
	"./mn.js": "./node_modules/moment/locale/mn.js",
	"./mr": "./node_modules/moment/locale/mr.js",
	"./mr.js": "./node_modules/moment/locale/mr.js",
	"./ms": "./node_modules/moment/locale/ms.js",
	"./ms-my": "./node_modules/moment/locale/ms-my.js",
	"./ms-my.js": "./node_modules/moment/locale/ms-my.js",
	"./ms.js": "./node_modules/moment/locale/ms.js",
	"./mt": "./node_modules/moment/locale/mt.js",
	"./mt.js": "./node_modules/moment/locale/mt.js",
	"./my": "./node_modules/moment/locale/my.js",
	"./my.js": "./node_modules/moment/locale/my.js",
	"./nb": "./node_modules/moment/locale/nb.js",
	"./nb.js": "./node_modules/moment/locale/nb.js",
	"./ne": "./node_modules/moment/locale/ne.js",
	"./ne.js": "./node_modules/moment/locale/ne.js",
	"./nl": "./node_modules/moment/locale/nl.js",
	"./nl-be": "./node_modules/moment/locale/nl-be.js",
	"./nl-be.js": "./node_modules/moment/locale/nl-be.js",
	"./nl.js": "./node_modules/moment/locale/nl.js",
	"./nn": "./node_modules/moment/locale/nn.js",
	"./nn.js": "./node_modules/moment/locale/nn.js",
	"./oc-lnc": "./node_modules/moment/locale/oc-lnc.js",
	"./oc-lnc.js": "./node_modules/moment/locale/oc-lnc.js",
	"./pa-in": "./node_modules/moment/locale/pa-in.js",
	"./pa-in.js": "./node_modules/moment/locale/pa-in.js",
	"./pl": "./node_modules/moment/locale/pl.js",
	"./pl.js": "./node_modules/moment/locale/pl.js",
	"./pt": "./node_modules/moment/locale/pt.js",
	"./pt-br": "./node_modules/moment/locale/pt-br.js",
	"./pt-br.js": "./node_modules/moment/locale/pt-br.js",
	"./pt.js": "./node_modules/moment/locale/pt.js",
	"./ro": "./node_modules/moment/locale/ro.js",
	"./ro.js": "./node_modules/moment/locale/ro.js",
	"./ru": "./node_modules/moment/locale/ru.js",
	"./ru.js": "./node_modules/moment/locale/ru.js",
	"./sd": "./node_modules/moment/locale/sd.js",
	"./sd.js": "./node_modules/moment/locale/sd.js",
	"./se": "./node_modules/moment/locale/se.js",
	"./se.js": "./node_modules/moment/locale/se.js",
	"./si": "./node_modules/moment/locale/si.js",
	"./si.js": "./node_modules/moment/locale/si.js",
	"./sk": "./node_modules/moment/locale/sk.js",
	"./sk.js": "./node_modules/moment/locale/sk.js",
	"./sl": "./node_modules/moment/locale/sl.js",
	"./sl.js": "./node_modules/moment/locale/sl.js",
	"./sq": "./node_modules/moment/locale/sq.js",
	"./sq.js": "./node_modules/moment/locale/sq.js",
	"./sr": "./node_modules/moment/locale/sr.js",
	"./sr-cyrl": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr.js": "./node_modules/moment/locale/sr.js",
	"./ss": "./node_modules/moment/locale/ss.js",
	"./ss.js": "./node_modules/moment/locale/ss.js",
	"./sv": "./node_modules/moment/locale/sv.js",
	"./sv.js": "./node_modules/moment/locale/sv.js",
	"./sw": "./node_modules/moment/locale/sw.js",
	"./sw.js": "./node_modules/moment/locale/sw.js",
	"./ta": "./node_modules/moment/locale/ta.js",
	"./ta.js": "./node_modules/moment/locale/ta.js",
	"./te": "./node_modules/moment/locale/te.js",
	"./te.js": "./node_modules/moment/locale/te.js",
	"./tet": "./node_modules/moment/locale/tet.js",
	"./tet.js": "./node_modules/moment/locale/tet.js",
	"./tg": "./node_modules/moment/locale/tg.js",
	"./tg.js": "./node_modules/moment/locale/tg.js",
	"./th": "./node_modules/moment/locale/th.js",
	"./th.js": "./node_modules/moment/locale/th.js",
	"./tk": "./node_modules/moment/locale/tk.js",
	"./tk.js": "./node_modules/moment/locale/tk.js",
	"./tl-ph": "./node_modules/moment/locale/tl-ph.js",
	"./tl-ph.js": "./node_modules/moment/locale/tl-ph.js",
	"./tlh": "./node_modules/moment/locale/tlh.js",
	"./tlh.js": "./node_modules/moment/locale/tlh.js",
	"./tr": "./node_modules/moment/locale/tr.js",
	"./tr.js": "./node_modules/moment/locale/tr.js",
	"./tzl": "./node_modules/moment/locale/tzl.js",
	"./tzl.js": "./node_modules/moment/locale/tzl.js",
	"./tzm": "./node_modules/moment/locale/tzm.js",
	"./tzm-latn": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm-latn.js": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm.js": "./node_modules/moment/locale/tzm.js",
	"./ug-cn": "./node_modules/moment/locale/ug-cn.js",
	"./ug-cn.js": "./node_modules/moment/locale/ug-cn.js",
	"./uk": "./node_modules/moment/locale/uk.js",
	"./uk.js": "./node_modules/moment/locale/uk.js",
	"./ur": "./node_modules/moment/locale/ur.js",
	"./ur.js": "./node_modules/moment/locale/ur.js",
	"./uz": "./node_modules/moment/locale/uz.js",
	"./uz-latn": "./node_modules/moment/locale/uz-latn.js",
	"./uz-latn.js": "./node_modules/moment/locale/uz-latn.js",
	"./uz.js": "./node_modules/moment/locale/uz.js",
	"./vi": "./node_modules/moment/locale/vi.js",
	"./vi.js": "./node_modules/moment/locale/vi.js",
	"./x-pseudo": "./node_modules/moment/locale/x-pseudo.js",
	"./x-pseudo.js": "./node_modules/moment/locale/x-pseudo.js",
	"./yo": "./node_modules/moment/locale/yo.js",
	"./yo.js": "./node_modules/moment/locale/yo.js",
	"./zh-cn": "./node_modules/moment/locale/zh-cn.js",
	"./zh-cn.js": "./node_modules/moment/locale/zh-cn.js",
	"./zh-hk": "./node_modules/moment/locale/zh-hk.js",
	"./zh-hk.js": "./node_modules/moment/locale/zh-hk.js",
	"./zh-mo": "./node_modules/moment/locale/zh-mo.js",
	"./zh-mo.js": "./node_modules/moment/locale/zh-mo.js",
	"./zh-tw": "./node_modules/moment/locale/zh-tw.js",
	"./zh-tw.js": "./node_modules/moment/locale/zh-tw.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/moment/locale sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--7-2!../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Login.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/App.vue?vue&type=template&id=332fccf4&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/App.vue?vue&type=template&id=332fccf4&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "main-container",
      class: { "main-container-home": _vm.$route.name === "home" },
    },
    [
      _vm.$route.name !== "home" &&
      _vm.$route.name !== "login" &&
      _vm.$route.name !== "register" &&
      _vm.$route.name !== "password-reset" &&
      _vm.$route.name !== "verify" &&
      _vm.$route.name !== "password-request"
        ? _c("Navbar")
        : _vm._e(),
      _vm._v(" "),
      _c(
        "transition",
        { attrs: { name: "fade", mode: "out-in" } },
        [_c("router-view")],
        1
      ),
      _vm._v(" "),
      _vm.$route.name !== "home" &&
      _vm.$route.name !== "login" &&
      _vm.$route.name !== "register" &&
      _vm.$route.name !== "password-reset" &&
      _vm.$route.name !== "verify" &&
      _vm.$route.name !== "password-request"
        ? _c("Footer")
        : _vm._e(),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/Menu.vue?vue&type=template&id=1fff8d6c&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/admin/Menu.vue?vue&type=template&id=1fff8d6c&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "row" }, [
    _c(
      "div",
      { staticClass: "col-lg-3 col-12 menu" },
      [
        _c(
          "router-link",
          {
            staticClass: "nav-link text-center",
            attrs: { to: { name: "admin-orders" } },
          },
          [_vm._v("Zamówienia")]
        ),
      ],
      1
    ),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/orders/Index.vue?vue&type=template&id=1bd54153&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/admin/orders/Index.vue?vue&type=template&id=1bd54153&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container mb-3" },
    [
      _c("Menu"),
      _vm._v(" "),
      _c("div", { staticClass: "card-body table-responsive p-0" }, [
        _c("table", { staticClass: "table" }, [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "tbody",
            _vm._l(_vm.orders, function (order) {
              return _c("tr", { key: order.id }, [
                _c("td", [_vm._v(_vm._s(order.id))]),
                _vm._v(" "),
                _c("td", [_vm._v(_vm._s(order.nr))]),
              ])
            }),
            0
          ),
        ]),
      ]),
    ],
    1
  )
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", { staticClass: "thead-light" }, [
      _c("tr", [
        _c("th", [_vm._v("ID")]),
        _vm._v(" "),
        _c("th", [_vm._v("Numer")]),
      ]),
    ])
  },
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Login.vue?vue&type=template&id=4221c3ad&":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/Login.vue?vue&type=template&id=4221c3ad& ***!
  \*************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("section", { attrs: { id: "cover" } }, [
      _c("div", { attrs: { id: "cover-caption" } }, [
        _c("div", { staticClass: "container", attrs: { id: "container" } }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-sm-6 offset-sm-3 text-center" }, [
              _c("div", { staticClass: "card" }, [
                _c("h2", { staticClass: "text-center" }, [_vm._v("Logowanie")]),
                _vm._v(" "),
                _c("br"),
                _vm._v(" "),
                _c(
                  "form",
                  {
                    attrs: { action: "#", novalidate: "" },
                    on: {
                      submit: function ($event) {
                        $event.preventDefault()
                        return _vm.submit.apply(null, arguments)
                      },
                    },
                  },
                  [
                    _c("div", { staticClass: "form-group row" }, [
                      _c(
                        "label",
                        {
                          staticClass:
                            "col-md-4 col-form-label font-weight-bold text-md-right",
                          attrs: { for: "email" },
                        },
                        [_vm._v("Adres e-mail")]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-md-6" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.email,
                              expression: "email",
                            },
                          ],
                          staticClass: "form-control",
                          class: { "is-invalid": _vm.errors.email },
                          attrs: { id: "email", type: "email" },
                          domProps: { value: _vm.email },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.email = $event.target.value
                            },
                          },
                        }),
                        _vm._v(" "),
                        _vm.errors.email
                          ? _c(
                              "span",
                              {
                                staticClass: "invalid-feedback",
                                attrs: { role: "alert" },
                              },
                              [
                                _c("strong", [
                                  _vm._v(_vm._s(_vm.errors.email[0])),
                                ]),
                              ]
                            )
                          : _vm._e(),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group row" }, [
                      _c(
                        "label",
                        {
                          staticClass:
                            "col-md-4 col-form-label font-weight-bold text-md-right",
                          attrs: { for: "password" },
                        },
                        [_vm._v("Hasło")]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-md-6" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.password,
                              expression: "password",
                            },
                          ],
                          staticClass: "form-control",
                          class: { "is-invalid": _vm.errors.password },
                          attrs: { id: "password", type: "password" },
                          domProps: { value: _vm.password },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.password = $event.target.value
                            },
                          },
                        }),
                        _vm._v(" "),
                        _vm.errors.password
                          ? _c(
                              "span",
                              {
                                staticClass: "invalid-feedback",
                                attrs: { role: "alert" },
                              },
                              [
                                _c("strong", [
                                  _vm._v(_vm._s(_vm.errors.password[0])),
                                ]),
                              ]
                            )
                          : _vm._e(),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group mb-0 text-right" }, [
                      _c(
                        "button",
                        {
                          staticClass: "btn btn-primary text-uppercase mb-3",
                          attrs: { type: "submit", disabled: _vm.isSubmitting },
                        },
                        [
                          _vm._v(
                            "\n                                        " +
                              _vm._s(_vm.submitBtnText) +
                              "\n                                        "
                          ),
                          _vm.isSubmitting
                            ? _c("span", {
                                staticClass: "spinner-border spinner-border-sm",
                              })
                            : _vm._e(),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        [
                          _c(
                            "router-link",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !_vm.isSubmitting,
                                  expression: "!isSubmitting",
                                },
                              ],
                              attrs: { to: { name: "password-request" } },
                            },
                            [_vm._v(" Zapomniałeś hasła?")]
                          ),
                        ],
                        1
                      ),
                    ]),
                    _vm._v(
                      "\n                                Jezeli nie masz konta, "
                    ),
                    _c(
                      "router-link",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: !_vm.isSubmitting,
                            expression: "!isSubmitting",
                          },
                        ],
                        attrs: { to: { name: "register" } },
                      },
                      [_vm._v("Zarejestruj się")]
                    ),
                  ],
                  1
                ),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Register.vue?vue&type=template&id=d4f9cbe2&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/Register.vue?vue&type=template&id=d4f9cbe2&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("section", { attrs: { id: "cover" } }, [
      _c("div", { attrs: { id: "cover-caption" } }, [
        _c("div", { staticClass: "container", attrs: { id: "container" } }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-sm-6 offset-sm-3 text-center" }, [
              _c("div", { staticClass: "card" }, [
                _c("h2", { staticClass: "text-center" }, [
                  _vm._v("Rejestracja"),
                ]),
                _vm._v(" "),
                _c("br"),
                _vm._v(" "),
                _c(
                  "form",
                  {
                    attrs: { action: "#", novalidate: "" },
                    on: {
                      submit: function ($event) {
                        $event.preventDefault()
                        return _vm.submit.apply(null, arguments)
                      },
                    },
                  },
                  [
                    _c("div", { staticClass: "form-group row" }, [
                      _c(
                        "label",
                        {
                          staticClass:
                            "col-md-4 col-form-label font-weight-bold text-md-right",
                          attrs: { for: "email" },
                        },
                        [_vm._v("Adres e-mail")]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-md-6" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.email,
                              expression: "email",
                            },
                          ],
                          staticClass: "form-control",
                          class: { "is-invalid": _vm.errors.email },
                          attrs: { id: "email", type: "email" },
                          domProps: { value: _vm.email },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.email = $event.target.value
                            },
                          },
                        }),
                        _vm._v(" "),
                        _vm.errors.email
                          ? _c(
                              "span",
                              {
                                staticClass: "invalid-feedback",
                                attrs: { role: "alert" },
                              },
                              [
                                _c("strong", [
                                  _vm._v(_vm._s(_vm.errors.email[0])),
                                ]),
                              ]
                            )
                          : _vm._e(),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group row" }, [
                      _c(
                        "label",
                        {
                          staticClass:
                            "col-md-4 col-form-label font-weight-bold text-md-right",
                          attrs: { for: "password" },
                        },
                        [_vm._v("Hasło")]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-md-6" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.password,
                              expression: "password",
                            },
                          ],
                          staticClass: "form-control",
                          class: { "is-invalid": _vm.errors.password },
                          attrs: {
                            id: "password",
                            type: "password",
                            autocomplete: "new-password",
                          },
                          domProps: { value: _vm.password },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.password = $event.target.value
                            },
                          },
                        }),
                        _vm._v(" "),
                        _vm.errors.password
                          ? _c(
                              "span",
                              {
                                staticClass: "invalid-feedback",
                                attrs: { role: "alert" },
                              },
                              [
                                _c("strong", [
                                  _vm._v(_vm._s(_vm.errors.password[0])),
                                ]),
                              ]
                            )
                          : _vm._e(),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group row" }, [
                      _c(
                        "label",
                        {
                          staticClass:
                            "col-md-4 col-form-label font-weight-bold text-md-right",
                          attrs: { for: "password-confirm" },
                        },
                        [_vm._v("Potwierdź hasło")]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-md-6" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.password_confirmation,
                              expression: "password_confirmation",
                            },
                          ],
                          staticClass: "form-control",
                          attrs: {
                            id: "password-confirm",
                            type: "password",
                            autocomplete: "new-password",
                          },
                          domProps: { value: _vm.password_confirmation },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.password_confirmation = $event.target.value
                            },
                          },
                        }),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group row mb-0" }, [
                      _c(
                        "div",
                        {
                          staticClass:
                            "col-12 col-md-8 offset-md-4 text-center text-md-left",
                        },
                        [
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-primary",
                              attrs: {
                                type: "submit",
                                disabled: _vm.isSubmitting,
                              },
                            },
                            [
                              _vm._v(
                                "\n                                            " +
                                  _vm._s(_vm.submitBtnText) +
                                  "\n                                            "
                              ),
                              _vm.isSubmitting
                                ? _c("span", {
                                    staticClass:
                                      "spinner-border spinner-border-sm",
                                  })
                                : _vm._e(),
                            ]
                          ),
                        ]
                      ),
                    ]),
                  ]
                ),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Verify.vue?vue&type=template&id=2f4f1de5&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/Verify.vue?vue&type=template&id=2f4f1de5&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("section", { attrs: { id: "cover" } }, [
      _c("div", { attrs: { id: "cover-caption" } }, [
        _c("div", { staticClass: "container", attrs: { id: "container" } }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-sm-6 offset-sm-3 text-center" }, [
              _c(
                "div",
                { staticClass: "card" },
                [
                  _c("h2", { staticClass: "text-center" }, [
                    _vm._v("Weryfikacja adresu e-mail"),
                  ]),
                  _vm._v(" "),
                  _c("br"),
                  _vm._v(" "),
                  _vm.isSubmitting
                    ? _c(
                        "div",
                        { staticClass: "d-flex justify-content-center" },
                        [
                          _c("div", {
                            staticClass:
                              "spinner-grow text-danger admin-loading-spinner",
                          }),
                        ]
                      )
                    : [
                        _vm.verifyMode
                          ? _c("div", [
                              _vm._v(
                                "\n                                    Wykryto zbyt dużą ilość żądań."
                              ),
                              _c("br"),
                              _vm._v(
                                "\n                                    Odśwież stronę po upływie 1 minuty.\n                                "
                              ),
                            ])
                          : [
                              _c("div", { staticClass: "mb-0" }, [
                                _vm._v(
                                  "\n                                        Zanim przejdziesz dalej, sprawdź czy otrzymałeś link weryfikacyjny na adres e-mail podany podczas rejestracji.\n                                    "
                                ),
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "mb-3" }, [
                                _vm._v(
                                  "\n                                        Jeżeli nie otrzymałeś wiadomości,\n                                        "
                                ),
                                _c(
                                  "form",
                                  {
                                    staticClass: "d-inline",
                                    attrs: { action: "#", novalidate: "" },
                                    on: {
                                      submit: function ($event) {
                                        $event.preventDefault()
                                        return _vm.submit.apply(null, arguments)
                                      },
                                    },
                                  },
                                  [
                                    _c(
                                      "button",
                                      {
                                        staticClass:
                                          "btn btn-link p-0 m-0 align-baseline",
                                        staticStyle: {
                                          padding: "0 !important",
                                          border: "none !important",
                                        },
                                        attrs: { type: "submit" },
                                      },
                                      [
                                        _vm._v(
                                          "kliknij tutaj, aby wysłać ponownie"
                                        ),
                                      ]
                                    ),
                                    _vm._v("."),
                                  ]
                                ),
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "mb-0" }, [
                                _vm._v(
                                  "Jeżeli adres e-mail został zweryfikowany, "
                                ),
                                _c(
                                  "button",
                                  {
                                    staticClass:
                                      "btn btn-link p-0 m-0 align-baseline",
                                    staticStyle: {
                                      padding: "0 !important",
                                      border: "none !important",
                                    },
                                    attrs: { type: "button" },
                                    on: { click: _vm.refreshApp },
                                  },
                                  [
                                    _vm._v(
                                      "kliknij tutaj, aby odświeżyć aplikację"
                                    ),
                                  ]
                                ),
                                _vm._v("."),
                              ]),
                            ],
                      ],
                ],
                2
              ),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=template&id=0cc2d5ee&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=template&id=0cc2d5ee&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("section", { attrs: { id: "cover" } }, [
      _c("div", { attrs: { id: "cover-caption" } }, [
        _c("div", { staticClass: "container", attrs: { id: "container" } }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-sm-6 offset-sm-3 text-center" }, [
              _c("div", { staticClass: "card" }, [
                _c("h2", { staticClass: "text-center" }, [
                  _vm._v("Reset hasła"),
                ]),
                _vm._v(" "),
                _c("br"),
                _vm._v(" "),
                _vm.msg.length
                  ? _c(
                      "div",
                      {
                        staticClass: "alert alert-success",
                        attrs: { role: "alert" },
                      },
                      [
                        _vm._v(
                          "\n                                " +
                            _vm._s(_vm.msg) +
                            "\n                            "
                        ),
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "form",
                  {
                    attrs: { action: "#", novalidate: "" },
                    on: {
                      submit: function ($event) {
                        $event.preventDefault()
                        return _vm.submit.apply(null, arguments)
                      },
                    },
                  },
                  [
                    _c("div", { staticClass: "form-group row" }, [
                      _c(
                        "label",
                        {
                          staticClass:
                            "col-md-4 col-form-label font-weight-bold text-md-right",
                          attrs: { for: "email" },
                        },
                        [_vm._v("Adres e-mail")]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-md-6" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.email,
                              expression: "email",
                            },
                          ],
                          staticClass: "form-control",
                          class: { "is-invalid": _vm.errors.email },
                          attrs: { id: "email", type: "email" },
                          domProps: { value: _vm.email },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.email = $event.target.value
                            },
                          },
                        }),
                        _vm._v(" "),
                        _vm.errors.email
                          ? _c(
                              "span",
                              {
                                staticClass: "invalid-feedback",
                                attrs: { role: "alert" },
                              },
                              [
                                _c("strong", [
                                  _vm._v(_vm._s(_vm.errors.email[0])),
                                ]),
                              ]
                            )
                          : _vm._e(),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group row mb-0" }, [
                      _c(
                        "div",
                        {
                          staticClass:
                            "col-12 col-md-8 offset-md-4 text-center text-md-left",
                        },
                        [
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-primary text-uppercase",
                              attrs: {
                                type: "submit",
                                disabled: _vm.isSubmitting,
                              },
                            },
                            [
                              _vm._v(
                                "\n                                            " +
                                  _vm._s(_vm.submitBtnText) +
                                  "\n                                            "
                              ),
                              _vm.isSubmitting
                                ? _c("span", {
                                    staticClass:
                                      "spinner-border spinner-border-sm",
                                  })
                                : _vm._e(),
                            ]
                          ),
                        ]
                      ),
                    ]),
                  ]
                ),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=template&id=07009621&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=template&id=07009621&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("section", { attrs: { id: "cover" } }, [
      _c("div", { attrs: { id: "cover-caption" } }, [
        _c("div", { staticClass: "container", attrs: { id: "container" } }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-sm-6 offset-sm-3 text-center" }, [
              _c("div", { staticClass: "card" }, [
                _c("h2", { staticClass: "text-center" }, [
                  _vm._v("Reset hasła"),
                ]),
                _vm._v(" "),
                _c("br"),
                _vm._v(" "),
                _vm.msg.length
                  ? _c(
                      "div",
                      {
                        staticClass: "alert alert-success",
                        attrs: { role: "alert" },
                      },
                      [
                        _vm._v(
                          "\n                                " +
                            _vm._s(_vm.msg) +
                            "\n                            "
                        ),
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                !_vm.isReseted
                  ? _c(
                      "form",
                      {
                        attrs: { action: "#", novalidate: "" },
                        on: {
                          submit: function ($event) {
                            $event.preventDefault()
                            return _vm.submit.apply(null, arguments)
                          },
                        },
                      },
                      [
                        _c("div", { staticClass: "form-group row" }, [
                          _c(
                            "label",
                            {
                              staticClass:
                                "col-md-4 col-form-label font-weight-bold text-md-right",
                              attrs: { for: "password" },
                            },
                            [_vm._v("Hasło")]
                          ),
                          _vm._v(" "),
                          _c("div", { staticClass: "col-md-6" }, [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.password,
                                  expression: "password",
                                },
                              ],
                              staticClass: "form-control",
                              class: {
                                "is-invalid":
                                  _vm.errors.password ||
                                  _vm.errors.email ||
                                  _vm.errors.token,
                              },
                              attrs: { id: "password", type: "password" },
                              domProps: { value: _vm.password },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.password = $event.target.value
                                },
                              },
                            }),
                            _vm._v(" "),
                            _vm.errors.password
                              ? _c(
                                  "span",
                                  {
                                    staticClass: "invalid-feedback",
                                    attrs: { role: "alert" },
                                  },
                                  [
                                    _c("strong", [
                                      _vm._v(_vm._s(_vm.errors.password[0])),
                                    ]),
                                  ]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.errors.email
                              ? _c(
                                  "span",
                                  {
                                    staticClass: "invalid-feedback",
                                    attrs: { role: "alert" },
                                  },
                                  [
                                    _c("strong", [
                                      _vm._v(_vm._s(_vm.errors.email[0])),
                                    ]),
                                  ]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.errors.token
                              ? _c(
                                  "span",
                                  {
                                    staticClass: "invalid-feedback",
                                    attrs: { role: "alert" },
                                  },
                                  [
                                    _c("strong", [
                                      _vm._v(_vm._s(_vm.errors.token[0])),
                                    ]),
                                  ]
                                )
                              : _vm._e(),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "form-group row" }, [
                          _c(
                            "label",
                            {
                              staticClass:
                                "col-md-4 col-form-label font-weight-bold text-md-right",
                              attrs: { for: "password-confirm" },
                            },
                            [_vm._v("Potwierdź hasło")]
                          ),
                          _vm._v(" "),
                          _c("div", { staticClass: "col-md-6" }, [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.password_confirmation,
                                  expression: "password_confirmation",
                                },
                              ],
                              staticClass: "form-control",
                              attrs: {
                                id: "password-confirm",
                                type: "password",
                                name: "password_confirmation",
                              },
                              domProps: { value: _vm.password_confirmation },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.password_confirmation =
                                    $event.target.value
                                },
                              },
                            }),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "form-group row mb-0" }, [
                          _c(
                            "div",
                            {
                              staticClass:
                                "col-12 col-md-8 offset-md-4 text-center text-md-left",
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "btn btn-primary text-uppercase mb-3",
                                  attrs: {
                                    type: "submit",
                                    disabled: _vm.isSubmitting,
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n                                            " +
                                      _vm._s(_vm.submitBtnText) +
                                      "\n                                            "
                                  ),
                                  _vm.isSubmitting
                                    ? _c("span", {
                                        staticClass:
                                          "spinner-border spinner-border-sm",
                                      })
                                    : _vm._e(),
                                ]
                              ),
                            ]
                          ),
                        ]),
                      ]
                    )
                  : _c(
                      "div",
                      { staticClass: "text-center" },
                      [
                        _c(
                          "router-link",
                          {
                            staticClass: "btn btn-save text-uppercase",
                            attrs: { to: { name: "login" } },
                          },
                          [_vm._v("Zaloguj się")]
                        ),
                      ],
                      1
                    ),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/cart/Index.vue?vue&type=template&id=f5636fe4&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/cart/Index.vue?vue&type=template&id=f5636fe4&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("div", { staticClass: "container mt-4" }, [
      !_vm.cart.id
        ? _c("div", [_vm._v("Brak produktów w koszyku.")])
        : _c("div", { staticClass: "row mx-0 py-3" }, [
            _vm._m(0),
            _vm._v(" "),
            _c("div", { staticClass: "table-responsive" }, [
              _c("table", { staticClass: "table" }, [
                _vm._m(1),
                _vm._v(" "),
                _c(
                  "tbody",
                  _vm._l(_vm.cart.positions, function (position) {
                    return _c("tr", { key: position.id }, [
                      _c("th", { attrs: { scope: "row" } }, [
                        _vm._v(_vm._s(position.product.name)),
                      ]),
                      _vm._v(" "),
                      _c("td", [_vm._v(_vm._s(position.quantity))]),
                      _vm._v(" "),
                      _c("td", [_vm._v(_vm._s(position.price))]),
                      _vm._v(" "),
                      _c("td", [
                        _vm._v(
                          _vm._s(position.price * position.quantity) + " zł"
                        ),
                      ]),
                      _vm._v(" "),
                      _c("td", [
                        _c(
                          "form",
                          {
                            on: {
                              submit: function ($event) {
                                $event.preventDefault()
                                return _vm.removeFromCart(position.id)
                              },
                            },
                          },
                          [
                            _c(
                              "button",
                              {
                                staticClass: "btn btn-danger",
                                attrs: { type: "submit" },
                              },
                              [_vm._v("Usuń")]
                            ),
                          ]
                        ),
                      ]),
                    ])
                  }),
                  0
                ),
              ]),
              _vm._v(" "),
              _c("hr"),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group col-12" }, [
              _c(
                "label",
                { staticClass: "col-form-label", attrs: { for: "table" } },
                [_vm._v("Stolik:")]
              ),
              _vm._v(" "),
              _c(
                "select",
                {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.table_id,
                      expression: "table_id",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: { id: "table" },
                  on: {
                    change: [
                      function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.table_id = $event.target.multiple
                          ? $$selectedVal
                          : $$selectedVal[0]
                      },
                      function ($event) {
                        return _vm.onChangeTables($event)
                      },
                    ],
                  },
                },
                _vm._l(_vm.tables, function (table) {
                  return _c(
                    "option",
                    { key: table.id, domProps: { value: table.id } },
                    [
                      _vm._v(
                        "\n                    " +
                          _vm._s(table.table_nr) +
                          "\n                "
                      ),
                    ]
                  )
                }),
                0
              ),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group col-12" }, [
              _c(
                "label",
                {
                  staticClass: "col-form-label",
                  attrs: { for: "additional_informations" },
                },
                [_vm._v("Dodatkowe informacje:")]
              ),
              _vm._v(" "),
              _c("div", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.additional_informations,
                      expression: "additional_informations",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: { type: "text", name: "additional_informations" },
                  domProps: { value: _vm.additional_informations },
                  on: {
                    input: [
                      function ($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.additional_informations = $event.target.value
                      },
                      _vm.updateAdditionalInformations,
                    ],
                  },
                }),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-12 text-right" }, [
              _c("p", [
                _c("b", [_vm._v("Suma:")]),
                _vm._v(" " + _vm._s(_vm.cart.value)),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-12 text-right" }, [
              _c(
                "form",
                {
                  staticClass: "mx-0 pt-0 mb-3",
                  on: {
                    submit: function ($event) {
                      $event.preventDefault()
                      return _vm.storeCarts.apply(null, arguments)
                    },
                  },
                },
                [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary",
                      attrs: { type: "submit" },
                    },
                    [_vm._v("Złóż zamówienie")]
                  ),
                ]
              ),
            ]),
          ]),
    ]),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-12 text-center" }, [
      _c("h2", { staticStyle: { color: "#2574A9" } }, [
        _vm._v("Twoje zamówienie"),
      ]),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", { staticClass: "fw-bold", attrs: { scope: "col" } }, [
          _vm._v("Produkt"),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "fw-bold", attrs: { scope: "col" } }, [
          _vm._v("Ilość"),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "fw-bold", attrs: { scope: "col" } }, [
          _vm._v("Cena"),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "fw-bold", attrs: { scope: "col" } }, [
          _vm._v("Wartość"),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "fw-bold text-end", attrs: { scope: "col" } }, [
          _vm._v("Usuń"),
        ]),
      ]),
    ])
  },
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/cart/Summary.vue?vue&type=template&id=12a363e2&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/cart/Summary.vue?vue&type=template&id=12a363e2&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("div", { staticClass: "container mt-4" }, [
      _vm.error == "501"
        ? _c("div", [
            _vm._v(
              "Wystąpił błąd podczas dokonywania płatności. Prosimy o zgłoszenie się do pracownika restauracji."
            ),
          ])
        : _c("div", [_vm._v("Dziękujemy za złożenie zamówienia.")]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/layout/FooterVue.vue?vue&type=template&id=26d5c071&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/layout/FooterVue.vue?vue&type=template&id=26d5c071&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("footer", { staticClass: "text-center py-3" }, [
    _vm._v("\n    Footer\n"),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/layout/NavbarVue.vue?vue&type=template&id=7987c748&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/layout/NavbarVue.vue?vue&type=template&id=7987c748&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "nav",
    { staticClass: "navbar navbar-expand-lg navbar-light bg-light" },
    [
      _c("a", { staticClass: "navbar-brand", attrs: { href: "#" } }, [
        _vm._v("SelfOrder"),
      ]),
      _vm._v(" "),
      _vm._m(0),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "collapse navbar-collapse",
          attrs: { id: "navbarSupportedContent" },
        },
        [
          _c(
            "ul",
            { staticClass: "navbar-nav mr-auto" },
            [
              !_vm.isLoggedIn
                ? [
                    _c(
                      "li",
                      { staticClass: "nav-item" },
                      [
                        _c(
                          "router-link",
                          {
                            staticClass: "nav-link",
                            attrs: { to: { name: "login" } },
                          },
                          [_vm._v("Zaloguj")]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "li",
                      { staticClass: "nav-item" },
                      [
                        _c(
                          "router-link",
                          {
                            staticClass: "nav-link",
                            attrs: { to: { name: "register" } },
                          },
                          [_vm._v("Zarejestruj")]
                        ),
                      ],
                      1
                    ),
                  ]
                : [
                    _c(
                      "li",
                      { staticClass: "nav-item" },
                      [
                        _c(
                          "router-link",
                          {
                            staticClass: "nav-link",
                            attrs: { to: { name: "products" } },
                          },
                          [_vm._v("Menu")]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "li",
                      { staticClass: "nav-item" },
                      [
                        _c(
                          "router-link",
                          {
                            staticClass: "nav-link",
                            attrs: { to: { name: "cart" } },
                          },
                          [_vm._v("Koszyk")]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "li",
                      { staticClass: "nav-item" },
                      [
                        _c(
                          "router-link",
                          {
                            staticClass: "nav-link",
                            attrs: { to: { name: "user-orders" } },
                          },
                          [_vm._v(_vm._s(_vm.loggedUser.email))]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c("li", { staticClass: "nav-item" }, [
                      _c(
                        "a",
                        {
                          staticClass: "nav-link",
                          attrs: { href: "#" },
                          on: {
                            click: function ($event) {
                              $event.preventDefault()
                              return _vm.logout.apply(null, arguments)
                            },
                          },
                        },
                        [
                          _vm._v(
                            "\n                        Wyloguj\n                    "
                          ),
                        ]
                      ),
                    ]),
                    _vm._v(" "),
                    _c(
                      "li",
                      { staticClass: "nav-item" },
                      [
                        _vm.loggedUser.is_admin
                          ? _c(
                              "router-link",
                              {
                                staticClass: "nav-link",
                                attrs: { to: { name: "admin-orders" } },
                              },
                              [_vm._v("Panel administratora")]
                            )
                          : _vm._e(),
                      ],
                      1
                    ),
                  ],
            ],
            2
          ),
        ]
      ),
    ]
  )
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "button",
      {
        staticClass: "navbar-toggler",
        attrs: {
          type: "button",
          "data-toggle": "collapse",
          "data-target": "#navbarSupportedContent",
          "aria-controls": "navbarSupportedContent",
          "aria-expanded": "false",
          "aria-label": "Toggle navigation",
        },
      },
      [_c("span", { staticClass: "navbar-toggler-icon" })]
    )
  },
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/products/Details.vue?vue&type=template&id=ef4d817c&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/products/Details.vue?vue&type=template&id=ef4d817c&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("div", { staticClass: "container mt-4" }, [
      _vm.product.product_images.length > 0
        ? _c(
            "div",
            {
              staticClass: "carousel slide",
              attrs: { id: "carouselExampleControls", "data-ride": "carousel" },
            },
            [
              _c(
                "div",
                { staticClass: "carousel-inner" },
                _vm._l(_vm.product.product_images, function (image, index) {
                  return _c("div", { key: image.id }, [
                    _c(
                      "div",
                      {
                        class:
                          index == 0 ? "carousel-item active" : "carouse-item",
                      },
                      [
                        _c("img", {
                          staticClass: "d-block w-100",
                          attrs: { src: image.url, alt: "First slide" },
                        }),
                      ]
                    ),
                  ])
                }),
                0
              ),
              _vm._v(" "),
              _vm._m(0),
              _vm._v(" "),
              _vm._m(1),
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _c("div", {
        staticClass: "alert alert-info",
        staticStyle: { display: "none" },
        attrs: { id: "success", role: "alert" },
      }),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 text-center" }, [
          _c("h2", { staticStyle: { color: "#2574A9" } }, [
            _vm._v(_vm._s(_vm.product.name)),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-lg-9" }, [
          _c("span", { staticStyle: { "font-size": "19px" } }, [
            _c("strong", [_vm._v("Cena: ")]),
            _vm._v(" " + _vm._s(_vm.product.price) + " zł"),
          ]),
        ]),
        _vm._v(" "),
        _c(
          "form",
          {
            staticClass: "col-12 col-lg-3",
            on: {
              submit: function ($event) {
                $event.preventDefault()
                return _vm.addToCart.apply(null, arguments)
              },
            },
          },
          [
            _c("div", { staticClass: "input-group mb-3" }, [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.quantity,
                    expression: "quantity",
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  id: "quantity",
                  type: "number",
                  name: "quantity",
                  min: "1",
                  step: "1",
                  required: "",
                },
                domProps: { value: _vm.quantity },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.quantity = $event.target.value
                  },
                },
              }),
              _vm._v(" "),
              _vm._m(2),
            ]),
          ]
        ),
        _vm._v(" "),
        _vm.product.description != null
          ? _c("div", { staticClass: "col-12 col-lg-9 mt-3" }, [
              _c("h3", [_vm._v("Opis")]),
              _vm._v(" "),
              _c("p", {
                domProps: { innerHTML: _vm._s(_vm.product.description) },
              }),
            ])
          : _vm._e(),
      ]),
    ]),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "a",
      {
        staticClass: "carousel-control-prev",
        attrs: {
          href: "#carouselExampleControls",
          role: "button",
          "data-slide": "prev",
        },
      },
      [
        _c("span", {
          staticClass: "carousel-control-prev-icon",
          attrs: { "aria-hidden": "true" },
        }),
        _vm._v(" "),
        _c("span", { staticClass: "sr-only" }, [_vm._v("Previous")]),
      ]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "a",
      {
        staticClass: "carousel-control-next",
        attrs: {
          href: "#carouselExampleControls",
          role: "button",
          "data-slide": "next",
        },
      },
      [
        _c("span", {
          staticClass: "carousel-control-next-icon",
          attrs: { "aria-hidden": "true" },
        }),
        _vm._v(" "),
        _c("span", { staticClass: "sr-only" }, [_vm._v("Next")]),
      ]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "input-group-append" }, [
      _c(
        "button",
        { staticClass: "btn btn-primary", attrs: { type: "submit" } },
        [_vm._v("Dodaj")]
      ),
    ])
  },
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/products/Main.vue?vue&type=template&id=600fa169&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/products/Main.vue?vue&type=template&id=600fa169&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c(
      "div",
      { staticClass: "container mt-4" },
      _vm._l(_vm.categories, function (category) {
        return _c("div", { key: category.id, staticClass: "category" }, [
          _c("h3", { staticClass: "mb-3 font-weight-bold text-center" }, [
            _vm._v(_vm._s(category.name)),
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "products" },
            _vm._l(category.products, function (product) {
              return _c(
                "div",
                { key: product.id, staticClass: "row mb-3" },
                [
                  product.product_images.length == 0
                    ? _c("div", { staticClass: "col-4" }, [
                        _c("img", {
                          staticStyle: { width: "120px", height: "120px" },
                          attrs: { src: "/images/no-photo.png" },
                        }),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _vm._l(product.product_images, function (image, index) {
                    return _c("div", { key: image.id, staticClass: "col-4" }, [
                      index == 0
                        ? _c("img", {
                            staticStyle: { width: "120px", height: "120px" },
                            attrs: { src: image.url },
                          })
                        : _vm._e(),
                    ])
                  }),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "col-8" },
                    [
                      _c("h5", { staticClass: "card-title" }, [
                        _vm._v(_vm._s(product.name)),
                      ]),
                      _vm._v(" "),
                      _c("p", { staticClass: "card-text" }, [
                        _vm._v(_vm._s(product.price)),
                      ]),
                      _vm._v(" "),
                      _c(
                        "router-link",
                        {
                          staticClass: "btn btn-primary",
                          attrs: {
                            to: { name: "product", params: { id: product.id } },
                            title: product.name,
                          },
                        },
                        [_vm._v("Szczegóły")]
                      ),
                    ],
                    1
                  ),
                ],
                2
              )
            }),
            0
          ),
        ])
      }),
      0
    ),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Menu.vue?vue&type=template&id=8ca6f120&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/profile/Menu.vue?vue&type=template&id=8ca6f120&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "row" }, [
    _c(
      "div",
      { staticClass: "col-lg-3 col-12 menu" },
      [
        _c(
          "router-link",
          {
            staticClass: "nav-link text-center",
            attrs: { to: { name: "user-orders" } },
          },
          [_vm._v("Zamówienia")]
        ),
      ],
      1
    ),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Orders.vue?vue&type=template&id=f1767094&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/profile/Orders.vue?vue&type=template&id=f1767094&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container mb-3" },
    [
      _c("Menu"),
      _vm._v(" "),
      _c("div", { staticClass: "card-body table-responsive p-0" }, [
        _c("table", { staticClass: "table" }, [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "tbody",
            _vm._l(_vm.orders, function (order) {
              return _c("tr", { key: order.id }, [
                _c("td", [_vm._v(_vm._s(order.id))]),
                _vm._v(" "),
                _c("td", [_vm._v(_vm._s(order.nr))]),
              ])
            }),
            0
          ),
        ]),
      ]),
    ],
    1
  )
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", { staticClass: "thead-light" }, [
      _c("tr", [
        _c("th", [_vm._v("ID")]),
        _vm._v(" "),
        _c("th", [_vm._v("Numer")]),
      ]),
    ])
  },
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/static/Home.vue?vue&type=template&id=61e10305&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/static/Home.vue?vue&type=template&id=61e10305&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "main" }, [
    _c("section", { attrs: { id: "cover" } }, [
      _c("div", { attrs: { id: "cover-caption" } }, [
        _c("div", { staticClass: "container", attrs: { id: "container" } }, [
          _c("div", { staticClass: "row" }, [
            _c(
              "div",
              { staticClass: "col-sm-6 offset-sm-3 text-center" },
              [
                _c(
                  "router-link",
                  {
                    staticClass: "btn btn-primary btn-start",
                    attrs: { to: { name: _vm.startBtnRoute } },
                  },
                  [_vm._v("Start")]
                ),
              ],
              1
            ),
          ]),
        ]),
      ]),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "container mt-4" }),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/App */ "./resources/js/components/App.vue");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/store */ "./resources/js/store/store.js");
/* harmony import */ var _router_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./router/router */ "./resources/js/router/router.js");
/* harmony import */ var es6_promise_auto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! es6-promise/auto */ "./node_modules/es6-promise/auto.js");
/* harmony import */ var es6_promise_auto__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(es6_promise_auto__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/jwt */ "./resources/js/utils/jwt.js");







__webpack_require__(/*! ./utils/fontawesome */ "./resources/js/utils/fontawesome.js");

__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");

vue__WEBPACK_IMPORTED_MODULE_0__["default"].config.productionTip = false;

function createApp() {
  new vue__WEBPACK_IMPORTED_MODULE_0__["default"]({
    el: "#app",
    store: _store_store__WEBPACK_IMPORTED_MODULE_2__["default"],
    router: _router_router__WEBPACK_IMPORTED_MODULE_3__["default"],
    render: function render(h) {
      return h(_components_App__WEBPACK_IMPORTED_MODULE_1__["default"]);
    }
  });
}

if (Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_5__["isLoggedIn"])()) {
  _store_store__WEBPACK_IMPORTED_MODULE_2__["default"].dispatch("getLoggedUser").then(function () {
    return createApp();
  });
} else {
  createApp();
}

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _router_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./router/router */ "./resources/js/router/router.js");
/* harmony import */ var _utils_jwt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/jwt */ "./resources/js/utils/jwt.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store/store */ "./resources/js/store/store.js");



 // ===== Lodash, jQuery i Bootstrap =====

window._ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
window.moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
window.alertify = __webpack_require__(/*! alertifyjs */ "./node_modules/alertifyjs/build/alertify.js");
window.moment.locale("pl");
alertify.set("notifier", "position", "bottom-center");
window.Popper = __webpack_require__(/*! popper.js */ "./node_modules/popper.js/dist/esm/popper.js")["default"];
window.$ = window.jQuery = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");

__webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.js"); // ===== Konfiguracja router =====


_router_router__WEBPACK_IMPORTED_MODULE_1__["default"].beforeEach(function (to, from, next) {
  $(".collapse").collapse("hide");

  if (to.matched.some(function (record) {
    return record.meta.requiresGuest;
  })) {
    if (Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_2__["isLoggedIn"])()) {
      next({
        name: "home"
      });
    } else {
      next();
    }
  } else if (to.matched.some(function (record) {
    return record.meta.requiresAuth;
  })) {
    if (Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_2__["isLoggedIn"])()) {
      next();
    } else {
      next({
        name: "login"
      });
    }
  } else if (to.matched.some(function (record) {
    return record.meta.requiresNotVerified;
  })) {
    var verifyUrl = to.params.id && to.params.hash && to.params.email;

    if (verifyUrl) {
      next();
    } else if (Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_2__["isLoggedIn"])()) {
      if (_store_store__WEBPACK_IMPORTED_MODULE_3__["default"].state.loggedUser.email_verified_at === null) {
        next();
      } else {
        next({
          name: "home"
        });
      }
    } else {
      next({
        name: "login"
      });
    }
  } else if (to.matched.some(function (record) {
    return record.meta.requiresVerified;
  })) {
    if (!Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_2__["isLoggedIn"])()) {
      next({
        name: "login"
      });
    } else if (_store_store__WEBPACK_IMPORTED_MODULE_3__["default"].state.loggedUser.email_verified_at) {
      next();
    } else {
      next({
        name: "verify"
      });
    }
  } else if (to.matched.some(function (record) {
    return record.meta.requiresAdmin;
  })) {
    if (!Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_2__["isLoggedIn"])()) {
      next({
        name: "login"
      });
    } else if (_store_store__WEBPACK_IMPORTED_MODULE_3__["default"].state.loggedUser.is_admin) {
      next();
    } else {
      next({
        name: "home"
      });
    }
  } else {
    next();
  }
}); // ==========
// ===== Konfiguracja axios =====

window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"; // przekierowanie do formularza logowania gdy 401

axios.interceptors.response.use(function (res) {
  return res;
}, function (error) {
  if (error.response.status === 401) {
    Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_2__["logout"])();
    return true;
  }

  if (error.response.status === 402) {
    _router_router__WEBPACK_IMPORTED_MODULE_1__["default"].push({
      name: "home"
    });
    return true;
  }

  return Promise.reject(error);
}); // dołączenie nagłówka autoryzacji

axios.interceptors.request.use(function (config) {
  var token = Object(_utils_jwt__WEBPACK_IMPORTED_MODULE_2__["getToken"])();

  if (token) {
    config.headers.Authorization = "Bearer ".concat(token);
  }

  return config;
}, function (error) {
  return Promise.reject(error);
}); // ==========
// SW

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js")["catch"](function (err) {
      return console.log(err);
    });
  }, false);
}

/***/ }),

/***/ "./resources/js/components/App.vue":
/*!*****************************************!*\
  !*** ./resources/js/components/App.vue ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_vue_vue_type_template_id_332fccf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.vue?vue&type=template&id=332fccf4&scoped=true& */ "./resources/js/components/App.vue?vue&type=template&id=332fccf4&scoped=true&");
/* harmony import */ var _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.vue?vue&type=script&lang=js& */ "./resources/js/components/App.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _App_vue_vue_type_style_index_0_id_332fccf4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true& */ "./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _App_vue_vue_type_template_id_332fccf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _App_vue_vue_type_template_id_332fccf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "332fccf4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/App.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/App.vue?vue&type=script&lang=js&":
/*!******************************************************************!*\
  !*** ./resources/js/components/App.vue?vue&type=script&lang=js& ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/App.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true&":
/*!***************************************************************************************************!*\
  !*** ./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true& ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_332fccf4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--7-2!../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/App.vue?vue&type=style&index=0&id=332fccf4&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_332fccf4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_332fccf4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_332fccf4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_332fccf4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/components/App.vue?vue&type=template&id=332fccf4&scoped=true&":
/*!************************************************************************************!*\
  !*** ./resources/js/components/App.vue?vue&type=template&id=332fccf4&scoped=true& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_332fccf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=template&id=332fccf4&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/App.vue?vue&type=template&id=332fccf4&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_332fccf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_332fccf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/admin/Menu.vue":
/*!************************************************!*\
  !*** ./resources/js/components/admin/Menu.vue ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Menu_vue_vue_type_template_id_1fff8d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Menu.vue?vue&type=template&id=1fff8d6c&scoped=true& */ "./resources/js/components/admin/Menu.vue?vue&type=template&id=1fff8d6c&scoped=true&");
/* harmony import */ var _Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Menu.vue?vue&type=script&lang=js& */ "./resources/js/components/admin/Menu.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _Menu_vue_vue_type_style_index_0_id_1fff8d6c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true& */ "./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Menu_vue_vue_type_template_id_1fff8d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Menu_vue_vue_type_template_id_1fff8d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "1fff8d6c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/admin/Menu.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/admin/Menu.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/components/admin/Menu.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Menu.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/Menu.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true&":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true& ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_1fff8d6c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/Menu.vue?vue&type=style&index=0&id=1fff8d6c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_1fff8d6c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_1fff8d6c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_1fff8d6c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_1fff8d6c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/components/admin/Menu.vue?vue&type=template&id=1fff8d6c&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/components/admin/Menu.vue?vue&type=template&id=1fff8d6c&scoped=true& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_template_id_1fff8d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Menu.vue?vue&type=template&id=1fff8d6c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/Menu.vue?vue&type=template&id=1fff8d6c&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_template_id_1fff8d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_template_id_1fff8d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/admin/orders/Index.vue":
/*!********************************************************!*\
  !*** ./resources/js/components/admin/orders/Index.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Index_vue_vue_type_template_id_1bd54153_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Index.vue?vue&type=template&id=1bd54153&scoped=true& */ "./resources/js/components/admin/orders/Index.vue?vue&type=template&id=1bd54153&scoped=true&");
/* harmony import */ var _Index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Index.vue?vue&type=script&lang=js& */ "./resources/js/components/admin/orders/Index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Index_vue_vue_type_template_id_1bd54153_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Index_vue_vue_type_template_id_1bd54153_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "1bd54153",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/admin/orders/Index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/admin/orders/Index.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/components/admin/orders/Index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./Index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/orders/Index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/admin/orders/Index.vue?vue&type=template&id=1bd54153&scoped=true&":
/*!***************************************************************************************************!*\
  !*** ./resources/js/components/admin/orders/Index.vue?vue&type=template&id=1bd54153&scoped=true& ***!
  \***************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_template_id_1bd54153_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./Index.vue?vue&type=template&id=1bd54153&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/admin/orders/Index.vue?vue&type=template&id=1bd54153&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_template_id_1bd54153_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_template_id_1bd54153_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/auth/Login.vue":
/*!************************************************!*\
  !*** ./resources/js/components/auth/Login.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Login_vue_vue_type_template_id_4221c3ad___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Login.vue?vue&type=template&id=4221c3ad& */ "./resources/js/components/auth/Login.vue?vue&type=template&id=4221c3ad&");
/* harmony import */ var _Login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Login.vue?vue&type=script&lang=js& */ "./resources/js/components/auth/Login.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _Login_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Login.vue?vue&type=style&index=0&lang=scss& */ "./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Login_vue_vue_type_template_id_4221c3ad___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Login_vue_vue_type_template_id_4221c3ad___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/auth/Login.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/auth/Login.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/components/auth/Login.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Login.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Login.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss&":
/*!**********************************************************************************!*\
  !*** ./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss& ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Login.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Login.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/components/auth/Login.vue?vue&type=template&id=4221c3ad&":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/auth/Login.vue?vue&type=template&id=4221c3ad& ***!
  \*******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_template_id_4221c3ad___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Login.vue?vue&type=template&id=4221c3ad& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Login.vue?vue&type=template&id=4221c3ad&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_template_id_4221c3ad___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_template_id_4221c3ad___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/auth/Register.vue":
/*!***************************************************!*\
  !*** ./resources/js/components/auth/Register.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Register_vue_vue_type_template_id_d4f9cbe2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Register.vue?vue&type=template&id=d4f9cbe2&scoped=true& */ "./resources/js/components/auth/Register.vue?vue&type=template&id=d4f9cbe2&scoped=true&");
/* harmony import */ var _Register_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Register.vue?vue&type=script&lang=js& */ "./resources/js/components/auth/Register.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Register_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Register_vue_vue_type_template_id_d4f9cbe2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Register_vue_vue_type_template_id_d4f9cbe2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "d4f9cbe2",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/auth/Register.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/auth/Register.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/components/auth/Register.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Register_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Register.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Register.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Register_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/auth/Register.vue?vue&type=template&id=d4f9cbe2&scoped=true&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/components/auth/Register.vue?vue&type=template&id=d4f9cbe2&scoped=true& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Register_vue_vue_type_template_id_d4f9cbe2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Register.vue?vue&type=template&id=d4f9cbe2&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Register.vue?vue&type=template&id=d4f9cbe2&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Register_vue_vue_type_template_id_d4f9cbe2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Register_vue_vue_type_template_id_d4f9cbe2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/auth/Verify.vue":
/*!*************************************************!*\
  !*** ./resources/js/components/auth/Verify.vue ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Verify_vue_vue_type_template_id_2f4f1de5_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Verify.vue?vue&type=template&id=2f4f1de5&scoped=true& */ "./resources/js/components/auth/Verify.vue?vue&type=template&id=2f4f1de5&scoped=true&");
/* harmony import */ var _Verify_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Verify.vue?vue&type=script&lang=js& */ "./resources/js/components/auth/Verify.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Verify_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Verify_vue_vue_type_template_id_2f4f1de5_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Verify_vue_vue_type_template_id_2f4f1de5_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "2f4f1de5",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/auth/Verify.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/auth/Verify.vue?vue&type=script&lang=js&":
/*!**************************************************************************!*\
  !*** ./resources/js/components/auth/Verify.vue?vue&type=script&lang=js& ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Verify_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Verify.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Verify.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Verify_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/auth/Verify.vue?vue&type=template&id=2f4f1de5&scoped=true&":
/*!********************************************************************************************!*\
  !*** ./resources/js/components/auth/Verify.vue?vue&type=template&id=2f4f1de5&scoped=true& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Verify_vue_vue_type_template_id_2f4f1de5_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Verify.vue?vue&type=template&id=2f4f1de5&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/Verify.vue?vue&type=template&id=2f4f1de5&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Verify_vue_vue_type_template_id_2f4f1de5_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Verify_vue_vue_type_template_id_2f4f1de5_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/auth/passwords/PasswordEmail.vue":
/*!******************************************************************!*\
  !*** ./resources/js/components/auth/passwords/PasswordEmail.vue ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PasswordEmail_vue_vue_type_template_id_0cc2d5ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PasswordEmail.vue?vue&type=template&id=0cc2d5ee&scoped=true& */ "./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=template&id=0cc2d5ee&scoped=true&");
/* harmony import */ var _PasswordEmail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PasswordEmail.vue?vue&type=script&lang=js& */ "./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PasswordEmail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PasswordEmail_vue_vue_type_template_id_0cc2d5ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PasswordEmail_vue_vue_type_template_id_0cc2d5ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "0cc2d5ee",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/auth/passwords/PasswordEmail.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordEmail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PasswordEmail.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordEmail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=template&id=0cc2d5ee&scoped=true&":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=template&id=0cc2d5ee&scoped=true& ***!
  \*************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordEmail_vue_vue_type_template_id_0cc2d5ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PasswordEmail.vue?vue&type=template&id=0cc2d5ee&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/passwords/PasswordEmail.vue?vue&type=template&id=0cc2d5ee&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordEmail_vue_vue_type_template_id_0cc2d5ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordEmail_vue_vue_type_template_id_0cc2d5ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/auth/passwords/PasswordReset.vue":
/*!******************************************************************!*\
  !*** ./resources/js/components/auth/passwords/PasswordReset.vue ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PasswordReset_vue_vue_type_template_id_07009621_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PasswordReset.vue?vue&type=template&id=07009621&scoped=true& */ "./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=template&id=07009621&scoped=true&");
/* harmony import */ var _PasswordReset_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PasswordReset.vue?vue&type=script&lang=js& */ "./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PasswordReset_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PasswordReset_vue_vue_type_template_id_07009621_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PasswordReset_vue_vue_type_template_id_07009621_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "07009621",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/auth/passwords/PasswordReset.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordReset_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PasswordReset.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordReset_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=template&id=07009621&scoped=true&":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=template&id=07009621&scoped=true& ***!
  \*************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordReset_vue_vue_type_template_id_07009621_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PasswordReset.vue?vue&type=template&id=07009621&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/auth/passwords/PasswordReset.vue?vue&type=template&id=07009621&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordReset_vue_vue_type_template_id_07009621_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordReset_vue_vue_type_template_id_07009621_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/cart/Index.vue":
/*!************************************************!*\
  !*** ./resources/js/components/cart/Index.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Index_vue_vue_type_template_id_f5636fe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Index.vue?vue&type=template&id=f5636fe4&scoped=true& */ "./resources/js/components/cart/Index.vue?vue&type=template&id=f5636fe4&scoped=true&");
/* harmony import */ var _Index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Index.vue?vue&type=script&lang=js& */ "./resources/js/components/cart/Index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Index_vue_vue_type_template_id_f5636fe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Index_vue_vue_type_template_id_f5636fe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "f5636fe4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/cart/Index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/cart/Index.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/components/cart/Index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/cart/Index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/cart/Index.vue?vue&type=template&id=f5636fe4&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/components/cart/Index.vue?vue&type=template&id=f5636fe4&scoped=true& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_template_id_f5636fe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Index.vue?vue&type=template&id=f5636fe4&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/cart/Index.vue?vue&type=template&id=f5636fe4&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_template_id_f5636fe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_template_id_f5636fe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/cart/Summary.vue":
/*!**************************************************!*\
  !*** ./resources/js/components/cart/Summary.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Summary_vue_vue_type_template_id_12a363e2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Summary.vue?vue&type=template&id=12a363e2&scoped=true& */ "./resources/js/components/cart/Summary.vue?vue&type=template&id=12a363e2&scoped=true&");
/* harmony import */ var _Summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Summary.vue?vue&type=script&lang=js& */ "./resources/js/components/cart/Summary.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Summary_vue_vue_type_template_id_12a363e2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Summary_vue_vue_type_template_id_12a363e2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "12a363e2",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/cart/Summary.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/cart/Summary.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/components/cart/Summary.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Summary.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/cart/Summary.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/cart/Summary.vue?vue&type=template&id=12a363e2&scoped=true&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/components/cart/Summary.vue?vue&type=template&id=12a363e2&scoped=true& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Summary_vue_vue_type_template_id_12a363e2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Summary.vue?vue&type=template&id=12a363e2&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/cart/Summary.vue?vue&type=template&id=12a363e2&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Summary_vue_vue_type_template_id_12a363e2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Summary_vue_vue_type_template_id_12a363e2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/layout/FooterVue.vue":
/*!******************************************************!*\
  !*** ./resources/js/components/layout/FooterVue.vue ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FooterVue_vue_vue_type_template_id_26d5c071_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FooterVue.vue?vue&type=template&id=26d5c071&scoped=true& */ "./resources/js/components/layout/FooterVue.vue?vue&type=template&id=26d5c071&scoped=true&");
/* harmony import */ var _FooterVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FooterVue.vue?vue&type=script&lang=js& */ "./resources/js/components/layout/FooterVue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FooterVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FooterVue_vue_vue_type_template_id_26d5c071_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FooterVue_vue_vue_type_template_id_26d5c071_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "26d5c071",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/layout/FooterVue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/layout/FooterVue.vue?vue&type=script&lang=js&":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/layout/FooterVue.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FooterVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./FooterVue.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/layout/FooterVue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FooterVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/layout/FooterVue.vue?vue&type=template&id=26d5c071&scoped=true&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/components/layout/FooterVue.vue?vue&type=template&id=26d5c071&scoped=true& ***!
  \*************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FooterVue_vue_vue_type_template_id_26d5c071_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./FooterVue.vue?vue&type=template&id=26d5c071&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/layout/FooterVue.vue?vue&type=template&id=26d5c071&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FooterVue_vue_vue_type_template_id_26d5c071_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FooterVue_vue_vue_type_template_id_26d5c071_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/layout/NavbarVue.vue":
/*!******************************************************!*\
  !*** ./resources/js/components/layout/NavbarVue.vue ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _NavbarVue_vue_vue_type_template_id_7987c748_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NavbarVue.vue?vue&type=template&id=7987c748&scoped=true& */ "./resources/js/components/layout/NavbarVue.vue?vue&type=template&id=7987c748&scoped=true&");
/* harmony import */ var _NavbarVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NavbarVue.vue?vue&type=script&lang=js& */ "./resources/js/components/layout/NavbarVue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _NavbarVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _NavbarVue_vue_vue_type_template_id_7987c748_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _NavbarVue_vue_vue_type_template_id_7987c748_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "7987c748",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/layout/NavbarVue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/layout/NavbarVue.vue?vue&type=script&lang=js&":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/layout/NavbarVue.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NavbarVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./NavbarVue.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/layout/NavbarVue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NavbarVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/layout/NavbarVue.vue?vue&type=template&id=7987c748&scoped=true&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/components/layout/NavbarVue.vue?vue&type=template&id=7987c748&scoped=true& ***!
  \*************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NavbarVue_vue_vue_type_template_id_7987c748_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./NavbarVue.vue?vue&type=template&id=7987c748&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/layout/NavbarVue.vue?vue&type=template&id=7987c748&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NavbarVue_vue_vue_type_template_id_7987c748_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NavbarVue_vue_vue_type_template_id_7987c748_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/products/Details.vue":
/*!******************************************************!*\
  !*** ./resources/js/components/products/Details.vue ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Details_vue_vue_type_template_id_ef4d817c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Details.vue?vue&type=template&id=ef4d817c&scoped=true& */ "./resources/js/components/products/Details.vue?vue&type=template&id=ef4d817c&scoped=true&");
/* harmony import */ var _Details_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Details.vue?vue&type=script&lang=js& */ "./resources/js/components/products/Details.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Details_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Details_vue_vue_type_template_id_ef4d817c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Details_vue_vue_type_template_id_ef4d817c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "ef4d817c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/products/Details.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/products/Details.vue?vue&type=script&lang=js&":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/products/Details.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Details_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Details.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/products/Details.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Details_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/products/Details.vue?vue&type=template&id=ef4d817c&scoped=true&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/components/products/Details.vue?vue&type=template&id=ef4d817c&scoped=true& ***!
  \*************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Details_vue_vue_type_template_id_ef4d817c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Details.vue?vue&type=template&id=ef4d817c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/products/Details.vue?vue&type=template&id=ef4d817c&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Details_vue_vue_type_template_id_ef4d817c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Details_vue_vue_type_template_id_ef4d817c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/products/Main.vue":
/*!***************************************************!*\
  !*** ./resources/js/components/products/Main.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Main_vue_vue_type_template_id_600fa169_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Main.vue?vue&type=template&id=600fa169&scoped=true& */ "./resources/js/components/products/Main.vue?vue&type=template&id=600fa169&scoped=true&");
/* harmony import */ var _Main_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Main.vue?vue&type=script&lang=js& */ "./resources/js/components/products/Main.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Main_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Main_vue_vue_type_template_id_600fa169_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Main_vue_vue_type_template_id_600fa169_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "600fa169",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/products/Main.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/products/Main.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/components/products/Main.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Main.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/products/Main.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/products/Main.vue?vue&type=template&id=600fa169&scoped=true&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/components/products/Main.vue?vue&type=template&id=600fa169&scoped=true& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_template_id_600fa169_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Main.vue?vue&type=template&id=600fa169&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/products/Main.vue?vue&type=template&id=600fa169&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_template_id_600fa169_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_template_id_600fa169_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/profile/Menu.vue":
/*!**************************************************!*\
  !*** ./resources/js/components/profile/Menu.vue ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Menu_vue_vue_type_template_id_8ca6f120_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Menu.vue?vue&type=template&id=8ca6f120&scoped=true& */ "./resources/js/components/profile/Menu.vue?vue&type=template&id=8ca6f120&scoped=true&");
/* harmony import */ var _Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Menu.vue?vue&type=script&lang=js& */ "./resources/js/components/profile/Menu.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _Menu_vue_vue_type_style_index_0_id_8ca6f120_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true& */ "./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Menu_vue_vue_type_template_id_8ca6f120_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Menu_vue_vue_type_template_id_8ca6f120_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "8ca6f120",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/profile/Menu.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/profile/Menu.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/components/profile/Menu.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Menu.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Menu.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true&":
/*!************************************************************************************************************!*\
  !*** ./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true& ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_8ca6f120_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Menu.vue?vue&type=style&index=0&id=8ca6f120&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_8ca6f120_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_8ca6f120_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_8ca6f120_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_style_index_0_id_8ca6f120_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/components/profile/Menu.vue?vue&type=template&id=8ca6f120&scoped=true&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/components/profile/Menu.vue?vue&type=template&id=8ca6f120&scoped=true& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_template_id_8ca6f120_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Menu.vue?vue&type=template&id=8ca6f120&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Menu.vue?vue&type=template&id=8ca6f120&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_template_id_8ca6f120_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Menu_vue_vue_type_template_id_8ca6f120_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/profile/Orders.vue":
/*!****************************************************!*\
  !*** ./resources/js/components/profile/Orders.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Orders_vue_vue_type_template_id_f1767094_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Orders.vue?vue&type=template&id=f1767094&scoped=true& */ "./resources/js/components/profile/Orders.vue?vue&type=template&id=f1767094&scoped=true&");
/* harmony import */ var _Orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Orders.vue?vue&type=script&lang=js& */ "./resources/js/components/profile/Orders.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Orders_vue_vue_type_template_id_f1767094_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Orders_vue_vue_type_template_id_f1767094_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "f1767094",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/profile/Orders.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/profile/Orders.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/components/profile/Orders.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Orders.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Orders.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/profile/Orders.vue?vue&type=template&id=f1767094&scoped=true&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/components/profile/Orders.vue?vue&type=template&id=f1767094&scoped=true& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Orders_vue_vue_type_template_id_f1767094_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Orders.vue?vue&type=template&id=f1767094&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/profile/Orders.vue?vue&type=template&id=f1767094&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Orders_vue_vue_type_template_id_f1767094_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Orders_vue_vue_type_template_id_f1767094_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/static/Home.vue":
/*!*************************************************!*\
  !*** ./resources/js/components/static/Home.vue ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Home_vue_vue_type_template_id_61e10305_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Home.vue?vue&type=template&id=61e10305&scoped=true& */ "./resources/js/components/static/Home.vue?vue&type=template&id=61e10305&scoped=true&");
/* harmony import */ var _Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Home.vue?vue&type=script&lang=js& */ "./resources/js/components/static/Home.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _Home_vue_vue_type_style_index_0_id_61e10305_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true& */ "./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Home_vue_vue_type_template_id_61e10305_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Home_vue_vue_type_template_id_61e10305_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "61e10305",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/static/Home.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/static/Home.vue?vue&type=script&lang=js&":
/*!**************************************************************************!*\
  !*** ./resources/js/components/static/Home.vue?vue&type=script&lang=js& ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/static/Home.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true&":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true& ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_61e10305_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/static/Home.vue?vue&type=style&index=0&id=61e10305&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_61e10305_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_61e10305_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_61e10305_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_61e10305_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/components/static/Home.vue?vue&type=template&id=61e10305&scoped=true&":
/*!********************************************************************************************!*\
  !*** ./resources/js/components/static/Home.vue?vue&type=template&id=61e10305&scoped=true& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_61e10305_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=template&id=61e10305&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/static/Home.vue?vue&type=template&id=61e10305&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_61e10305_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_61e10305_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/helpers/helpers.js":
/*!*****************************************!*\
  !*** ./resources/js/helpers/helpers.js ***!
  \*****************************************/
/*! exports provided: showAlertifyConfirm, quillOptions, getErrorsOrAlert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showAlertifyConfirm", function() { return showAlertifyConfirm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quillOptions", function() { return quillOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getErrorsOrAlert", function() { return getErrorsOrAlert; });
function showAlertifyConfirm(title, msg, callback) {
  alertify.confirm(title, msg, callback, null).set({
    movable: false,
    labels: {
      ok: "Tak",
      cancel: "Nie"
    },
    defaultFocusOff: true,
    transition: "zoom"
  });
}
var quillOptions = {
  placeholder: "Treść",
  theme: "snow",
  modules: {
    toolbar: [["bold", "italic", "underline"], ["link"], [{
      align: []
    }], [{
      list: "ordered"
    }, {
      list: "bullet"
    }], [{
      indent: "-1"
    }, {
      indent: "+1"
    }]]
  },
  formats: ["bold", "italic", "underline", "align", "list", "indent", "link"]
};
function getErrorsOrAlert(response) {
  if (response && response.status === 422) {
    return response.data.errors; // window.scrollTo(0, 0);
  }

  if (response && response.status === 424) {
    alertify.error(response.data.msg);
    window.location.reload();
    return {};
  }

  var msg = "Wystąpił błąd serwera.";

  if (response) {
    if (response.status === 432) {
      msg = response.data.msg;
    } else if (response.status === 429) {
      msg = "Wykryto zbyt dużą ilość żądań. Proszę odczekać 1 minutę i spróbować ponownie.";
    }
  }

  alertify.error(msg);
  return {};
}

/***/ }),

/***/ "./resources/js/router/router.js":
/*!***************************************!*\
  !*** ./resources/js/router/router.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-router */ "./node_modules/vue-router/dist/vue-router.esm.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routes */ "./resources/js/router/routes.js");



vue__WEBPACK_IMPORTED_MODULE_0__["default"].use(vue_router__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (new vue_router__WEBPACK_IMPORTED_MODULE_1__["default"]({
  mode: "history",
  routes: _routes__WEBPACK_IMPORTED_MODULE_2__["default"],
  scrollBehavior: function scrollBehavior() {
    return {
      x: 0,
      y: 0
    };
  }
}));

/***/ }),

/***/ "./resources/js/router/routes.js":
/*!***************************************!*\
  !*** ./resources/js/router/routes.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_static_Home__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/static/Home */ "./resources/js/components/static/Home.vue");
/* harmony import */ var _components_auth_Login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/auth/Login */ "./resources/js/components/auth/Login.vue");
/* harmony import */ var _components_auth_Register__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/auth/Register */ "./resources/js/components/auth/Register.vue");
/* harmony import */ var _components_auth_Verify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/auth/Verify */ "./resources/js/components/auth/Verify.vue");
/* harmony import */ var _components_auth_passwords_PasswordEmail__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/auth/passwords/PasswordEmail */ "./resources/js/components/auth/passwords/PasswordEmail.vue");
/* harmony import */ var _components_auth_passwords_PasswordReset__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/auth/passwords/PasswordReset */ "./resources/js/components/auth/passwords/PasswordReset.vue");
/* harmony import */ var _components_products_Main__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/products/Main */ "./resources/js/components/products/Main.vue");
/* harmony import */ var _components_products_Details__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/products/Details */ "./resources/js/components/products/Details.vue");
/* harmony import */ var _components_cart_Index__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/cart/Index */ "./resources/js/components/cart/Index.vue");
/* harmony import */ var _components_cart_Summary__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/cart/Summary */ "./resources/js/components/cart/Summary.vue");
/* harmony import */ var _components_profile_Orders__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/profile/Orders */ "./resources/js/components/profile/Orders.vue");
/* harmony import */ var _components_admin_orders_Index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/admin/orders/Index */ "./resources/js/components/admin/orders/Index.vue");










 //admin


/* harmony default export */ __webpack_exports__["default"] = ([{
  path: "/",
  component: _components_static_Home__WEBPACK_IMPORTED_MODULE_0__["default"],
  name: "home"
}, {
  path: "/login",
  component: _components_auth_Login__WEBPACK_IMPORTED_MODULE_1__["default"],
  name: "login",
  meta: {
    requiresGuest: true
  }
}, {
  path: "/register",
  component: _components_auth_Register__WEBPACK_IMPORTED_MODULE_2__["default"],
  name: "register",
  meta: {
    requiresGuest: true
  }
}, {
  path: "/email/verify/:id?/:hash?/:email?",
  component: _components_auth_Verify__WEBPACK_IMPORTED_MODULE_3__["default"],
  name: "verify",
  props: true,
  meta: {
    requiresNotVerified: true
  }
}, {
  path: "/password/reset",
  component: _components_auth_passwords_PasswordEmail__WEBPACK_IMPORTED_MODULE_4__["default"],
  name: "password-request",
  meta: {
    requiresGuest: true
  }
}, {
  path: "/password/reset/:token",
  component: _components_auth_passwords_PasswordReset__WEBPACK_IMPORTED_MODULE_5__["default"],
  name: "password-reset",
  props: true,
  meta: {
    requiresGuest: true
  }
}, {
  path: '/products',
  name: 'products',
  component: _components_products_Main__WEBPACK_IMPORTED_MODULE_6__["default"]
}, {
  path: '/product/:id',
  name: 'product',
  component: _components_products_Details__WEBPACK_IMPORTED_MODULE_7__["default"]
}, {
  path: '/cart',
  name: 'cart',
  component: _components_cart_Index__WEBPACK_IMPORTED_MODULE_8__["default"]
}, {
  path: '/summary',
  name: 'summary',
  component: _components_cart_Summary__WEBPACK_IMPORTED_MODULE_9__["default"]
}, //user 
{
  path: '/user/orders',
  name: 'user-orders',
  component: _components_profile_Orders__WEBPACK_IMPORTED_MODULE_10__["default"]
}, //admin
{
  path: '/admin/orders',
  name: 'admin-orders',
  component: _components_admin_orders_Index__WEBPACK_IMPORTED_MODULE_11__["default"]
}]);

/***/ }),

/***/ "./resources/js/store/actions.js":
/*!***************************************!*\
  !*** ./resources/js/store/actions.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  getLoggedUser: function getLoggedUser(_ref) {
    var commit = _ref.commit;
    return axios.get("/api/user/get-logged-user").then(function (_ref2) {
      var data = _ref2.data;
      commit("setLoggedUser", {
        data: data
      });
    });
  }
});

/***/ }),

/***/ "./resources/js/store/mutations.js":
/*!*****************************************!*\
  !*** ./resources/js/store/mutations.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  setLoggedUser: function setLoggedUser(state, payload) {
    state.loggedUser = payload.data;
  }
});

/***/ }),

/***/ "./resources/js/store/store.js":
/*!*************************************!*\
  !*** ./resources/js/store/store.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mutations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mutations */ "./resources/js/store/mutations.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions */ "./resources/js/store/actions.js");




vue__WEBPACK_IMPORTED_MODULE_0__["default"].use(vuex__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (new vuex__WEBPACK_IMPORTED_MODULE_1__["default"].Store({
  state: {
    loggedUser: {}
  },
  mutations: _mutations__WEBPACK_IMPORTED_MODULE_2__["default"],
  actions: _actions__WEBPACK_IMPORTED_MODULE_3__["default"]
}));

/***/ }),

/***/ "./resources/js/utils/fontawesome.js":
/*!*******************************************!*\
  !*** ./resources/js/utils/fontawesome.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

window.FontAwesomeKitConfig = {
  "asyncLoading": {
    "enabled": false
  },
  "autoA11y": {
    "enabled": true
  },
  "baseUrl": "https://kit-free.fontawesome.com",
  "detectConflictsUntil": null,
  "license": "free",
  "method": "css",
  "minify": {
    "enabled": true
  },
  "v4FontFaceShim": {
    "enabled": true
  },
  "v4shim": {
    "enabled": true
  },
  "version": "latest"
};
!function () {
  function r(e) {
    var _t,
        n = [],
        i = document,
        o = i.documentElement.doScroll,
        r = "DOMContentLoaded",
        a = (o ? /^loaded|^c/ : /^loaded|^i|^c/).test(i.readyState);

    a || i.addEventListener(r, _t = function t() {
      for (i.removeEventListener(r, _t), a = 1; _t = n.shift();) {
        _t();
      }
    }), a ? setTimeout(e, 0) : n.push(e);
  }

  !function () {
    if (!(void 0 === window.Element || "classList" in document.documentElement)) {
      var e,
          t,
          n,
          i = Array.prototype,
          o = i.push,
          r = i.splice,
          a = i.join;
      d.prototype = {
        add: function add(e) {
          this.contains(e) || (o.call(this, e), this.el.className = this.toString());
        },
        contains: function contains(e) {
          return -1 != this.el.className.indexOf(e);
        },
        item: function item(e) {
          return this[e] || null;
        },
        remove: function remove(e) {
          if (this.contains(e)) {
            for (var t = 0; t < this.length && this[t] != e; t++) {
              ;
            }

            r.call(this, t, 1), this.el.className = this.toString();
          }
        },
        toString: function toString() {
          return a.call(this, " ");
        },
        toggle: function toggle(e) {
          return this.contains(e) ? this.remove(e) : this.add(e), this.contains(e);
        }
      }, window.DOMTokenList = d, e = Element.prototype, t = "classList", n = function n() {
        return new d(this);
      }, Object.defineProperty ? Object.defineProperty(e, t, {
        get: n
      }) : e.__defineGetter__(t, n);
    }

    function d(e) {
      for (var t = (this.el = e).className.replace(/^\s+|\s+$/g, "").split(/\s+/), n = 0; n < t.length; n++) {
        o.call(this, t[n]);
      }
    }
  }();

  function a(e) {
    var t, n, i, o;
    prefixesArray = e || ["fa"], prefixesSelectorString = "." + Array.prototype.join.call(e, ",."), t = document.querySelectorAll(prefixesSelectorString), Array.prototype.forEach.call(t, function (e) {
      n = e.getAttribute("title"), e.setAttribute("aria-hidden", "true"), i = !e.nextElementSibling || !e.nextElementSibling.classList.contains("sr-only"), n && i && ((o = document.createElement("span")).innerHTML = n, o.classList.add("sr-only"), e.parentNode.insertBefore(o, e.nextSibling));
    });
  }

  var d = function d(e, t) {
    var n = document.createElement("link");
    n.href = e, n.media = "all", n.rel = "stylesheet", t && t.detectingConflicts && t.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(t.detectionIgnoreAttr)), document.getElementsByTagName("head")[0].appendChild(n);
  },
      c = function c(e, t) {
    !function (e, t) {
      var n,
          i = t && t.before || void 0,
          o = t && t.media || void 0,
          r = window.document,
          a = r.createElement("link");
      if (t && t.detectingConflicts && t.detectionIgnoreAttr && a.setAttributeNode(document.createAttribute(t.detectionIgnoreAttr)), i) n = i;else {
        var d = (r.body || r.getElementsByTagName("head")[0]).childNodes;
        n = d[d.length - 1];
      }
      var c = r.styleSheets;
      a.rel = "stylesheet", a.href = e, a.media = "only x", function e(t) {
        if (r.body) return t();
        setTimeout(function () {
          e(t);
        });
      }(function () {
        n.parentNode.insertBefore(a, i ? n : n.nextSibling);
      });

      var s = function s(e) {
        for (var t = a.href, n = c.length; n--;) {
          if (c[n].href === t) return e();
        }

        setTimeout(function () {
          s(e);
        });
      };

      function l() {
        a.addEventListener && a.removeEventListener("load", l), a.media = o || "all";
      }

      a.addEventListener && a.addEventListener("load", l), (a.onloadcssdefined = s)(l);
    }(e, t);
  },
      e = function e(_e, t, n) {
    var i = t && void 0 !== t.autoFetchSvg ? t.autoFetchSvg : void 0,
        o = t && void 0 !== t.async ? t.async : void 0,
        r = t && void 0 !== t.autoA11y ? t.autoA11y : void 0,
        a = document.createElement("script"),
        d = document.scripts[0];
    a.src = _e, void 0 !== r && a.setAttribute("data-auto-a11y", r ? "true" : "false"), i && (a.setAttributeNode(document.createAttribute("data-auto-fetch-svg")), a.setAttribute("data-fetch-svg-from", t.fetchSvgFrom)), o && a.setAttributeNode(document.createAttribute("defer")), n && n.detectingConflicts && n.detectionIgnoreAttr && a.setAttributeNode(document.createAttribute(n.detectionIgnoreAttr)), d.parentNode.appendChild(a);
  };

  function s(e, t) {
    var n = t && t.addOn || "",
        i = t && t.baseFilename || e.license + n,
        o = t && t.minify ? ".min" : "",
        r = t && t.fileSuffix || e.method,
        a = t && t.subdir || e.method;
    return e.baseUrl + "/releases/" + ("latest" === e.version ? "latest" : "v".concat(e.version)) + "/" + a + "/" + i + o + "." + r;
  }

  var t, n, i, o, l;

  try {
    if (window.FontAwesomeKitConfig) {
      var u,
          f = window.FontAwesomeKitConfig,
          m = {
        detectingConflicts: f.detectConflictsUntil && new Date() <= new Date(f.detectConflictsUntil),
        detectionIgnoreAttr: "data-fa-detection-ignore",
        detectionTimeoutAttr: "data-fa-detection-timeout",
        detectionTimeout: null
      };
      "js" === f.method && (o = m, l = {
        async: (i = f).asyncLoading.enabled,
        autoA11y: i.autoA11y.enabled
      }, "pro" === i.license && (l.autoFetchSvg = !0, l.fetchSvgFrom = i.baseUrl + "/releases/" + ("latest" === i.version ? "latest" : "v".concat(i.version)) + "/svgs"), i.v4shim.enabled && e(s(i, {
        addOn: "-v4-shims",
        minify: i.minify.enabled
      })), e(s(i, {
        minify: i.minify.enabled
      }), l, o)), "css" === f.method && function (e, t) {
        var n,
            i = a.bind(a, ["fa", "fab", "fas", "far", "fal", "fad"]);
        e.autoA11y.enabled && (r(i), n = i, "undefined" != typeof MutationObserver && new MutationObserver(n).observe(document, {
          childList: !0,
          subtree: !0
        })), e.v4shim.enabled && (e.license, e.asyncLoading.enabled ? c(s(e, {
          addOn: "-v4-shims",
          minify: e.minify.enabled
        }), t) : d(s(e, {
          addOn: "-v4-shims",
          minify: e.minify.enabled
        }), t));
        e.v4FontFaceShim.enabled && (e.asyncLoading.enabled ? c(s(e, {
          addOn: "-v4-font-face",
          minify: e.minify.enabled
        }), t) : d(s(e, {
          addOn: "-v4-font-face",
          minify: e.minify.enabled
        }), t));
        var o = s(e, {
          minify: e.minify.enabled
        });
        e.asyncLoading.enabled ? c(o, t) : d(o, t);
      }(f, m), m.detectingConflicts && ((u = document.currentScript.getAttribute(m.detectionTimeoutAttr)) && (m.detectionTimeout = u), document.currentScript.setAttributeNode(document.createAttribute(m.detectionIgnoreAttr)), t = f, n = m, r(function () {
        var e = document.createElement("script");
        n && n.detectionIgnoreAttr && e.setAttributeNode(document.createAttribute(n.detectionIgnoreAttr)), n && n.detectionTimeoutAttr && n.detectionTimeout && e.setAttribute(n.detectionTimeoutAttr, n.detectionTimeout), e.src = s(t, {
          baseFilename: "conflict-detection",
          fileSuffix: "js",
          subdir: "js",
          minify: t.minify.enabled
        }), e.async = !0, document.body.appendChild(e);
      }));
    }
  } catch (e) {}
}();

/***/ }),

/***/ "./resources/js/utils/jwt.js":
/*!***********************************!*\
  !*** ./resources/js/utils/jwt.js ***!
  \***********************************/
/*! exports provided: getToken, login, logout, isLoggedIn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getToken", function() { return getToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "login", function() { return login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logout", function() { return logout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLoggedIn", function() { return isLoggedIn; });
function getToken() {
  return window.localStorage.getItem("token");
}
function login(token) {
  window.localStorage.setItem("token", token);
}
function logout() {
  window.localStorage.removeItem("token");
  window.location.replace("/");
}
function isLoggedIn() {
  var token = getToken();
  return token !== null;
}

/***/ }),

/***/ "./resources/sass/app.scss":
/*!*********************************!*\
  !*** ./resources/sass/app.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!*************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/sass/app.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\xampp\htdocs\self-order\resources\js\app.js */"./resources/js/app.js");
module.exports = __webpack_require__(/*! C:\xampp\htdocs\self-order\resources\sass\app.scss */"./resources/sass/app.scss");


/***/ })

},[[0,"/js/manifest","/js/vendor"]]]);