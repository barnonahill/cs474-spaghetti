package spg.controllers;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;

import spg.models.MSType;
import spg.models.Manuscript;

/**
 * 
 * @author Carl Clermont
 *
 */
public class ManuscriptController extends SpgController {
	private static final long serialVersionUID = 1L;
	
	private final static String MANUSCRIPT = "Manuscript";
	private final static String MSTYPE = "MSType"; 
	
	
	/**
	 * Set up the DB connection info.
	 */
	public ManuscriptController () {
		super();
	}
	
	/**
	 * createMSType -
	 * @param msType -
	 * @param msTypeName -
	 * @return - 
	 * @throws Exception -
	 */
	public MSType createMSType(String msType, String msTypeName) throws Exception {
		String query;
		MSType mst;
		
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		
		if(msType == null) {
			throw new Exception("msType cannot be left empty.");
		}
		
		namesToValues.put("msType", msType);
		namesToValues.put("msTypeName", msTypeName);
		
		query = super.buildInsertQuery(MSTYPE, namesToValues);
		super.executeSQL(query);
		
		mst = new MSType(msType, msTypeName);
				
		return mst;
	}

	
	/**
	 * updateMSType - 
	 * @param msType - 
	 * @param msTypeName - 
	 * @return - 
	 * @throws Exception -
	 */
	public MSType updateMSType(String msType, String msTypeName) throws Exception {
		String query;
		MSType mst;
		
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		HashMap<String, String> pkNamesToValues = new HashMap<String, String>();
		
		pkNamesToValues.put("msType", msType);
		namesToValues.put("msTypeName", msTypeName);
		
		query = super.buildUpdateQuery(MSTYPE, pkNamesToValues, namesToValues);
		super.executeSQL(query);
		
		mst = new MSType(msType, msTypeName);
				
		return mst;
	}

	
	public ArrayList<MSType> getMSTypes() throws Exception {
		ArrayList<MSType> msts = new ArrayList<MSType>();
		String query;
		ResultSet resultSet;
		MSType mst;
		
		query = super.buildSelectQuery(MSTYPE, null);
		resultSet = super.getResultSet(query);
		
		while (resultSet.next()) {
			mst = new MSType(resultSet);
			msts.add(mst);
		}
		
		return msts;
	}
	
	
	
	/**
	 * Deletes an MSType.
	 * @param msType - 
	 * @param msTypeName -
	 * @return -
	 * @throws Exception -
	 */
	public boolean deleteMSType(String msType) throws Exception {
		String query;
		HashMap<String, String> pkNamesToValues = new HashMap<String,String>();

		pkNamesToValues.put("msType", msType);
		
		query = super.buildDeleteQuery(MSTYPE, pkNamesToValues);
		
		super.executeSQL(query);
				
		return true;
	}
	
	
	
	/**
	 * createManuscript - sets up to do an insert statement to create a new Manuscript.
	 * @params - 
	 * @return - 
	 * @throws Exception - 
	 */
	public Manuscript createManuscript(String libSiglum, String msSiglum, String msType,
			String dimensions, String leaves, String foliated, String vellum,
			String binding, String sourceNotes, String summary, String bibliography) throws Exception {
		String query;
		Manuscript ms;
		
		HashMap<String, String> namesToValues = new HashMap<String, String>();

		//Eventually move to SPG Controller and make generic for testing if primary keys are correct.
		if(libSiglum == null  || msSiglum == null) {
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
		
		query = super.buildInsertQuery(MANUSCRIPT, namesToValues);
		super.executeSQL(query);
		
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
	public Manuscript updateManuscript(String libSiglum, String msSiglum, String msType,
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
		
		query = super.buildUpdateQuery(MANUSCRIPT, pkNamesToValues, namesToValues);
		super.executeSQL(query);
		
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
	public Manuscript getManuscript(String libSiglum, String msSiglum) throws Exception {
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		Manuscript ms;
		String query;
		ResultSet resultSet;
		
		namesToValues.put("libSiglum", libSiglum);
		namesToValues.put("msSiglum", msSiglum);
		query = super.buildSelectQuery(MANUSCRIPT, namesToValues);
		resultSet = super.getResultSet(query);
		
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
	public ArrayList<Manuscript> getManuscripts(String libSiglum) throws Exception {
		HashMap<String, String> namesToValues = null;
		String query;
		ResultSet resultSet;
		Manuscript ms;
		ArrayList<Manuscript> manuscripts = new ArrayList<Manuscript>();

		if(libSiglum != null) {
			namesToValues = new HashMap<String, String>();
			namesToValues.put("libSiglum", libSiglum);
		}
		query = super.buildSelectQuery(MANUSCRIPT, namesToValues);
		
		resultSet = super.getResultSet(query);
		
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
	public boolean deleteManuscript(String libSiglum, String msSiglum) throws Exception {
		String query;
		HashMap<String, String> pkNamesToValues = new HashMap<String,String>();

		pkNamesToValues.put("libSiglum", libSiglum);
		pkNamesToValues.put("msSiglum", msSiglum);
		
		query = super.buildDeleteQuery(MANUSCRIPT, pkNamesToValues);
		
		super.executeSQL(query);
				
		return true;
	}

	/**
	 * 
	 * @param getLibSiglum
	 * @param getMSSiglum
	 * @return
	 * @throws Exception
	 */
	public Manuscript getManuscriptOrNull(String libSiglum, String msSiglum) {
		HashMap<String, String> namesToValues = new HashMap<String, String>();
		Manuscript ms = null;
		String query;
		ResultSet resultSet;
		
		namesToValues.put("libSiglum", libSiglum);
		namesToValues.put("msSiglum", msSiglum);
		query = super.buildSelectQuery(MANUSCRIPT, namesToValues);

		try {
			resultSet = super.getResultSet(query);
			resultSet.next();
			ms = new Manuscript(resultSet);
		} catch (Exception e) {
			//This method is meant to cut of the exception. its for testing if a ms already exists.
		}
		
		
		return ms;
	}

	
}
