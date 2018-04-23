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
import spg.models.MSType;
import spg.models.Manuscript;

/**
 * 
 * @author Carl Clermont
 *
 */
@WebServlet(name="ManuscriptServices", urlPatterns= {"/manuscript"})
public class ManuscriptServlet extends SpgHttpServlet{
	private static final long serialVersionUID = 1L;
	
	public static final String CREATE_MSTYPE 		= "createmstype";
	public static final String UPDATE_MSTYPE 		= "updatemstype";
	public static final String GET_MSTYPES 			= "getmstypes";
	public static final String DELETE_MSTYPE		= "deletemstype";
	
	public static final String CREATE_MANUSCRIPT 	= "createmanuscript";
	public static final String UPDATE_MANUSCRIPT 	= "updatemanuscript";
	public static final String GET_MANUSCRIPT 		= "getmanuscript";
	public static final String GET_MANUSCRIPTS 		= "getmanuscripts";
	public static final String DELETE_MANUSCRIPT	= "deletemanuscripts";
	
	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try 
		{
			Map<String, String> params = super.getParameters(req);
			String action = super.getParameter(params, "action").toLowerCase();
			String msg = null;
			
			// Actions are in node/src/proxies/ManuscriptProxy.ts
			switch (action) 
			{
				case CREATE_MSTYPE:
					String MSTypeMSType = params.get("msType");
					String MSTypeMSTypeName = params.get("msTypeName");
					msg = this.createMSType(MSTypeMSType, MSTypeMSTypeName);
					break;
				case UPDATE_MSTYPE:
				    String updateMSTypeMSType = params.get("msType");
                    String updateMSTypeMSTypeName = params.get("msTypeName");
                    msg = this.updateMSType(updateMSTypeMSType, updateMSTypeMSTypeName);
					break;
				case GET_MSTYPES:
					// TODO should return array of all MsTypes - Paul
					String getMSTypeMSType = params.get("msType");
                    String getMSTypeMSTypeName = params.get("msTypeName");
                    msg = this.getMSType(getMSTypeMSType, getMSTypeMSTypeName);
					break;
				case DELETE_MSTYPE:
					// TODO implement - Paul
					// If you use if-elsif blocks you don't need these funky var names. -Paul
					// Since you're using a switch, this is the equivalent of declaring all these
					// variables at the top. Incredibly inefficient.
					String msType = params.get("msType");
				case CREATE_MANUSCRIPT:
					String createLibSiglum = params.get("libSiglum");
					String createMSSiglum = params.get("msSiglum");
					String createMSType = params.get("msType");
					String createDimensions = params.get("dimensions");
					String createLeaves = params.get("leaves");
					String createFoliated = params.get("foliated");
					String createVellum = params.get("vellum");
					String createBinding = params.get("binding");
					String createSourceNotes = params.get("sourceNotes");
					String createSummary = params.get("summary");
					String createBibliography = params.get("bibliography");
					
					msg = this.createManuscript(createLibSiglum, createMSSiglum, createMSType, createDimensions,
							createLeaves, createFoliated, createVellum, createBinding, createSourceNotes,
							createSummary, createBibliography);
					break;
				case UPDATE_MANUSCRIPT:
					String updateLibSiglum = params.get("libSiglum");
					String updateMSSiglum = params.get("msSiglum");
					String updateMSType = params.get("msType");
					String updateDimensions = params.get("dimensions");
					String updateLeaves = params.get("leaves");
					String updateFoliated = params.get("foliated");
					String updateVellum = params.get("vellum");
					String updateBinding = params.get("binding");
					String updateSourceNotes = params.get("sourceNotes");
					String updateSummary = params.get("summary");
					String updateBibliography = params.get("bibliography");
					
					msg = this.updateManuscript(updateLibSiglum, updateMSSiglum, updateMSType, updateDimensions,
							updateLeaves, updateFoliated, updateVellum, updateBinding, updateSourceNotes,
							updateSummary, updateBibliography);
					break;
				case GET_MANUSCRIPT:
					String getLibSiglum = params.get("libSiglum");
					String getMSSiglum = params.get("msSiglum");
					
					msg = this.getManuscript(getLibSiglum, getMSSiglum);
					break;
				case GET_MANUSCRIPTS:
					String getLibSiglums = params.get("libSiglum");
					String getCountries = params.get("country");
					msg = this.getManuscripts(getLibSiglums, getCountries);
					break;
				case DELETE_MANUSCRIPT:
					String deleteLibSiglum = params.get("libSiglum");
					String deleteMSSiglum = params.get("msSiglum");
					
					msg = this.deleteManuscript(deleteLibSiglum, deleteMSSiglum);
					break;
				default:
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
	 * createMSType -
	 * @param msType - 
	 * @param msTypeName - 
	 * @return - 
	 * @throws Exception - 
	 */
	public String createMSType(String msType, String msTypeName) throws Exception {
		MSType mst = ManuscriptController.createMSType(msType, msTypeName);
		return mst.toJSON().toString();
	}
	/**
     *updateMSType - updates an existing MSType
     *@param updateMSTypeMSType
     *@param updateMSTypeMSTypeName
     *@return
     */
    public String updateMSType(String updateMSTypeMSType, String updateMSTypeMSTypeName) throws Exception
    {
        MSType mst = ManuscriptController.updateMSType(updateMSTypeMSType, updateMSTypeMSTypeName);
        return mst.toJSON().toString();
	}

	/**
     *getMSType - gets an existing MSType
     *@param getMSTypeMSType
     *@param getMSTypeMSTypeName
     *@return
     */
    public String getMSType(String getMSTypeMSType, String getMSTypeMSTypeName) throws Exception
    {
        MSType mst = ManuscriptController.getMSType(getMSTypeMSType, getMSTypeMSTypeName);
        return mst.toJSON().toString();
	}
		
	/**
	 * createManuscript - creates a new manuscript.
	 * @params - 
	 * @return -
	 * @throws Exception -
	 */
	private String createManuscript(String createLibSiglum, String createMSSiglum, String createMSType,
			String createDimensions, String createLeaves, String createFoliated, String createVellum,
			String createBinding, String createSourceNotes, String createSummary, String createBibliography) throws Exception {
		Manuscript ms = ManuscriptController.createManuscript(createLibSiglum, createMSSiglum, createMSType, createDimensions,
				createLeaves, createFoliated, createVellum, createBinding, createSourceNotes,
				createSummary, createBibliography);
		return ms.toJSON().toString();
	}
	

	/**
	 * updateManuscript - 
	 * @params -
	 * @return -
	 * @throws Exception 
	 */
	private String updateManuscript(String updateLibSiglum, String updateMSSiglum, String updateMSType,
			String updateDimensions, String updateLeaves, String updateFoliated, String updateVellum,
			String updateBinding, String updateSourceNotes, String updateSummary, String updateBibliography) throws Exception {
		Manuscript ms = ManuscriptController.updateManuscript(updateLibSiglum, updateMSSiglum, updateMSType, updateDimensions,
				updateLeaves, updateFoliated, updateVellum, updateBinding, updateSourceNotes,
				updateSummary, updateBibliography);
		return ms.toJSON().toString();
	}
	
	/**
	 * getManuscript - 
	 * @param getLibSiglum - 
	 * @param getMSSiglum - 
	 * @return - 
	 * @throws Exception 
	 */
	private String getManuscript(String getLibSiglum, String getMSSiglum) throws Exception {
		Manuscript ms = ManuscriptController.getManuscript(getLibSiglum, getMSSiglum);
		return ms.toJSON().toString();
	}
	

	/**
	 * @param countries 
	 * @param libSiglums 
	 * @throws Exception 
	 * 
	 */
	private String getManuscripts(String libSiglum, String country) throws Exception {
		JSONArray manuscripts = new JSONArray();
		ArrayList<Manuscript> results = ManuscriptController.getManuscripts(libSiglum, country);
		
		for(Manuscript m : results) {
			manuscripts.put(m.toJSON());
		}
				
		return manuscripts.toString();
	}

	
	/**
	 * deleteManuscript - 
	 * @param deleteLibSiglum -
	 * @param deleteMSSiglum -
	 * @return -
	 * @throws Exception 
	 */
	private String deleteManuscript(String deleteLibSiglum, String deleteMSSiglum) throws Exception {
		ManuscriptController.deleteManuscript(deleteLibSiglum, deleteMSSiglum);
		JSONObject j = new JSONObject();
        j.put("success", true);
		return j.toString();
	}

	
	
}
