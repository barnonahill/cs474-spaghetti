package spg.controllers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.http.HttpServlet;

/**
 * @author Carl Clermont
 * @version 4/16/18
 */

public abstract class SpgController extends HttpServlet{
	
	public static final String DATABASE_ADDR = "jdbc:mysql://mysql.cs.jmu.edu";
	public static final String USER = "clermocj";
	public static final String DB_PASS = "cs474";
	public static final String DATABASE_NAME = "BarnhillButtsClermontTran_Manuscript";
	
	/**
	 * makes a connection to the database and returns whatever the query that was received outputs.
	 * @param queryString - the sql command to execute.
	 * @return - the resultSet of the sql command.
	 * @throws Exception - if it cant connect to the server.
	 */
	static final ResultSet getResultSet(String queryString) throws Exception {
		Connection connection;
		Statement statement;
		try {
			connection = DriverManager.getConnection(DATABASE_ADDR, USER, DB_PASS);
			statement = connection.createStatement();
			statement.executeQuery("USE "+ DATABASE_NAME + ";");
			return statement.executeQuery(queryString);
		} catch (Exception e) {
	        e.printStackTrace();
	        throw new Exception("Could not connect to database");
		}
	}
	
}
