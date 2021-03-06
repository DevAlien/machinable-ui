import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'turtle-ui';
import Loader from '../../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faMobile from '@fortawesome/fontawesome-free-solid/faMobileAlt';
import faComputer from '@fortawesome/fontawesome-free-solid/faDesktop';
import Machinable from '../../client';
import Empty from '../../images/sessions.svg';
import moment from 'moment';

class Sessions extends Component {

	constructor(props) {
        super(props);
        this.state = {
			sessions: [],
			slug: props.slug,
			loading: true,
		}
	}

	sessionsError = (response) => {
		console.log(response);
		this.setState({loading: false});
	}

	handleSessions = (response) => {
		this.setState({sessions: response.data.items, loading: false});
	}

	getSessions = () => {
		Machinable.sessions(this.state.slug).list(this.handleSessions, this.sessionsError);
	}

	deleteSession = (id) => {
		Machinable.sessions(this.state.slug).delete(id, this.getSessions, this.sessionsError);
	}

	componentDidMount = () => {		
		this.getSessions();
	}

	emptyState = () => {
        return (
            <div className="grid grid-8">
                <div className="col-2-8 flex-col">
                    <h2 className="text-center">No Active Sessions</h2>
					<img src={Empty} alt="" className="empty-state-sm"/>
					<h3 className="text-center">Sessions will be shown here once a project user logs in to your project.</h3>
                </div>
            </div>
        );
    }

	render() {

		var currentSession = -1;
		var sessions = this.state.sessions.reverse();
		var values = sessions.map(function(session){
			var isCurrent = currentSession === session.id ? <span style={{"float":"right"}} className="background-information text-400 tag">Active Session</span> : <Button style={{"float":"right"}} classes="btn-small" onClick={() => this.deleteSession(session.id)}>Revoke</Button>;
			var icon = session.mobile ? faMobile : faComputer;
			return [
				<div>
					<FontAwesomeIcon className="fa-lg fa-fw text-muted" icon={icon} style={{"marginRight": "15px", "float": "left"}} />
					<div className="text-400">
						{session.location}&nbsp;{session.ip}<br/>
						<span className="text-muted text-small">last accessed {moment(session.last_accessed).fromNow()}</span>
					</div>
				</div>, 
				<div className="text-small">
					{session.user_id}
				</div>,
				<div>
					{isCurrent}
				</div>
			]
		}, this);

		var rndr = values.length > 0 ? <Table headers={["Client", "User ID", ""]} classes="m-table" values={values} /> : this.emptyState();

		return (
			<div className="grid grid-1">
				<Loader loading={this.state.loading} />
				{!this.state.loading && rndr}
			</div>
		  );
	}
}

// redux
function mapStateToProps(state) {
	return {
		slug: state.project_slug
	};
}
  
export default connect(mapStateToProps)(Sessions);
