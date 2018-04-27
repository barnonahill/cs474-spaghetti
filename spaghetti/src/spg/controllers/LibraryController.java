package spg.controllers;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;


import spg.models.Country;
import spg.models.Library;

/**
 * LibraryController - Static methods used for handling Library and Country sql commands.
 * @author Paul Barnhill, Carl Clermont
 *
 */
public class LibraryController extends SpgController {
	private final static String LIBRARY = "Library"; 
	
	/**
	 * Set up the DB connection info.
	 */
	public LibraryController () {
		super();
	}

	/**
	 * getCountries - gets an array list of all the counties.
	 * @return - Arraylist of Country objects.
	 * @throws Exception - any exception. 
	 */
	public ArrayList<Country> getCountries() throws Exception {
		String query = super.buildSelectQuery("Country", null);
		ResultSet resultSet;
		resultSet = super.getResultSet(query);

		ArrayList<Country> countries = new ArrayList<Country>();
		Country c;
		
		while (resultSet.next()) {
			c = new Country(resultSet);
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
	public Library createLibrary(String libSiglum, String countryID, String city,
			String library, String address1, String address2, String postCode) throws Exception{
		String query;
		Library lib;
		
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		
		namesToValues.put("libSiglum", libSiglum);
		namesToValues.put("countryID", countryID);
		namesToValues.put("city", city);
		namesToValues.put("library", library);
		namesToValues.put("address1", address1);
		namesToValues.put("address2", address2);
		namesToValues.put("postCode", postCode);
		
		query = super.buildInsertQuery(LIBRARY, namesToValues);
		super.executeSQL(query);
		
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
	public Library updateLibrary(String libSiglum, String countryID , String city, 
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
		
		query = super.buildUpdateQuery(LIBRARY, pkNamesToValues, namesToValues);

		super.executeSQL(query);
		l = new Library(libSiglum, countryID, city, library, address1, address2, postCode);
		
		return l;
	}
	
	
	/**
	 * is used ONLY for testing if a library already exists!!!!!!!!!!!!!!!!!!
	 * @param libSiglum
	 * @return
	 * @throws Exception
	 */
	public Library getLibraryOrNull(String libSiglum){
		HashMap<String, String> pkNamesToValues = new HashMap<String, String>();
		Library l = null;
		ResultSet resultSet;
		String query;
		String countryID;
		
		try {
			int i = libSiglum.indexOf('-');
			countryID = libSiglum.substring(0, i);
		}
		catch (NullPointerException | IndexOutOfBoundsException e) {
			return null;
		}
		
		pkNamesToValues.put("countryID", countryID);
		pkNamesToValues.put("libSiglum", libSiglum);
		query = super.buildSelectQuery(LIBRARY, pkNamesToValues);
		try {
			resultSet = super.getResultSet(query);
			
			resultSet.next();
			l = new Library(resultSet);
		} catch (Exception e) {
			//Catch and do nothing.
			//Because this is meant to return null if there is no library with the libSiglum
		}
		
		return l;
	}
	
	public Library getLibrary(String libSiglum) throws Exception {
		HashMap<String, String> pkNamesToValues = new HashMap<String, String>();
		Library l = null;
		ResultSet resultSet;
		String query;
		String countryID;
		
		try {
			int i = libSiglum.indexOf('-');
			countryID = libSiglum.substring(0, i);
		}
		catch (NullPointerException | IndexOutOfBoundsException e) {
			return null;
		}
		
		pkNamesToValues.put("countryID", countryID);
		pkNamesToValues.put("libSiglum", libSiglum);
		query = super.buildSelectQuery(LIBRARY, pkNamesToValues);
		resultSet = super.getResultSet(query);
			
		resultSet.next();
		l = new Library(resultSet);
		
		return l;
	}
	
	
	/**
	 * getLibraries - gets an array list of all the Libraries. 
	 * @return - Arraylist of Library objects.
	 * @throws Exception - any exception. 
	 */
	public ArrayList<Library> getLibraries(String countryID) throws Exception{
		HashMap<String,String> namesToValues = new HashMap<String, String>();
		String query;
		ResultSet resultSet;
		ArrayList<Library> libraries;
		Library l;
		
		namesToValues.put("countryID", countryID);
		query = super.buildSelectQuery(LIBRARY, namesToValues);
		resultSet = super.getResultSet(query);
		
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
	public boolean deleteLibrary(String libSiglum) throws Exception{
		String query;
		HashMap<String, String> pkNamesToValues = new HashMap<String,String>();

		try {
			pkNamesToValues.put("libSiglum", libSiglum);
			
			query = super.buildDeleteQuery(LIBRARY, pkNamesToValues);
			
			super.executeSQL(query);
					
			return true;
		}
		catch (SQLException e) {
			return false;
		}
	}
}
