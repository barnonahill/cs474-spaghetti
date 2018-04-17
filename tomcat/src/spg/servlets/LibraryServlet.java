package spg.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;

import spg.models.Country;

/**
 * @author Carl Clermont
 * @version 2018-04-16
 */
public class LibraryServlet extends SpgHttpServlet {

	//From the Country table.
	public static final String GET_COUNTRIES 	= "GetCountries";
	public static final String GET_COUNTRY 		= "GetCountry";
	
	//From the Library table.
	public static final String CREATE_LIBRARY 	= "CreateLibrary";
	public static final String UPDATE_LIBRARY 	= "UpdateLibrary";
	public static final String GET_LIBRARY 		= "GetLibrary";
	public static final String GET_LIBRARIES 	= "GetLibraries";
	
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
			String action = super.getAction(req);
			action.toLowerCase();
			
			String msg = null;
			
			switch (action) 
			{
				case GET_COUNTRIES:
					msg = this.getCountries();
					break;
				case GET_COUNTRY:
					String countryCode = req.getParameter("countryCode");
					if (countryCode == null || countryCode.isEmpty()) {
						throw new Exception("Missing countryCode parameter.");
					}
					msg = this.getCountry(countryCode);
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
		
		return countries.toString();
	}
	
	/**
	 * Gets the JSON String of the country with the matching countryCode.
	 * @param countryCode
	 * @return
	 */
	public String getCountry(String countryCode) throws Exception {
		Country country;
		return null;
		// TODO get country
		
		//if (c != null) {
		//	return c.toString();
		//}
		//else {
		//	throw new Exception("Could not find a country with countryCode " + countryCode);
		//}
	}
	
}
