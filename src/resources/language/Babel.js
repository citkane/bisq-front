/*
 * Copyright 2018 Michael Jonker (http://openpoint.ie)
 *
 * This file is part of bisq-front.
 *
 * bisq-front is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at
 * your option) any later version.
 *
 * bisq-front is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with bisq-front. If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react';
import base from '../modules/base.js';

var Lang;
var fallback;
function Fallback(l){
	var fb = {};
	Object.keys(l).forEach((key)=>{
		if(key === 'list') return;
		Object.keys(Lang[key]).forEach((k)=>{
			fb[k.toLowerCase()] = l[key][k]
		})
	})
	return fb;
}



class Babel extends Component {
	constructor(props) {
		super(props);
		Lang = base.get('Lang');
		if(!fallback) fallback = Fallback(Lang);
		this.prepare(this.props.children,this.props.lang);
	}
	prepare = (children,l)=>{
		if(!window.ui_settings || !window.ui_settings.lang){
			console.error('The Babel translation method needs you to set window.ui_settings.lang = "<language code>" at the root of you app');
			this.out = '..[error:no window.ui_settings.lang]..';
			return;
		}
		const {cat} = this.props;
		this.l = l||window.ui_settings.lang;

		if(!children || typeof children!=='string'){
			console.error('Babel translator needs input and the input needs to be a string.');
			this.out = '..[error]..';
			return;
		}
		var string = children;
		this.out = string;
		if(Lang[cat] && Lang[cat][string] && Lang[cat][string][this.l]){
			this.out = Lang[cat][string][this.l]
		}else{
			var s = string.toLowerCase();
			if(fallback[s] && fallback[s][this.l]){
				this.out = fallback[s][this.l]
			}
		}
	}
	init = ()=>{
		this.out = this.out.toLowerCase();
		this.out = this.out.replace(/(?:^|\s)[a-z]/g, function (m) {
			return m.toUpperCase();
		});

	}
	shouldComponentUpdate(nextProps,nextState){
		var go = (
			this.props.children !== nextProps.children||
			(
				this.l!==window.ui_settings.lang||
				this.l!==nextProps.lang
			)
		);
		if(go) this.prepare(nextProps.children,nextProps.lang);
		return go;
	}
	render(){
		//console.error(this.props.children+' | '+this.out)
		const {caps} = this.props;
		if(caps && (caps==='init'||caps==='all'||caps==='lower')){
			caps === 'init'?
				this.init():
				caps === 'all'?
					this.out = this.out.toUpperCase():
					this.out = this.out.toLowerCase()
		}else{
			this.out = this.out.split('. ').map((s)=>{
				s = s.replace(s[0],s[0].toUpperCase())
				return s
			}).join('. ');
		}
		const {aria} = this.props
		if(aria) return (<span aria-label = {this.out}>{this.out}</span>)
		return this.out;
	}
}
export default Babel;
