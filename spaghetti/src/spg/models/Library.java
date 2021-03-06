package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * Model for a Library.
 * 
 * @author Paul Barnhill, Kyle Tran, Carl Clermont
 * @version 2018-05-07
 */
public class Library {
	private final String libSiglum;
	private final String countryID;
	private final String city;
	private final String library;
	private final String address1;
	private final String address2;
	private final String postCode;
	
	public Library(String libSiglum, String countryID, String city, String library,
			String address1, String address2, String postCode) {
		this.libSiglum = libSiglum;
		this.countryID = countryID;
		this.city = city;
		this.library = library;
		this.address1 = address1;
		this.address2 = address2;
		this.postCode = postCode;
	}
	
	public Library(ResultSet resultSet) throws SQLException {
		this.libSiglum = resultSet.getString("libSiglum");
		this.countryID = resultSet.getString("countryID");
		this.city = resultSet.getString("city");
		this.library = resultSet.getString("library");
		this.address1 = resultSet.getString("address1");
		this.address2 = resultSet.getString("address2");
		this.postCode = resultSet.getString("postCode");
	}
	
	public String getlibSiglum() {
		return this.libSiglum;
	}
	
	public String getCountryID() {
		return this.countryID;
	}
	
	public String getCity() {
		return this.city;
	}
	
	public String getLibrary() {
		return this.library;
	}
	
	public String getAddress1() {
		return this.address1;
	}
	
	public String getAddress2() {
		return this.address2;
	}
	
	public String getPostCode() {
		return this.postCode;
	}
	
	/**
	 * Returns a JSONObject representation of this Library.
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("libSiglum", this.libSiglum);
		j.put("countryID", this.countryID);
		j.put("city", this.city);
		j.put("library", this.library);
		j.put("address1", this.address1);
		j.put("address2", this.address2);
		j.put("postCode", this.postCode);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Library.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
