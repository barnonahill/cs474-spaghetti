package spg.models;

import org.json.JSONObject;

/**
 * Model for a Country.
 * 
 * @author Paul Barnhill 
 * @version 2018-04-15
 */
public class Country {
	private final String countryCode;
	private final String country;
	
	public Country(String countryCode, String country) {
		this.countryCode = countryCode;
		this.country = country;
	}
	
	public String getCountryCode() {
		return this.countryCode;
	}
	
	public String getCountryName() {
		return this.country;
	}
	
	/**
	 * Returns a JSONObject representation of this Country
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("countryCode", this.countryCode);
		j.put("country", this.country);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Country.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}