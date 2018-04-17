/**
 * Interface of a data model for database entities.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
export default abstract class SpgModel {
	abstract toProperties(): any;

	/**
	 * Deletes all the properties of this data model, to prevent memory leakage.
	 */
	destroy() {
		for (let k in this) {
			delete this[k];
		}
	}

	/**
	 * Creates a JSON representation of this data model.
	 * @return
	 */
	toString() {
		return JSON.stringify(this.toProperties());
	}
}
