package spg.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

public class CountryServlet extends SpgHttpServlet {
	// Actions
	public static final String GET_COUNTRIES = "GetCountries";

	public CountryServlet() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try {
			String action = super.getAction(req);
			String msg;
			if (action.equalsIgnoreCase(GET_COUNTRIES)) {
				msg = this.getCountries();
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
		JSONObject country;
		
		
		// TODO read countries into JSONArray
		/* Example
		 * country = new JSONObject();
		 * country.put("countryCode", "US");
		 * country.put("country", "United States");
		 * countries.put(country);
		 */
		
		return countries.toString();
	}
}
