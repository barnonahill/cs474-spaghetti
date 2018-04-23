package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Kyle Tran
 *
 */
public class MasterChant {
	private final String chantID;
	private final String incipit;
	private final String msText;
	private final String feastID;
	private final String officeID;
	private final String genreID;
	private final String caoConrdances;
	
	public MasterChant(String chantID, String incipit, String msText, String feastID,
			String officeID, String genreID, String caoConrdances) {
		this.chantID = chantID;
		this.incipit = incipit;
		this.msText = msText;
		this.feastID = feastID;
		this.officeID = officeID;
		this.genreID = genreID;
		this.caoConrdances = caoConrdances;
	}
	
	public MasterChant(ResultSet resultSet) throws SQLException {
		this.chantID = resultSet.getString("chantID");
		this.incipit = resultSet.getString("incipit");
		this.msText = resultSet.getString("msText");
		this.feastID = resultSet.getString("feastID");
		this.officeID = resultSet.getString("officeID");
		this.genreID = resultSet.getString("genreID");
		this.caoConrdances = resultSet.getString("caoConrdances");
	}
	
	public String getChantID() {
		return this.chantID;
	}
	
	public String getIncipit() {
		return this.incipit;
	}
	
	public String getMSText() {
		return this.msText;
	}
	
	public String getFeastID() {
		return this.feastID;
	}
	
	public String getOfficeID() {
		return this.officeID;
	}
	
	public String getGenreID() {
		return this.genreID;
	}
	
	public String getCaoConrdances() {
		return this.caoConrdances;
	}
	/**
	 * Returns a JSONObject representation of this MasterChant
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("chantID", this.chantID);
		j.put("incipit", this.incipit);
		j.put("msText", this.msText);
		j.put("feastID", this.feastID);
		j.put("officeID", this.officeID);
		j.put("feastMonth", this.genreID);
		j.put("feastNotes", this.caoConrdances);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this MasterChant.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
