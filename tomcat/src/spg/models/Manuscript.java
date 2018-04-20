package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Carl Clermont
 *
 */
public class Manuscript {
	private final String libSiglum;
	private final String msSiglum;
	private final String msType;
	private final String dimensions;
	private final Integer leaves;
	private final boolean foliated;
	private final boolean vellum;
	private final String binding;
	private final String sourceNotes;
	private final String summary;
	private final String bibliography;
	
	public Manuscript(String libSiglum, String msSiglum, String msType, String dimensions,
			Integer leaves, boolean foliated, boolean vellum, String binding, String sourceNotes,
			String summary, String bibliography) {
		this.libSiglum = libSiglum;
		this.msSiglum = msSiglum;
		this.msType = msType;
		this.dimensions = dimensions;
		this.leaves = leaves;
		this.foliated = foliated;
		this.vellum = vellum;
		this.binding = binding;
		this.sourceNotes = sourceNotes;
		this.summary = summary;
		this.bibliography = bibliography;
	}
	
	public Manuscript(ResultSet resultSet) throws SQLException {
		this.libSiglum = resultSet.getString("libSiglum");
		this.msSiglum = resultSet.getString("msSiglum");
		this.msType = resultSet.getString("msType");
		this.dimensions = resultSet.getString("dimensions");
		this.leaves = resultSet.getInt("leaves");
		this.foliated = resultSet.getBoolean("foliated");
		this.vellum = resultSet.getBoolean("vellum");
		this.binding = resultSet.getString("binding");
		this.sourceNotes = resultSet.getString("sourceNotes");
		this.summary = resultSet.getString("summary");
		this.bibliography = resultSet.getString("bibliography");
	}
	
	//getters
	//
	
	/**
	 * Returns a JSONObject representation of this Country
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("libSiglum", this.libSiglum);
		j.put("msSiglum", this.msSiglum);
		j.put("msType", this.msType);
		j.put("dimensions", this.dimensions);
		j.put("leaves", this.leaves);
		j.put("foliated", this.foliated);
		j.put("vellum", this.vellum);
		j.put("binding", this.binding);
		j.put("sourceNotes", this.sourceNotes);
		j.put("summary", this.summary);
		j.put("bibliography", this.bibliography);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Country.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
	
	
	
}
