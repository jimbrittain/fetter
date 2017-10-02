"use strict";
/*global document, window, __imns */
var adr = __imns('util.tools'),
    uc = __imns('util.classes'),
    udb = __imns('util.debug');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('fetter' in adr)){
    /**
     * @module fetter
     * @author JDB - jim@immaturedawn.co.uk 2013
     * @url - http://www.immaturedawn.co.uk
     * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     * @copyright - Immature Dawn 2017
     * @version - 0.3
     */
    /*
     * fetter.js and fetter.min.js

     * Requires isHTMLElement, isArray
     * Use is an alternative to jQuery's bind functionality - in particular for window.load, so that if window.loaded, the function fires,
     * This is beneficial if the content is dynamic/async-loaded, and could be included in an already loaded window.
     * 
     * Usage
     * 	fetter(element:htmlElement, event:string, function:function, bubble:boolean, done:both||after, donefunction:function) - equivalence of bind
     *  unfetter(element:htmlElement, event:string, function:function) - equivalence of unbind
     * 
     * TO DO
     * 	Validate code,
     * 	See if can do it for multiple HTMLElements
     * 	Add a preventDefault?
     * 	ie7,8,9,10,webkit,mozilla. To do ie6,7
     */
    adr.unfetter = function(_element, _event, _function, _capt){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation'),
            uc = __imns('util.classes');
        var getEvent = ut.unfetter.prototype.eventChooser(_element, _event);
        var fun = ut.unfetter.prototype.functionChooser(_element);
        var _funattacher = null;
        if(fun !== null){
            var r = false;
            _capt = (_capt !== undefined && _capt === false) ? false : true;
            if(uv.isArray(_function) && _function.length === 2){
                _funattacher = _function[0];
                _function = _function[1]; }
            if(_function !== null && typeof _function === 'function'){
                _function = (new uc.FetterMain()).findListener(_function, _element, _event, _funattacher);
                try {
                    r = (fun.call) ? fun.call(_element, getEvent, _function, _capt) : fun(getEvent, _function, _capt);
                } catch(e){ r = (_element.detachEvent && _element.detachEvent === fun) ? _element.detachEvent(getEvent, _function) : false; }
            } else { 
                try {
                    r = (fun.call) ? fun.call(_element, getEvent, _capt) : _element.fun(getEvent, _capt);
                } catch(e){
                    r = (_element.detachEvent && fun === _element.detachEvent) ? _element.detachEvent(getEvent) : false; }}
            (new uc.FetterMain()).removeListenerFromIndex((new uc.FetterMain()).findListenerIndex(_function, _element, _event, _funattacher));
        } else { return false; }};

    adr.unfetter.prototype.eventChooser = function(_element, name){
        if('removeEventListener' in _element){
            return name;
        } else {
            return ('detachEvent' in _element || ('on' + name) in _element) ? 'on' + name : null; }};

    adr.unfetter.prototype.functionChooser = function(_element){
        var uc = __imns('util.classes');
        if('removeEventListener' in _element){
            return _element.removeEventListener;
        } else if('detachEvent' in _element){
            return _element.detachEvent;
        } else if('onload' in _element){
            return (new uc.FetterMain().findElement(_element).remove);
        } else { return null; }};

    adr.fetter = function(_element, _event, _function, _bubble, _done, _donefunction){ //could be given an object;
        var ut = __imns('util.tools'),
            uc = __imns('util.classes'),
            uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var fette = ut.fetter.prototype;
        var te = null, tv = null, tf = null, tb = true, td = false, tdf = null, tfa = null;
        if(_element !== null && typeof _element === 'object' && (!uv.isHTMLElement(_element) && _element !== window && _element !== document)){
            te = ('_element' in _element && (uv.isHTMLElement(_element._element) || _element._element === window || _element._element === document)) ? _element._element : null;
            tv = ('_event' in _element) ? _element._event : null;
            tf = ('_function' in _element && typeof _element._function === 'function') ? _element._function : null;
            if('_function' in _element && uv.isArray(_element._function) && _element._function.length === 2){
                tfa = _element._function[0];
                tf = _element._function[1]; }
            tb = ('_bubble' in _element && _element._bubble === false) ? false : true;
            td = ('_done' in _element) ? fette.returnDoneNumber(_element._done) : 1;
            tdf = ('_done_function' in _element && typeof _element._done_function === 'function') ? _element._done_function : null;
        } else {
            te = (uv.isHTMLElement(_element) || _element === window || _element === document) ? _element : null;
            tv = _event;
            tf = (_function !== null && typeof _function === 'function') ? _function : null;
            if(_function !== null && uv.isArray(_function) && _function.length === 2){
                tfa = _function[0];
                tf = _function[1]; }
            tb = (_bubble === false) ? false : true;
            td = fette.returnDoneNumber(_done); }
        if(te !== null && tv !== null && tf !== null){ //okay to try;
            tf = (new uc.FetterMain()).findListener(tf, te, tv, tfa);
            tv = tv.split(" ");
            var added = 0;
            for(var i = 0; i<tv.length; i += 1){
                var getEvent = null;
                if(td === 2 || td === 3){
                    if(tdf !== null){
                        if(!tdf()){ getEvent = fette.eventChooser(te, tv[i]); } else { tf(); }
                    } else if(tv[i] === 'load' && te === window){
                        if(fette.windowOpened()){ tf(); } else {  getEvent = fette.eventChooser(te, tv[i]); }
                    } else if(tv[i] === 'CSSContentRendered' && te === document){
                        if((new uc.CSSRendered()).hasRendered()){ tf(); } else { getEvent = fette.eventChooser(te, tv[i]); }
                    } else if(tv[i] === 'DOMContentLoaded' && te === document){
                        if(fette.documentReady()){ tf(); } else { getEvent = fette.eventChooser(te, tv[i]); }}}
                if((td === 1 || td === 3) && getEvent === null){ getEvent = fette.eventChooser(te, tv[i]); }
                if(getEvent !== null){
                    try {
                        var fun = fette.functionChooser(te);
                        if(fun !== null){ 
                            if(fun.call){
                                fun.call(te, getEvent, tf, tb);
                            } else { fun(te, getEvent, tf, tb); }
                            added += 1; }
                    } catch(e){ 
                        if(te.attachEvent && fun === te.attachEvent){ te.attachEvent(getEvent, tf, tb); } //catch for ie7;
                    }}}
            return (added === tv.length) ? true : false;
        } else { return false; }};

    adr.fetter.prototype.eventChooser = function(_element, name){
        if('addEventListener' in _element){
            return name;
        } else {
            return ('attachEvent' in _element || ('on' + name) in _element) ? 'on' + name : null; }};

    adr.fetter.prototype.functionChooser = function(_element){ //requires try/catch; may return null;
        var uc = __imns('util.classes');
        if(_element.addEventListener){
            return _element.addEventListener;
        } else if(_element.attachEvent){
            return _element.attachEvent;
        } else if(_element.onload){
            return (new uc.FetterMain().findElement(_element).set);
        } else { return null; }};

    adr.fetter.prototype.documentReadyConfirmed = function(){ 
        var ut = __imns('util.tools');
        ut.fetter.prototype._documentready = true; };
    adr.fetter.prototype.windowLoadConfirmed = function(){ 
        var ut = __imns('util.tools');
        ut.fetter.prototype._windowloaded = true; };

    adr.fetter.prototype.returnDoneNumber = function(s){
        s = (s === 'both') ? 3 : s;
        s = (s === 'after') ? 2 : s;
        s = (s === 2 || s === 3) ? s : 1;
        return s; };

    adr.fetter.prototype.windowOpened = function(){
        var ut = __imns('util.tools');
        var fette = ut.fetter.prototype;
        if(fette._windowloaded){
            return fette._windowloaded;
        } else {
            var isLoaded = false;
            if(document.readyState && (document.readyState === 'complete' || document.readyState === 'loaded')){
                isLoaded = true;
            } else if('loaded' in window){ isLoaded = window.loaded; }
            if(isLoaded){
                fette._windowloaded = true;
            } else {
                var fun = fette.functionChooser(window);
                if(fun !== null){ fun('load', fette.windowLoadConfirmed, true); }}
            return isLoaded;}};

    adr.fetter.prototype.documentReady = function(){
        var ut = __imns('util.tools');
        var fette = ut.fetter.prototype, fun = null;
        if(fette._documentready){
            return fette._documentready;
        } else {
            var isReady = false;
            if(document.attachEvent && document.documentElement){ //is ie
                try {
                    document.documentElement.doScroll("left");
                    isReady = true;
                } catch(e) {}
            } else if(document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive' || (document.attachEvent && document.readyState !== 'loading')){ //apparently !loading for ie4
                isReady = true; }
            if(isReady){
                fette._documentready = true;
                return true;
            } else {
                fun = fette.functionChooser(document);
                if(fun !== null){ fun('DOMContentLoaded', fette.documentReadyConfirmed, true); }
                fun = fette.functionChooser(window);
                if(fun !== null){ fun('load', fette.documentReadyConfirmed, true); }
                return false; }}};

    uc.FetterMain = function(){
        var uc = __imns('util.classes');
        if(uc.FetterMain.prototype.singletonInstance){ return uc.FetterMain.prototype.singletonInstance; }
        uc.FetterMain.prototype.singletonInstance = this;
        this.fetter_array = [];
        this.listener_array = []; };

    uc.FetterMain.prototype.findListenerIndex = function(_fun, _elem, _evt, _funattacher){
        _funattacher = (_funattacher === undefined) ? null : _funattacher;
        var f = -1, i = 0, imax = 0;
        if(typeof _fun === 'function'){
            for(i=0, imax = this.listener_array.length; i < imax; i += 1){
                if(this.listener_array[i]._function === _fun){ 
                    f = i; break; }}
            if(f === -1){ //verbose search
                var l = this.listener_array.length;
                for(i=0; i < l; i += 1){
                    if(this.listener_array[i]._function.toString() === _fun.toString() && this.listener_array[i]._element === _elem && this.listener_array[i]._event === _evt && _funattacher === this.listener_array[i]._funattacher){
                        f = i; break; }}}
            return f;
        } else {
            (new udb.IMDebugger()).pass("Fetter must be supplied with a function");
            return undefined; }};

    uc.FetterMain.prototype.removeListenerFromIndex = function(i){ 
        if(i > -1 && i < this.listener_array.length){ this.listener_array.splice(i, 1); }};

    uc.FetterMain.prototype.findListener = function(_fun, _elem, _evt, _funattacher){
        var uc = __imns('util.classes');
        _funattacher = (_funattacher === undefined) ? null : _funattacher;
        var f = this.findListenerIndex(_fun, _elem, _evt, _funattacher);
        if(f === -1){
            this.listener_array.push(new uc.FetterListener(_fun, _elem, _evt, _funattacher));
            return this.listener_array[this.listener_array.length - 1]._listener;
        } else { return this.listener_array[f]._listener; }};

    /*FetterMain.prototype.addEventDefinition = function(name, attr){
        var f = false;
        for(var i=0, imax = this.event_array.length; i<imax; i += 1){
            if(this.event_array[i].name === name || this.event_array[i].attr === attr){
                f = true;
                break; }}
        if(!f){
            this.event_array = new FetterEventDefinition(name, attr);
            return true;
        } else {
            if(console && console.warn){
                console.warn("This FetterEvent Already Exists");
            } else { throw new Error("This FetterEvent Already Exists"); }
            return false; }};*/

    uc.FetterMain.prototype.findElementNumber = function(_element){
        var f = -1;
        for(var i=0, imax = this.fetter_array.length; i<imax; i += 1){
            if(this.fetter_array[f].element === _element){ f = i; break; }}
        return f; };

    uc.FetterMain.prototype.findElement = function(_element){
        var uc = __imns('util.tools');
        var f = this.findElementNumber(_element);
        if(f === -1){ 
            f = this.fetter_array.length;
            this.fetter_array.push(new uc.FetterDefinition(_element)); }
        return this.fetter_array[f]; };

    uc.FetterMain.prototype.isElement = function(_element){
        var f = this.findElementNumber(_element);
        return (f !== -1) ? true : false; };

    uc.FetterDefinition = function(){
        this.element = null;
        this.event_array = null; };

    uc.FetterDefinition.prototype.init = function(_element){ 
        this.element = _element; this.event_array = []; };

    uc.FetterDefinition.prototype.returnEventObject = function(clarifiedEvent){
        var found = false;
        for(var i=0, imax = this.event_array.length; i < imax; i += 1){
            if(this.event_array[i]._event === clarifiedEvent){
                found = this.event_array[i];
                return this.event_array[i]; }}
        return found; };

    uc.FetterDefinition.prototype.sendToTheFront = function(_event, _function){
        var eveObj = this.returnEventObject(this.returnEvent(_event));
        if(eveObj.functionExists(_function)){
            var i = eveObj.findFunctionNumber(_function);
            var f = eveObj._function_arr.splice(i, 1);
            eveObj._function_arr.unshift(f); }};

    uc.FetterDefinition.prototype.sendToTheBack = function(_event, _function){
        var eveObj = this.returnEventObject(this.returnEvent(_event));
        if(eveObj.functionExists(_function)){
            var i = eveObj.findFunctionNumber(_function);
            var f = eveObj._function_arr.splice(i, 1);
            eveObj._function_arr.push(f);}};

    uc.FetterDefinition.prototype.set = function(_event, _function, _bubble){
        var eveObj = this.returnEventObject(this.returnEvent(_event));
        var uc = __imns('util.classes');
        if(eveObj instanceof uc.FetterEvent){
            if(!eveObj.functionExists(_function)){
                eveObj._function_arr.push(_function);
                return true;
            } else { return false; }}};

    uc.FetterDefinition.prototype.remove = function(_event, _function){
        var eveObj = this.returnEventObject(this.returnEvent(_event));
        var uc = __imns('util.classes');
        if(eveObj instanceof uc.FetterEvent){
            if(eveObj.functionExists(_function)){
                var splicePoint = eveObj.findFunctionNumber(_function);
                this.eveObj._function_arr.splice(splicePoint, 1);
                return true;
            } else { return false; }
        } else { return false; }};

    uc.FetterListener = function(_fun, _elem, _evt, _funattacher){
        var m = this;
        this._function = (typeof _fun === 'function') ? _fun : function(){};
        this._funattacher = (_funattacher !== undefined) ? _funattacher : null;
        this._element = (_elem !== null) ? _elem : -1;
        this._event = (_evt !== null) ? _evt : -1;
        this._listener = function(e){ return m._function(e); };
    };

    uc.FetterEvent = function(){
        this._element = null;
        this._event = null;
        this._bubble = true;
        this._function_arr = null; };

    uc.FetterEvent.prototype.process = function(e){
        for(var i=0, imax = this._function_arr.length; i<imax; i += 1){ if(typeof this._function_arr[i] === 'function'){ this._function_arr[i](e); }}};

    uc.FetterEvent.prototype.functionExists = function(_fun){
        var f = this.findFunctionNumber(_fun); return (f === -1) ? false : true; };

    uc.FetterEvent.prototype.findFunctionNumber = function(_fun){
            var foundNumber = -1;
            for(var i=0, imax = this._function_arr.length; i<imax; i += 1){
                if(this._function_arr[i] === _fun){
                    foundNumber = i;
                    break; }}
            return foundNumber; };

    uc.FetterEvent.prototype.findFunction = function(_fun){
            var foundNum = this.findFunctionNumber(_fun);
            return (foundNum !== -1) ? this._function_arr[foundNum] : false; };


}
