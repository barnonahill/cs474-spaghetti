package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

public class Century {
	private final String centuryID;
	private final String centuryName;
	
	public Century(String centuryID, String centuryName) {
		this.centuryID = centuryID;
		this.centuryName = centuryName;
	}
	
	public Century(ResultSet resultSet) throws SQLException {
		this.centuryID = resultSet.getString("centuryID");
		this.centuryName = resultSet.getString("centuryName");
	}
	
	public String getCenturyID() {
		return this.centuryID;
	}
	
	public String getCenturyName() {
		return this.centuryName;
	}
	
	/**
	 * Returns a JSONObject representation of this Century
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("centuryID", this.centuryID);
		j.put("centuryName", this.centuryName);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Century.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
