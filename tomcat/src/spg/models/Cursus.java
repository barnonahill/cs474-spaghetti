package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

public class Cursus {
	private final String cursusID;
	private final String cursusName;
	
	public Cursus(String cursusID, String cursusName) {
		this.cursusID = cursusID;
		this.cursusName = cursusName;
	}
	
	public Cursus(ResultSet resultSet) throws SQLException {
		this.cursusID = resultSet.getString("cursusID");
		this.cursusName = resultSet.getString("cursusName");
	}
	
	public String getCursusID() {
		return this.cursusID;
	}
	
	public String getCursusName() {
		return this.cursusName;
	}
	
	/**
	 * Returns a JSONObject representation of this Cursus
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("cursusID", this.cursusID);
		j.put("cursusName", this.cursusName);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Cursus.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
