/**
 * Interface of a data model for database entities.
 *
 * @author Paul Barnhill
 * @version 2018-04-24
 */
export default abstract class SpgModel {
	abstract toProperties(): any;

	/**
	 * Clones the object passed in and nulls any empty string values.
	 */
	static cloneAndNullify(a:any) {
		if (a) {
			var b = Object.assign({},a);
			for (let k in b) {
				if (b[k] === '') {
					b[k] = null;
				}
			}
		}
		return b;
	}

	/**
	 * Deletes all the properties of this data model, to prevent memory leakage.
	 */
	destroy() {
		for (let k in this) {
			delete this[k];
		}
	}

	/**
	 * Calls destroy on each SpgModel in arr, then nulls arr.
	 * @param arr array of SpgModels to destroy.
	 */
	static destroyArray(arr: Array<SpgModel>) {
		if (arr) {
			while (arr.length) {
				arr.pop().destroy();
			}
			arr = null;
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
