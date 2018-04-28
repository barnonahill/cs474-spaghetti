import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/provenance/ProvenanceTablePanel.tsx';
import EditPanel from '@src/components/provenance/ProvenanceEditPanel.tsx';

import * as pv from '@src/models/provenance.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	TABLE=0,
	EDIT=1,
	LOADER=2
}

interface P {
	provenances: pv.Provenance[]
	onBack: () => void
	reloadProvenances: () => void
}
interface S {
	provenance?: pv.Provenance
	provenances: pv.Provenance[]
	panel: Panel
	loadMessage?: string
}

export default class ProvenanceApp extends React.Component<P,S> {
	public state: S;
	public props: P;

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			provenances: this.props.provenances
		};

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Data manipulation operations
		this.saveProvenance = this.saveProvenance.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = this.setPanel.bind(this);
		this.setLoader = this.setLoader.bind(this);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					provenances={this.props.provenances}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={() => {
						this.setLoader('Loading Provenances...');
						this.props.reloadProvenances();
					}}
				/>);

			case Panel.EDIT:
				return (<EditPanel
					provenance={this.state.provenance}
					onBack={() => this.setPanel(Panel.TABLE)}
					onSubmit={this.saveProvenance}
				/>);

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	/**
	 * Attempts to delete provenance using the sectionProxy.
	 * @param provenance to delete
	 */
	confirmDelete(provenance: pv.Provenance) {
		var del = confirm('Delete provenance ' + provenance.provenanceID + '?');
		if (del) {
			this.setLoader('Deleting ' + provenance.provenanceID + '...');

			proxyFactory.getSectionProxy().deleteProvenance(provenance.provenanceID, (success, e?) => {
				if (e) {
					alert(e);
				}
				else if (success) {
					this.setState((s:S) => {
						var i = s.provenances.findIndex(c => provenance.provenanceID === c.provenanceID);
						s.provenances[i].destroy();
						s.provenances.splice(i, 1);

						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
				else {
					this.setPanel(Panel.TABLE);
					alert('Failed to delete provenance ' + provenance.provenanceName + '.');
				}
			});
		}
	}

	/**
	 * Opens the edit panel for a Provenance.
	 * @param provenance to edit
	 */
	openEdit(provenance: pv.Provenance) {
		this.setState((s:S) => {
			s.provenance = provenance;
			this.setPanel(Panel.EDIT, null, s);
			return s;
		});
	}

	/**
	 * Utilizes the sectionProxy to create or update a Provenance.
	 * @param pvProps properties of the Provenance.
	 * @param isNew
	 */
	saveProvenance(pvProps:pv.Properties, isNew:boolean) {
		this.setLoader('Saving Provenance ' + pvProps.provenanceID + '...');

		if (isNew) {
			proxyFactory.getSectionProxy().createProvenance(pvProps, (provenance, e?) => {
				if (e) {
					alert('Error creating new Provenance: ' + e);
				}

				else {
					this.setState((s:S) => {
						s.provenances.push(provenance);
						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
			});
		}

		else {
			proxyFactory.getSectionProxy().updateProvenance(pvProps, (provenance, e?) => {
				if (e) {
					alert('Error updating Provenance: ' + e);
				}

				else {
					this.setState((s:S) => {
						var i = s.provenances.findIndex(c => provenance.provenanceID === c.provenanceID);
						s.provenances[i].destroy();
						s.provenances[i] = provenance;

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
