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
		padding:theme.spacing.unit*3
	},
	formControl:{
		marginRight:theme.spacing.unit*3
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
		const {classes,colors,root} = this.props;
		return (
			<div>
				<Paper className = {classes.paper}>
					<Typography type='title' gutterBottom >Language</Typography>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="language">Language</InputLabel>
							<Select
								native
								defaultValue={this.state.lang}
								onChange={this.handleChange('lang')}
								input={<Input id="language" />}
							>
								{root('langList').map((lang,i)=>{
									return <option key={i} value={lang} >{lang}</option>
								})}
							</Select>
						<FormHelperText>Select your language</FormHelperText>
					</FormControl>
				</Paper>
				<Paper className = {classes.paper}>
					<Typography type='title' gutterBottom >Appearance</Typography>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="theme">Theme</InputLabel>
							<Select
								native
								value={root('theme')}
								onChange={this.handleChange('theme')}
								input={<Input id="theme" />}
							>
								<option value='light'>Light</option>
								<option value='dark'>Dark</option>
							</Select>
						<FormHelperText>Select the theme variation</FormHelperText>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="color">Theme Color</InputLabel>
							<Select
								native
								value={root('color')}
								onChange={this.handleChange('color')}
								input={<Input id="color" />}
							>
								{colors.map((color,i)=>{
									return <option key={i} value={color}>{color}</option>
								})}
							</Select>
						<FormHelperText>Select the theme color</FormHelperText>
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
