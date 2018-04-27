import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/msType/MsTypeTablePanel.tsx';
import EditPanel from '@src/components/msType/MsTypeEditPanel.tsx';

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
	replaceMsTypes: (msTypes: mst.MsType[]) => void
}
interface S {
	msTypes: mst.MsType[]
	msType: mst.MsType
	panel: Panel
	loadMessage: string
}

export default class MsTypeApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			msTypes: p.msTypes,
			msType: null,
			panel: Panel.TABLE,
			loadMessage: ''
		};

		this.confirmDelete = this.confirmDelete.bind(this);
		this.openEdit = this.openEdit.bind(this);
		this.loadMsTypes = this.loadMsTypes.bind(this);
		this.saveMsType = this.saveMsType.bind(this);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					msTypes={this.state.msTypes}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={this.loadMsTypes}
				/>)
			case Panel.EDIT:
				return (<EditPanel
					msType={this.state.msType}
					onBack={() => this.setState((s:S) => {
						s.panel = Panel.TABLE;
						return s;
					})}
					onSubmit={this.saveMsType}

				/>);

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;
			default:
				return null;
		}
	}

	confirmDelete(msType: mst.MsType) {
		var del = confirm('Delete ' + msType.msTypeName +
			'? This will delete all manuscripts of this type!');
		if (del) {
			this.setState((s:S) => {
				s.panel = Panel.LOADER;
				s.loadMessage = 'Deleting ' + msType.msType + '...';
			});

			proxyFactory.getManuscriptProxy().deleteMsType(msType.msType, (s:boolean, e?:string) => {
				if (e) {
					alert(e);
				}
				else if (s) {
					this.setState((s:S) => {
						var i = s.msTypes.findIndex((m:mst.MsType) => {
							return m.msType === msType.msType;
						});
						s.msTypes[i].destroy();
						s.msTypes.splice(i, 1);
						s.panel = Panel.TABLE;
						this.props.replaceMsTypes(s.msTypes);
						return s;
					});
				}
			});
		}
	}

	loadMsTypes() {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Loading Manuscript Types...';
			return s;
		});

		proxyFactory.getManuscriptProxy().getMsTypes((msTypes: Array<mst.MsType>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					mst.MsType.destroyArray(s.msTypes);
					s.msTypes = msTypes;
					s.msType = null;
					s.panel = Panel.TABLE;
					this.props.replaceMsTypes(s.msTypes);
					return s;
				});
			}
		});
	}

	openEdit(msType: mst.MsType) {
		this.setState((s:S) => {
			s.panel = Panel.EDIT;
			s.msType = msType;
			return s;
		});
	}

	saveMsType(p:mst.Properties, isNew:boolean) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Saving ' + p.msType + '...';
		});

		if (isNew) {
			proxyFactory.getManuscriptProxy().createMsType(p, (msType:mst.MsType, e?:string) => {
				if (e) {
					alert(e);
				}
				else {
					this.setState((s:S) => {
						s.msTypes.push(msType);
						s.panel = Panel.TABLE;
						this.props.replaceMsTypes(s.msTypes);
						return s;
					});
				}
			});
		}
		else {
			proxyFactory.getManuscriptProxy().updateMsType(p, (msType:mst.MsType, e?:string) => {
				if (e) {
					alert(e);
				}
				else {
					this.setState((s:S) => {
						var i = s.msTypes.findIndex((m:mst.MsType) => {
							return m.msType === p.msType;
						});
						s.msTypes[i].destroy();
						s.msTypes[i] = msType;
						s.panel = Panel.TABLE;
						this.props.replaceMsTypes(s.msTypes);
						return s;
					});
				}
			});
		}
	}
}
