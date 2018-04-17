package spg.controllers;

import java.sql.ResultSet;

/**
 * 
 * @author Carl Clermont
 *
 */
public class LibraryController{

	
	public LibraryController () {
		
	}

	public static ResultSet getCountries() throws Exception{
		String query = "SELECT * FROM Countries;";
		ResultSet resultSet;
		resultSet = SpgController.getResultSet(query);
		//Change to list of Countries?
		return resultSet;
	}
}
