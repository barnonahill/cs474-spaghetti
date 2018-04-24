package spg.controllers;

import java.util.HashMap;

import spg.models.Manuscript;
import spg.models.Section;

public class SectionController {
	
	private final static String SECTION = "Section";

	
	
	public static Section createSection(String libSiglum, String msSiglum, int sectionID, String sectionType,
			String liturgicalOccassion, String notationID, int numGatherings, int numColumns,
			int linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception
	{
		
		return null;
	}
	
	
	public static Section updateSection(String libSiglum, String msSiglum, int sectionID, String sectionType,
			String liturgicalOccassion, String notationID, int numGatherings, int numColumns,
			int linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception
	{
		
		return null;
	}
	
	
	public static Section getSections(String countryID, String libSiglum, String msSiglum ) throws Exception{
		
		//get from r to l only the ones that are in that. (msSiglum if given, else lib if given, then countryID if given).
		return null;
	}
	
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
