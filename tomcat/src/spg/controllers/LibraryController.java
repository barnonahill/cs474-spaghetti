package spg.controllers;

import java.sql.ResultSet;
import java.util.ArrayList;

import spg.models.Country;
import spg.models.Library;

/**
 * LibraryController - Static methods used for handling Library and Country sql commands.
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
		String query = SpgController.buildSelectQuery("Country", null, null);
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
	 * createLibrary - currently assumes no null values. CAREFUL!!!
	 * @params - condensed - (im lazy) the columns of the Library table.
	 * @return - A Library object. (the one made from what was passed in.)
	 * @throws Exception - anything.
	 */
	public static Library createLibrary(String libSiglum, String countryID, String city,
			String library, String address1, String address2, String postCode) throws Exception{
		

		
		ResultSet resultSet;
		String query;
		//Should I check these for null or empty values??
		StringBuilder stringBuilder = new StringBuilder("INSERT INTO Library VALUES ( ");
		stringBuilder.append("'"+ libSiglum +"',");
		stringBuilder.append("'"+ countryID +"',");
		stringBuilder.append("'"+ city +"',");
		stringBuilder.append("'"+ library +"',");
		stringBuilder.append("'"+ address1 +"',");
		stringBuilder.append("'"+ address2 +"',");
		stringBuilder.append("'"+ postCode +"',");
		stringBuilder.append(");");
		
		query = stringBuilder.toString();
		resultSet = SpgController.getResultSet(query);
		
		//Should I build the Library manually??
		//since the result set may just confirm the Library was inserted. 
		//(or I could use getLibrary(libSiglum) when that is finished)!!
		resultSet.next();
		Library lib = new Library(resultSet);
		
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
		ArrayList<String> varNames, varValues, pkNames, pkValues;
		varNames = new ArrayList<String>();
		varValues = new ArrayList<String>();
		pkNames = new ArrayList<String>();
		pkValues = new ArrayList<String>();
		
		//all non primary keys. aka anything that can be changed within Library.
		varNames.add("countryID");
		varNames.add("city");
		varNames.add("library");
		varNames.add("address1");
		varNames.add("address2");
		varNames.add("postCode");
		
		varValues.add(countryID);
		varValues.add(city);
		varValues.add(library);
		varValues.add(address1);
		varValues.add(address2);
		varValues.add(postCode);
		
		pkNames.add("libSiglum");
		
		pkValues.add(libSiglum);
		
		query = SpgController.buildUpdateQuery("Library", varNames, varValues, pkNames, pkValues);
		ResultSet resultSet;

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
		String query = SpgController.buildSelectQuery("Library", "countryID", countryID);
		
		ResultSet resultSet;
		resultSet = SpgController.getResultSet(query);
		
		ArrayList<Library> libraries = new ArrayList<Library>();
		Library l;
		
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
	public static Library deleteLibrary(String libSiglum) throws Exception{
		String query;
		ArrayList<String> pkNames, pkValues;
		pkNames = new ArrayList<String>();
		pkValues = new ArrayList<String>();
		ResultSet resultSet;
		Library l;
		
		pkNames.add("libSiglum");
		pkValues.add(libSiglum);
		
		query = SpgController.createDeleteQuery("Library", pkNames, pkValues);
		
		resultSet = SpgController.getResultSet(query);
		resultSet.next();
		l = new Library(resultSet);
		
		return l;
	}
	
	
	
}
