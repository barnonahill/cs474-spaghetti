package spg.controllers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Properties;

import javax.servlet.http.HttpServlet;

/**
 * @author Carl Clermont
 * @version 4/16/18
 */

public abstract class SpgController extends HttpServlet{
	
	public static final String DATABASE_ADDR = 
			"jdbc:mysql://mysql.cs.jmu.edu/BarnhillButtsClermontTran_Manuscript";
			//"jdbc:mysql://127.0.0.1/Manuscript2018";
	public static final String USER = "clermocj";
	public static final String DB_PASS = "cs474";	
	
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
			//Properties p = new Properties();
			//p.setProperty("user", "root");
			//p.setProperty("port", "3306");
			Class.forName("com.mysql.jdbc.Driver");
			//connection = DriverManager.getConnection(DATABASE_ADDR, p);
			connection = DriverManager.getConnection(DATABASE_ADDR, USER, DB_PASS);
			statement = connection.createStatement();
			return statement.executeQuery(queryString);
		} catch (Exception e) {
	        e.printStackTrace();
	        throw new Exception("Could not connect to database");
		}
	}
	
}
