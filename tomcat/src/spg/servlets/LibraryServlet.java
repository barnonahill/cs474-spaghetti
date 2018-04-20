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
	public static final String CREATE_LIBRARY 	= "createlibrary";
	public static final String UPDATE_LIBRARY 	= "updatelibrary";
	public static final String GET_LIBRARY 		= "getlibrary";
	public static final String GET_LIBRARIES 	= "getlibraries";
	
	public static final String CREATE_CENTURY 	= "createcentury";
	public static final String GET_CENTURY 		= "getcentury";
	public static final String GET_CENTURIES 	= "getcenturies";
	
	
	// Don't implement these here. They should go in the SectionService. -Paul 
	public static final String CREATE_CURSUS 	= "createcursus";
	public static final String GET_CURSUS 		= "getcursus";
	public static final String GET_CURSUSES	 	= "getcursuses";
	
	
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
					//None of these are checked for null. Not sure if that needs to be done.
					// ^ TODO ALWAYS VERIFY FRONT-END INPUT -Paul
					String createLibSiglum = params.get("libSiglum");
					String createCountryID = params.get("countryID");
					String createCity = params.get("city");
					String createLibrary = params.get("library");
					String createAddress1 = params.get("address1");
					String createAddress2 = params.get("address2");
					String createPostCode = params.get("postCode");
					msg = this.createLibrary(createLibSiglum, createCountryID, createCity, createLibrary,
							createAddress1, createAddress2, createPostCode);
					break;
				case UPDATE_LIBRARY:
					// TODO
					
					
					break;
				case GET_LIBRARY:
					// TODO
					break;
				case GET_LIBRARIES:
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
	
	/**
	 * getCountries - handles getting and returning countries.
	 * @return - A JSONArray filled with countries. 
	 * @throws Exception 
	 */
	public String getCountries() throws Exception {
		JSONArray countries = new JSONArray();
		ArrayList<Country> results = LibraryController.getCountries();
		
		for(Country c : results) {
			countries.put(c.toJSON());
		}

		return countries.toString();
	}
	
	/**
	 * createLibrary - library creation handler.
	 * @params - condensed - (im lazy) the columns of the Library table.
	 * @return - a string representation of a JSON representation of the Library made.
	 * @throws Exception - anything.
	 */
	public String createLibrary(String libSiglum, String countryID, String city,
			String library, String address1, String address2, String postCode) throws Exception {
		
		Library lib = LibraryController.createLibrary(libSiglum, countryID, city, library, address1, address2, postCode);
		return lib.toJSON().toString();
	}
	
	/**
	 * 
	 * @param columnName
	 * @param newValue
	 * @return
	 */
	public String updateLibrary(String columnName, String newValue /*, ,*/) {
		return null;
	}
	
	
	/**
	 * getLibraries - handles getting and returning Libraries.
	 * @return A JSONArray filled with libraries.
	 * @throws Exception 
	 */
	public String getLibraries(String countryID) throws Exception {
		JSONArray libraries = new JSONArray();
		ArrayList<Library> results = LibraryController.getLibraries(countryID);
		
		for(Library l : results) {
			libraries.put(l.toJSON());
		}
				
		return libraries.toString();
	}
}
