package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Kyle Tran
 *
 */
public class Feast {
	private final String feastID;
	private final String feastCode;
	private final String feastName;
	private final String feastDescription;
	private final String feastDate;
	private final String feastDay;
	private final String feastMonth;
	private final String feastNotes;
	
	public Feast(String feastID, String feastCode, String feastName, String feastDescription,
			String feastDate, String feastDay, String feastMonth, String feastNotes) {
		this.feastID = feastID;
		this.feastName = feastName;
		this.feastCode = feastCode;
		this.feastDescription = feastDescription;
		this.feastDate = feastDate;
		this.feastDay = feastDay;
		this.feastMonth = feastMonth;
		this.feastNotes = feastNotes;
	}
	
	public Feast(ResultSet resultSet) throws SQLException {
		this.feastID = resultSet.getString("feastID");
		this.feastName = resultSet.getString("feastName");
		this.feastCode = resultSet.getString("feastCode");
		this.feastDescription = resultSet.getString("feastDescription");
		this.feastDate = resultSet.getString("feastDate");
		this.feastDay = resultSet.getString("feastDay");
		this.feastMonth = resultSet.getString("feastMonth");
		this.feastNotes = resultSet.getString("feastNotes");
	}
	
	public String getFeastID() {
		return this.feastID;
	}
	
	public String getFeastName() {
		return this.feastName;
	}
	
	public String getFeastCode() {
		return this.feastCode;
	}
	
	public String getFeastDescription() {
		return this.feastDescription;
	}
	
	public String getFeastDate() {
		return this.feastDate;
	}
	
	public String getFeastDay() {
		return this.feastDay;
	}
	
	public String getFeastMonth() {
		return this.feastMonth;
	}
	
	public String getFeastNotes() {
		return this.feastNotes;
	}
	/**
	 * Returns a JSONObject representation of this Feast
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("feastID", this.feastID);
		j.put("feastName", this.feastName);
		j.put("feastCode", this.feastCode);
		j.put("feastDescription", this.feastDescription);
		j.put("feastDate", this.feastDate);
		j.put("feastDay", this.feastDay);
		j.put("feastMonth", this.feastMonth);
		j.put("feastNotes", this.feastNotes);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Feast.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
