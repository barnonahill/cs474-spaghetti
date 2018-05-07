import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/notation/NotationTablePanel.tsx';
import EditPanel from '@src/components/notation/NotationEditPanel.tsx';
import StateUtils from '@src/components/StateUtilities.ts'

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

	editOpts: {
		isNew?: boolean
		ntProps?: nt.Properties
		val?: null | 'error'
	}
}

export default class NotationApp extends React.Component<P,S> {
	public readonly state: S;
	public readonly props: P;

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			notations: this.props.notations,
			editOpts: {}
		};

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Render helper
		this.renderEditPanel = this.renderEditPanel.bind(this);

		// Data manipulation operations
		this.saveNotation = this.saveNotation.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
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
				return this.renderEditPanel();

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	renderEditPanel() {
		var edo = this.state.editOpts;
		var ntProps: nt.Properties;
		if (edo.ntProps) {
			ntProps = edo.ntProps;
		}
		else if (this.state.notation) {
			ntProps = this.state.notation.toProperties();
			ntProps.notationName = ntProps.notationName || '';
		}
		else {
			ntProps = null;
		}

		return <EditPanel
			onBack={() => this.setPanel(Panel.TABLE, s => {
				s.editOpts = {};
				return s;
			})}
			onSubmit={this.saveNotation}
			ntProps={ntProps}
			isNew={edo.isNew}
			val={edo.val}
		/>
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
					alert('Error deleting notation: ' + e);
					this.setPanel(Panel.TABLE);
				}
				else if (success) {
					this.setPanel(Panel.TABLE, s => {
						var i = s.notations.findIndex(c => notation.notationID === c.notationID);
						s.notations[i].destroy();
						s.notations.splice(i, 1);
						return s;
					})
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
		this.setPanel(Panel.EDIT, s => {
			s.notation = notation;
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

		var onError = (e:string) => {
			alert('Error saving Notation: ' + e);
			this.setPanel(Panel.EDIT, s => {
				s.editOpts = {
					isNew: isNew,
					ntProps: ntProps,
					val: (e.toLowerCase().indexOf(ntProps.notationID.toLowerCase()) === -1
						? null : 'error')
				};
				return s;
			});
		};

		if (isNew) {
			proxyFactory.getSectionProxy().createNotation(ntProps, (notation, e?) => {
				if (e) {
					onError(e);
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
					onError(e);
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
}
