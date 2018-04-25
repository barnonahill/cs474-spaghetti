package spg.controllers;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;


import spg.models.Country;
import spg.models.Library;

/**
 * LibraryController - Static methods used for handling Library and Country sql commands.
 * @author Carl Clermont
 *
 */
public class LibraryController {

	private final static String LIBRARY = "Library"; 
	
	public LibraryController () {
		
	}

	/**
	 * getCountries - gets an array list of all the counties.
	 * @return - Arraylist of Country objects.
	 * @throws Exception - any exception. 
	 */
	public static ArrayList<Country> getCountries() throws Exception{
		String query = SpgController.buildSelectQuery("Country", null);
		ResultSet resultSet;
		resultSet = SpgController.getResultSet(query);

		ArrayList<Country> countries = new ArrayList<Country>();
		Country c;
		
		while (resultSet.next()) { //TODO still need to add new Country(resultSet); constructor
			c = new Country(resultSet.getString("countryID"), 
							resultSet.getString("countryName"));
			countries.add(c);
		}
		
		return countries;
	}
	
	/**
	 * createLibrary - builds a Library.
	 * @params - condensed - (im lazy) the columns of the Library table.
	 * @return - A Library object. (the one made from what was passed in.)
	 * @throws Exception - anything.
	 */
	public static Library createLibrary(String libSiglum, String countryID, String city,
			String library, String address1, String address2, String postCode) throws Exception{
		String query;
		Library lib;
		
		HashMap<String, String> namesToValues = new HashMap<String, String>();

		//Eventually move to SPG Controller and make generic for testing if primary keys are correct.
		if(libSiglum == null) {
			throw new Exception("libSiglum cannot be left empty or blank.");
		}
		
		namesToValues.put("libSiglum", libSiglum);
		namesToValues.put("countryID", countryID);
		namesToValues.put("city", city);
		namesToValues.put("library", library);
		namesToValues.put("address1", address1);
		namesToValues.put("address2", address2);
		namesToValues.put("postCode", postCode);
		
		query = SpgController.buildInsertQuery(LIBRARY, namesToValues);
		SpgController.executeSQL(query);
		
		lib = new Library(libSiglum, countryID, city, library, address1, address2, postCode);
				
		return lib;
	}
	
	/**
	 * updateLibrary - updates the library with all of the parameters that are not null or empty.
	 * @param libSiglum
	 * @param countryID
	 * @param city
	 * @param library
	 * @param address1
	 * @param address2
	 * @param postCode
	 * @return - a the new Library element.
	 * @throws Exception - any exception.
	 */
	public static Library updateLibrary(String libSiglum, String countryID , String city, 
			String library, String address1, String address2, String postCode) throws Exception {
		Library l;
		String query;
		
		HashMap<String, String> namesToValues = new HashMap<String,String>();
		HashMap<String, String> pkNamesToValues = new HashMap<String,String>();
		
		//all non primary keys. aka anything that can be changed within Library.
		namesToValues.put("countryID", countryID);
		namesToValues.put("city", city);
		namesToValues.put("library", library);
		namesToValues.put("address1", address1);
		namesToValues.put("address2", address2);
		namesToValues.put("postCode", postCode);
		
		pkNamesToValues.put("libSiglum", libSiglum);
		
		query = SpgController.buildUpdateQuery(LIBRARY, pkNamesToValues, namesToValues);

		SpgController.executeSQL(query);
		l = new Library(libSiglum, countryID, city, library, address1, address2, postCode);
		
		return l;
	}
	
	
	/**
	 * is used ONLY for testing if a library already exists!!!!!!!!!!!!!!!!!!
	 * @param libSiglum
	 * @return
	 * @throws Exception
	 */
	public static Library getLibraryOrNull(String libSiglum){
		HashMap<String, String> pkNamesToValues = new HashMap<String, String>();
		Library l = null;
		ResultSet resultSet;
		String query;
		
		pkNamesToValues.put("libSiglum", libSiglum);
		query = SpgController.buildSelectQuery(LIBRARY, pkNamesToValues);
		try {
			resultSet = SpgController.getResultSet(query);
			
			resultSet.next();
			l = new Library(resultSet);
		} catch (Exception e) {
			//Catch and do nothing.
			//Because this is meant to return null if there is no library with the libSiglum
		}
		
		return l;
	}
	
	public static Library getLibrary(String libSiglum) throws Exception {
		HashMap<String, String> pkNamesToValues = new HashMap<String, String>();
		Library l = null;
		ResultSet resultSet;
		String query;
		
		pkNamesToValues.put("libSiglum", libSiglum);
		query = SpgController.buildSelectQuery(LIBRARY, pkNamesToValues);
		resultSet = SpgController.getResultSet(query);
			
		resultSet.next();
		l = new Library(resultSet);
		
		return l;
	}
	
	
	/**
	 * getLibraries - gets an array list of all the Libraries. 
	 * @return - Arraylist of Library objects.
	 * @throws Exception - any exception. 
	 */
	public static ArrayList<Library> getLibraries(String countryID) throws Exception{
		HashMap<String,String> namesToValues = new HashMap<String, String>();
		String query;
		ResultSet resultSet;
		ArrayList<Library> libraries;
		Library l;
		
		namesToValues.put("countryID", countryID);
		query = SpgController.buildSelectQuery(LIBRARY, namesToValues);
		resultSet = SpgController.getResultSet(query);
		
		libraries = new ArrayList<Library>();
		
		while (resultSet.next()) {
			l = new Library(resultSet);
			libraries.add(l);
		}
		
		return libraries;
	}

	/**
	 * deleteLibrary - Removes a library with input libSiglum from the database and returns the library that was deleted. 
	 * @param libSiglum - represents Libary's libSiglum.
	 * @return The delete Library.
	 * @throws Exception - any exception.
	 */
	public static boolean deleteLibrary(String libSiglum) throws Exception{
		String query;
		HashMap<String, String> pkNamesToValues = new HashMap<String,String>();

		pkNamesToValues.put("libSiglum", libSiglum);
		
		query = SpgController.buildDeleteQuery(LIBRARY, pkNamesToValues);
		
		SpgController.executeSQL(query);
				
		return true; //currently unused.
	}


	
	
	
}
