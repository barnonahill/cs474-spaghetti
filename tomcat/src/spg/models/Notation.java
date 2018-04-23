package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Kyle Tran
 *
 */
public class Notation {
	private final String notationID;
	private final String notationName;
	
	public Notation(String notationID, String notationName) {
		this.notationID = notationID;
		this.notationName = notationName;
	}
	
	public Notation(ResultSet resultSet) throws SQLException {
		this.notationID = resultSet.getString("notationID");
		this.notationName = resultSet.getString("notationName");
	}
	
	public String getNotationID() {
		return this.notationID;
	}
	
	public String getNotationName() {
		return this.notationName;
	}
	
	/**
	 * Returns a JSONObject representation of this Notation
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("notationID", this.notationID);
		j.put("notationName", this.notationName);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Notation.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
