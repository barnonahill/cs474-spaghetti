package spg.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import spg.controllers.LibraryController;
import spg.controllers.ManuscriptController;
import spg.models.MSType;
import spg.models.Manuscript;

/**
 * 
 * @author Carl Clermont, Paul Barnhill, Zach Butts
 *
 */
@WebServlet(name="ManuscriptServices", urlPatterns= {"/manuscript"})
public class ManuscriptServlet extends SpgHttpServlet{
	private static final long serialVersionUID = 1L;
	private ManuscriptController manuscriptController;
	
	public static final String CREATE_MSTYPE 		= "createmstype";
	public static final String UPDATE_MSTYPE 		= "updatemstype";
	public static final String GET_MSTYPES 			= "getmstypes";
	public static final String DELETE_MSTYPE		= "deletemstype";
	
	public static final String CREATE_MANUSCRIPT 	= "createmanuscript";
	public static final String UPDATE_MANUSCRIPT 	= "updatemanuscript";
	public static final String GET_MANUSCRIPT 		= "getmanuscript";
	public static final String GET_MANUSCRIPTS 		= "getmanuscripts";
	public static final String DELETE_MANUSCRIPT	= "deletemanuscript";
	
	public ManuscriptServlet() {
		super();
		this.manuscriptController = new ManuscriptController();
	}
	
	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try 
		{
			Map<String, String> params = super.getParameters(req);
			String action = super.getRequiredParameter(params, "action").toLowerCase();
			String msg = null;
			
			manuscriptController.open();
			if(action.equalsIgnoreCase(CREATE_MSTYPE))
            {
                String msType = super.getRequiredParameter(params, "msType");
				String msTypeName = super.getParameter(params, "msTypeName");
				msg = this.createMSType(msType, msTypeName);
            }

            else if (action.equalsIgnoreCase(UPDATE_MSTYPE))
            {
            	String msType = super.getRequiredParameter(params, "msType");
				String msTypeName = super.getParameter(params, "msTypeName");
                msg = this.updateMSType(msType, msTypeName);    
            }

            else if (action.equalsIgnoreCase(GET_MSTYPES))
            {
                msg = this.getMSTypes();   
            }

            else if (action.equalsIgnoreCase(DELETE_MSTYPE))
            {
                String msType = super.getRequiredParameter(params, "msType");
				msg = this.deleteMSType(msType);  
            }

            else if (action.equalsIgnoreCase(CREATE_MANUSCRIPT))
            {
                String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String msSiglum = super.getRequiredParameter(params, "msSiglum");
				String msType = super.getParameter(params, "msType");
				String dimensions = super.getParameter(params, "dimensions");
				String leaves = super.getParameter(params, "leaves");
				String foliated = super.getParameter(params, "foliated");
				String vellum = super.getParameter(params, "vellum");
				String binding = super.getParameter(params, "binding");
				String sourceNotes = super.getParameter(params, "sourceNotes");
				String summary = super.getParameter(params, "summary");
				String bibliography = super.getParameter(params, "bibliography");
					
				msg = this.createManuscript(libSiglum, msSiglum, msType, dimensions,
						leaves, foliated, vellum, binding, sourceNotes, summary, bibliography);
            }

            else if (action.equalsIgnoreCase(UPDATE_MANUSCRIPT))
            {
                String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String msSiglum = super.getRequiredParameter(params, "msSiglum");
				String msType = super.getParameter(params, "msType");
				String dimensions = super.getParameter(params, "dimensions");
				String leaves = super.getParameter(params, "leaves");
				String foliated = super.getParameter(params, "foliated");
				String vellum = super.getParameter(params, "vellum");
				String binding = super.getParameter(params, "binding");
				String sourceNotes = super.getParameter(params, "sourceNotes");
				String summary = super.getParameter(params, "summary");
				String bibliography = super.getParameter(params, "bibliography");
					
				msg = this.updateManuscript(libSiglum, msSiglum, msType, dimensions,
						leaves, foliated, vellum, binding, sourceNotes, summary, bibliography);
            }
            
            else if (action.equalsIgnoreCase(GET_MANUSCRIPT))
            {
            	String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String msSiglum = super.getRequiredParameter(params, "msSiglum");
				msg = this.getManuscript(libSiglum, msSiglum);
            }
            else if (action.equalsIgnoreCase(GET_MANUSCRIPTS))
            {
            	//not required b/c we sometimes need all, and sometimes filter.
            	String libSiglums = super.getParameter(params, "libSiglum");
				msg = this.getManuscripts(libSiglums);
            }
            
            else if(action.equalsIgnoreCase(DELETE_MANUSCRIPT))
            {
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String msSiglum = super.getRequiredParameter(params, "msSiglum");
				msg = this.deleteManuscript(libSiglum, msSiglum);
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
		finally {
			try {
				manuscriptController.close();
			}
			catch (Exception e) {
				System.err.println("Exception closing manuscriptController: " + e.getMessage());
			}
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
		MSType mst = manuscriptController.createMSType(msType, msTypeName);
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
        MSType mst = manuscriptController.updateMSType(updateMSTypeMSType, updateMSTypeMSTypeName);
        return mst.toJSON().toString();
	}

	/**
     *getMSType - gets an existing MSType
     *@param getMSTypeMSType
     *@param getMSTypeMSTypeName
     *@return
     */
    public String getMSTypes() throws Exception
    {
        JSONArray msTypes = new JSONArray();
		ArrayList<MSType> results = manuscriptController.getMSTypes();
		
		for(MSType m : results) {
			msTypes.put(m.toJSON());
		}
				
		return msTypes.toString();
	}

    private String deleteMSType(String MSType) throws Exception {
		manuscriptController.deleteMSType(MSType);
		JSONObject j = new JSONObject();
        j.put("success", true);
		return j.toString();
	}
		
	/**
	 * createManuscript - creates a new manuscript.
	 * @params - 
	 * @return -
	 * @throws Exception -
	 */
	private String createManuscript(String libSiglum, String msSiglum, String msType,
			String dimensions, String leaves, String foliated, String vellum,
			String binding, String sourceNotes, String summary, String bibliography) throws Exception {
		if(manuscriptController.getManuscriptOrNull(libSiglum, msSiglum) != null) {
			throw new Exception("Manuscript with same libSiglum and msType already exists.");
		}
		
		Manuscript ms = manuscriptController.createManuscript(libSiglum, msSiglum, msType, dimensions,
				leaves, foliated, vellum, binding, sourceNotes, summary, bibliography);
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
		Manuscript ms = manuscriptController.updateManuscript(updateLibSiglum, updateMSSiglum, updateMSType, updateDimensions,
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
	private String getManuscript(String libSiglum, String msSiglum) throws Exception {
		Manuscript ms = manuscriptController.getManuscript(libSiglum, msSiglum);
		return ms.toString();
	}
	

	/**
	 * @param countries 
	 * @param libSiglums 
	 * @throws Exception 
	 * 
	 */
	private String getManuscripts(String libSiglum) throws Exception {
		JSONArray manuscripts = new JSONArray();
		ArrayList<Manuscript> results = manuscriptController.getManuscripts(libSiglum);
		
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
		manuscriptController.deleteManuscript(deleteLibSiglum, deleteMSSiglum);
		JSONObject j = new JSONObject();
        j.put("success", true);
		return j.toString();
	}

	
	
}
