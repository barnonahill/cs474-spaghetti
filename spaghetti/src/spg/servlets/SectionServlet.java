package spg.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import spg.controllers.SectionController;
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
@WebServlet(name="SectionServices", urlPatterns= {"/section"})
public class SectionServlet extends SpgHttpServlet{
private static final long serialVersionUID = 1L;
	
	
	public static final String CREATE_SECTION 	= "createsection";
	public static final String UPDATE_SECTION 	= "updatesection";
	public static final String GET_SECTION 		= "getsection";
	public static final String GET_SECTIONS 	= "getsections";
	public static final String DELETE_SECTION	= "deletesections";
	
	public static final String GET_CENTURIES = "GetCenturies";
	public static final String GET_CURSUSES = "GetCursuses";
	public static final String GET_SRC_COMPS = "GetSourceCompletenesses";
	public static final String GET_PROVENANCES = "GetProvenances";
	public static final String GET_NOTATIONS = "GetNotations";
	
	
	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try 
		{
			Map<String, String> params = super.getParameters(req);
			String action = super.getParameter(params, "action").toLowerCase();
			String msg = null;
			if (action.equalsIgnoreCase(CREATE_SECTION))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				String sectionType = super.getParameter(params, "sectionType");
				String liturgicalOccasions = super.getParameter(params, "liturgicalOccasions");
				String notationID = super.getParameter(params, "notationID");
				String numGatherings = super.getParameter(params, "numGatherings");
				String numColumns = super.getParameter(params, "numColumns");
				String linesPerColumn = super.getParameter(params, "linesPerColumn");
				String scribe = super.getParameter(params, "scribe");
				String date = super.getParameter(params, "date");
				String centuryID = super.getParameter(params, "centuryID");
				String cursusID = super.getParameter(params, "cursusID");
				String provenanceID = super.getParameter(params, "provenanceID");
				String provenanceDetail = super.getParameter(params, "provenanceDetail");
				String commissioner = super.getParameter(params, "commissioner");
				String inscription = super.getParameter(params, "inscription");
				String colophon = super.getParameter(params, "colophon");
				String sourceCompletenessID = super.getParameter(params, "sourceCompletenessID");
					
				msg = this.createSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasions, 
						notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
						provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
            }

            else if (action.equalsIgnoreCase(UPDATE_SECTION))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				String sectionType = super.getParameter(params, "sectionType");
				String liturgicalOccasions = super.getParameter(params, "liturgicalOccasions");
				String notationID = super.getParameter(params, "notationID");
				String numGatherings = super.getParameter(params, "numGatherings");
				String numColumns = super.getParameter(params, "numColumns");
				String linesPerColumn = super.getParameter(params, "linesPerColumn");
				String scribe = super.getParameter(params, "scribe");
				String date = super.getParameter(params, "date");
				String centuryID = super.getParameter(params, "centuryID");
				String cursusID = super.getParameter(params, "cursusID");
				String provenanceID = super.getParameter(params, "provenanceID");
				String provenanceDetail = super.getParameter(params, "provenanceDetail");
				String commissioner = super.getParameter(params, "commissioner");
				String inscription = super.getParameter(params, "inscription");
				String colophon = super.getParameter(params, "colophon");
				String sourceCompletenessID = super.getParameter(params, "sourceCompletenessID");
					
