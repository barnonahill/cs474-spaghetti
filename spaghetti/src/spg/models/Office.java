package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Kyle Tran
 *
 */
public class Office {
	private final String officeID;
	private final String officeName;
	
	public Office(String officeID, String officeName) {
		this.officeID = officeID;
		this.officeName = officeName;
	}
	
	public Office(ResultSet resultSet) throws SQLException {
		this.officeID = resultSet.getString("officeID");
		this.officeName = resultSet.getString("officeName");
	}
	
	public String getOfficeID() {
		return this.officeID;
	}
	
	public String getOfficeName() {
		return this.officeName;
	}
	
	/**
	 * Returns a JSONObject representation of this Office
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("officeID", this.officeID);
		j.put("officeName", this.officeName);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Office.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
