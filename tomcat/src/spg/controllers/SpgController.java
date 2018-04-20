package spg.controllers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.NumberFormat;
import java.text.ParseException;
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
		ResultSet resultSet;
		try {
			//Properties p = new Properties();
			//p.setProperty("user", "root");
			//p.setProperty("port", "3306");
			Class.forName("com.mysql.jdbc.Driver");
			//connection = DriverManager.getConnection(DATABASE_ADDR, p);
			connection = DriverManager.getConnection(DATABASE_ADDR, USER, DB_PASS);
			statement = connection.createStatement();
			resultSet = statement.executeQuery(queryString);
			connection.close();
			return resultSet; 
		} catch (Exception e) {
	        e.printStackTrace();
	        throw new Exception("Could not connect to database");
		}
	}
	
	
	/**
	 * buildSelectQuery - handles creating the strings for select queries.
	 * @param tableName - the table to select from.
	 * @param filterName - the variable to filter by.
	 * @param filterValue - the value to filter by.
	 * 
	 * @return The string to use for the SELECT query based on the input.
	 */
	static final String buildSelectQuery(String tableName, String filterName, String filterValue) {
		StringBuilder query = new StringBuilder("SELECT * FROM ");
		query.append(tableName);
		
		if(!(filterName == null || filterName.equals("") || filterValue == null || filterValue.equals(""))) {
			query.append(" WHERE ");
			query.append(filterName);
			query.append(" = ");
			query.append(checkVarType(filterValue));
			query.append("");
		}
		query.append(";");
		return query.toString();
	}
	
	
	/**
	 * checkFilterValue - checks the value to see if it is any kind of number or boolean. 
	 * if it is then leave the string as is. Else add ' 's around it (varchar/text)
	 * 
	 * @param var - a string.
	 * @return filterValue or 'filterValue' where filterValue is a String.
	 */
	private static final String checkVarType(String var) {
		NumberFormat nf = NumberFormat.getInstance();
		String newValue = var;
		
    	if (newValue.equalsIgnoreCase("true") || newValue.equalsIgnoreCase("false")) {
    		return newValue;
    	}
		
        try {
        	System.out.println( nf.parse(newValue).getClass().getName() );
        } catch (ParseException e) {
        	newValue = "'"+newValue+"'";
        }
		
		return newValue;
		
	}
}
