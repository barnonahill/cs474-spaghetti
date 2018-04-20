package spg.servlets;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 
 * @author Carl Clermont
 *
 */
public class ManuscriptServlet extends SpgHttpServlet{
	private static final long serialVersionUID = 1L;
	
	public static final String CREATE_MSTYPE 		= "createmsType";
	public static final String UPDATE_MSTYPE 		= "updatemsType";
	public static final String GET_MSTYPE 			= "getMstypes";
	
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
					// TODO
					break;
				case UPDATE_MSTYPE:
					// TODO
					break;
				case GET_MSTYPE:
					// TODO
					break;
				case CREATE_MANUSCRIPT:
					// TODO
					break;
				case UPDATE_MANUSCRIPT:
					// TODO
					break;
				case GET_MANUSCRIPT:
					// TODO
					break;
				case GET_MANUSCRIPTS:
					// TODO
					break;
				case DELETE_MANUSCRIPT:
					// TODO
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
	
	
}
