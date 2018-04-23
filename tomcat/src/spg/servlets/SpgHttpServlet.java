package spg.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Abstract implementation of an HTTP Servlet. We don't care if Requests are GETs or POSTs.
 * 
 * @author Paul Barnhill
 * @version 2018-04-18
 */
public abstract class SpgHttpServlet extends HttpServlet {
	
	public final void doGet(HttpServletRequest req, HttpServletResponse res) {
		try {
			handleRequest(req, res);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public final void doPost(HttpServletRequest req, HttpServletResponse res) {
		try {
			handleRequest(req, res);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public abstract void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException;
	
	/**
	 * Map the parameters from a JSON post or a browser GET request.
	 *
	 * @throws IOException content-type is JSON and the request BufferedReader threw an exception.
	 */
	public Map<String, String> getParameters(HttpServletRequest req) throws IOException {
		String contentType = req.getHeader("content-type");
		Map<String, String> map = new HashMap<String, String>();
		
		if (contentType != null && contentType.indexOf("application/json") >= 0) {
			StringBuilder sb = new StringBuilder();
			String s;
			BufferedReader br = req.getReader();
			while ((s = br.readLine()) != null) {
				sb.append(s);
			}
			
			JSONObject j = new JSONObject(sb.toString());
			Set<String> keys = j.keySet();
			for (String k : keys) {
				try {
					map.put(k, j.getString(k));
				}
				catch (JSONException e) {
				}
			}
		}
		else {
			Enumeration<String> keys = req.getParameterNames();
			String k;
			while (keys.hasMoreElements()) {
				k = keys.nextElement();
				map.put(k, req.getParameter(k));
			}
		}
		
		return map;	
	}
	
	/**
	 * Gets parameter p from map m, or throws an Exception for the front-end.
	 * 
	 * @param m map of parameters
	 * @param p parameter to get
	 * @return value of parameter
	 * @throws Exception the parameter is not in the map.
	 */
	public String getParameter(Map<String, String> m, String p) throws Exception {
		String s = m.get(p);
		if (s == null || s.isEmpty()) {
			throw new Exception("Missing " + p + " parameter.");
		}
		return s;
	}
	
	/**
	 * Writes a JSON String to response.
	 * @param res
	 * @param msg
	 * @throws IOException could not get res writer
	 */
	public void writeResponse(HttpServletResponse res, String msg) throws IOException {
		PrintWriter out = null;
		try {
			res.setContentType("application/json");
			res.setHeader("Cache-Control", "no-cache");
			out = res.getWriter();
			out.write(msg);
		}
		finally {
			if (out != null) {
				out.close();
			}
		}
	}
	
	/**
	 * Converts the message of an exception to a JSON String and writes it as a response.
	 * @param res
	 * @param e
	 * @throws IOException
	 */
	public void writeResponse(HttpServletResponse res, Exception e) throws IOException {
		String msg = "{\"err\":\"" + e.getMessage() + "\"}";
		writeResponse(res, msg);
	}
}
