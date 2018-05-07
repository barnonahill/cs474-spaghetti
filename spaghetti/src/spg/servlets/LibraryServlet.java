package spg.servlets;

import java.io.IOException;
import java.util.List;
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
 * @version 2018-05-07
 */
@WebServlet(name = "LibraryServices", urlPatterns = { "/library" })
public class LibraryServlet extends SpgHttpServlet {
	private LibraryController libraryController;

	private static final long serialVersionUID = 1L;

	// From the Country table.
	public static final String GET_COUNTRIES = "getcountries";

	// From the Library table.
	public static final String CREATE_LIBRARY = "createlibrary";
	public static final String UPDATE_LIBRARY = "updatelibrary";
	public static final String GET_LIBRARY = "getlibrary";
	public static final String GET_LIBRARIES = "getlibraries";
	public static final String DELETE_LIBRARY = "deletelibrary";

	public LibraryServlet() {
		super();
		this.libraryController = new LibraryController();
	}

	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try {
			Map<String, String> params = super.getParameters(req);
			String action = super.getRequiredParameter(params, "action").toLowerCase();
			String msg = null;

			// Actions are in node/src/proxies/LibraryProxy.ts
			// We have an existing action, open our connection.
			libraryController.open();

			if (action.equalsIgnoreCase(GET_COUNTRIES)) {
				msg = this.getCountries();
			} 
			else if (action.equalsIgnoreCase(CREATE_LIBRARY)) {
				String countryID = super.getRequiredParameter(params, "countryID");
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String city = super.getRequiredParameter(params, "city");
				String library = super.getRequiredParameter(params, "library");
				String address1 = super.getParameter(params, "address1");
				String address2 = super.getParameter(params, "address2");
				String postCode = super.getParameter(params, "postCode");
				msg = this.createLibrary(libSiglum, countryID, city, library, address1, address2, postCode);
			} 
			else if (action.equalsIgnoreCase(UPDATE_LIBRARY)) {
				String countryID = super.getRequiredParameter(params, "countryID");
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String city = super.getRequiredParameter(params, "city");
				String library = super.getRequiredParameter(params, "library");
				String address1 = super.getParameter(params, "address1");
				String address2 = super.getParameter(params, "address2");
				String postCode = super.getParameter(params, "postCode");
				msg = this.updateLibrary(libSiglum, countryID, city, library, address1, address2, postCode);
			}
			else if (action.equalsIgnoreCase(DELETE_LIBRARY)) {
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				msg = this.deleteLibrary(libSiglum);
			}
			else if (action.equalsIgnoreCase(GET_LIBRARY)) {
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				msg = this.getLibrary(libSiglum);
			}
			else if (action.equalsIgnoreCase(GET_LIBRARIES)) {
				String countryID = super.getRequiredParameter(params, "countryID");
				msg = this.getLibraries(countryID);
			}
			else {
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
	 * 
	 * @return - A JSONArray filled with countries.
	 * @throws Exception
	 */
	public String getCountries() throws Exception {
		JSONArray countries = new JSONArray();
		List<Country> results = libraryController.getCountries();

		for (Country c : results) {
			countries.put(c.toJSON());
		}

		return countries.toString();
	}

	/**
	 * createLibrary - library creation handler.
	 * 
	 * @params - condensed - (im lazy) the columns of the Library table.
	 * @return - a string representation of a JSON representation of the Library
	 *         made.
	 * @throws Exception
	 *             - anything.
	 */
	public String createLibrary(String libSiglum, String countryID, String city, String library, String address1,
			String address2, String postCode) throws Exception {
		// Check if it already exists:
		if (libraryController.getLibraryOrNull(libSiglum) != null) {
			throw new Exception("Library with same libSiglum already exists.");
		}

		Library lib = libraryController.createLibrary(libSiglum, countryID, city, library, address1, address2,
				postCode);
		return lib.toString();
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
	public String updateLibrary(String libSiglum, String countryID, String city, String library, String address1,
			String address2, String postCode) throws Exception {
		Library lib = libraryController.updateLibrary(libSiglum, countryID, city, library, address1, address2,
				postCode);
		return lib.toString();
	}

	/**
	 * gets a single Library.
	 * 
	 * @param libSiglum
	 * @return
	 * @throws Exception
	 */
	private String getLibrary(String libSiglum) throws Exception {
		Library l = libraryController.getLibrary(libSiglum);
		return l.toString();
	}

	/**
	 * getLibraries - handles getting and returning Libraries.
	 * 
	 * @return A JSONArray filled with libraries.
	 * @throws Exception
	 */
	public String getLibraries(String countryID) throws Exception {
		JSONArray libraries = new JSONArray();
		List<Library> results = libraryController.getLibraries(countryID);

		for (Library l : results) {
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
