package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

public class SourceCompleteness {
	private final String sourceCompletenessID;
	private final String sourceCompletenessName;
	
	public SourceCompleteness(String sourceCompletenessID, String sourceCompletenessName) {
		this.sourceCompletenessID = sourceCompletenessID;
		this.sourceCompletenessName = sourceCompletenessName;
	}
	
	public SourceCompleteness(ResultSet resultSet) throws SQLException {
		this.sourceCompletenessID = resultSet.getString("sourceCompletenessID");
		this.sourceCompletenessName = resultSet.getString("sourceCompletenessName");
	}
	
	public String getSourceCompletenessID() {
		return this.sourceCompletenessID;
	}
	
	public String getSourceCompletenessName() {
		return this.sourceCompletenessName;
	}
	
	/**
	 * Returns a JSONObject representation of this SourceCompleteness
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("sourceCompletenessID", this.sourceCompletenessID);
		j.put("sourceCompletenessName", this.sourceCompletenessName);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this SourceCompleteness.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
