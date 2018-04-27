import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/century/CenturyTablePanel.tsx';
import EditPanel from '@src/components/century/CenturyEditPanel.tsx';

import * as ct from '@src/models/century.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	TABLE=0,
	EDIT=1,
	LOADER=2
}

interface P {
	centuries: ct.Century[]
	onBack: () => void
	reloadCenturies: (callback: (centuries: ct.Century[]) => void) => void
}
interface S {
	century?: ct.Century
	centuries: ct.Century[]
	panel: Panel
	loadMessage?: string
}

export default class CenturyApp extends React.Component<P,S> {
	public state: S;
	public props: P;

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			centuries: this.props.centuries
		};

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// CRUD Operations
		this.reloadCenturies = this.reloadCenturies.bind(this);
		this.saveCentury = this.saveCentury.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = this.setPanel.bind(this);
		this.setLoader = this.setLoader.bind(this);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					centuries={this.props.centuries}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={this.reloadCenturies}
				/>);

			case Panel.EDIT:
				return (<EditPanel
					century={this.state.century}
					onBack={() => this.setPanel(Panel.TABLE)}
					onSubmit={this.saveCentury}
				/>);

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	/**
	 * Attempts to delete century using the sectionProxy.
	 * @param century to delete
	 */
	confirmDelete(century: ct.Century) {
		var del = confirm('Delete century ' + century.centuryName + '?');
		if (del) {
			this.setLoader('Deleting ' + century.centuryName + '...');

			proxyFactory.getSectionProxy().deleteCentury(century.centuryID, (success, e?) => {
				if (e) {
					alert(e);
				}
				else if (success) {
					this.setState((s:S) => {
						var i = s.centuries.findIndex(c => century.centuryID === c.centuryID);
						s.centuries[i].destroy();
						s.centuries.splice(i, 1);

						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
				else {
					this.setPanel(Panel.TABLE);
					alert('Failed to delete century ' + century.centuryName + '.');
				}
			});
		}
	}

	/**
	 * Tells Section App to reload the Centuries form Cantus.
	 * @param callback contains the new Centuries array.
	 */
	reloadCenturies() {
		this.setLoader('Loading Centuries...');

		this.props.reloadCenturies(centuries => {
			this.setState((s:S) => {
				s.century = null;
				s.centuries = centuries;
				this.setPanel(Panel.TABLE, null, s);
				return s;
			});
		});
	}

	/**
	 * Opens the edit panel for a Century.
	 * @param century to edit
	 */
	openEdit(century: ct.Century) {
		this.setState((s:S) => {
			s.century = century;
			this.setPanel(Panel.EDIT, null, s);
			return s;
		});
	}

	/**
	 * Utilizes the sectionProxy to create or update a Century.
	 * @param ctProps properties of the Century.
	 * @param isNew
	 */
	saveCentury(ctProps:ct.Properties, isNew:boolean) {
		this.setLoader('Saving ' + ctProps.centuryID + '...');

		if (isNew) {
			proxyFactory.getSectionProxy().createCentury(ctProps, (century, e?) => {
				if (e) {
					alert('Error creating new Century: ' + e);
				}

				else {
					this.setState((s:S) => {
						s.centuries.push(century);
						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
			});
		}

		else {
			proxyFactory.getSectionProxy().updateCentury(ctProps, (century, e?) => {
				if (e) {
					alert('Error updating Century: ' + e);
				}

				else {
					this.setState((s:S) => {
						var i = s.centuries.findIndex(c => century.centuryID === c.centuryID);
						s.centuries[i].destroy();
						s.centuries[i] = century;

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
