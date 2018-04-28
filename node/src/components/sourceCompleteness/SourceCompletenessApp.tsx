import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/sourceCompleteness/SourceCompletenessTablePanel.tsx';
import EditPanel from '@src/components/sourceCompleteness/SourceCompletenessEditPanel.tsx';

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
}

export default class SourceCompletenessApp extends React.Component<P,S> {
	public state: S;
	public props: P;

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			sourceCompletenesses: this.props.sourceCompletenesses
		};

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Data manipulation operations
		this.saveSourceCompleteness = this.saveSourceCompleteness.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = this.setPanel.bind(this);
		this.setLoader = this.setLoader.bind(this);
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
				return (<EditPanel
					sourceCompleteness={this.state.sourceCompleteness}
					onBack={() => this.setPanel(Panel.TABLE)}
					onSubmit={this.saveSourceCompleteness}
				/>);

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	/**
	 * Attempts to delete sourceCompleteness using the sectionProxy.
	 * @param sourceCompleteness to delete
	 */
	confirmDelete(sourceCompleteness: sc.SourceCompleteness) {
		var del = confirm('Delete sourceCompleteness ' + sourceCompleteness.sourceCompletenessID + '?');
		if (del) {
			this.setLoader('Deleting ' + sourceCompleteness.sourceCompletenessID + '...');

			proxyFactory.getSectionProxy().deleteSourceCompleteness(sourceCompleteness.sourceCompletenessID, (success, e?) => {
				if (e) {
					alert(e);
				}
				else if (success) {
					this.setState((s:S) => {
						var i = s.sourceCompletenesses.findIndex(c => sourceCompleteness.sourceCompletenessID === c.sourceCompletenessID);
						s.sourceCompletenesses[i].destroy();
						s.sourceCompletenesses.splice(i, 1);

						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
				else {
					this.setPanel(Panel.TABLE);
					alert('Failed to delete sourceCompleteness ' + sourceCompleteness.sourceCompletenessName + '.');
				}
			});
		}
	}

	/**
	 * Opens the edit panel for a SourceCompleteness.
	 * @param sourceCompleteness to edit
	 */
	openEdit(sourceCompleteness: sc.SourceCompleteness) {
		this.setState((s:S) => {
			s.sourceCompleteness = sourceCompleteness;
			this.setPanel(Panel.EDIT, null, s);
			return s;
		});
	}

	/**
	 * Utilizes the sectionProxy to create or update a SourceCompleteness.
	 * @param ctProps properties of the SourceCompleteness.
	 * @param isNew
	 */
	saveSourceCompleteness(ctProps:sc.Properties, isNew:boolean) {
		this.setLoader('Saving SourceCompleteness ' + ctProps.sourceCompletenessID + '...');

		if (isNew) {
			proxyFactory.getSectionProxy().createSourceCompleteness(ctProps, (sourceCompleteness, e?) => {
				if (e) {
					alert('Error creating new SourceCompleteness: ' + e);
				}

				else {
					this.setState((s:S) => {
						s.sourceCompletenesses.push(sourceCompleteness);
						this.setPanel(Panel.TABLE, null, s);
						return s;
					});
				}
			});
		}

		else {
			proxyFactory.getSectionProxy().updateSourceCompleteness(ctProps, (sourceCompleteness, e?) => {
				if (e) {
					alert('Error updating SourceCompleteness: ' + e);
				}

				else {
					this.setState((s:S) => {
						var i = s.sourceCompletenesses.findIndex(c => sourceCompleteness.sourceCompletenessID === c.sourceCompletenessID);
						s.sourceCompletenesses[i].destroy();
						s.sourceCompletenesses[i] = sourceCompleteness;

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
