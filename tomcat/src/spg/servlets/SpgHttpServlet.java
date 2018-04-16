package spg.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Abstract implementation of an HTTP Servlet. We don't care if Requests are GETs or POSTs.
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
	
	public String getAction(HttpServletRequest req) throws Exception {
		String a = req.getParameter("action");
		if (a == null || a.isEmpty()) {
			throw new Exception("Missing action parameter.");
		}
		return a;
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
