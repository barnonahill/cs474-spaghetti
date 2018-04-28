package spg.controllers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;
import java.util.Properties;

/**
 * @author Paul Barnhill, Carl Clermont
 */

public abstract class SpgController {
	private Connection connection;

	public static Properties p = null;
	public static final String DATABASE_ADDR =
			// "jdbc:mysql://mysql.cs.jmu.edu/BarnhillButtsClermontTran_Manuscript";
			"jdbc:mysql://127.0.0.1/Manuscript2018";
	// public static final String USER = "clermocj";
	public static final String USER = "root";
	// public static final String DB_PASS = "cs474";
	
	public static final String SQL_STATE_DUPLICATE_ENTRY = "23000";

	public SpgController() {
		SpgController.initProperties();
		this.connection = null;
	}

	/**
	 * Set the controller's current connection.
	 * 
	 * @throws SQLException
	 *             connection open issue
	 * @throws ClassNotFoundException
	 */
	public void open() throws Exception {
		try {
			Class.forName("com.mysql.jdbc.Driver");
			this.connection = DriverManager.getConnection(DATABASE_ADDR, p);
		} catch (SQLException e) {
			Throwable cause = e.getCause();
			if (cause != null) {
				System.out.println(cause.getClass());
				cause.printStackTrace(System.err);
			}
			throw new Exception("Could not connect to database");
		} catch (ClassNotFoundException e) {
			throw new Exception("Internal service error.");
		}
	}

	/**
	 * Close a connection after you're finished parsing data from it. Checks for
	 * connection existence.
	 * 
	 * @throws SQLException
	 *             connection close issue
	 */
	public void close() throws SQLException {
		if (this.connection != null) {
			this.connection.close();
			this.connection = null;
		}
	}

	/**
	 * getResultSet - for SELECT. makes a connection to the database and returns
	 * whatever the query that was received outputs.
	 * 
	 * @param queryString
	 *            - the sql command to execute.
	 * @return - the resultSet of the sql command.
	 * @throws Exception
	 *             - if it cant connect to the server.
	 */
	final ResultSet getResultSet(String queryString) throws Exception {
		Statement statement;
		ResultSet resultSet;

		try {
			initProperties();
			statement = connection.createStatement();
			resultSet = statement.executeQuery(queryString);
			return resultSet;
		} catch (SQLException e) {
			e.printStackTrace();
			throw new Exception("Could not connect to database");
		} catch (Exception e) {
			throw new Exception("Internal service error.");
		}
	}

	private static final void initProperties() {
		if (SpgController.p == null) {
			SpgController.p = new Properties();
			p.setProperty("user", USER);
			// p.setProperty("password", DB_PASS);
			p.setProperty("port", "3306");
		}
	}

	/**
	 * executeSQL - for CREATE, UPDATE, DELETE. same as getResultSet but for ^.
	 * 
	 * @param queryString
	 * @return
	 * @throws Exception
	 */
	final int executeSQL(String queryString) throws Exception {
		Statement statement;
		int rows;

		try {
			statement = connection.createStatement();
			rows = statement.executeUpdate(queryString);
			return rows;
		} catch (SQLException e) {
			if (e.getSQLState().equals(SQL_STATE_DUPLICATE_ENTRY)) {
				throw e;
			}
			e.printStackTrace();
			throw new Exception("Could not connect to database");
		} catch (Exception e) {
			throw new Exception("Could not connect to database");
		}
	}

	/**
	 * Builds an Inset Query.
	 * 
	 * @param tableName
	 * @param createNames
	 * @param createVals
	 * @return e.g. INSERT INTO Library (libSiglum, city, address1) VALUES
	 *         ('potato', 'H-Burg', 'Neverland st.');
	 */
	final String buildInsertQuery(String tableName, Map<String, String> namesToValues) {
		StringBuilder query = new StringBuilder("");

		query.append("INSERT INTO ");
		query.append(tableName);
		query.append(" (");
		query.append(createColumnString(namesToValues));
		query.append(") VALUES (");
		query.append(ceateValueListString(namesToValues));
		query.append(");");

		return query.toString();
	}

	/**
	 * Builds an update query.
	 * 
	 * @param tableName
	 *            - name of the updated table. e.g. Libary
	 * @param predicate
	 *            - Prebuilt predicate. e.g libSiglum = 'potato'
	 * @param updates
	 *            - Prebuilt changes. e.g. address1 = heaven, address2 = hell
	 * @return UPDATE table SET column1 = val1, column2 = val2 WHERE pk = pkVal;
	 */
	final String buildUpdateQuery(String tableName, Map<String, String> primaryMap, Map<String, String> nvMap) {
		StringBuilder query = new StringBuilder("UPDATE ");
		query.append(tableName);
		query.append(" SET ");
		query.append(createUpdatesString(nvMap));
		query.append(" WHERE ");
		query.append(createPredicate(primaryMap));
		query.append(";");
		return query.toString();
	}

