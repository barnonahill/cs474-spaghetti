import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/sourceCompleteness/SourceCompletenessTablePanel.tsx';
import EditPanel from '@src/components/sourceCompleteness/SourceCompletenessEditPanel.tsx';

import StateUtils from '@src/components/StateUtilities.ts'

import * as sc from '@src/models/sourceCompleteness.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	TABLE=0,
	EDIT=1,
	LOADER=2
}

interface P {
	sourceCompletenesses: sc.SourceCompleteness[]
	onBack: () => void
	reloadSourceCompletenesses: () => void
}
interface S {
	sourceCompleteness?: sc.SourceCompleteness
	sourceCompletenesses: sc.SourceCompleteness[]
	panel: Panel
	loadMessage?: string

	editOpts: {
		scProps?: sc.Properties
		isNew?: boolean
		val?: null | 'error'
	}
}

export default class SourceCompletenessApp extends React.Component<P,S> {
	public readonly state: S
	public readonly props: P

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			sourceCompletenesses: this.props.sourceCompletenesses,
			editOpts: {}
		};

		// Render helper
		this.renderEditPanel = this.renderEditPanel.bind(this);

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Data manipulation operations
		this.saveSourceCompleteness = this.saveSourceCompleteness.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					sourceCompletenesses={this.props.sourceCompletenesses}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={() => {
						this.setLoader('Loading SourceCompletenesses...');
						this.props.reloadSourceCompletenesses();
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
		var sc = this.state.sourceCompleteness;
		var scProps: sc.Properties;

		if (edo.scProps) {
			scProps = edo.scProps;
		}
		else if (sc) {
			scProps = sc.toProperties();
		}
		else {
			scProps = null;
		}

		return (<EditPanel
			onBack={() => this.setPanel(Panel.TABLE, s => {
				s.editOpts = {};
				return s;
			})}
			onSubmit={this.saveSourceCompleteness}
			scProps={scProps}
			isNew={edo.isNew}
			val={edo.val}
		/>);

	}

	/**
	 * Attempts to delete sourceCompleteness using the sectionProxy.
	 * @param sourceCompleteness to delete
	 */
	confirmDelete(sourceCompleteness: sc.SourceCompleteness) {
		var del = confirm('Delete sourceCompleteness ' + sourceCompleteness.sourceCompletenessID + '?');
		if (del) {
			this.setLoader('Deleting ' + sourceCompleteness.sourceCompletenessID + '...');

			proxyFactory.getSectionProxy().deleteSourceCompleteness(sourceCompleteness.sourceCompletenessID,
				(success, e?) =>
			{
				if (e) {
					alert('Error deleting Source Completeness: ' + e);
					this.setPanel(Panel.TABLE);
				}

				else if (success) {
					this.setPanel(Panel.TABLE, s => {
						var i = s.sourceCompletenesses.findIndex(c => sourceCompleteness.sourceCompletenessID === c.sourceCompletenessID);
						s.sourceCompletenesses[i].destroy();
						s.sourceCompletenesses.splice(i, 1);
						return s;
					});
				}

				else {
					alert('Failed to delete Source Completeness ' + sourceCompleteness.sourceCompletenessID + '.');
					this.setPanel(Panel.TABLE);
				}
			});
		}
	}

	/**
	 * Opens the edit panel for a SourceCompleteness.
	 * @param sourceCompleteness to edit, or null for new.
	 */
	openEdit(sourceCompleteness: sc.SourceCompleteness) {
		this.setPanel(Panel.EDIT, s => {
			s.sourceCompleteness = sourceCompleteness;
			return s;
		});
	}

	/**
	 * Utilizes the sectionProxy to create or update a Source Completeness.
	 * @param scProps properties of the SourceCompleteness.
	 * @param isNew
	 */
	saveSourceCompleteness(scProps:sc.Properties, isNew:boolean) {
		this.setLoader('Saving SourceCompleteness ' + scProps.sourceCompletenessID + '...');

		var onError = (e:string) => {
			alert('Error saving Source Completeness: ' + e);
			var editOpts: S['editOpts'] = {
				isNew: isNew,
				scProps: scProps,
				val: (e.toLowerCase().indexOf(scProps.sourceCompletenessID.toLowerCase()) === -1
					? null : 'error')
			};

			this.setPanel(Panel.EDIT, s => {
				s.editOpts = editOpts;
				return s;
			});
		};

		if (isNew) {
			proxyFactory.getSectionProxy().createSourceCompleteness(scProps, (sourceCompleteness, e?) => {
				if (e) {
					onError(e);
				}

				else {
					this.setPanel(Panel.TABLE, s => {
						s.sourceCompletenesses.push(sourceCompleteness);
						s.editOpts = {};
						return s;
					});
				}
			});
		}

		else {
			proxyFactory.getSectionProxy().updateSourceCompleteness(scProps, (sourceCompleteness, e?) => {
				if (e) {
					onError(e);
				}

				else {
					this.setPanel(Panel.TABLE, s => {
						var i = s.sourceCompletenesses.findIndex(c => sourceCompleteness.sourceCompletenessID === c.sourceCompletenessID);
						s.sourceCompletenesses[i].destroy();
						s.sourceCompletenesses[i] = sourceCompleteness;

						s.editOpts = {};
						return s;
					});
				}
			});
		}
	}
}
