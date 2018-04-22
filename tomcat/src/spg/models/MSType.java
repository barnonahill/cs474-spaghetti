package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

public class MSType {
	private final String msType;
	private final String msTypeName;
	
	public MSType(String msType, String msTypeName) {
		this.msType = msType;
		this.msTypeName = msTypeName;
	}
	
	public MSType(ResultSet resultSet) throws SQLException {
		this.msType = resultSet.getString("msType");
		this.msTypeName = resultSet.getString("msTypeName");
	}
	
	//Getters
	public String getMSType() {
		return this.msType;
	}
	
	public String getMSTypeName() {
		return this.msTypeName;
	}
	
	/**
	 * Returns a JSONObject representation of this MSType.
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("msType", this.msType);
		j.put("msTypeName", this.msTypeName);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this MSType.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
