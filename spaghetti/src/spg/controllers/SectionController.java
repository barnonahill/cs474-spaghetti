package spg.controllers;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;

import spg.models.Century;
import spg.models.Cursus;
import spg.models.Notation;
import spg.models.Provenance;
import spg.models.Section;
import spg.models.SourceCompleteness;

/**
 * 
 * @author Paul Barnhill, Carl Clermont, Kyle Tran, Zach Butts
 *
 */
public class SectionController extends SpgController {
	
	private final static String SECTION = "Section";

	/**
	 * Set up the DB connection info.
	 */
	public SectionController () {
		super();
	}
	
	/**
	 * 
	 * @params - all the colums of Section
	 * @return
	 * @throws Exception
	 */
	public Section createSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccassion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception
	{
		
		String query;
        Section section;

        HashMap<String, String> namesToValues = new HashMap<String, String>();
        
    	if(libSiglum == null || msSiglum == null || sectionID == null)
    	{
        	throw new Exception("libSiglum, msSiglum, and sectionID cannot be left empty or blank.");
		}
    
   	 	namesToValues.put("libSiglum", libSiglum);
   	 	namesToValues.put("msSiglum", msSiglum);
   	 	namesToValues.put("sectionID", sectionID);
  	 	namesToValues.put("sectionType", sectionType);
  	 	namesToValues.put("liturgicalOccassion", liturgicalOccassion);
  	 	namesToValues.put("notationID", notationID);
 	 	namesToValues.put("numGatherings", numGatherings);
 	 	namesToValues.put("numColumns", numColumns);
        namesToValues.put("linesPerColumn", linesPerColumn);
 	 	namesToValues.put("scribe", scribe);
    	namesToValues.put("date", date);
	 	namesToValues.put("centuryID", centuryID);
    	namesToValues.put("cursusID", cursusID);
    	namesToValues.put("provenanceID", provenanceID);
    	namesToValues.put("provenanceDetail", provenanceDetail);
    	namesToValues.put("commissioner", commissioner);
    	namesToValues.put("inscription", inscription);
    	namesToValues.put("colophon", colophon);
    	namesToValues.put("sourceCompletenessID", sourceCompletenessID);

    	query = super.buildInsertQuery(SECTION, namesToValues);
    	super.executeSQL(query);
    
   		section = new Section(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccassion, notationID,
   				numGatherings, numColumns, linesPerColumn, scribe, date, centuryID, cursusID, provenanceID,
   				provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);

    	return section;
	}
	
	
	/**
	 * 
	 * @params -
	 * @return -
	 * @throws Exception -
	 */
	public Section updateSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccassion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception
	{
		
		String query;
		Section section;
		
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		HashMap<String, String> pkNamesToValues = new HashMap<String, String>();
		
   	 	
  	 	namesToValues.put("sectionType", sectionType);
  	 	namesToValues.put("liturgicalOccassion", liturgicalOccassion);
  	 	namesToValues.put("notationID", notationID);
 	 	namesToValues.put("numGatherings", numGatherings);
 	 	namesToValues.put("numColumns", numColumns);
        namesToValues.put("linesPerColumn", linesPerColumn);
 	 	namesToValues.put("scribe", scribe);
    	namesToValues.put("date", date);
	 	namesToValues.put("centuryID", centuryID);
    	namesToValues.put("cursusID", cursusID);
    	namesToValues.put("provenanceID", provenanceID);
    	namesToValues.put("provenanceDetail", provenanceDetail);
    	namesToValues.put("commissioner", commissioner);
    	namesToValues.put("inscription", inscription);
    	namesToValues.put("colophon", colophon);
    	namesToValues.put("sourceCompletenessID", sourceCompletenessID);
		
		pkNamesToValues.put("libSiglum", libSiglum);
		pkNamesToValues.put("msSiglum", msSiglum);
		pkNamesToValues.put("sectionID", sectionID);
		
		query = super.buildUpdateQuery(SECTION, pkNamesToValues, namesToValues);
		super.executeSQL(query);
		
		section =  new Section(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccassion, notationID,
				numGatherings, numColumns, linesPerColumn, scribe, date, centuryID, cursusID, provenanceID,
				provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
				
		return section;
	}
	
	
	/**
	 * getSection = gets one Section.
	 * @params = primary keys to find a single section
	 * @return = one section
	 * @throws Exception = anything.
	 */
	public Section getSection(String libSiglum, String msSiglum, String sectionID) throws Exception {
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		Section s;
		String query;
		ResultSet resultSet;
		
		namesToValues.put("libSiglum", libSiglum);
		namesToValues.put("msSiglum", msSiglum);
		namesToValues.put("sectionID", sectionID);
		
		
		query = super.buildSelectQuery(SECTION, namesToValues);
		resultSet = super.getResultSet(query);
		
		resultSet.next();
		s = new Section(resultSet);
		
		return s;
	}
	
	
	/**
	 * gets all the sections filtered by libSiglum or msSiglum (but not by countryID yet)
	 * @param countryID -
	 * @param libSiglum - primary key
	 * @param msSiglum - primary key
	 * @return - a list of all the selected Libraries
	 * @throws Exception - anything (SQLEception, ...)
	 */
	public ArrayList<Section> getSections(String libSiglum, String msSiglum ) throws Exception{
		//get from r to l only the ones that are in that. (msSiglum if given, else lib if given, then countryID if given).
		HashMap<String, String> namesToValues = null;
		String query;
		ResultSet resultSet;
		Section s;
		ArrayList<Section> sections= new ArrayList<Section>();

		
		// What heathen doesn't put spaces after his ifs - Paul
		if (libSiglum != null) {
			namesToValues = new HashMap<String, String>();
			namesToValues.put("libSiglum", libSiglum);
		}
		if (msSiglum != null) {
			namesToValues = new HashMap<String, String>();
			namesToValues.put("msSiglum", msSiglum);
		}
		
		query = super.buildSelectQuery(SECTION, namesToValues);
		
		resultSet = super.getResultSet(query);
		
		while (resultSet.next()) {
			s = new Section(resultSet);
			sections.add(s);
		}
		
		return sections;
	}
	
	/**
	 * deleteSection = deletes a Section.
	 * @params = the primary keys.
	 * @return = true/exception.
	 * @throws Exception = anything.
	 */
	public boolean deleteSection(String sectionID, String libSiglum, String msSiglum) throws Exception {
		String query;
		HashMap<String, String> pkNamesToValues = new HashMap<String,String>();

		pkNamesToValues.put("sectionID", sectionID);
		pkNamesToValues.put("libSiglum", libSiglum);
		pkNamesToValues.put("msSiglum", msSiglum);
		
		query = super.buildDeleteQuery(SECTION, pkNamesToValues);
		
		super.executeSQL(query);
				
		return true;
	}


	/**
	 * for checking if a Section already exists.
	 * @param libSiglum - primary keys
	 * @param msSiglum - 
	 * @param sectionID - 
	 * @return A library or null.
	 */
	public Object getSectionOrNull(String libSiglum, String msSiglum, String sectionID) {
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		Section s = null;
		String query;
		ResultSet resultSet;
		
		namesToValues.put("libSiglum", libSiglum);
		namesToValues.put("msSiglum", msSiglum);
		namesToValues.put("sectionID", sectionID);
		
		
		query = super.buildSelectQuery(SECTION, namesToValues);
		try {
			resultSet = super.getResultSet(query);
			resultSet.next();
			s = new Section(resultSet);
		} catch (Exception e) {
			//Do nothing. aka return null. 
		}
		
		return s;
	}
	
	public ArrayList<Century> getCenturies() {
		String query = super.buildSelectQuery("Century", null);
		ArrayList<Century> centuries = null;
		
		try {
			ResultSet rs = super.getResultSet(query);
			centuries = new ArrayList<>();
			while (rs.next()) {
				centuries.add(new Century(rs));
			}
			return centuries;
		}
		catch (Exception e) {
			return null;
		}
	}
	
	public ArrayList<Cursus> getCursuses() {
		String query = super.buildSelectQuery("Cursus", null);
		ArrayList<Cursus> cursuses = null;
		
		try {
			ResultSet rs = super.getResultSet(query);
			cursuses = new ArrayList<>();
			while (rs.next()) {
				cursuses.add(new Cursus(rs));
			}
			return cursuses;
		}
		catch (Exception e) {
			return null;
		}
	}
	
	public ArrayList<SourceCompleteness> getSourceCompletenesses() {
		String query = super.buildSelectQuery("SourceCompleteness", null);
		ArrayList<SourceCompleteness> al = null;
		
		try {
			ResultSet rs = super.getResultSet(query);
			al = new ArrayList<>();
			while (rs.next()) {
				al.add(new SourceCompleteness(rs));
			}
			return al;
		}
		catch (Exception e) {
			return null;
		}
	}
	
	public ArrayList<Provenance> getProvenances() {
		String query = super.buildSelectQuery("Provenance", null);
		ArrayList<Provenance> al = null;
		
		try {
			ResultSet rs = super.getResultSet(query);
			al = new ArrayList<>();
			while (rs.next()) {
				al.add(new Provenance(rs));
			}
			return al;
		}
		catch (Exception e) {
			return null;
		}
	}
	
	public ArrayList<Notation> getNotations() {
		String query = super.buildSelectQuery("Notation", null);
		ArrayList<Notation> al = null;
		
		try {
			ResultSet rs = super.getResultSet(query);
			al = new ArrayList<>();
			while (rs.next()) {
				al.add(new Notation(rs));
			}
			return al;
		}
		catch (Exception e) {
			return null;
		}
	}
}
