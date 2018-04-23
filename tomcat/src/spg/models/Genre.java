package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

public class Genre {
	private final String genreID;
	private final String genreDescription;
	
	public Genre(String genreID, String genreDescription) {
		this.genreID = genreID;
		this.genreDescription = genreDescription;
	}
	
	public Genre(ResultSet resultSet) throws SQLException {
		this.genreID = resultSet.getString("genreID");
		this.genreDescription = resultSet.getString("genreDescription");
	}
	
	public String getGenreID() {
		return this.genreID;
	}
	
	public String getGenreDescription() {
		return this.genreDescription;
	}
	
	/**
	 * Returns a JSONObject representation of this Century
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("genreID", this.genreID);
		j.put("genreDescription", this.genreDescription);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Century.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
}
