package spg.controllers;

import java.sql.ResultSet;
import java.util.ArrayList;

import spg.models.Country;
import spg.models.Library;

/**
 * 
 * @author Carl Clermont
 *
 */
public class LibraryController{

	
	public LibraryController () {
		
	}

	/**
	 * getCountries - gets an array list of all the counties.
	 * @return - Arraylist of Country objects.
	 * @throws Exception - any exception. 
	 */
	public static ArrayList<Country> getCountries() throws Exception{
		String query = "SELECT * FROM Country;";
		ResultSet resultSet;
		resultSet = SpgController.getResultSet(query);

		ArrayList<Country> countries = new ArrayList<Country>();
		Country c;
		
		while (resultSet.next()) {
			c = new Country(resultSet.getString("countryID"),
							resultSet.getString("country"));
			countries.add(c);
		}
		
		return countries;
	}
	
	/**
	 * getLibraries - gets an array list of all the Libraries.
	 * @return - Arraylist of Library objects.
	 * @throws Exception - any exception. 
	 */
	public static ArrayList<Library> getLibraries() throws Exception{
		String query = "SELECT * FROM Library;";
		ResultSet resultSet;
		resultSet = SpgController.getResultSet(query);
		
		ArrayList<Library> libraries = new ArrayList<Library>();
		Library l;
		
		while (resultSet.next()) {
			l = new Library(resultSet.getString("libSiglum"),
							resultSet.getString("countryID"),
							resultSet.getString("city"),
							resultSet.getString("library"),
							resultSet.getString("address1"),
							resultSet.getString("address2"),
							resultSet.getString("postCoe")
							);
			libraries.add(l);
		}
		
		return libraries;
	}
}