	/**
	 * Builds a select query.
	 * 
	 * buildSelectQuery - handles creating the strings for select queries.
	 * 
	 * @param tableName
	 *            - the table to select from.
	 * @param filterName
	 *            - the variable to filter by.
	 * @param filterValue
	 *            - the value to filter by.
	 * 
	 * @return The string to use for the SELECT query based on the input. e.g.
	 *         SELECT * FROM Library WHERE Libsiglum = 'potato';
	 */
	final String buildSelectQuery(String tableName, Map<String, String> namesToValues) {
		StringBuilder query = new StringBuilder("SELECT * FROM ");
		query.append(tableName);

		if (namesToValues != null) {
			query.append(" WHERE ");
			query.append(createPredicate(namesToValues));
		}
		query.append(";");
		return query.toString();
	}

	/**
	 * Builds a delete query.
	 * 
	 * createDeleteString - creates the query needed to delete from a table.
	 * 
	 * @param tableName
	 *            - ...
	 * @param pkNames
	 *            - a list of all the primary key column names.
	 * @param pkValues
	 *            - a list of all the primary key values in the same order as
	 *            pkNames.
	 * @return e.g. DELETE FROM Library WHERE libSiglum = 'potato';
	 */
	final String buildDeleteQuery(String tableName, Map<String, String> namesToValues) {
		StringBuilder query = new StringBuilder("");
		query.append("DELETE FROM ");
		query.append(tableName);
		query.append(" WHERE ");
		query.append(createPredicate(namesToValues));
		query.append(";");
		return query.toString();
	}

	/***************************** PRIVATES *****************************/

	/**
	 * createColumnString - used for INSERT
	 * 
	 * @param createNames
	 * @param createVals
	 * @return
	 */
	private Object createColumnString(Map<String, String> namesToValues) {
		StringBuilder updates = new StringBuilder("");
		boolean addComma = false;
		String val;

		for (String name : namesToValues.keySet()) {
			val = namesToValues.get(name);
			if (val != null) {
				if (addComma) {
					updates.append(", ");
				}
				addComma = true;
				updates.append(name);
			}
		}

		return updates.toString();
	}

	/**
	 * ceateValueListString - used for INSERT
	 * 
	 * @param createNames
	 * @param createVals
	 * @return
	 */
	private Object ceateValueListString(Map<String, String> namesToValues) {
		StringBuilder updates = new StringBuilder("");
		boolean addComma = false;
		String val;

		for (String name : namesToValues.keySet()) {
			val = namesToValues.get(name);
			if (val != null) {
				if (addComma) {
					updates.append(", ");
				}
				addComma = true;
				if (val.equals("")) {
					updates.append("NULL");
				} else {
					updates.append(checkVarType(name, val));
				}
			}
		}

		return updates.toString();
	}

	/**
	 * createUpdatesString - used for UPDATE.
	 * 
	 * @param varNames
	 *            - the names of the variables to update.
	 * @param varVals
	 *            - the values to set them too.
	 * @return a string. e.g. "countryID = 'US', city = 'Harrisonburg', postCode =
	 *         '22807'"
	 */
	private final String createUpdatesString(Map<String, String> namesToValues) {

		StringBuilder updates = new StringBuilder("");
		boolean addComma = false;
		String val;

		for (String name : namesToValues.keySet()) {
			val = namesToValues.get(name);
			if (!(val == null)) {
				if (addComma) {
					updates.append(", ");
				}
				addComma = true;
				if (val.equals("")) {
					updates.append(name + " = NULL");
				} else {
					updates.append(name + " = " + checkVarType(name, val));
				}
			}
		}

		return updates.toString();
	}

	/**
	 * createPredicate - creates the part after the WHERE clause.
	 * 
	 * @param pkNames
	 * @param pkValues
	 * @return a String e.g. libSiglum = 'potato' AND msType = 'windex'
	 */
	private final String createPredicate(Map<String, String> primaryMap) {
		StringBuilder predicate = new StringBuilder("");
		boolean addAnd = false;
		String pkVal;

		for (String name : primaryMap.keySet()) {
			pkVal = primaryMap.get(name);

			if (addAnd) {
				predicate.append(" AND ");
			}

			addAnd = true;
			predicate.append(name + " = " + checkVarType(name, pkVal));
		}

		return predicate.toString();
	}

	/**
	 * checkFilterValue - checks the value to see if it is any kind of number or
	 * boolean. if it is then leave the string as is. Else add ' 's around it
	 * (varchar/text)
	 * 
	 * @param var
	 *            - a string.
	 * @return filterValue or 'filterValue' where filterValue is a String.
	 */
	protected String checkVarType(String key, String value) {
		String newValue = value;

		if (newValue.equalsIgnoreCase("true") || newValue.equalsIgnoreCase("false")) {
			return newValue;
		}

		try {
			Integer.parseInt(newValue);
		} catch (NumberFormatException nfe) {
			newValue = "'" + escapeString(newValue) + "'";
		}

		return newValue;
	}

	protected String escapeString(String s) {
		return s.replace("'", "\'");
	}

}
