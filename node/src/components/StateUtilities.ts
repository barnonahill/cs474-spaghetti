import { Component } from 'react';

/**
 * Static state setter utility class. Components should always bind themselves to State Utility functions before using them.
 * Exs:	this.setPanel = stateUtilities.setPanel.bind(this);
 * 			this.setLoader = stateUtilities.setLoader.bind(this, panel.LOADER)
 * @param component
 * @param panel
 * @param callback
 * @return
 */
export default class StateUtilities {

	/**
	 * Component must have a panel propery that should map to a number (or enum of numbers.)
	 * @param component
	 * @param panel
	 * @param callback
	 * @return
	 */
	public static setPanel(panel: number,
		callback?: (state:any) => any, state?:any)
	{
		if (state) {
			state.panel = panel;
		}
		else {
			/// @ts-ignore - Component will bind itself
			this.setState((s:any) => {
				s.panel = panel;
				if (callback) return callback(s);
				return s;
			});
		}
	}

	/**
	 * Sets the panel to LOADER and loadMessage to msg.
	 *
	 * Component must have a LOADER panel, and it must have been binded in the constructor!
	 * Ex: this.setLoader = stateUtilities.setLoader.bind(this, panel.LOADER)
	 *
	 * @param component This component. Should be binded.
	 * @param loadPanel This component's load panel number. Should be binded.
	 * @param loadMessage load message
	 * @param callback Callback that has set state for loader, but not returned it.
	 * @param s State object to set, but not return.
	 */
	public static setLoader(loadPanel:number, loadMessage: string,
		callback?: (state:any) => any, state?:any)
	{
		if (state) {
			state.panel = loadPanel;
			state.loadMessage = loadMessage;
		}
		else {
			/// @ts-ignore - Component will bind itself
			this.setState((s:any) => {
				s.panel = loadPanel;
				s.loadMessage = loadMessage;
				if (callback) return callback(s);
				return s;
			});
		}
	}
}
