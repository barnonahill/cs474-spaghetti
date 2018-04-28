import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/msType/MsTypeTablePanel.tsx';
import EditPanel from '@src/components/msType/MsTypeEditPanel.tsx';

import StateUtils from '@src/components/StateUtilities.ts'

import * as mst from '@src/models/msType.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	TABLE=0,
	EDIT=1,
	LOADER=2
}

interface P {
	msTypes: mst.MsType[]
	onBack: () => void
	reloadMsTypes: () => void
}
interface S {
	msTypes: mst.MsType[]
	panel: Panel
	loadMessage?: string
	msType?: mst.MsType

	editPanelProps: {
		isNew?: boolean
		mProps?: mst.Properties
		val?: {
			msType: null | 'error'
			msTypeName: null | 'error'
		}
	}
}

export default class MsTypeApp extends React.Component<P,S> {
	public readonly state: S
	public readonly props: P

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(p:P) {
		super(p);

		this.state = {
			msTypes: p.msTypes,
			panel: Panel.TABLE,
			editPanelProps: {}
		};

		// JSX Element getters
		this.renderEditPanel = this.renderEditPanel.bind(this);

		// Panel opener
		this.openEdit = this.openEdit.bind(this);

		// Data manipulators
		this.confirmDelete = this.confirmDelete.bind(this);
		this.saveMsType = this.saveMsType.bind(this);

		// State utilities
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					msTypes={this.state.msTypes}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={this.props.reloadMsTypes}
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
		const edp = this.state.editPanelProps;
		var isNew = edp.isNew;
		var val = edp.val || null;
		var mProps: mst.Properties;

		if (edp.mProps) {
			mProps = edp.mProps;
		}
		else if (this.state.msType) {
			mProps = this.state.msType.toProperties();
		}
		else {
			mProps = null;
		}

		return (<EditPanel
			isNew={isNew}
			mProps={mProps}
			val={val}
			onBack={() => this.setPanel(Panel.TABLE, s => {
				s.editPanelProps = {};
				s.msType = null;
				return s;
			})}
			onSubmit={this.saveMsType}
		/>);
	}

	confirmDelete(msType: mst.MsType) {
		var del = confirm('Delete ' + msType.msTypeName +
			'? This will delete all manuscripts of this type!');
		if (del) {
			this.setLoader('Deleting ' + msType.msType + '...')

			proxyFactory.getManuscriptProxy().deleteMsType(msType.msType, (s:boolean, e?:string) => {
				if (e) {
					alert('Error deleting Manuscript Type: ' + e);
					this.setPanel(Panel.TABLE);
				}
				else if (s) {
					this.setPanel(Panel.TABLE, (s:S) => {
						var i = s.msTypes.findIndex((m:mst.MsType) => {
							return m.msType === msType.msType;
						});
						s.msTypes[i].destroy();
						s.msTypes.splice(i, 1);
						s.msType = null;
						return s;
					});
				}
				else {
					this.setPanel(Panel.TABLE);
					alert('Could not delete Manuscript Type ' + msType.msType);
				}
			});
		}
	}

	openEdit(msType: mst.MsType) {
		this.setPanel(Panel.EDIT, state => {
			state.msType = msType;
			return state;
		});
	}

	saveMsType(mProps:mst.Properties, isNew:boolean) {
		this.setLoader('Saving ' + mProps.msType + '...');

		var onError = (e:string) => {
			alert('Error saving Manuscript Type: ' + e);
			const lcErr = e.toLowerCase();
			var val: S['editPanelProps']['val'] = {
				msType: lcErr.indexOf(mProps.msType.toLowerCase()) === -1 ? null : 'error',
				msTypeName: null
			};

			this.setState((s:S) => {
				s.editPanelProps.isNew = true;
				s.editPanelProps.mProps = mProps;
				s.editPanelProps.val = val;
				this.setPanel(Panel.EDIT, null, s);
				return s;
			});
		};

		if (isNew) {
			proxyFactory.getManuscriptProxy().createMsType(mProps, (msType:mst.MsType, e?:string) => {
				if (e) {
					onError(e);
				}
				else {
					this.setState((s:S) => {
						s.editPanelProps = {};
						s.msTypes.push(msType);
						s.panel = Panel.TABLE;
						return s;
					});
				}
			});
		}
		else {
			proxyFactory.getManuscriptProxy().updateMsType(mProps, (msType:mst.MsType, e?:string) => {
				if (e) {
					onError(e);
				}
				else {
					this.setState((s:S) => {
						s.editPanelProps = {};
						var i = s.msTypes.findIndex((m:mst.MsType) => {
							return mProps.msType === m.msType;
						});
						s.msTypes[i].destroy();
						s.msTypes[i] = msType;
						s.panel = Panel.TABLE;
						return s;
					});
				}
			});
		}
	}
}
