package spg.controllers;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;

import spg.models.Manuscript;

/**
 * 
 * @author Carl Clermont
 *
 */
public class ManuscriptController {

	private final static String MANUSCRIPT = "Manuscript"; 
	
	/**
	 * createManuscript - sets up to do an insert statement to create a new Manuscript.
	 * @params - 
	 * @return - 
	 * @throws Exception - 
	 */
	public static Manuscript createManuscript(String libSiglum, String msSiglum, String msType,
			String dimensions, String leaves, String foliated, String vellum,
			String binding, String sourceNotes, String summary, String bibliography) throws Exception {
		String query;
		Manuscript ms;
		
		HashMap<String, String> namesToValues = new HashMap<String, String>();

		//Eventually move to SPG Controller and make generic for testing if primary keys are correct.
		if(libSiglum == null || libSiglum.equals("") || msSiglum == null || msSiglum.equals("")) {
			throw new Exception("libSiglum and msSiglum cannot be left empty or blank.");
		}
		
		namesToValues.put("libSiglum", libSiglum);
		namesToValues.put("msSiglum", msSiglum);
		namesToValues.put("msType", msType);
		namesToValues.put("dimensions", dimensions);
		namesToValues.put("leaves", leaves);
		namesToValues.put("foliated", foliated);
		namesToValues.put("vellum", vellum);
		namesToValues.put("binding", binding);
		namesToValues.put("sourceNotes", sourceNotes);
		namesToValues.put("summary", summary);
		namesToValues.put("bibliography", bibliography);
		
		query = SpgController.buildInsertQuery(MANUSCRIPT, namesToValues);
		SpgController.executeSQL(query);
		
		ms = new Manuscript(libSiglum, msSiglum, msType, dimensions, leaves, foliated, vellum,
				binding, sourceNotes, summary, bibliography);
				
		return ms;
	}

	/**
	 * updateManuscript -
	 * @params -
	 * @return -
	 * @throws Exception -
	 */
	public static Manuscript updateManuscript(String libSiglum, String msSiglum, String msType,
			String dimensions, String leaves, String foliated, String vellum,
			String binding, String sourceNotes, String summary, String bibliography) throws Exception {
		String query;
		Manuscript ms;
		
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		HashMap<String, String> pkNamesToValues = new HashMap<String, String>();
		
		namesToValues.put("msType", msType);
		namesToValues.put("dimensions", dimensions);
		namesToValues.put("leaves", leaves);
		namesToValues.put("foliated", foliated);
		namesToValues.put("vellum", vellum);
		namesToValues.put("binding", binding);
		namesToValues.put("sourceNotes", sourceNotes);
		namesToValues.put("summary", summary);
		namesToValues.put("bibliography", bibliography);
		
		pkNamesToValues.put("libSiglum", libSiglum);
		pkNamesToValues.put("msSiglum", msSiglum);
		
		query = SpgController.buildUpdateQuery(MANUSCRIPT, pkNamesToValues, namesToValues);
		SpgController.executeSQL(query);
		
		ms = new Manuscript(libSiglum, msSiglum, msType, dimensions, leaves, foliated, vellum,
				binding, sourceNotes, summary, bibliography);
				
		return ms;
	}

	
	/**
	 * 
	 * @param getLibSiglum
	 * @param getMSSiglum
	 * @return
	 * @throws Exception
	 */
	public static Manuscript getManuscript(String getLibSiglum, String getMSSiglum) throws Exception {
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		Manuscript ms;
		String query;
		ResultSet resultSet;
		
		query = SpgController.buildSelectQuery(MANUSCRIPT, namesToValues);
		resultSet = SpgController.getResultSet(query);
		
		resultSet.next();
		ms = new Manuscript(resultSet);
		
		return ms;
	}
	
	/**
	 * 
	 * @param country 
	 * @param libSiglum 
	 * @return
	 * @throws Exception
	 */
	public static ArrayList<Manuscript> getManuscripts(String libSiglum, String country) throws Exception {
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		String query;
		ResultSet resultSet;

		//filter by none, country, or country and libSiglum.
		if( !(country == null || country.equals("")) ) {
			namesToValues.put("country", country);
			if(!(libSiglum == null || libSiglum.equals(""))) {
				namesToValues.put("libSiglum", libSiglum);
			}
		}
		
		query = SpgController.buildSelectQuery(MANUSCRIPT, namesToValues);
		
		resultSet = SpgController.getResultSet(query);
		
		ArrayList<Manuscript> manuscripts = new ArrayList<Manuscript>();
		Manuscript ms;
		
		while (resultSet.next()) {
			ms = new Manuscript(resultSet);
			manuscripts.add(ms);
		}
		
		return manuscripts;
	}
	
	/**
	 * deleteManuscript -
	 * @param libSiglum -
	 * @param msSiglum -
	 * @return -
	 * @throws Exception -
	 */
	public static boolean deleteManuscript(String libSiglum, String msSiglum) throws Exception {
		String query;
		HashMap<String, String> pkNamesToValues = new HashMap<String,String>();

		pkNamesToValues.put("libSiglum", libSiglum);
		pkNamesToValues.put("msSiglum", msSiglum);
		
		query = SpgController.createDeleteQuery(MANUSCRIPT, pkNamesToValues);
		
		SpgController.executeSQL(query);
				
		return true;
	}




}
