package spg.models;

import org.json.JSONObject;

/**
 * Model for a Country.
 * 
 * @author Paul Barnhill 
 * @version 2018-04-18
 */
public class Country {
	private final String countryID;
	private final String countryName;
	
	public Country(String countryCode, String countryName) {
		this.countryID = countryCode;
		this.countryName = countryName;
	}
	
	public String getCountryCode() {
		return this.countryID;
	}
	
	public String getCountryName() {
		return this.countryName;
	}
	
	/**
	 * Returns a JSONObject representation of this Country
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("countryID", this.countryID);
		j.put("country", this.countryName);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Country.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
