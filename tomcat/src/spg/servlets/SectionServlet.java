package spg.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import spg.controllers.ManuscriptController;
import spg.controllers.SectionController;
import spg.models.MSType;
import spg.models.Manuscript;
import spg.models.Section;

/**
 * 
 * @author Kyle Tran
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
	
	
	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try 
		{
			Map<String, String> params = super.getParameters(req);
			String action = super.getParameter(params, "action").toLowerCase();
			String msg = null;
			if (action.equalsIgnoreCase("CREATE_SECTION"))
            {
                String createLibSiglum = super.getParameter(params, "libSiglum");
				String createMSSiglum = super.getParameter(params, "msSiglum");
				String createSectionID = super.getParameter(params, "sectionID");
				String createSectionType = super.getParameter(params, "sectionType");
				String createLiturgicalOccassions = super.getParameter(params, "liturgicalOccassion");
				String createNotationID = super.getParameter(params, "notationID");
				String createNumGatherings = super.getParameter(params, "numGatherings");
				String createNumColumns = super.getParameter(params, "numColumns");
				String createLinesPerColumn = super.getParameter(params, "linesPerColumn");
				String createScribe = super.getParameter(params, "scribe");
				String createDate = super.getParameter(params, "date");
				String createCenturyID = super.getParameter(params, "centuryID");
				String createCursusID = super.getParameter(params, "cursusID");
				String createProvenanceID = super.getParameter(params, "provenanceID");
				String createProvenanceDetail = super.getParameter(params, "provenanceDetail");
				String createCommissioner = super.getParameter(params, "commissioner");
				String createInscription = super.getParameter(params, "inscription");
				String createColophon = super.getParameter(params, "colophon");
				String createSourceCompletenessID = super.getParameter(params, "sourceCompletenessID");
					
				msg = this.createSection(createLibSiglum, createMSSiglum, createSectionID, createSectionType,
						createLiturgicalOccassions, createNotationID, createNumGatherings, createNumColumns,
						createLinesPerColumn, createScribe, createDate, createCenturyID, createCursusID,
						createProvenanceID, createProvenanceDetail, createCommissioner, createInscription,
						createColophon, createSourceCompletenessID);
            }

            else if (action.equalsIgnoreCase("UPDATE_SECTION"))
            {
				String updateLibSiglum = super.getParameter(params, "libSiglum");
				String updateMSSiglum = super.getParameter(params, "msSiglum");
				String updateSectionID = super.getParameter(params, "sectionID");
				String updateSectionType = super.getParameter(params, "sectionType");
				String updateLiturgicalOccassions = super.getParameter(params, "liturgicalOccassions");
				String updateNotationID = super.getParameter(params, "notationID");
				String updateNumGatherings = super.getParameter(params, "numGatherings");
				String updateNumColumns = super.getParameter(params, "numColumns");
				String updateLinesPerColumn = super.getParameter(params, "linesPerColumn");
				String updateScribe = super.getParameter(params, "scribe");
				String updateDate = super.getParameter(params, "date");
				String updateCenturyID = super.getParameter(params, "centuryID");
				String updateCursusID = super.getParameter(params, "cursusID");
				String updateProvenanceID = super.getParameter(params, "provenanceID");
				String updateProvenanceDetail = super.getParameter(params, "provenanceDetail");
				String updateCommissioner = super.getParameter(params, "commissioner");
				String updateInscription = super.getParameter(params, "inscription");
				String updateColophon = super.getParameter(params, "colophon");
				String updateSourceCompletenessID = super.getParameter(params, "sourceCompletenessID");
					
				msg = this.updateSection(updateLibSiglum, updateMSSiglum, updateSectionID, updateSectionType,
						updateLiturgicalOccassions, updateNotationID, updateNumGatherings, updateNumColumns,
						updateLinesPerColumn, updateScribe, updateDate, updateCenturyID, updateCursusID,
						updateProvenanceID, updateProvenanceDetail, updateCommissioner, updateInscription,
						updateColophon, updateSourceCompletenessID);
            }
            
            else if (action.equalsIgnoreCase("GET_SECTION"))
            {
				String getLibSiglum = super.getParameter(params, "libSiglum");
				String getMSSiglum = super.getParameter(params, "msSiglum");
				msg = this.getSection(getLibSiglum, getMSSiglum);
            }
            else if (action.equalsIgnoreCase("GET_SECTIONS"))
            {
				String getLibSiglums = super.getParameter(params, "libSiglum");
				String getSectionID = super.getParameter(params, "sectionID");
				msg = this.getSections(getLibSiglums, getSectionID);
            }
            
            else if(action.equalsIgnoreCase("DELETE_SECTION"))
            {
				String deleteLibSiglum = super.getParameter(params, "libSiglum");
				String deleteMSSiglum = super.getParameter(params, "msSiglum");
				msg = this.deleteManuscript(deleteLibSiglum, deleteMSSiglum);
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
	private String createSection(String createLibSiglum, String createMSSiglum, String createSectionID, String createSectionType,
			String createLiturgicalOccassions, String createNotationID, String createNumGatherings, String createNumColumns,
			String createLinesPerColumn, String createScribe, String createDate, String createCenturyID, String createCursusID,
			String createProvenanceID, String createProvenanceDetail, String createCommissioner, String createInscription,
			String createColophon, String createSourceCompletenessID) throws Exception {
		Section s = SectionController.createSection(createLibSiglum, createMSSiglum, createSectionID, createSectionType,
				createLiturgicalOccassions, createNotationID, createNumGatherings, createNumColumns,
				createLinesPerColumn, createScribe, createDate, createCenturyID, createCursusID,
				createProvenanceID, createProvenanceDetail, createCommissioner, createInscription,
				createColophon, createSourceCompletenessID);
		return s.toJSON().toString();
	}
	

	/**
	 * updateSection - 
	 * @params -
	 * @return -
	 * @throws Exception 
	 */
	private String updateSection(String updateLibSiglum, String updateMSSiglum, String updateSectionID, String updateSectionType,
			String updateLiturgicalOccassions, String updateNotationID, String updateNumGatherings, String updateNumColumns,
			String updateLinesPerColumn, String updateScribe, String updateDate, String updateCenturyID, String updateCursusID,
			String updateProvenanceID, String updateProvenanceDetail, String updateCommissioner, String updateInscription,
			String updateColophon, String updateSourceCompletenessID) throws Exception {
		Section s = SectionController.updateSection(updateLibSiglum, updateMSSiglum, updateSectionID, updateSectionType,
				updateLiturgicalOccassions, updateNotationID, updateNumGatherings, updateNumColumns,
				updateLinesPerColumn, updateScribe, updateDate, updateCenturyID, updateCursusID,
				updateProvenanceID, updateProvenanceDetail, updateCommissioner, updateInscription,
				updateColophon, updateSourceCompletenessID);
		return s.toJSON().toString();
	}
	
	/**
	 * getSection - 
	 * @param getLibSiglum - 
	 * @param getMSSiglum - 
	 * @return - 
	 * @throws Exception 
	 */
	private String getSection(String getLibSiglum, String getMSSiglum) throws Exception {
		Section s = SectionController.getSection(getLibSiglum, getMSSiglum);
		return s.toJSON().toString();
	}
	

	/**
	 * @param countries 
	 * @param libSiglums 
	 * @throws Exception 
	 * 
	 */
	private String getSections(String libSiglum, String sectionID) throws Exception {
		JSONArray sections = new JSONArray();
		ArrayList<Section> results = SectionController.getSections(libSiglum, sectionID);
		
		for(Section test : results) {
			sections.put(test.toJSON());
		}
				
		return sections.toString();
	}

	
	/**
	 * deleteManuscript - 
	 * @param deleteLibSiglum -
	 * @param deleteMSSiglum -
	 * @return -
	 * @throws Exception 
	 */
	private String deleteSection(String deleteLibSiglum, String deleteMSSiglum) throws Exception {
		SectionController.deleteSection(deleteLibSiglum, deleteMSSiglum);
		JSONObject j = new JSONObject();
        j.put("success", true);
		return j.toString();
	}

	

}
