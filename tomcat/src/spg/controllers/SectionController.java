package spg.controllers;

import spg.models.Manuscript;
import spg.models.Section;

public class SectionController {
	
	
	
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
	
	
	public static Section updateSection(String countryID, String libSiglum, String msSiglum ) throws Exception{
		
		//get from r to l only the ones that are in that. (msSiglum if given, else lib if given, then countryID if given).
		return null;
	}
	
	
	
}
