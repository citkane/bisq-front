import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

const styles = theme => ({
	paper:{
		padding:theme.spacing.unit*3,
		marginBottom:theme.spacing.unit
	},
	formControl:{
		marginRight:theme.direction==='ltr'?theme.spacing.unit*3:'auto',
		marginLeft:theme.direction==='rtl'?theme.spacing.unit*3:'auto'
	}
})

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			theme:'light',
			lang:this.props.root('lang')
		}

	}

	handleChange = name => event => {
		var val = event.target.value
		this.setState({ [name]:val},()=>{
			this.props.root(name,val)
		});

	};
	render(){
		const {classes,colors,babel,root} = this.props;
		return (
			<div>
				<Paper className = {classes.paper}>
					<Typography type='title' gutterBottom >{babel('language',{category:'form'})}</Typography>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="language">{babel('language',{category:'form'})}</InputLabel>
							<Select
								native
								defaultValue={this.state.lang}
								onChange={this.handleChange('lang')}
								input={<Input id="language" />}
							>
								{root('langList').map((lang,i)=>{
									return <option key={i} value={lang.language} >{lang.dir === 'ltr'?lang.language+' - '+lang.name:lang.name+' - '+lang.language}</option>
								})}
							</Select>
						<FormHelperText>{babel('select language',{category:'form'})}</FormHelperText>
					</FormControl>
				</Paper>
				<Paper className = {classes.paper}>
					<Typography type='title' gutterBottom >{babel('Appearance',{category:'form'})}</Typography>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="theme">{babel('Theme',{category:'form'})}</InputLabel>
							<Select
								native
								value={root('theme')}
								onChange={this.handleChange('theme')}
								input={<Input id="theme" />}
							>
								<option value='light'>{babel('Light',{category:'form'})}</option>
								<option value='dark'>{babel('Dark',{category:'form'})}</option>
							</Select>
						<FormHelperText>{babel('Select the theme variation',{category:'form'})}</FormHelperText>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="color">{babel('Theme Color',{category:'form'})}</InputLabel>
							<Select
								native
								value={root('color')}
								onChange={this.handleChange('color')}
								input={<Input id="color" />}
							>
								{colors.map((color,i)=>{
									return <option key={i} value={color}>{babel(color,{category:'form'})}</option>
								})}
							</Select>
						<FormHelperText>{babel('Select the theme color',{category:'form'})}</FormHelperText>
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
