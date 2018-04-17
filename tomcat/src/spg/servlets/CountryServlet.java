package spg.servlets;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import spg.models.Country;

@WebServlet(name="CountryServices", urlPatterns= {"/country"})
public class CountryServlet extends SpgHttpServlet {
	// Actions
	public static final String GET_COUNTRIES = "GetCountries";
	public static final String GET_COUNTRY = "GetCountry";

	public CountryServlet() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try {
			String action = super.getAction(req);
			String msg = null;
			
			if (action.equalsIgnoreCase(GET_COUNTRIES)) {
				msg = this.getCountries();
			}
			else if (action.equalsIgnoreCase(GET_COUNTRY)) {
				String countryCode = req.getParameter("countryCode");
				if (countryCode == null || countryCode.isEmpty()) {
					throw new Exception("Missing countryCode parameter.");
				}
				msg = this.getCountry(countryCode);
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
		Country c;
		
		// TODO get country
		
		if (c != null) {
			return c.toString();
		}
		else {
			throw new Exception("Could not find a country with countryCode " + countryCode);
		}
	}
}
