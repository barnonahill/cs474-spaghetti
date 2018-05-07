import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/provenance/ProvenanceTablePanel.tsx';
import EditPanel from '@src/components/provenance/ProvenanceEditPanel.tsx';
import StateUtils from '@src/components/StateUtilities.ts'

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

	editOpts: {
		isNew?: boolean
		val?: null | 'error'
		pvProps?: pv.Properties
	}
}

export default class ProvenanceApp extends React.Component<P,S> {
	public readonly state: S;
	public readonly props: P;

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			provenances: this.props.provenances,
			editOpts: {}
		};

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Render helper
		this.renderEditPanel = this.renderEditPanel.bind(this);

		// Data manipulation operations
		this.saveProvenance = this.saveProvenance.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
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
				return this.renderEditPanel();

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	renderEditPanel() {
		var edo = this.state.editOpts;
		var pvProps: pv.Properties;

		if (edo.pvProps) {
			pvProps = edo.pvProps;
		}
		else if (this.state.provenance) {
			pvProps = this.state.provenance.toProperties();
			pvProps.provenanceName = pvProps.provenanceName || '';
		}
		else {
			pvProps = null;
		}

		return (<EditPanel
			onBack={() => this.setPanel(Panel.TABLE, s => {
				s.editOpts = {};
				return s;
			})}
			onSubmit={this.saveProvenance}
			pvProps={pvProps}
			isNew={edo.isNew}
			val={edo.val}
		/>);
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
					alert('Error deleting provenance: ' + e);
					this.setPanel(Panel.TABLE);
				}
				else if (success) {
					this.setPanel(Panel.TABLE, s => {
						var i = s.provenances.findIndex(c => provenance.provenanceID === c.provenanceID);
						s.provenances[i].destroy();
						s.provenances.splice(i, 1);
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
		this.setPanel(Panel.EDIT, s => {
			s.provenance = provenance;
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

		var onError = (e:string) => {
			alert('Error saving provenance: ' + e);
			this.setPanel(Panel.EDIT, s => {
				s.editOpts = {
					isNew: isNew,
					pvProps: pvProps,
					val: (e.toLowerCase().indexOf(pvProps.provenanceID.toLowerCase()) === -1
						? null : 'error')
				};
				return s;
			});
		}

		if (isNew) {
			proxyFactory.getSectionProxy().createProvenance(pvProps, (provenance, e?) => {
				if (e) {
					onError(e);
				}

				else {
					this.setPanel(Panel.TABLE, s => {
						s.provenances.push(provenance);
						return s;
					});
				}
			});
		}

		else {
			proxyFactory.getSectionProxy().updateProvenance(pvProps, (provenance, e?) => {
				if (e) {
					onError(e);
				}

				else {
					this.setPanel(Panel.TABLE, s => {
						var i = s.provenances.findIndex(c => provenance.provenanceID === c.provenanceID);
						s.provenances[i].destroy();
						s.provenances[i] = provenance;
						return s;
					});
				}
			});
		}
	}
}
