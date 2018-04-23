package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Kyle Tran
 *
 */
public class Chant {
	private final String libSiglum;
	private final String msSiglum;
	private final int sectionID;
	private final String leafNumber;
	private final int columnNumber;
	private final int lineNumber;
	private final String chantID;
	private final String feastID;
	private final String officeID;
	private final String officePosition;
	private final String genreID;
	private final String msIncipit;
	private final String msFullText;
	private final String rubric;
	private final String marginalia;
	private final String addendum;
	private final String extra;
	private final String chantNotes;
	
	public Chant(String libSiglum, String msSiglum, int sectionID, String leafNumber,
			int columnNumber, int lineNumber, String chantID, String feastID,
			String officeID, String officePosition, String genreID, String msIncipit,
			String msFullText, String rubric, String marginalia, String addendum,
			String extra, String chantNotes) {
		this.libSiglum = libSiglum;
		this.msSiglum = msSiglum;
		this.sectionID = sectionID;
		this.leafNumber = leafNumber;
		this.columnNumber = columnNumber;
		this.lineNumber = lineNumber;
		this.chantID = chantID;
		this.feastID = feastID;
		this.officeID = officeID;
		this.officePosition = officePosition;
		this.genreID = genreID;
		this.msIncipit = msIncipit;
		this.msFullText = msFullText;
		this.rubric = rubric;
		this.marginalia = marginalia;
		this.addendum = addendum;
		this.extra = extra;
		this.chantNotes = chantNotes;
	}
	
	public Chant(ResultSet resultSet) throws SQLException {
		this.libSiglum = resultSet.getString("libSiglum");
		this.msSiglum = resultSet.getString("msSiglum");
		this.sectionID = resultSet.getInt("sectionID");
		this.leafNumber = resultSet.getString("leafNumber");
		this.columnNumber = resultSet.getInt("columnNumber");
		this.lineNumber = resultSet.getInt("lineNumber");
		this.chantID = resultSet.getString("chantID");
		this.feastID = resultSet.getString("feastID");
		this.officeID = resultSet.getString("officeID");
		this.officePosition = resultSet.getString("officePosition");
		this.genreID = resultSet.getString("genreID");
		this.msIncipit = resultSet.getString("msIncipit");
		this.msFullText = resultSet.getString("msFullText");
		this.rubric = resultSet.getString("rubric");
		this.marginalia = resultSet.getString("marginalia");
		this.addendum = resultSet.getString("addendum");
		this.extra = resultSet.getString("extra");
		this.chantNotes = resultSet.getString("chantNotes");
		
	}
	
	//Getters
		public String getlibSiglum() {
			return this.libSiglum;
		}
		
		public String getmsSiglum() {
			return this.msSiglum;
		}
		
		public int getSectionID() {
			return this.sectionID;
		}
		
		public String getLeafNumber() {
			return this.leafNumber;
		}
		
		public int getColumnNumber() {
			return this.columnNumber;
		}
		
		public String getChantID() {
			return this.chantID;
		}
		
		public String getFeastID() {
			return this.feastID;
		}
		
		public String getOfficeID() {
			return this.officeID;
		}
		
		public String getOfficePosition() {
			return this.officePosition;
		}
		
		public String getGenreID() {
			return this.genreID;
		}
		
		public String getMSIncipit() {
			return this.msIncipit;
		}
		
		public String getMSFullText() {
			return this.msFullText;
		}
		
		public String getRubric() {
			return this.rubric;
		}
		
		public String getMarginalia() {
			return this.marginalia;
		}
		
		public String getAddendum() {
			return this.addendum;
		}
		
		public String getChantNotes() {
			return this.chantNotes;
		}
		
		/**
		 * Returns a JSONObject representation of this Leaf.
		 */
		public JSONObject toJSON() {
			JSONObject j = new JSONObject();
			j.put("libSiglum", this.libSiglum);
			j.put("msSiglum", this.msSiglum);
			j.put("sectionID", this.sectionID);
			j.put("leafNumber", this.leafNumber);
			j.put("columnNumber", this.columnNumber);
			j.put("chantID", this.chantID);
			j.put("feastID", this.feastID);
			j.put("officeID", this.officeID);
			j.put("officePosition", this.officePosition);
			j.put("genreID", this.genreID);
			j.put("msIcripit", this.msIncipit);
			j.put("msFullText", this.msFullText);
			j.put("rubric", this.rubric);
			j.put("marginalia", this.marginalia);
			j.put("addendum", this.addendum);
			j.put("chantNotes", this.chantNotes);
			return j;
		}
		
		/**
		 * Returns a JSONObject String representation of this Leaf.
		 */
		public String toString() {
			return this.toJSON().toString();
		}
}
