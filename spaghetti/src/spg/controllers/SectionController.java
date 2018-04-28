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
	public SectionController() {
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
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID, String provenanceID,
			String provenanceDetail, String commissioner, String inscription, String colophon,
			String sourceCompletenessID) throws Exception {

		String query;
		Section section;

		HashMap<String, String> namesToValues = new HashMap<String, String>();

		if (libSiglum == null || msSiglum == null || sectionID == null) {
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
	 * @throws Exception
	 *             -
	 */
	public Section updateSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccassion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID, String provenanceID,
			String provenanceDetail, String commissioner, String inscription, String colophon,
			String sourceCompletenessID) throws Exception {

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

		section = new Section(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccassion, notationID,
				numGatherings, numColumns, linesPerColumn, scribe, date, centuryID, cursusID, provenanceID,
				provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);

		return section;
	}

	/**
	 * getSection = gets one Section.
	 * 
	 * @params = primary keys to find a single section
	 * @return = one section
	 * @throws Exception
	 *             = anything.
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
	 * gets all the sections filtered by libSiglum or msSiglum (but not by countryID
	 * yet)
	 * 
	 * @param countryID
	 *            -
	 * @param libSiglum
	 *            - primary key
	 * @param msSiglum
	 *            - primary key
	 * @return - a list of all the selected Libraries
	 * @throws Exception
	 *             - anything (SQLEception, ...)
	 */
	public ArrayList<Section> getSections(String libSiglum, String msSiglum) throws Exception {
		// get from r to l only the ones that are in that. (msSiglum if given, else lib
		// if given, then countryID if given).
		HashMap<String, String> namesToValues = null;
		String query;
		ResultSet resultSet;
		Section s;
		ArrayList<Section> sections = new ArrayList<Section>();

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
	 * for checking if a Section already exists.
	 * 
	 * @param libSiglum
	 *            - primary keys
	 * @param msSiglum
	 *            -
	 * @param sectionID
	 *            -
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
			// Do nothing. aka return null.
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
		} catch (Exception e) {
			return null;
		}
	}

	public Century createCentury(String centuryID, String centuryName) throws Exception {
		String query;
		HashMap<String, String> nvMap = new HashMap<>();

		nvMap.put("centuryID", centuryID);
		nvMap.put("centuryName", centuryName);

		query = super.buildInsertQuery("Century", nvMap);
		super.executeSQL(query);

		return new Century(centuryID, centuryName);
	}

	public Century updateCentury(String centuryID, String centuryName) throws Exception {
		String query;
		HashMap<String, String> primaryMap = new HashMap<>();
		HashMap<String, String> updateMap = new HashMap<>();

		primaryMap.put("centuryID", centuryID);
		updateMap.put("centuryName", centuryName);

		query = super.buildUpdateQuery("Century", primaryMap, updateMap);
		super.executeSQL(query);

		return new Century(centuryID, centuryName);
	}

	public boolean deleteCentury(String centuryID) throws Exception {
		String query;
		HashMap<String, String> nvMap = new HashMap<String, String>();

		try {
			nvMap.put("centuryID", centuryID);

			query = super.buildDeleteQuery("Century", nvMap);
			super.executeSQL(query);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public ArrayList<Cursus> getCursuses() throws Exception {
		String query = super.buildSelectQuery("Cursus", null);
		ArrayList<Cursus> cursuses = null;

		ResultSet rs = super.getResultSet(query);
		cursuses = new ArrayList<>();
		while (rs.next()) {
			cursuses.add(new Cursus(rs));
		}
		return cursuses;
	}

	public Cursus createCursus(String cursusID, String cursusName) throws Exception {
		String query;
		HashMap<String, String> nvMap = new HashMap<>();

		nvMap.put("cursusID", cursusID);
		nvMap.put("cursusName", cursusName);

		query = super.buildInsertQuery("Cursus", nvMap);
		super.executeSQL(query);

		return new Cursus(cursusID, cursusName);
	}
	
	public Cursus updateCursus(String cursusID, String cursusName) throws Exception {
		String query;
		HashMap<String, String> primaryMap = new HashMap<>();
		HashMap<String, String> updateMap = new HashMap<>();

		primaryMap.put("cursusID", cursusID);
		updateMap.put("cursusName", cursusName);

		query = super.buildUpdateQuery("Cursus", primaryMap, updateMap);
		super.executeSQL(query);

		return new Cursus(cursusID, cursusName);
	}
	
	public boolean deleteCursus(String cursusID) throws Exception {
		String query;
		HashMap<String, String> nvMap = new HashMap<String, String>();

		try {
			nvMap.put("cursusID", cursusID);

			query = super.buildDeleteQuery("Cursus", nvMap);
			super.executeSQL(query);
			return true;
		} catch (Exception e) {
			return false;
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
		} catch (Exception e) {
			return null;
		}
	}
	
	public SourceCompleteness createSourceCompleteness(String scID, String scName) throws Exception {
		String query;
		HashMap<String, String> nvMap = new HashMap<>();
		
		nvMap.put("sourceCompletenessID", scID);
		nvMap.put("sourceCompletenessName", scName);
		
		query = super.buildInsertQuery("SourceCompleteness", nvMap);
		super.executeSQL(query);
		
		return new SourceCompleteness(scID, scName);
	}
	
	public SourceCompleteness updateSourceCompleteness(String scID, String scName) throws Exception {
		String query;
		HashMap<String, String> primaryMap = new HashMap<>();
		HashMap<String, String> nvMap = new HashMap<>();
		
		primaryMap.put("sourceCompletenessID", scID);
		nvMap.put("sourceCompletenessName", scName);
		
		query = super.buildUpdateQuery("SourceCompleteness", primaryMap, nvMap);
		super.executeSQL(query);
		
		return new SourceCompleteness(scID, scName);
	}
	
	public boolean deleteSourceCompleteness(String scID) {
		String query;
		HashMap<String, String> nvMap = new HashMap<String, String>();

		try {
			nvMap.put("sourceCompletenessID", scID);

			query = super.buildDeleteQuery("SourceCompleteness", nvMap);
			super.executeSQL(query);
			return true;
		} catch (Exception e) {
			return false;
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
		} catch (Exception e) {
			return null;
		}
	}
	
	public Provenance createProvenance(String pID, String pName) throws Exception {
		String query;
		HashMap<String, String> nvMap = new HashMap<>();
		
		nvMap.put("provenanceID", pID);
		nvMap.put("provenanceName", pName);
		
		query = super.buildInsertQuery("Provenance", nvMap);
		super.executeSQL(query);
		
		return new Provenance(pID, pName);
	}
	
	public Provenance updateProvenance(String pID, String pName) throws Exception {
		String query;
		HashMap<String, String> primaryMap = new HashMap<>();
		HashMap<String, String> nvMap = new HashMap<>();
		
		primaryMap.put("provenanceID", pID);
		nvMap.put("provenanceName", pName);
		
		query = super.buildUpdateQuery("Provenance", primaryMap, nvMap);
		super.executeSQL(query);
		
		return new Provenance(pID, pName);
	}
	
	public boolean deleteProvenance(String pID) {
		String query;
		HashMap<String, String> nvMap = new HashMap<String, String>();

		try {
			nvMap.put("provenanceID", pID);

			query = super.buildDeleteQuery("Provenance", nvMap);
			super.executeSQL(query);
			return true;
		} catch (Exception e) {
			return false;
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
		} catch (Exception e) {
			return null;
		}
	}
	
	public Notation createNotation(String nID, String nName) throws Exception {
		String query;
		HashMap<String, String> nvMap = new HashMap<>();
		
		nvMap.put("notationID", nID);
		nvMap.put("notationName", nName);
		
		query = super.buildInsertQuery("Notation", nvMap);
		super.executeSQL(query);
		
		return new Notation(nID, nName);
	}
	
	public Notation updateNotation(String nID, String nName) throws Exception {
		String query;
		HashMap<String, String> primaryMap = new HashMap<>();
		HashMap<String, String> nvMap = new HashMap<>();
		
		primaryMap.put("notationID", nID);
		nvMap.put("notationName", nName);
		
		query = super.buildUpdateQuery("Notation", primaryMap, nvMap);
		super.executeSQL(query);
		
		return new Notation(nID, nName);
	}
	
	public boolean deleteNotation(String nID) {
		String query;
		HashMap<String, String> nvMap = new HashMap<String, String>();

		try {
			nvMap.put("notationID", nID);

			query = super.buildDeleteQuery("Notation", nvMap);
			super.executeSQL(query);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * deleteSection = deletes a Section.
	 * 
	 * @params = the primary keys.
	 * @return = true/exception.
	 * @throws Exception
	 *             = anything.
	 */
	public boolean deleteSection(String sectionID, String libSiglum, String msSiglum) throws Exception {
		String query;
		HashMap<String, String> pkNamesToValues = new HashMap<String, String>();

		pkNamesToValues.put("sectionID", sectionID);
		pkNamesToValues.put("libSiglum", libSiglum);
		pkNamesToValues.put("msSiglum", msSiglum);

		query = super.buildDeleteQuery(SECTION, pkNamesToValues);

		super.executeSQL(query);

		return true;
	}

	@Override
	protected String checkVarType(String key, String value) {
		if (key.indexOf("num") == 0 || key.indexOf("linesPer") == 0) {
			return value;
		} else {
			return "'" + value + "'";
		}
	}
}
