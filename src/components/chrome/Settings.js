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
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TranslateIcon from 'material-ui-icons/Translate';
import Avatar from 'material-ui/Avatar';
import Babel from '../../resources/language/Babel.js';
import base from '../../resources/modules/base.js';

const styles = theme => ({
	paper:{
		padding:theme.spacing.unit*3,
		marginBottom:theme.spacing.unit
	},
	formControl:{
		marginRight:theme.direction==='ltr'?theme.spacing.unit*3:'auto',
		marginLeft:theme.direction==='rtl'?theme.spacing.unit*3:'auto'
	},
	row:{
		display:'flex',
		alignItems:'center',
		marginBottom:theme.spacing.unit*2
	},
	avatar:{
		marginRight:theme.direction === 'ltr'?theme.spacing.unit:0,
		marginLeft:theme.direction === 'rtl'?theme.spacing.unit:0
	}
})

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			theme:'light',
			lang:base.get('lang')
		}

	}

	handleChange = name => event => {
		var val = event.target.value
		if(name === 'lang') window.ui_settings.lang = val;
		this.setState({ [name]:val},()=>{
			base.set(name,val,true)
		});

	};
	render(){
		const {classes,colors} = this.props;
		return (
			<div>
				<Paper className = {classes.paper}>
					<div className = {classes.row}>
						<Avatar className={classes.avatar}>
        					<TranslateIcon />
      					</Avatar>
						<Typography type='title' >
							<Babel cat = 'form'>language</Babel>
						</Typography>
	  				</div>

					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="language">
							<Babel cat = 'form'>language</Babel>
						</InputLabel>
							<Select
								native
								defaultValue={this.state.lang}
								onChange={this.handleChange('lang')}
								input={<Input id="language" />}
							>
								{base.get('langList').map((lang,i)=>{
									return <option key={i} value={lang.language} >
										{lang.dir === 'ltr'?lang.language+' - '+lang.name:lang.name+' - '+lang.language}
									</option>
								})}
							</Select>
						<FormHelperText>
							<Babel cat = 'form'>select language</Babel>
						</FormHelperText>
					</FormControl>
				</Paper>
				<Paper className = {classes.paper}>
					<Typography type='title' gutterBottom className = {classes.row}>
						<Babel cat = 'form'>Appearance</Babel>
					</Typography>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="theme">
							<Babel cat = 'form'>Theme</Babel>
						</InputLabel>
							<Select
								native
								value={base.get('theme')}
								onChange={this.handleChange('theme')}
								input={<Input id="theme" />}
							>
								<option value='light'>
									<Babel cat = 'form'>Light</Babel>
								</option>
								<option value='dark'>
									<Babel cat = 'form'>Dark</Babel>
								</option>
							</Select>
						<FormHelperText>
							<Babel cat = 'form'>Select the theme variation</Babel>
						</FormHelperText>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="color">
							<Babel cat = 'form'>Theme Color</Babel>
						</InputLabel>
							<Select
								native
								value={base.get('color')}
								onChange={this.handleChange('color')}
								input={<Input id="color" />}
							>
								{colors.map((color,i)=>{
									return <option key={i} value={color}>
										<Babel cat = 'form'>{color}</Babel>
									</option>
								})}
							</Select>
						<FormHelperText>
							<Babel cat = 'form'>Select the theme color</Babel>
						</FormHelperText>
					</FormControl>
				</Paper>
			</div>
		)
	}
}

Settings.propTypes = {
	classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Settings);
