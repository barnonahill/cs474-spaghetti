package spg.controllers;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;

import spg.models.Section;

public class SectionController {
	
	private final static String SECTION = "Section";

	
	
	public static Section createSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccassion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception
	{
		
		return null;
	}
	
	
	public static Section updateSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccassion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception
	{
		
		return null;
	}
	
	
	/**
	 * getSection = gets one Section.
	 * @params = primary keys to find a single section
	 * @return = one section
	 * @throws Exception = anything.
	 */
	public static Section getSection(String libSiglum, String msSiglum, String sectionID) throws Exception {
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		Section s;
		String query;
		ResultSet resultSet;
		
		namesToValues.put("libSiglum", libSiglum);
		namesToValues.put("msSiglum", msSiglum);
		namesToValues.put("sectionID", sectionID);
		
		
		query = SpgController.buildSelectQuery(SECTION, namesToValues);
		resultSet = SpgController.getResultSet(query);
		
		resultSet.next();
		s = new Section(resultSet);
		
		return s;
	}
	
	
	public static ArrayList<Section> getSections(String countryID, String libSiglum, String msSiglum ) throws Exception{
		
		//get from r to l only the ones that are in that. (msSiglum if given, else lib if given, then countryID if given).
		return null;
	}
	
	/**
	 * deleteSection = deletes a Section.
	 * @params = the primary keys.
	 * @return = true/exception.
	 * @throws Exception = anything.
	 */
	public static boolean deleteSection(String sectionID, String libSiglum, String msSiglum) throws Exception {
		String query;
		HashMap<String, String> pkNamesToValues = new HashMap<String,String>();

		pkNamesToValues.put("sectionID", sectionID);
		pkNamesToValues.put("libSiglum", libSiglum);
		pkNamesToValues.put("msSiglum", msSiglum);
		
		query = SpgController.buildDeleteQuery(SECTION, pkNamesToValues);
		
		SpgController.executeSQL(query);
				
		return true;
	}



	
	
}
