import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/cursus/CursusTablePanel.tsx';
import {
	default as EditPanel,
	S as EditState
} from '@src/components/cursus/CursusEditPanel.tsx';

import StateUtils from '@src/components/StateUtilities.ts'

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
	editState?: EditState
}

export default class CursusApp extends React.Component<P,S> {
	public readonly state: S
	public readonly props: P

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			cursuses: this.props.cursuses,
		};

		// Render helpers
		this.renderTablePanel = this.renderTablePanel.bind(this);
		this.renderEditPanel = this.renderEditPanel.bind(this);

		// Data manipulators
		this.saveCursus = this.saveCursus.bind(this);
		this.deleteCursus = this.deleteCursus.bind(this);

		// State helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return this.renderTablePanel();

			case Panel.EDIT:
				return this.renderEditPanel();

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	renderTablePanel() {
		return (<TablePanel
			cursuses={this.props.cursuses}
			onBack={this.props.onBack}
			onRefresh={() => {
				this.setLoader('Loading Cursuses...');
				this.props.reloadCursuses();
			}}

			onEdit={cursus => {
				this.setPanel(Panel.EDIT, s => {
					s.cursus = cursus;
					return s;
				});
			}}

			onDelete={cursus => {
				var del = confirm('Delete Cursus ' + cursus.cursusID + '?');
				if (del) {
					this.deleteCursus(cursus);
				}
			}}
		/>);
	}

	renderEditPanel() {
		var es: Partial<EditState> = this.state.editState || {};
		if (!es.csProps && this.state.cursus) {
			es.csProps = this.state.cursus.toProperties();
		}

		return (<EditPanel
			onBack={() => this.setPanel(Panel.TABLE, s => {
				delete s.editState;
				s.cursus = null;
				return s;
			})}
			onSubmit={this.saveCursus}
			editState={es}
		/>);
	}

	/**
	 * Attempts to delete cursus using the sectionProxy.
	 * @param cursus to delete
	 */
	deleteCursus(cursus: cs.Cursus) {
		this.setLoader('Deleting Cursus ' + cursus.cursusID + '...');
		proxyFactory.getSectionProxy().deleteCursus(cursus.cursusID, (success, e?) => {
			if (e) {
				alert('Error deleting Cursus: ' + e);
				this.setPanel(Panel.TABLE);
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

	/**
	 * Utilizes the sectionProxy to create or update a Cursus.
	 */
	saveCursus(editState: EditState) {
		this.setLoader('Saving Cursus ' + editState.csProps.cursusID + '...');

		var onError = (e:string) => {
			alert('Error saving Cursus: ' + e);
			this.setPanel(Panel.EDIT, s => {
				e = e.toLowerCase();
				for (let k in editState.csProps) {
					if (editState.csProps[k] && (e.indexOf(editState.csProps[k].toLowerCase()) !== -1 ||
						e.indexOf(k.toLowerCase()) !== -1))
					{
						editState.val[k] = 'error';
					}
				}
				s.editState = editState;
				return s;
			});
		};

		const proxy = proxyFactory.getSectionProxy();
		if (editState.isNew) {
			proxy.createCursus(editState.csProps, (cursus, e?) => {
				if (e) {
					onError(e);
				}
				else {
					this.setPanel(Panel.TABLE, s => {
						s.cursuses.push(cursus);
						delete s.editState;
						return s;
					});
				}
			});
		}

		else {
			proxy.updateCursus(editState.csProps, (cursus, e?) => {
				if (e) {
					onError(e);
				}
				else {
					this.setPanel(Panel.TABLE, s => {
						var i = s.cursuses.findIndex(c => cursus.cursusID === c.cursusID);
						s.cursuses[i].destroy();
						s.cursuses[i] = cursus;
						delete s.editState;
						return s;
					});
				}
			});
		}
	}
}
