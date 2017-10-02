"use strict";
/*global isHTMLElement, IMDebugger, FetterMain, FetterDefinition, document, window, FetterListener, FetterEvent, console*/
/**
 * @module fetter
 * @author JDB - jim@immaturedawn.co.uk 2013
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2013
 * @version - 0.1
 */
/*
 * js.fetter.js and js.fetter.min.js

 * Requires isHTMLElement.min.js,
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
function unfetter(_element, _event, _function, _capt){
	var getEvent = unfetter.prototype.eventChooser(_element, _event);
	var fun = unfetter.prototype.functionChooser(_element);
	if(fun !== null){
		var r = false;
		_capt = (_capt !== undefined && _capt === false) ? false : true;
		if(_function !== null && typeof _function === 'function'){
			_function = (new FetterMain()).findListener(_function, _element, _event);
			try {
				r = (fun.call) ? fun.call(_element, getEvent, _function, _capt) : fun(getEvent, _function, _capt);
			} catch(e){ r = (_element.detachEvent && _element.detachEvent === fun) ? _element.detachEvent(getEvent, _function) : false; }
		} else { 
			try {
				r = (fun.call) ? fun.call(_element, getEvent, _capt) : _element.fun(getEvent, _capt);
			} catch(e){
				r = (_element.detachEvent && fun === _element.detachEvent) ? _element.detachEvent(getEvent) : false; }}
		(new FetterMain()).removeListenerFromIndex((new FetterMain()).findListenerIndex(_function, _element, _event));
	} else { return false; }}
unfetter.prototype.eventChooser = function(_element, name){
	if('removeEventListener' in _element){
		return name;
	} else {
		return ('detachEvent' in _element || ('on' + name) in _element) ? 'on' + name : null; }};
unfetter.prototype.functionChooser = function(_element){
	if('removeEventListener' in _element){
		return _element.removeEventListener;
	} else if('detachEvent' in _element){
		return _element.detachEvent;
	} else if('onload' in _element){
		return (new FetterMain().findElement(_element).remove);
	} else { return null; }};

function fetter(_element, _event, _function, _bubble, _done, _donefunction){ //could be given an object;
	var fette = fetter.prototype;
	var te = null, tv = null, tf = null, tb = true, td = false, tdf = null;
	if(_element !== null && typeof _element === 'object' && (!isHTMLElement(_element) && _element !== window && _element !== document)){
		te = ('_element' in _element && (isHTMLElement(_element._element) || _element._element === window || _element._element === document)) ? _element._element : null;
		tv = ('_event' in _element) ? _element._event : null;
		tf = ('_function' in _element && typeof _element._function === 'function') ? _element._function : null;
		tb = ('_bubble' in _element && _element._bubble === false) ? false : true;
		td = ('_done' in _element) ? fette.returnDoneNumber(_element._done) : 1;
		tdf = ('_done_function' in _element && typeof _element._done_function === 'function') ? _element._done_function : null;
	} else {
		te = (isHTMLElement(_element) || _element === window || _element === document) ? _element : null;
		tv = _event;
		tf = (_function !== null && typeof _function === 'function') ? _function : null;
		tb = (_bubble === false) ? false : true;
		td = fette.returnDoneNumber(_done); }
	if(te !== null && tv !== null && tf !== null){ //okay to try;
		tf = (new FetterMain()).findListener(tf, te, tv);
		tv = tv.split(" ");
		var added = 0;
		for(var i = 0; i<tv.length; i += 1){
			var getEvent = null;
			if(td === 2 || td === 3){
				if(tdf !== null){
					if(!tdf()){ getEvent = fette.eventChooser(te, tv[i]); } else { tf(); }
				} else if(tv[i] === 'load' && te === window){
					if(fette.windowOpened()){ tf(); } else {  getEvent = fette.eventChooser(te, tv[i]); }
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
	} else { return false; }}
fetter.prototype.eventChooser = function(_element, name){
	if('addEventListener' in _element){
		return name;
	} else {
		return ('attachEvent' in _element || ('on' + name) in _element) ? 'on' + name : null; }};
fetter.prototype.functionChooser = function(_element){ //requires try/catch; may return null;
	if(_element.addEventListener){
		return _element.addEventListener;
	} else if(_element.attachEvent){
		return _element.attachEvent;
	} else if(_element.onload){
		return (new FetterMain().findElement(_element).set);
	} else { return null; }};
fetter.prototype.documentReadyConfirmed = function(){ fetter.prototype._documentready = true; };
fetter.prototype.windowLoadConfirmed = function(){ fetter.prototype._windowloaded = true; };
fetter.prototype.returnDoneNumber = function(s){
	s = (s === 'both') ? 3 : s;
	s = (s === 'after') ? 2 : s;
	s = (s === 2 || s === 3) ? s : 1;
	return s; };
fetter.prototype.windowOpened = function(){
	var fette = fetter.prototype;
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
fetter.prototype.documentReady = function(){
	var fette = fetter.prototype, fun = null;
	if(fette._documentready){
		return fetter.prototype._documentready;
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
			fetter.prototype._documentready = true;
			return true;
		} else {
			fun = fette.functionChooser(document);
			if(fun !== null){ fun('DOMContentLoaded', fette.documentReadyConfirmed, true); }
			fun = fette.functionChooser(window);
			if(fun !== null){ fun('load', fette.documentReadyConfirmed, true); }
			return false; }}};
function FetterMain(){
	if(FetterMain.prototype.singletonInstance){ return FetterMain.prototype.singletonInstance; }
	FetterMain.prototype.singletonInstance = this;
	this.fetter_array = [];
	this.listener_array = []; }
FetterMain.prototype.findListenerIndex = function(_fun, _elem, _evt){
	var f = -1, i = 0, imax = 0;
	if(typeof _fun === 'function'){
		for(i=0, imax = this.listener_array.length; i < imax; i += 1){
			if(this.listener_array[i]._function === _fun){ 
				f = i; break; }}
		if(f === -1){ //verbose search
			var l = this.listener_array.length;
			for(i=0; i < l; i += 1){
				if(this.listener_array[i]._function.toString() === _fun.toString() && this.listener_array[i]._element === _elem && this.listener_array[i]._event === _evt){
					f = i; break; }}}
		return f;
	} else {
		(new IMDebugger()).pass("Fetter must be supplied with a function");
		return undefined; }};
FetterMain.prototype.removeListenerFromIndex = function(i){ if(i > -1 && i < this.listener_array.length){ this.listener_array.splice(i, 1); }};
FetterMain.prototype.findListener = function(_fun, _elem, _evt){
	var f = this.findListenerIndex(_fun, _elem, _evt);
	if(f === -1){
		this.listener_array.push(new FetterListener(_fun, _elem, _evt));
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
FetterMain.prototype.findElementNumber = function(_element){
	var f = -1;
	for(var i=0, imax = this.fetter_array.length; i<imax; i += 1){
		if(this.fetter_array[f].element === _element){ f = i; break; }}
	return f; };
FetterMain.prototype.findElement = function(_element){
	var f = this.findElementNumber(_element);
	if(f === -1){ 
		f = this.fetter_array.length;
		this.fetter_array.push(new FetterDefinition(_element)); }
	return this.fetter_array[f]; };
FetterMain.prototype.isElement = function(_element){
	var f = this.findElementNumber(_element);
	return (f !== -1) ? true : false; };

function FetterDefinition(){
	this.element = null;
	this.event_array = null; }
FetterDefinition.prototype.init = function(_element){ this.element = _element; this.event_array = []; };
FetterDefinition.prototype.returnEventObject = function(clarifiedEvent){
	var found = false;
	for(var i=0, imax = this.event_array.length; i < imax; i += 1){
		if(this.event_array[i]._event === clarifiedEvent){
			found = this.event_array[i];
			return this.event_array[i]; }}
	return found; };
FetterDefinition.prototype.sendToTheFront = function(_event, _function){
	var eveObj = this.returnEventObject(this.returnEvent(_event));
	if(eveObj.functionExists(_function)){
		var i = eveObj.findFunctionNumber(_function);
		var f = eveObj._function_arr.splice(i, 1);
		eveObj._function_arr.unshift(f); }};
FetterDefinition.prototype.sendToTheBack = function(_event, _function){
	var eveObj = this.returnEventObject(this.returnEvent(_event));
	if(eveObj.functionExists(_function)){
		var i = eveObj.findFunctionNumber(_function);
		var f = eveObj._function_arr.splice(i, 1);
		eveObj._function_arr.push(f);}};
FetterDefinition.prototype.set = function(_event, _function, _bubble){
	var eveObj = this.returnEventObject(this.returnEvent(_event));
	if(eveObj instanceof FetterEvent){
		if(!eveObj.functionExists(_function)){
			eveObj._function_arr.push(_function);
			return true;
		} else { return false; }}};
FetterDefinition.prototype.remove = function(_event, _function){
	var eveObj = this.returnEventObject(this.returnEvent(_event));
	if(eveObj instanceof FetterEvent){
		if(eveObj.functionExists(_function)){
			var splicePoint = eveObj.findFunctionNumber(_function);
			this.eveObj._function_arr.splice(splicePoint, 1);
			return true;
		} else { return false; }
	} else { return false; }};

function FetterListener(_fun, _elem, _evt){
	var m = this;
	this._function = (typeof _fun === 'function') ? _fun : function(){};
	this._element = (_elem !== null) ? _elem : -1;
	this._event = (_evt !== null) ? _evt : -1;
	this._listener = function(e){ return m._function(e); };
}
function FetterEvent(){
	this._element = null;
	this._event = null;
	this._bubble = true;
	this._function_arr = null; }
FetterEvent.prototype.process = function(e){ for(var i=0, imax = this._function_arr.length; i<imax; i += 1){ if(typeof this._function_arr[i] === 'function'){ this._function_arr[i](e); }}};
FetterEvent.prototype.functionExists = function(_fun){ var f = this.findFunctionNumber(_fun); return (f === -1) ? false : true; };
FetterEvent.prototype.findFunctionNumber = function(_fun){
		var foundNumber = -1;
		for(var i=0, imax = this._function_arr.length; i<imax; i += 1){
			if(this._function_arr[i] === _fun){
				foundNumber = i;
				break; }}
		return foundNumber; };
FetterEvent.prototype.findFunction = function(_fun){
		var foundNum = this.findFunctionNumber(_fun);
		return (foundNum !== -1) ? this._function_arr[foundNum] : false; };
