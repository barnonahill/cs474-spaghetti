package spg.models;

import org.json.JSONObject;

public class Library {
	//TODO CHANGE THIS ALL TO LIBRARY.
	private final String libSiglum;
	private final String countryID;
	private final String city;
	private final String library;
	private final String address1;
	private final String address2;
	private final String postCode;
	
	public Library(String libSiglum, String countryID) {
		this.libSiglum = libSiglum;
		this.countryID = countryID;
		this.city = null;
		this.library = null;
		this.address1 = null;
		this.address2 = null;
		this.postCode = null;
	}
	
	public String getCountryCode() {
		return this.libSiglum;
	}
	
	public String getCountryName() {
		return this.countryID;
	}
	
	/**
	 * Returns a JSONObject representation of this Country
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("countryCode", this.libSiglum);
		j.put("country", this.countryID);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Country.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
