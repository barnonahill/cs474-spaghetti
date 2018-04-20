package spg.controllers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Map;
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
	
	
	
	static final String buildInsertQuery(String tableName, ArrayList<String> createNames, ArrayList<String> createVals) {
		StringBuilder query = new StringBuilder("");
		
		query.append("INSERT INTO ");
		query.append(tableName);
		query.append(createColumnString(createNames, createVals));
		query.append(" VALUES (");
		query.append(ceateValueListString(createNames, createVals));
		query.append(");");
		
		return query.toString();
	}
	
	
	/**
	 * buildSelectQuery - handles creating the strings for select queries.
	 * @param tableName - the table to select from.
	 * @param filterName - the variable to filter by.
	 * @param filterValue - the value to filter by.
	 * 
	 * @return The string to use for the SELECT query based on the input.
	 * e.g. 
	 * SELECT * FROM Library WHERE Libsiglum = 'potato';
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
	 * 
	 * @param tableName - name of the updated table. 
	 * e.g. Libary
	 * @param predicate - Prebuilt predicate.
	 * e.g libSiglum = 'potato'
	 * @param updates - Prebuilt changes.
	 * e.g. address1 = heaven, address2 = hell 
	 * @return
	 * UPDATE table SET column1 = val1, column2 = val2 WHERE pk = pkVal;
	 */
	static final String buildUpdateQuery(String tableName, ArrayList<String> updateNames, ArrayList<String> updateVals,
			ArrayList<String> pkNames, ArrayList<String> pkValues ) {
		StringBuilder query = new StringBuilder("UPDATE ");
		query.append(tableName);
		query.append(" SET ");
		query.append(ceateUpdatesString(updateNames, updateVals));
		query.append(" WHERE ");
		query.append(createPredicate(pkNames, pkValues));
		query.append(";");
		return query.toString();
	}
	

	/**
	 * createDeleteString - creates the query needed to delete from a table.
	 * @param tableName - ...
	 * @param pkNames - a list of all the primary key column names.
	 * @param pkValues - a list of all the primary key values in the same order as pkNames.
	 * @return
	 * e.g.
	 * DELETE FROM Library WHERE libSiglum = 'potato';
	 */
	static final String createDeleteQuery(String tableName, ArrayList<String> pkNames, ArrayList<String> pkValues) {
		StringBuilder query = new StringBuilder("");
		query.append("DELETE FROM ");
		query.append(tableName);
		query.append(" WHERE ");
		query.append(createPredicate(pkNames, pkValues));
		query.append(";" );
		return query.toString();
	}
	
	
	
	/*****************************PRIVATES*****************************/
	
	/**
	 * createColumnString - used for INSERT
	 * @param createNames
	 * @param createVals
	 * @return
	 */
	private static Object createColumnString(ArrayList<String> createNames, ArrayList<String> createVals) {
		StringBuilder updates = new StringBuilder("");
		boolean addComma = false;
		int nameIndex;

		for(String val : createVals) {
			if(!(val == null || val.equals(""))) {
				if(addComma) {
					updates.append(", ");
				}
				addComma = true;
				nameIndex = createVals.indexOf(val);
				updates.append(createNames.get(nameIndex));
			}
		}
		
		return updates.toString();
	}
	
	/**
	 * ceateValueListString - used for INSERT
	 * @param createNames
	 * @param createVals
	 * @return
	 */
	private static Object ceateValueListString(ArrayList<String> createNames, ArrayList<String> createVals) {
		StringBuilder updates = new StringBuilder("");
		boolean addComma = false;

		for(String val : createVals) {
			if(!(val == null || val.equals(""))) {
				if(addComma) {
					updates.append(", ");
				}
				addComma = true;
				updates.append(checkVarType(val));
			}
		}
		
		return updates.toString();
	}
	
	
	/**
	 * ceateUpdatesString - used for UPDATE.
	 * @param varNames - the names of the variables to update.
	 * @param varVals - the values to set them too.
	 * @return a string.
	 * e.g.
	 * "countryID = 'US', city = 'Harrisonburg', postCode = '22807'"
	 */
	private static final String ceateUpdatesString(ArrayList<String> varNames, ArrayList<String> varVals) {
		StringBuilder updates = new StringBuilder("");
		boolean addComma = false;
		int nameIndex;

		for(String val : varVals) {
			if(!(val == null || val.equals(""))) {
				if(addComma) {
					updates.append(", ");
				}
				addComma = true;
				nameIndex = varVals.indexOf(val);
				updates.append(varNames.get(nameIndex) + " = " + checkVarType(val));
			}
		}
		
		return updates.toString();
	}
	
	/**
	 * createPredicate - creates the part after the WHERE clause.
	 * @param pkNames
	 * @param pkValues
	 * @return a String
	 * e.g.
	 * libSiglum = 'potato' AND msType = 'windex'
	 */
	private static final String createPredicate(ArrayList<String> pkNames, ArrayList<String> pkValues) {
		StringBuilder predicate = new StringBuilder("");
		boolean addAnd = false;
		int nameIndex;
		
		for(String pkVal : pkValues) {
			if(addAnd) {
				predicate.append(" AND ");
			}
			addAnd = true;
			nameIndex = pkValues.indexOf(pkVal);
			predicate.append(pkNames.get(nameIndex) + " = " + checkVarType(pkVal));
		}

		return predicate.toString();
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
