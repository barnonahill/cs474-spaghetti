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
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				String sectionType = super.getParameter(params, "sectionType");
				String liturgicalOccassions = super.getParameter(params, "liturgicalOccassions");
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
					
				msg = this.createSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccassions, 
						notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
						provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
            }

            else if (action.equalsIgnoreCase("UPDATE_SECTION"))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				String sectionType = super.getParameter(params, "sectionType");
				String liturgicalOccassions = super.getParameter(params, "liturgicalOccassions");
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
					
				msg = this.updateSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccassions, 
						notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
						provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
            }
            
            else if (action.equalsIgnoreCase("GET_SECTION"))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				msg = this.getSection(libSiglum, msSiglum, sectionID);
            }
            else if (action.equalsIgnoreCase("GET_SECTIONS"))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				msg = this.getSections(libSiglum, msSiglum, sectionID);
            }
            
            else if(action.equalsIgnoreCase("DELETE_SECTION"))
            {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");
				String sectionID = super.getParameter(params, "sectionID");
				msg = this.deleteSection(libSiglum, msSiglum, sectionID);
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
			String liturgicalOccassion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception {
		if(SectionController.getSectionOrNull(libSiglum, msSiglum, sectionID) != null) {
			throw new Exception("Section with same libSiglum, msType, and sectionID already exists.");
		}
		
		
		Section s = SectionController.createSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccassion, 
				notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
				provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
		return s.toJSON().toString();
	}
	

	/**
	 * updateSection - 
	 * @params -
	 * @return -
	 * @throws Exception 
	 */
	private String updateSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccassion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID,
			String provenanceID, String provenanceDetail, String commissioner,
			String inscription, String colophon, String sourceCompletenessID) throws Exception {
		Section s = SectionController.updateSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccassion, 
				notationID, numGatherings, numColumns,	linesPerColumn, scribe, date, centuryID, cursusID,
				provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
		return s.toJSON().toString();
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
		Section s = SectionController.getSection(libSiglum, msSiglum, sectionID);
		return s.toJSON().toString();
	}
	

	/**
	 * @param deletesectionID 
	 * @param countries 
	 * @param libSiglums 
	 * @throws Exception 
	 * 
	 */
	private String getSections(String libSiglum, String sectionID, String deletesectionID) throws Exception {
		JSONArray sections = new JSONArray();
		ArrayList<Section> results = SectionController.getSections(libSiglum, sectionID, deletesectionID);
		
		for(Section s : results) {
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
		SectionController.deleteSection(deleteLibSiglum, deleteMSSiglum, deletesectionID);
		JSONObject j = new JSONObject();
        j.put("success", true);
		return j.toString();
	}

	

}
