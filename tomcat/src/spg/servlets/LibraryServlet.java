package spg.servlets;

import java.io.IOException;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import spg.models.Country;
import spg.models.Library;

/**
 * Library-related services.
 * 
 * @author Paul Barnhill, Carl Clermont
 * @version 2018-04-18
 */
@WebServlet(name="LibraryServices", urlPatterns= {"/library"})
public class LibraryServlet extends SpgHttpServlet {
	private static final long serialVersionUID = 1L;
	
	//From the Country table.
	public static final String GET_COUNTRIES 	= "getcountries";
	
	//From the Library table.
	public static final String CREATE_LIBRARY 	= "CreateLibrary";
	public static final String UPDATE_LIBRARY 	= "UpdateLibrary";
	public static final String GET_LIBRARY 		= "getlibrary";
	public static final String GET_LIBRARIES 	= "getlibraries";
	
	public static final String CREATE_CENTURY 	= "CreateCentury";
	public static final String GET_CENTURY 		= "GetCentury";
	public static final String GET_CENTURIES 	= "GetCenturies";
	
	public static final String CREATE_CURSUS 	= "CreateCursus";
	public static final String GET_CURSUS 		= "GetCursus";
	public static final String GET_CURSUSES	 	= "GetCursuses";
	
	
	public LibraryServlet() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try 
		{
			Map<String, String> params = super.getParameters(req);
			String action = super.getParameter(params, "action").toLowerCase();
			String msg = null;
			
			// Actions are in node/src/proxies/LibraryProxy.ts
			switch (action) 
			{
				case GET_COUNTRIES:
					msg = this.getCountries();
					break;
				case CREATE_LIBRARY:
					// TODO
					break;
				case UPDATE_LIBRARY:
					// TODO
					break;
				case GET_LIBRARY:
					// TODO
					break;
				case GET_LIBRARIES:
					// TODO
					String countryID = super.getParameter(params, "countryID");
					msg = this.getLibraries(countryID);
					break;
				case CREATE_CENTURY:
					// TODO
					break;
				case GET_CENTURY:
					// TODO
					break;
				case GET_CENTURIES:
					// TODO
					break;
				case CREATE_CURSUS:
					// TODO
					break;
				case GET_CURSUS:
					// TODO
					break;
				case GET_CURSUSES:
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
	
	public String getCountries() {
		JSONArray countries = new JSONArray();
		Country country;
		
		// TODO read countries into JSONArray
		/* Example
		 * country = new Country("US", "United States");
		 * countries.put(country.toJSON());
		 */
		
		// Dummy code for front-end. TODO replace with code that connects to DB
		country = new Country("US", "United States");
		countries.put(country.toJSON());
		
		return countries.toString();
	}
	
	public String getLibraries(String countryID) {
		JSONArray libraries = new JSONArray();
		Library library;
		
		// TODO read libraries from DB
		
		// Dummy code for front-end. TODO replace with code that connects to DB
		library = new Library("US-Cn", "US", "Chicago", "Newberry Library", null, null, null);
		libraries.put(library.toJSON());
				
		return libraries.toString();
	}
}
