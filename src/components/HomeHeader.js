import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faUser from '@fortawesome/fontawesome-free-solid/faUserCircle';
import signOut from '@fortawesome/fontawesome-free-solid/faSignOutAlt';
import cog from '@fortawesome/fontawesome-free-solid/faCog';
import { Dropdown, List, ListItem } from 'turtle-ui';
import Machinable from '../client';
import Logo from './Logo';

class Header extends Component {

	constructor(props) {
	    super(props);
		this.state = {
          body: ""
		}
	}

	componentDidMount = () => {		

	}

    logout = () => {
		const history = this.props.history;
		Machinable.user().logout(function(response){
			history.push('/login');
		}, function(response) {});
	}

	render() {
		return (
			<div className="home-header">
                <div className="grid grid-2" style={{"height": "100%"}}>
                    <div className="vertical-align">
                        <h3 className="vertical-align text-400 text-white">
                            <Logo color={"#FFF"}/>
                            <span className="margin-left">Machinable</span>
                        </h3>
                    </div>
                    <div className="align-right vertical-align">
                        <Dropdown 
                            type="text plain"
                            width={200}
                            buttonText={<FontAwesomeIcon className="text-white" style={{fontSize: "24px"}} icon={faUser} />}
                            buttonClasses={"no-click"}
                            buttonStyle={{"paddingRight": "0"}}
                            classes="col-1 align-items-right">
                            <div className="grid grid-1">
                                <List>
                                    <ListItem title="email@tld.io"/>
                                    <ListItem icon={cog} title="Settings"/>
                                    <ListItem icon={signOut} title="Logout" onClick={this.logout}/>
                                </List>
                            </div>
                        </Dropdown>
                        <input className="text-muted input" placeholder="search"/>
                    </div>
                </div>
            </div>		
		  );
	}
}


export default Header;