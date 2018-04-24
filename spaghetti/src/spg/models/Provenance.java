package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Kyle Tran
 *
 */
public class Provenance {
	private final String provenanceID;
	private final String provenanceName;
	
	public Provenance(String provenanceID, String provenanceName) {
		this.provenanceID = provenanceID;
		this.provenanceName = provenanceName;
	}
	
	public Provenance(ResultSet resultSet) throws SQLException {
		this.provenanceID = resultSet.getString("provenanceID");
		this.provenanceName = resultSet.getString("provenanceName");
	}
	
	public String getProvenanceID() {
		return this.provenanceID;
	}
	
	public String getProvenanceName() {
		return this.provenanceName;
	}
	
	/**
	 * Returns a JSONObject representation of this Provenance
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("provenanceID", this.provenanceID);
		j.put("provenanceName", this.provenanceName);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Provenance.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
