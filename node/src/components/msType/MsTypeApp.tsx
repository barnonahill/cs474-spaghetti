import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/msType/MsTypeTablePanel.tsx';
import {
	default as EditPanel,
	S as EditState
} from '@src/components/msType/MsTypeEditPanel.tsx';

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
	editState?: EditState
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
			panel: Panel.TABLE
		};

		// Render helpers
		this.renderTablePanel = this.renderTablePanel.bind(this);
		this.renderEditPanel = this.renderEditPanel.bind(this);

		// Data manipulators
		this.deleteMsType = this.deleteMsType.bind(this);
		this.saveMsType = this.saveMsType.bind(this);

		// State utilities
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
			msTypes={this.state.msTypes}
			onBack={this.props.onBack}
			onRefresh={this.props.reloadMsTypes}
			onEdit={msType => {
				this.setPanel(Panel.EDIT, state => {
					state.msType = msType;
					return state;
				});
			}}

			onDelete={msType => {
				var del = confirm('Delete ' + msType.msType +
					'? This will delete all manuscripts of this type!');
				if (del) {
					this.deleteMsType(msType);
				}
			}}
		/>);
	}

	renderEditPanel() {
		var es: Partial<EditState> = this.state.editState || {};
		if (!es.mProps) {
			if (this.state.msType) {
				es.mProps = this.state.msType.toProperties();
				es.mProps.msTypeName = es.mProps.msTypeName || '';
			}
			else {
				es.mProps = null;
			}
		}

		return (<EditPanel
			onBack={() => this.setPanel(Panel.TABLE, s => {
				delete s.editState;
				s.msType = null;
				return s;
			})}
			onSubmit={this.saveMsType}
			editState={es}
		/>);
	}

	deleteMsType(msType: mst.MsType) {
		this.setLoader('Deleting ' + msType.msType + '...')
		proxyFactory.getManuscriptProxy().deleteMsType(msType.msType, (s, e?) => {
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

	saveMsType(editState: EditState) {
		this.setLoader('Saving ' + editState.mProps.msType + '...');

		var onError = (e:string) => {
			alert('Error saving Manuscript Type: ' + e);
			this.setPanel(Panel.EDIT, s => {
				for (let k in editState.val) {
					if (editState.mProps[k] && (e.indexOf(editState.mProps[k]) !== -1 ||
						e.indexOf(k.toLowerCase()) !== -1))
					{
						editState.val[k] = 'error';
					}
				}
				s.editState = editState;
				return s;
			});
		};

		const proxy = proxyFactory.getManuscriptProxy();
		if (editState.isNew) {
			proxy.createMsType(editState.mProps, (msType, e?) => {
				if (e) {
					onError(e);
				}
				else {
					this.setPanel(Panel.TABLE, s => {
						delete s.editState;
						s.msTypes.push(msType);
						return s;
					})
				}
			});
		}
		else {
			proxy.updateMsType(editState.mProps, (msType, e?) => {
				if (e) {
					onError(e);
				}
				else {
					this.setPanel(Panel.TABLE, s => {
						var i = s.msTypes.findIndex(m => editState.mProps.msType === m.msType);
						s.msTypes[i].destroy();
						delete s.editState;
						s.msTypes[i] = msType;
						return s;
					});
				}
			});
		}
	}
}
