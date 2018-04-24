package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Kyle Tran
 *
 */
public class Section {
	private final String libSiglum;
	private final String msSiglum;
	private final int sectionID;
	private final String sectionType;
	private final String liturgicalOccassion;
	private final String notationID;
	private final int numGatherings;
	private final int numColumns;
	private final int linesPerColumn;
	private final String scribe;
	private final String date;
	private final String centuryID;
	private final String cursusID;
	private final String provenanceID;
	private final String provenanceDetail;
	private final String commissioner;
	private final String inscription;
	private final String colophon;
	private final String sourceCompletenessID;
	
	
	/**
	 * from all normal values.
	 * @params
	 */
	public Section(String libSiglum, String msSiglum, int sectionID, String sectionType,
			String liturgicalOccassion, String notationID, int numGatherings, int numColumns,
			int linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) {
		this.libSiglum = libSiglum;
		this.msSiglum = msSiglum;
		this.sectionID = sectionID;
		this.sectionType = sectionType;
		this.liturgicalOccassion = liturgicalOccassion;
		this.notationID = notationID;
		this.numGatherings = numGatherings;
		this.numColumns = numColumns;
		this.linesPerColumn = linesPerColumn;
		this.scribe = scribe;
		this.date = date;
		this.centuryID = centuryID;
		this.cursusID = cursusID;
		this.provenanceID = provenanceID;
		this.provenanceDetail = provenanceDetail;
		this.commissioner = commissioner;
		this.inscription = inscription;
		this.colophon = colophon;
		this.sourceCompletenessID = sourceCompletenessID;
	}
	
	/**
	 * from all strings.
	 * @params
	 */
	public Section(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccassion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) {
		this.libSiglum = libSiglum;
		this.msSiglum = msSiglum;
		this.sectionID = Integer.parseInt(sectionID);
		this.sectionType = sectionType;
		this.liturgicalOccassion = liturgicalOccassion;
		this.notationID = notationID;
		this.numGatherings = Integer.parseInt(numGatherings);
		this.numColumns = Integer.parseInt(numColumns);
		this.linesPerColumn = Integer.parseInt(linesPerColumn);
		this.scribe = scribe;
		this.date = date;
		this.centuryID = centuryID;
		this.cursusID = cursusID;
		this.provenanceID = provenanceID;
		this.provenanceDetail = provenanceDetail;
		this.commissioner = commissioner;
		this.inscription = inscription;
		this.colophon = colophon;
		this.sourceCompletenessID = sourceCompletenessID;
	}
	
	public Section(ResultSet resultSet) throws SQLException {
		this.libSiglum = resultSet.getString("libSiglum");
		this.msSiglum = resultSet.getString("msSiglum");
		this.sectionID = resultSet.getInt("sectionID");
		this.sectionType = resultSet.getString("sectionType");
		this.liturgicalOccassion = resultSet.getString("liturgicalOccassion");
		this.notationID = resultSet.getString("notationID");
		this.numGatherings = resultSet.getInt("numGatherings");
		this.numColumns = resultSet.getInt("numColumns");
		this.linesPerColumn = resultSet.getInt("linesPerColumn");
		this.scribe = resultSet.getString("scribe");
		this.date = resultSet.getString("date");
		this.centuryID = resultSet.getString("centuryID");
		this.cursusID = resultSet.getString("cursusID");
		this.provenanceID = resultSet.getString("provenanceID");
		this.provenanceDetail = resultSet.getString("provenanceDetail");
		this.commissioner = resultSet.getString("commissioner");
		this.inscription = resultSet.getString("inscription");
		this.colophon = resultSet.getString("colophon");
		this.sourceCompletenessID = resultSet.getString("sourceCompletenessID");
		
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
	
	public String getSectionType() {
		return this.sectionType;
	}
	
	public String getLiturgicalOccassion() {
		return this.liturgicalOccassion;
	}
	
	public String getNotationID() {
		return this.notationID;
	}
	
	public int getNumGatherings() {
		return this.numGatherings;
	}
	
	public int getNumColumns() {
		return this.numColumns;
	}
	
	public int linesPerColumn() {
		return this.linesPerColumn;
	}
	
	public String getScribe() {
		return this.scribe;
	}
	
	public String getDate() {
		return this.date;
	}
	
	public String getCenturyID() {
		return this.centuryID;
	}
	
	public String getCursusID() {
		return this.cursusID;
	}
	
	public String getProvenanceID() {
		return this.provenanceID;
	}
	
	public String getProvenanceDetail() {
		return this.provenanceDetail;
	}
	
	public String getCommissioner() {
		return this.commissioner;
	}
	
	public String getInscription() {
		return this.inscription;
	}
	
	public String getColophon() {
		return this.colophon;
	}
	
	public String getSourceCompletenessID() {
		return this.sourceCompletenessID;
	}
	
	/**
	 * Returns a JSONObject representation of this Section.
	 */
	public JSONObject toJSON() {
		JSONObject j = new JSONObject();
		j.put("libSiglum", this.libSiglum);
		j.put("msSiglum", this.msSiglum);
		j.put("sectionID", this.sectionID);
		j.put("sectionType", this.sectionType);
		j.put("liturgicalOccassion", this.liturgicalOccassion);
		j.put("notationID", this.notationID);
		j.put("numGatherings", this.numGatherings);
		j.put("numColumns", this.numColumns);
		j.put("linesPerColumn", this.linesPerColumn);
		j.put("scribe", this.scribe);
		j.put("date", this.date);
		j.put("centuryID", this.centuryID);
		j.put("cursusID", this.cursusID);
		j.put("provenanceID", this.provenanceID);
		j.put("provenanceDetail", this.provenanceDetail);
		j.put("commissioner", this.commissioner);
		j.put("inscription", this.inscription);
		j.put("colophon", this.colophon);
		j.put("sourceCompletenessID", this.sourceCompletenessID);
		return j;
	}
	
	/**
	 * Returns a JSONObject String representation of this Section.
	 */
	public String toString() {
		return this.toJSON().toString();
	}
	
}
