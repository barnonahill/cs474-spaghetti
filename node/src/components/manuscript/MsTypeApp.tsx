import * as React from 'react';

import TablePanel from '@src/components/manuscript/MsTypeTablePanel.tsx';

import * as mst from '@src/models/msType.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	TABLE=0,
	EDIT=1
}

interface P {
	onBack: () => void
}
interface S {
	msTypes: Array<mst.MsType>
	msType: mst.MsType
	panel: Panel
}

export default class MsTypeApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		proxyFactory.getManuscriptProxy().getMsTypes((msTypes: Array<mst.MsType>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				this.state = {
					msTypes: msTypes,
					msType: null,
					panel: Panel.TABLE
				};
			}
		});

		this.openEdit = this.openEdit.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);
		this.saveMsType = this.saveMsType.bind(this);
	}

	openEdit(msType: mst.MsType) {
		this.setState((s:S) => {
			s.panel = Panel.EDIT;
			s.msType = msType;
			return s;
		});
	}

	saveMsType(p:mst.Properties, isNew:boolean) {
		if (isNew) {
			proxyFactory.getManuscriptProxy().createMsType(p, (msType:mst.MsType, e?:string) => {
				if (e) {
					alert(e);
				}
				else {
					this.setState((s:S) => {
						s.msTypes.push(msType);
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
						return s;
					});
				}
			});
		}
	}

	loadMsTypes() {
		proxyFactory.getManuscriptProxy().getMsTypes((msTypes: Array<mst.MsType>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					mst.MsType.destroyArray(s.msTypes);
					s.msTypes = msTypes;
					s.msType = null;
					return s;
				});
			}
		});
	}

	confirmDelete(msType: mst.MsType) {
		var del = confirm('Delete ' + msType.msTypeName + '?');
		if (del) {
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
						return s;
					});
				}
			});
		}
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					msTypes={this.state.msTypes}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={() => this.loadMsTypes}
				/>)
			default:
				return null;
		}
	}
}
