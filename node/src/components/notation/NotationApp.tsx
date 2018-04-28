import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/notation/NotationTablePanel.tsx';
import EditPanel from '@src/components/notation/NotationEditPanel.tsx';

import * as nt from '@src/models/notation.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	TABLE=0,
	EDIT=1,
	LOADER=2
}

interface P {
	notations: nt.Notation[]
	onBack: () => void
	reloadNotations: () => void
}
interface S {
	notation?: nt.Notation
	notations: nt.Notation[]
	panel: Panel
	loadMessage?: string
}

export default class NotationApp extends React.Component<P,S> {
	public state: S;
	public props: P;

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			notations: this.props.notations
		};

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Data manipulation operations
		this.saveNotation = this.saveNotation.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = this.setPanel.bind(this);
		this.setLoader = this.setLoader.bind(this);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					notations={this.props.notations}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={() => {
						this.setLoader('Loading Notations...');
						this.props.reloadNotations();
					}}
				/>);

			case Panel.EDIT:
				return (<EditPanel
					notation={this.state.notation}
					onBack={() => this.setPanel(Panel.TABLE)}
					onSubmit={this.saveNotation}
				/>);

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	/**
	 * Attempts to delete notation using the sectionProxy.
	 * @param notation to delete
	 */
	confirmDelete(notation: nt.Notation) {
		var del = confirm('Delete notation ' + notation.notationID + '?');
		if (del) {
			this.setLoader('Deleting ' + notation.notationID + '...');

			proxyFactory.getSectionProxy().deleteNotation(notation.notationID, (success, e?) => {
				if (e) {
					alert(e);
				}
				else if (success) {
					this.setState((s:S) => {
						var i = s.notations.findIndex(c => notation.notationID === c.notationID);
						s.notations[i].destroy();
						s.notations.splice(i, 1);

						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
				else {
					this.setPanel(Panel.TABLE);
					alert('Failed to delete notation ' + notation.notationName + '.');
				}
			});
		}
	}

	/**
	 * Opens the edit panel for a Notation.
	 * @param notation to edit
	 */
	openEdit(notation: nt.Notation) {
		this.setState((s:S) => {
			s.notation = notation;
			this.setPanel(Panel.EDIT, null, s);
			return s;
		});
	}

	/**
	 * Utilizes the sectionProxy to create or update a Notation.
	 * @param ntProps properties of the Notation.
	 * @param isNew
	 */
	saveNotation(ntProps:nt.Properties, isNew:boolean) {
		this.setLoader('Saving Notation ' + ntProps.notationID + '...');

		if (isNew) {
			proxyFactory.getSectionProxy().createNotation(ntProps, (notation, e?) => {
				if (e) {
					alert('Error creating new Notation: ' + e);
				}

				else {
					this.setState((s:S) => {
						s.notations.push(notation);
						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
			});
		}

		else {
			proxyFactory.getSectionProxy().updateNotation(ntProps, (notation, e?) => {
				if (e) {
					alert('Error updating Notation: ' + e);
				}

				else {
					this.setState((s:S) => {
						var i = s.notations.findIndex(c => notation.notationID === c.notationID);
						s.notations[i].destroy();
						s.notations[i] = notation;

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