				msg = this.updateSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasions, 
						notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
						provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
            }
            
            else if (action.equalsIgnoreCase(GET_SECTION))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				msg = this.getSection(libSiglum, msSiglum, sectionID);
            }
			
            else if (action.equalsIgnoreCase(GET_SECTIONS))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				msg = this.getSections(libSiglum, msSiglum);
            }
            
            else if (action.equalsIgnoreCase(DELETE_SECTION))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				msg = this.deleteSection(libSiglum, msSiglum, sectionID);
            }
			
            else if (action.equalsIgnoreCase(GET_CENTURIES))
            {
            	msg = this.getCenturies();
            }
			
			else if (action.equalsIgnoreCase(UPDATE_CENTURY))
			{
				String centuryID = super.getParameter(params, "centuryID");
				msg = this.updateCentury(centuryID);
			}
			
			else if (action.equalsIgnoreCase(CREATE_CENTURY))
			{
				String centuryID = super.getParameter(params, "centuryID");
				msg = this.createCentury(centuryID);
			}
			
			else if(action.equalsIgnoreCase(DELETE_CENTURY))
			{
				String centuryID = super.getParameter(params, "centuryID");
				msg = this.deleteCentury(centuryID);
			}
			
			else if (action.equalsIgnoreCase(GET_CURSUSES))
			{
				msg = this.getCursuses();
			}
			
			else if (action.equalsIgnoreCase(UPDATE_CURSUS))
			{
				String cursusID = super.getParameter(params, "cursusID");
				msg = this.updateCursus(cursusID);
			}
			
			else if (action.equalsIgnoreCase(CREATE_CURSUS))
			{
				String cursusID = super.getParameter(params, "cursusID");
				msg = this.createCursus(cursusID);
			}
			
			else if (action.equalsIgnoreCase(DELETE_CURSUS))
			{
				String cursusID = super.getParameter(params, "cursusID");
				msg = this.deleteCurus(cursusID);
			}
			
			else if (action.equalsIgnoreCase(GET_SRC_COMPS))
			{
				msg = this.getSourceCompletenesses();
			}
			
			else if (action.equalsIgnoreCase(UPDATE_SRC_COMPS))
			{
				String sourceCompletenessID = super.getParameter(params, "sourceCompletenessID");
				msg = this.updateSourceCompleteness(sourceCompletenessID);
			}
			
			else if (action.equalsIgnoreCase(CREATE_SRC_COMPS))
			{
				String sourceCompletenessID = super.getParameter(params, "sourceCompletenessID");
				msg = this.createSourceCompleteness(sourceCompletenessID);
			}
			else if (action.equalsIgnoreCase(DELETE_SRC_COMPS))
			{
				String sourceCompletenessID = super.getParameter(params, "sourceCompletenessID");
				msg = this.deleteSourceCompleteness(sourceCompletenessID);
			}
									
			else if (action.equalsIgnoreCase(GET_PROVENANCES))
			{
				msg = this.getProvenances();
			}
			
			else if (action.equalsIgnoreCase(UPDATE_PROVENANCE))
			{
				String provenanceID = super.getParameter(params, "provenanceID");
				msg = this.updateProvenance(provenanceID);
			}
			
			else if (action.equalsIgnoreCase(CREATE_PROVENANCE))
			{
				String provenanceID = super.getParameter(params, "provenanceID");
				msg = this.createProvenance(provenanceID);
			}
			
			else if (action.equalsIgnoreCase(DELETE_PROVENANCE))
			{
				String provenanceID = super.getParameter(params, "provenanceID");
				msg = this.deleteProvenance(provenanceID);
			}
			else if (action.equalsIgnoreCase(GET_NOTATIONS))
			{
				msg = this.getNotations();
			}
			
			else if (action.equalsIgnoreCase(UPDATE_NOTATION))
			{
				String notationID = super.getParameter(params, "notationID");
				msg = this.updateNotation(notationID);
			}
			
			else if (action.equalsIgnoreCase(CREATE_NOTATION))
			{
				String notationID = super.getParameter(params, "notationID");
				msg = this.createNotation(notationID);
			}
			
			else if (action.equalsIgnoreCase(DELETE_NOTATION))
			{
				String notationID = super.getParameter(params, "notationID");
				msg = this.deleteNotation(notationID);
			}
			
            else
            {
                throw new Exception("Invalid action parameter.");
            }

            if (msg != null) {
				super.writeResponse(res, msg);
			}

        }
        catch (Exception e) {
		    super.writeResponse(res, e);
		}
	}
	 
	/**
	 * createSection - creates a new section.
	 * @params - 
	 * @return -
	 * @throws Exception -
	 */
	private String createSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccasion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception {

		Section s = SectionController.createSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasion, 
				notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
				provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
		return s.toJSON().toString();
		try {
			Section s = SectionController.createSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasion, 
					notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
					provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
			return s.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
    }
	}
	

	/**
	 * updateSection - 
	 * @params -
	 * @return -
	 * @throws Exception 
	 */
	private String updateSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccasion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception {
		try {
			Section s = SectionController.updateSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasion, 
				notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
				provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
		return s.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	/**
	 * getSection - 
	 * @param getLibSiglum - 
	 * @param getMSSiglum - 
	 * @param deletesectionID 
	 * @return - 
	 * @throws Exception 
	 */
	private String getSection(String libSiglum, String msSiglum, String sectionID) throws Exception {
		try {
			Section s = SectionController.getSection(libSiglum, msSiglum, sectionID);
			return s.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	

	/**
	 * @param deletesectionID 
	 * @param countries 
	 * @param libSiglums 
	 * @throws Exception 
	 * 
	 */
	private String getSections(String libSiglum, String sectionID) throws Exception {
		JSONArray sections = new JSONArray();
		ArrayList<Section> results = SectionController.getSections(libSiglum, sectionID);
		
		for (Section s : results) {
			sections.put(s.toJSON());
		}
				
		return sections.toString();
	}

	
	/**
	 * deleteManuscript - 
	 * @param deleteLibSiglum -
	 * @param deleteMSSiglum -
	 * @param deletesectionID 
	 * @return -
	 * @throws Exception 
	 */
	private String deleteSection(String deleteLibSiglum, String deleteMSSiglum, String deletesectionID) throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;
        try {
			SectionController.deleteSection(deleteLibSiglum, deleteMSSiglum, deletesectionID);
			success = true;
		}
		catch (MYSQLException e) {
			success = false;
        }
		finally {
			j.put("success", success);
			return j.toString();
		}
    }
	/**
	 *getCenturies -
	 *@return
	 *@throws Exception
	 */
	private String getCenturies() throws Exception {
		ArrayList<Century> centuries = SectionController.getCenturies();
		if (centuries == null) {
			throw new Exception("Could not load centuries.");
		}
		
		JSONArray j = new JSONArray();
		for (Century c : centuries) {
			j.put(c.toJSON());
		}
		
		return j.toString();
	}
	
	/**
	 * updateCentury - 
	 * @params -
	 * @return -
	 * @throws Exception 
	 */
	private String updateCentury(String centuryID) throws Exception {
		try {
			Century s = SectionController.updateCentury(centuryID);
			return c.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String createCentury(String centuryID) throws Exception {
		try {
			Century s = SectionController.createCentury(centuryID);
			return c.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String deleteCentury(String centuryID) throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;
		try {
			SectionController.deleteCentury(centuryID);
			success = true;
		}
		catch (MYSQLException e) {
			success = false;
		}
		finally {
			j.put("success", success);
			return j.toString();
		}
	
	private String getCursuses() throws Exception {
		ArrayList<Cursus> cursuses = SectionController.getCursuses();
		if (cursuses == null) {
			throw new Exception("Could not load cursuses.");
		}
		
		JSONArray j = new JSONArray();
		for (Cursus c : cursuses) {
			j.put(c.toJSON());
		}
		
		return j.toString();
	}
	
	private String createCursus(String cursusID) throws Exception {
		try {
			Cursus c = SectionController.createCursus(cursusID);
			return c.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String updateCursus(String cursusID) throws Exception { 
		try {
			Cursus c = SectionController.updateCursus(cursusID);
			return c.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String deleteCursus(String cursusID) throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;
		try {
			SectionController.deleteCursus(cursusID);
			success = true;
		}
		catch (MYSQLException e) {
			success = false;
		}
		finally {
			j.put("success", success);
			return j.toString();
		}
	}
	
	private String getSourceCompletenesses() throws Exception {
		ArrayList<SourceCompleteness> sc = SectionController.getSourceCompletenesses();
		if (sc == null) {
			throw new Exception("Could not load source completenesses");
		}
		
		JSONArray j = new JSONArray();
		for (SourceCompleteness s : sc) {
			j.put(s.toJSON());
		}
		
		return j.toString();
	}
	
	private String updateSourceCompleteness(String sourceCompletenessID) throws Exception {
		try {
			SourceCompleteness sc = SectionController.updateSourceCompleteness(sourceCompletenessID);
			return sc.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String createSourceCompleteness(String sourceCompletenessID) throws Exception {
		try {
			SourceCompleteness sc = SectionController.createSourceCompleteness(sourceCompletenessID);
			return sc.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String deleteSourceCompleteness(String sourceCompletenessID) throws Exception { 
		JSONObject j = new JSONObject();
		boolean = success = false;
		try {
			SectionController.deleteSourceCompleteness(sourceCompletenessID);
			success = true;
		}
		catch (MYSQLException e) {
			success = false;
		}
		finally {
			j.put("success", success);
			return j.toString();
		}
	}
	private String getProvenances() throws Exception {
		ArrayList<Provenance> prov = SectionController.getProvenances();
		if (prov == null) {
			throw new Exception("Could not load provenance");
		}
		
		JSONArray j = new JSONArray();
		for (Provenance p : prov) {
			j.put(p.toJSON());
		}
		
		return j.toString();
	}
	
	private String updateProvenance(String provenanceID) throws Exception {
		try {
			Provenance p = SectionController.updateProvenance(provenanceID);
			return p.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String createProvenance(String provenanceID) throws Exception {
		try {
			Provenance p = SectionController.createProvenance(provenanceID);
			return p.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String deleteProvenance(String provenanceID) throws Exception {
		JSONObject j = new JSONObject();
		boolean = success = false;
		try {
			SectionController.deleteProvenance(provenanceID);
			success = true;
		}
		catch (MYSQLException e) {
			success = false;
		}
		finally {
			j.put("success", success);
			return j.toString();
		}
	
	private String getNotations() throws Exception {
		ArrayList<Notation> note = SectionController.getNotations();
		if (note == null) {
			throw new Exception("Could not load notation");
		}
		
		JSONArray j = new JSONArray();
		for (Notation n : note) {
			j.put(n.toJSON());
		}
		
		return j.toString();
	}
	
	private String updateNotation(String notationID) throws Exception {
		try {
			Notation n = SectionController.updateNotation(notationID);
			return n.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String createNotation(String notationID) throws Exception {
		try {
			Notation n = SectionController.createNotation(notationID);
			return n.toJSON().toString();
		}
		catch (MySQLIntegrityConstraintViolationException) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}
	
	private String deleteNotation(String notationID) throws Exception {
		JSONObject j = new JSONObject();
		boolean = success = false;
		try {
			SectionController.deleteNotation(notationID);
			success = true;
		}
		catch (MYSQLException e) {
			success = false;
		}
		finally {
			j.put("success", success);
			return j.toString();
		}
	}
}
