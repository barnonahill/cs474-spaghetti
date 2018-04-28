import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/cursus/CursusTablePanel.tsx';
import EditPanel from '@src/components/cursus/CursusEditPanel.tsx';

import * as cs from '@src/models/cursus.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	TABLE=0,
	EDIT=1,
	LOADER=2
}

interface P {
	cursuses: cs.Cursus[]
	onBack: () => void
	reloadCursuses: () => void
}
interface S {
	cursus?: cs.Cursus
	cursuses: cs.Cursus[]
	panel: Panel
	loadMessage?: string
}

export default class CursusApp extends React.Component<P,S> {
	public state: S;
	public props: P;

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			cursuses: this.props.cursuses
		};

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Data manipulation operations
		this.saveCursus = this.saveCursus.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = this.setPanel.bind(this);
		this.setLoader = this.setLoader.bind(this);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					cursuses={this.props.cursuses}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={() => {
						this.setLoader('Loading Cursuses...');
						this.props.reloadCursuses();
					}}
				/>);

			case Panel.EDIT:
				return (<EditPanel
					cursus={this.state.cursus}
					onBack={() => this.setPanel(Panel.TABLE)}
					onSubmit={this.saveCursus}
				/>);

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	/**
	 * Attempts to delete cursus using the sectionProxy.
	 * @param cursus to delete
	 */
	confirmDelete(cursus: cs.Cursus) {
		var del = confirm('Delete cursus ' + cursus.cursusID + '?');
		if (del) {
			this.setLoader('Deleting ' + cursus.cursusID + '...');

			proxyFactory.getSectionProxy().deleteCursus(cursus.cursusID, (success, e?) => {
				if (e) {
					alert(e);
				}
				else if (success) {
					this.setState((s:S) => {
						var i = s.cursuses.findIndex(c => cursus.cursusID === c.cursusID);
						s.cursuses[i].destroy();
						s.cursuses.splice(i, 1);

						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
				else {
					this.setPanel(Panel.TABLE);
					alert('Failed to delete cursus ' + cursus.cursusName + '.');
				}
			});
		}
	}

	/**
	 * Opens the edit panel for a Cursus.
	 * @param cursus to edit
	 */
	openEdit(cursus: cs.Cursus) {
		this.setState((s:S) => {
			s.cursus = cursus;
			this.setPanel(Panel.EDIT, null, s);
			return s;
		});
	}

	/**
	 * Utilizes the sectionProxy to create or update a Cursus.
	 * @param csProps properties of the Cursus.
	 * @param isNew
	 */
	saveCursus(csProps:cs.Properties, isNew:boolean) {
		this.setLoader('Saving Cursus ' + csProps.cursusID + '...');

		if (isNew) {
			proxyFactory.getSectionProxy().createCursus(csProps, (cursus, e?) => {
				if (e) {
					alert('Error creating new Cursus: ' + e);
				}

				else {
					this.setState((s:S) => {
						s.cursuses.push(cursus);
						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
			});
		}

		else {
			proxyFactory.getSectionProxy().updateCursus(csProps, (cursus, e?) => {
				if (e) {
					alert('Error updating Cursus: ' + e);
				}

				else {
					this.setState((s:S) => {
						var i = s.cursuses.findIndex(c => cursus.cursusID === c.cursusID);
						s.cursuses[i].destroy();
						s.cursuses[i] = cursus;

						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
			});
		}
	}

	/**
	 * Changes the current panel of the App.
	 */
	setPanel(p:Panel, callback?: (s:S) => S, s?:S) {
		if (s) {
			s.panel = p;
		}
		else {
			this.setState((s:S) => {
				s.panel = p;
				if (callback) return callback(s);
				else return s;
			});
		}
	}

	/**
	 * Sets the panel to LOADER and loadMessage to msg.
	 * @param msg load message
	 * @param callback Callback that has set state for loader, but not returned it.
	 * @param s State object to set, but not return.
	 */
	setLoader(msg:string, callback?: (s:S) => S, s?:S) {
		if (s) {
			this.setPanel(Panel.LOADER);
			s.loadMessage = msg;
		}
		else {
			this.setState((s:S) => {
				this.setPanel(Panel.LOADER, null, s);
				s.loadMessage = msg;
				if (callback) return callback(s);
				return s;
			});
		}
	}
}
