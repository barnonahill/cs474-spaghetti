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
	
	public static Library updateLibrary(String libSiglum, String countryID , String city, 
			String library, String address1, String address2, String postCode) throws Exception {
		String predicate, query;
		StringBuilder updates = new StringBuilder("");
		predicate = "Libsiglum = '" + libSiglum + "' ";
		
		
		//probably should make this generic with a ceateUpdatesString() vvv
		if(!(countryID == null || countryID.equals(""))) {
			updates.append("countryID = '" + countryID + "' ");
		}
		
		if(!(city == null || city.equals(""))) {
			if(!(countryID == null || countryID.equals("")))
				updates.append(", ");
			updates.append("city = '" + city + "' ");
		}
		
		if(!(library == null || library.equals(""))) {
			if(!(countryID == null || countryID.equals("")) || !(countryID == null || countryID.equals("")))
				updates.append(", ");
			updates.append("library = '" + library + "' ");
		}
		
		if(!(address1 == null || address1.equals(""))) {
			if(!(countryID == null || countryID.equals("")) || !(countryID == null || countryID.equals("")) || !(library == null || library.equals("")))
				updates.append(", ");
			updates.append("address1 = '" + address1 + "' ");
		}
		
		if(!(address2 == null || address2.equals(""))) {
			if(!(address1 == null || address1.equals("")))
				updates.append(", ");
			updates.append("address2 = '" + address2 + "' ");
		}
		
		if(!(postCode == null || postCode.equals(""))) {
			if(!(countryID == null || countryID.equals("")) || !(countryID == null || countryID.equals("")) || !(library == null || library.equals(""))
					|| !(address1 == null || address1.equals("")))
				updates.append(", ");
			updates.append("postCode = '" + postCode + "' ");
		}
		//if you have time go and make a generic for this. ^^^
		
		query = SpgController.buildUpdateQuery("Library", predicate, updates.toString());
		ResultSet resultSet;
		Library l;
		
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
		// TODO Auto-generated method stub
		String query = "DELETE FROM Library WHERE libSiglum = '" + libSiglum + "' ;";
		ResultSet resultSet;
		Library l;
		
		resultSet = SpgController.getResultSet(query);
		resultSet.next();
		l = new Library(resultSet);
		
		return l;
	}
	
	
	
}
