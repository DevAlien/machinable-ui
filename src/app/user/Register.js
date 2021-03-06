import React, { Component } from 'react';
import { Button, Card, Input } from 'turtle-ui';
import Machinable from '../../client';
import { ReCaptcha } from 'react-recaptcha-google';
import Statics from '../../Statics';

const UserAPI = Machinable.user();

class Register extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			password_confirm: "",
			captchaResponse: "",
			message: "",
			errors: [],
			isOpen: false,
			loading: false,
			recap: null
		}
	}

	handleResponse = (response) => {
		this.setState({ message: response.data.message, loading: false, email: "" });
	}

	handleError = (err) => {
		console.log(err);
		var error = err.data.error;
		if (error === '') {
			if (err.status === 404) {
				error = 'Invalid email or password';
			}
			else {
				error = 'Issue registering, please try again.'
			}
		}
		this.captcha.reset();
		this.setState({
			loading: false,
			errors: [error]
		});
	}

	onChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	onSubmit = (event) => {
		console.log(event);
		event.preventDefault();
		var errors = [];

		if (!this.state.email) {
			errors.push('Invalid email');
		}

		if (!this.state.password) {
			errors.push('Invalid password');
		}

		if (this.state.password !== this.state.password_confirm) {
			errors.push('Passwords must match');
		}

		if (this.state.captchaResponse === "") {
			errors.push("reCaptcha must be checked")
		}

		this.setState({
			errors: errors
		});

		var arr = errors.map(function (k) { return k });

		if (arr.join('').length === 0) {
			var pw = this.state.password;
			var un = this.state.email;
			this.setState({
				loading: true,
				password: '',
				password_confirm: ''
			});
			UserAPI.register(un, pw, this.state.captchaResponse).then(this.handleResponse).catch(this.handleError);
		} else {
			this.captcha.reset();
		}
	}

	Login = () => {
		this.props.history.push('/login');
	}

	verifyCallback = (response) => {
		this.setState({ captchaResponse: response });
	}

	componentDidMount = () => {
		console.log(Statics.RECAPTCHA_SITE_KEY);
		// load recaptcha
		const t = this;
		setTimeout(function () {
			t.setState({
				recap: <ReCaptcha
					ref={(el) => { t.captcha = el; }}
					className="g-recaptcha"
					sitekey={Statics.RECAPTCHA_SITE_KEY}
					verifyCallback={t.verifyCallback}
				/>
			})
		}, 100);
	}

	render() {
		return (
			<div className="grid grid-10">
				<div className="login-card col-4-8">
					<form onSubmit={this.onSubmit}>
						<Card
							classes="footer-plain"
							footer={
								<div className="grid grid-2">
									<div className="col-2 col-right">
										<Button classes="plain text" onClick={this.Login}>Login</Button>
										<Button classes="accent margin-left" type="submit" loading={this.state.loading}>Register</Button>
									</div>
								</div>
							}>
							<br />
							<h2 className="text-center">Register</h2>

							{this.state.errors.length > 0 &&
								<div className="text-danger text-center margin-bottom-more">
									{this.state.errors.map(function (error) {
										return (<div id={error} className="text-400 padding-bottom">{error}</div>)
									})}
								</div>
							}

							{this.state.message !== "" &&
								<div className="text-success text-center margin-bottom-more">
									<div id={"success-message"} className="text-400 padding-bottom">{this.state.message}</div>
								</div>
							}

							<div>
								<Input placeholder="email" label="Email" type="email" name="email" value={this.state.email} onChange={this.onChange} />
							</div>

							<div className="margin-top-more">
								<Input placeholder="password" type="password" label="Password" name="password" value={this.state.password} onChange={this.onChange} />
							</div>

							<div className="margin-top-more">
								<Input placeholder="confirm password" type="password" label="Confirm Password" name="password_confirm" value={this.state.password_confirm} onChange={this.onChange} />
							</div>

							<br />
							{this.state.recap}
						</Card>
					</form>
				</div>
			</div>
		);
	}
}

export default Register;