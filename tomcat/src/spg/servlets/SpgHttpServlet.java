package spg.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Abstract implementation of an HTTP Servlet. We don't care if Requests are GETs or POSTs.
 *
 */
public abstract class SpgHttpServlet extends HttpServlet {
	
	public final void doGet(HttpServletRequest req, HttpServletResponse res) {
		handleRequest(req, res);
	}
	
	public final void doPost(HttpServletRequest req, HttpServletResponse res) {
		handleRequest(req, res);
	}
	
	public abstract void handleRequest(HttpServletRequest req, HttpServletResponse res);
	
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
}
