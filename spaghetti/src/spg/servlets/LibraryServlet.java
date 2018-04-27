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
	private LibraryController libraryController;
	
	
	private static final long serialVersionUID = 1L;
	
	//From the Country table.
	public static final String GET_COUNTRIES 	= "getcountries";
	
	//From the Library table.
	public static final String CREATE_LIBRARY 	= "createlibrary";
	public static final String UPDATE_LIBRARY 	= "updatelibrary";
	public static final String GET_LIBRARY 		= "getlibrary";
	public static final String GET_LIBRARIES 	= "getlibraries";
	public static final String DELETE_LIBRARY	= "deletelibrary"; // 
	
	public LibraryServlet() {
		super();
		this.libraryController = new LibraryController();
	}

	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try 
		{
			Map<String, String> params = super.getParameters(req);
			String action = super.getRequiredParameter(params, "action").toLowerCase();
			String msg = null;
			
			// Actions are in node/src/proxies/LibraryProxy.ts
			// We have an existing action, open our connection.
			libraryController.open();
			switch (action) 
			{
				 
				case GET_COUNTRIES:
					msg = this.getCountries();
					break;
				case CREATE_LIBRARY:
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
					String updateLibSiglum = params.get("libSiglum");
					String updateCountryID = params.get("countryID");
					String updateCity = params.get("city");
					String updateLibrary = params.get("library");
					String updateAddress1 = params.get("address1");
					String updateAddress2 = params.get("address2");
					String updatePostCode = params.get("postCode");
					msg = this.updateLibrary(updateLibSiglum, updateCountryID,updateCity,updateLibrary,
							updateAddress1,updateAddress2,updatePostCode);
					break;
				case GET_LIBRARY:
					String getLibSiglum = super.getRequiredParameter(params, "libSiglum");
					msg = this.getLibrary(getLibSiglum);
					break;
				case GET_LIBRARIES:
					String countryID = super.getRequiredParameter(params, "countryID");
					msg = this.getLibraries(countryID);
					break;
				case DELETE_LIBRARY:
					String libSiglum = super.getRequiredParameter(params, "libSiglum");
					msg = this.deleteLibrary(libSiglum);
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
		finally {
			try {
				libraryController.close();
			}
			catch (Exception e) {}
		}
	}	


	/**
	 * getCountries - handles getting and returning countries.
	 * @return - A JSONArray filled with countries. 
	 * @throws Exception 
	 */
	public String getCountries() throws Exception {
		JSONArray countries = new JSONArray();
		ArrayList<Country> results = libraryController.getCountries();
		
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
		//Check if it already exists:
		if(libraryController.getLibraryOrNull(libSiglum) != null) {
			throw new Exception("Library with same libSiglum already exists.");
		}
		
		Library lib = libraryController.createLibrary(libSiglum, countryID, city, library, address1, address2, postCode);
		return lib.toJSON().toString();
	}
	
	/**
	 * 
	 * @param columnName
	 * @param newValue
	 * @param updatePostCode 
	 * @param updateAddress2 
	 * @param updateAddress1 
	 * @param updateLibrary 
	 * @param updateCity 
	 * @return
	 */
	public String updateLibrary(String LibSiglum, String CountryID , String City, 
			String Library, String Address1, String Address2, String PostCode) throws Exception {
		Library lib = libraryController.updateLibrary(LibSiglum, CountryID, City, Library, Address1, Address2, PostCode);
		return lib.toJSON().toString();
	}
	
	
	/**
	 * gets a single Library.
	 * @param libSiglum
	 * @return
	 * @throws Exception
	 */
	private String getLibrary(String libSiglum) throws Exception {
		Library l = libraryController.getLibrary(libSiglum);
		return l.toJSON().toString();
	}
	
	
	/**
	 * getLibraries - handles getting and returning Libraries.
	 * @return A JSONArray filled with libraries.
	 * @throws Exception 
	 */
	public String getLibraries(String countryID) throws Exception {
		JSONArray libraries = new JSONArray();
		ArrayList<Library> results = libraryController.getLibraries(countryID);
		
		for(Library l : results) {
			libraries.put(l.toJSON());
		}
				
		return libraries.toString();
	}
	
	/**
	 * 
	 * @param libSiglum
	 * @return
	 * @throws Exception
	 */
	public String deleteLibrary(String libSiglum) throws Exception {
		libraryController.deleteLibrary(libSiglum);
		JSONObject j = new JSONObject();
        j.put("success", true);
		return j.toString();
	}
	
}
