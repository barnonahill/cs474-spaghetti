package spg.servlets;

import java.io.IOException;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import spg.controllers.SectionController;
import spg.models.Century;
import spg.models.Cursus;
import spg.models.Notation;
import spg.models.Provenance;
import spg.models.Section;
import spg.models.SourceCompleteness;

/**
 * 
 * @author Paul Barnhill, Zach Butts, Carl Clermont, Kyle Tran,
 *
 */
@WebServlet(name = "SectionServices", urlPatterns = { "/section" })
public class SectionServlet extends SpgHttpServlet {
	private SectionController sectionController;

	private static final long serialVersionUID = 1L;

	private static final String CREATE_SECTION = "createsection";
	private static final String UPDATE_SECTION = "updatesection";
	private static final String GET_SECTION = "getsection";
	private static final String GET_SECTIONS = "getsections";
	private static final String DELETE_SECTION = "deletesections";

	private static final String GET_CENTURIES = "GetCenturies";
	private static final String CREATE_CENTURY = "CreateCentury";
	private static final String UPDATE_CENTURY = "UpdateCentury";
	private static final String DELETE_CENTURY = "DeleteCentury";

	private static final String GET_CURSUSES = "GetCursuses";
	private static final String CREATE_CURSUS = "CreateCursus";
	private static final String UPDATE_CURSUS = "UpdateCursus";
	private static final String DELETE_CURSUS = "DeleteCursus";

	private static final String GET_SRC_COMPS = "GetSourceCompletenesses";
	private static final String CREATE_SRC_COMP = "CreateSourceCompleteness";
	private static final String UPDATE_SRC_COMP = "UpdateSourceCompleteness";
	private static final String DELETE_SRC_COMP = "DeleteSourceCompleteness";

	private static final String GET_PROVENANCES = "GetProvenances";
	private static final String CREATE_PROVENANCE = "CreateProvenance";
	private static final String UPDATE_PROVENANCE = "UpdateProvenance";
	private static final String DELETE_PROVENANCE = "DeleteProvenance";

	private static final String GET_NOTATIONS = "GetNotations";
	private static final String CREATE_NOTATION = "CreateNotation";
	private static final String UPDATE_NOTATION = "UpdateNotation";
	private static final String DELETE_NOTATION = "DeleteNotation";

	public SectionServlet() {
		super();
		this.sectionController = new SectionController();
	}

	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
		try {
			Map<String, String> params = super.getParameters(req);
			String action = super.getParameter(params, "action").toLowerCase();
			String msg = null;

			sectionController.open();

			if (action.equalsIgnoreCase(GET_SECTION)) {
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String msSiglum = super.getRequiredParameter(params, "msSiglum");
				String sectionID = super.getRequiredParameter(params, "sectionID");

				msg = this.getSection(libSiglum, msSiglum, sectionID);
			}

			else if (action.equalsIgnoreCase(GET_SECTIONS)) {
				String libSiglum = super.getParameter(params, "libSiglum");
				String msSiglum = super.getParameter(params, "msSiglum");

				msg = this.getSections(libSiglum, msSiglum);
			}

			else if (action.equalsIgnoreCase(CREATE_SECTION)) {
				// Composite primary key
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String msSiglum = super.getRequiredParameter(params, "msSiglum");
				String sectionID = super.getRequiredParameter(params, "sectionID");

				// Optional attributes
				String sectionType = super.getParameter(params, "sectionType");
				String liturgicalOccasion = super.getParameter(params, "liturgicalOccasion");
				String notationID = super.getParameter(params, "notationID");
				String numGatherings = super.getParameter(params, "numGatherings");
				String numColumns = super.getParameter(params, "numColumns");
				String linesPerColumn = super.getParameter(params, "linesPerColumn");
				String scribe = super.getParameter(params, "scribe");
				String date = super.getParameter(params, "date");
				String centuryID = super.getParameter(params, "centuryID");
				String cursusID = super.getParameter(params, "cursusID");
				String provenanceID = super.getParameter(params, "provenanceID");
				String provenanceDetail = super.getParameter(params, "provenanceDetail");
				String commissioner = super.getParameter(params, "commissioner");
				String inscription = super.getParameter(params, "inscription");
				String colophon = super.getParameter(params, "colophon");
				String sourceCompletenessID = super.getParameter(params, "sourceCompletenessID");

				msg = this.createSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasion, notationID,
						numGatherings, numColumns, linesPerColumn, scribe, date, centuryID, cursusID, provenanceID,
						provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
			}

			else if (action.equalsIgnoreCase(UPDATE_SECTION)) {
				// Primary key
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String msSiglum = super.getRequiredParameter(params, "msSiglum");
				String sectionID = super.getRequiredParameter(params, "sectionID");

				// Optional attributes
				String sectionType = super.getParameter(params, "sectionType");
				String liturgicalOccasion = super.getParameter(params, "liturgicalOccasion");
				String notationID = super.getParameter(params, "notationID");
				String numGatherings = super.getParameter(params, "numGatherings");
				String numColumns = super.getParameter(params, "numColumns");
				String linesPerColumn = super.getParameter(params, "linesPerColumn");
				String scribe = super.getParameter(params, "scribe");
				String date = super.getParameter(params, "date");
				String centuryID = super.getParameter(params, "centuryID");
				String cursusID = super.getParameter(params, "cursusID");
				String provenanceID = super.getParameter(params, "provenanceID");
				String provenanceDetail = super.getParameter(params, "provenanceDetail");
				String commissioner = super.getParameter(params, "commissioner");
				String inscription = super.getParameter(params, "inscription");
				String colophon = super.getParameter(params, "colophon");
				String sourceCompletenessID = super.getParameter(params, "sourceCompletenessID");

				msg = this.updateSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasion, notationID,
						numGatherings, numColumns, linesPerColumn, scribe, date, centuryID, cursusID, provenanceID,
						provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
			}

			else if (action.equalsIgnoreCase(DELETE_SECTION)) {
				String libSiglum = super.getRequiredParameter(params, "libSiglum");
				String msSiglum = super.getRequiredParameter(params, "msSiglum");
				String sectionID = super.getRequiredParameter(params, "sectionID");
				msg = this.deleteSection(libSiglum, msSiglum, sectionID);
			}

			else if (action.equalsIgnoreCase(GET_CENTURIES)) {
				msg = this.getCenturies();
			}

			else if (action.equalsIgnoreCase(UPDATE_CENTURY)) {
				String centuryID = super.getRequiredParameter(params, "centuryID");
				String centuryName = super.getParameter(params, "centuryName");

				msg = this.updateCentury(centuryID, centuryName);
			}

			else if (action.equalsIgnoreCase(CREATE_CENTURY)) {
				String centuryID = super.getRequiredParameter(params, "centuryID");
				String centuryName = super.getParameter(params, "centuryName");

				msg = this.createCentury(centuryID, centuryName);
			}

			else if (action.equalsIgnoreCase(DELETE_CENTURY)) {
				String centuryID = super.getRequiredParameter(params, "centuryID");
				msg = this.deleteCentury(centuryID);
			}

			else if (action.equalsIgnoreCase(GET_CURSUSES)) {
				msg = this.getCursuses();
			}

			else if (action.equalsIgnoreCase(UPDATE_CURSUS)) {
				String cursusID = super.getRequiredParameter(params, "cursusID");
				String cursusName = super.getParameter(params, "cursusName");

				msg = this.updateCursus(cursusID, cursusName);
			}

			else if (action.equalsIgnoreCase(CREATE_CURSUS)) {
				String cursusID = super.getRequiredParameter(params, "cursusID");
				String cursusName = super.getParameter(params, "cursusName");

				msg = this.createCursus(cursusID, cursusName);
			}

			else if (action.equalsIgnoreCase(DELETE_CURSUS)) {
				String cursusID = super.getRequiredParameter(params, "cursusID");
				msg = this.deleteCursus(cursusID);
			}

			else if (action.equalsIgnoreCase(GET_SRC_COMPS)) {
				msg = this.getSourceCompletenesses();
			}

			else if (action.equalsIgnoreCase(UPDATE_SRC_COMP)) {
				String sourceCompletenessID = super.getRequiredParameter(params, "sourceCompletenessID");
				String sourceCompletenessName = super.getParameter(params, "sourceCompletenessName");

				msg = this.updateSourceCompleteness(sourceCompletenessID, sourceCompletenessName);
			}

			else if (action.equalsIgnoreCase(CREATE_SRC_COMP)) {
				String sourceCompletenessID = super.getRequiredParameter(params, "sourceCompletenessID");
				String sourceCompletenessName = super.getParameter(params, "sourceCompletenessName");

				msg = this.createSourceCompleteness(sourceCompletenessID, sourceCompletenessName);
			}

			else if (action.equalsIgnoreCase(DELETE_SRC_COMP)) {
				String sourceCompletenessID = super.getRequiredParameter(params, "sourceCompletenessID");
				msg = this.deleteSourceCompleteness(sourceCompletenessID);
			}

			else if (action.equalsIgnoreCase(GET_PROVENANCES)) {
				msg = this.getProvenances();
			}

			else if (action.equalsIgnoreCase(UPDATE_PROVENANCE)) {
				String provenanceID = super.getRequiredParameter(params, "provenanceID");
				String provenanceName = super.getParameter(params, "provenanceName");
				msg = this.updateProvenance(provenanceID, provenanceName);
			}

			else if (action.equalsIgnoreCase(CREATE_PROVENANCE)) {
				String provenanceID = super.getRequiredParameter(params, "provenanceID");
				String provenanceName = super.getParameter(params, "provenanceName");
				msg = this.createProvenance(provenanceID, provenanceName);
			}

			else if (action.equalsIgnoreCase(DELETE_PROVENANCE)) {
				String provenanceID = super.getRequiredParameter(params, "provenanceID");
				msg = this.deleteProvenance(provenanceID);
			}

			else if (action.equalsIgnoreCase(GET_NOTATIONS)) {
				msg = this.getNotations();
			}

			else if (action.equalsIgnoreCase(UPDATE_NOTATION)) {
				String notationID = super.getRequiredParameter(params, "notationID");
				String notationName = super.getParameter(params, "notationName");
				msg = this.updateNotation(notationID, notationName);
			}

			else if (action.equalsIgnoreCase(CREATE_NOTATION)) {
				String notationID = super.getRequiredParameter(params, "notationID");
				String notationName = super.getParameter(params, "notationName");
				msg = this.createNotation(notationID, notationName);
			}

			else if (action.equalsIgnoreCase(DELETE_NOTATION)) {
				String notationID = super.getRequiredParameter(params, "notationID");
				msg = this.deleteNotation(notationID);
			}

			else {
				throw new Exception("Invalid action parameter.");
			}

			if (msg != null) {
				super.writeResponse(res, msg);
			}

		} catch (Exception e) {
			super.writeResponse(res, e);
		} finally {
			try {
				sectionController.close();
			} catch (Exception e) {
			}
		}
	}

	/**
	 * createSection - creates a new section.
	 * 
	 * @params -
	 * @return -
	 * @throws Exception
	 *             -
	 */
	private String createSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccasion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID, String provenanceID,
			String provenanceDetail, String commissioner, String inscription, String colophon,
			String sourceCompletenessID) throws Exception {

		try {
			Section s = sectionController.createSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasion,
					notationID, numGatherings, numColumns, linesPerColumn, scribe, date, centuryID, cursusID,
					provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
			return s.toJSON().toString();
		} catch (SQLIntegrityConstraintViolationException e) {
			throw new Exception("A Section with the same primary key already exists.");
		}
	}

	/**
	 * updateSection -
	 * 
	 * @params -
	 * @return -
	 * @throws Exception
	 */
	private String updateSection(String libSiglum, String msSiglum, String sectionID, String sectionType,
			String liturgicalOccasion, String notationID, String numGatherings, String numColumns,
			String linesPerColumn, String scribe, String date, String centuryID, String cursusID, String provenanceID,
			String provenanceDetail, String commissioner, String inscription, String colophon,
			String sourceCompletenessID) throws Exception {
		try {
			Section s = sectionController.updateSection(libSiglum, msSiglum, sectionID, sectionType, liturgicalOccasion,
					notationID, numGatherings, numColumns, linesPerColumn, scribe, date, centuryID, cursusID,
					provenanceID, provenanceDetail, commissioner, inscription, colophon, sourceCompletenessID);
			return s.toJSON().toString();
		} catch (SQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}

	/**
	 * getSection -
	 * 
	 * @param getLibSiglum
	 *            -
	 * @param getMSSiglum
	 *            -
	 * @param deletesectionID
	 * @return -
	 * @throws Exception
	 */
	private String getSection(String libSiglum, String msSiglum, String sectionID) throws Exception {
		try {
			Section s = sectionController.getSection(libSiglum, msSiglum, sectionID);
			return s.toJSON().toString();
		} catch (SQLIntegrityConstraintViolationException e) {
			throw new Exception("An entry with the same primary key already exists.");
		}
	}

	/**
	 * @param deletesectionID
	 * @param countries
	 * @param libSiglums
	 * @throws Exception
	 * 
	 */
	private String getSections(String libSiglum, String sectionID) throws Exception {
		JSONArray sections = new JSONArray();
		ArrayList<Section> results = sectionController.getSections(libSiglum, sectionID);

		for (Section s : results) {
			sections.put(s.toJSON());
		}

		return sections.toString();
	}

	/**
	 * deleteManuscript -
	 * 
	 * @param deleteLibSiglum
	 *            -
	 * @param deleteMSSiglum
	 *            -
	 * @param deletesectionID
	 * @return -
	 * @throws Exception
	 */
	private String deleteSection(String deleteLibSiglum, String deleteMSSiglum, String deletesectionID)
			throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;

		try {
			sectionController.deleteSection(deleteLibSiglum, deleteMSSiglum, deletesectionID);
			success = true;
		} catch (SQLException e) {
			success = false;
		}

		j.put("success", success);
		return j.toString();
	}

	/**
	 * getCenturies -
	 * 
	 * @return
	 * @throws Exception
	 */
	private String getCenturies() throws Exception {
		ArrayList<Century> centuries = sectionController.getCenturies();
		if (centuries == null) {
			throw new Exception("Could not load centuries.");
		}

		JSONArray j = new JSONArray();
		for (Century c : centuries) {
			j.put(c.toJSON());
		}

		return j.toString();
	}

	private String createCentury(String centuryID, String centuryName) throws Exception {
		Century c = sectionController.createCentury(centuryID, centuryName);
		return c.toJSON().toString();
	}

	/**
	 * updateCentury -
	 * 
	 * @params -
	 * @return -
	 * @throws Exception
	 */
	private String updateCentury(String centuryID, String centuryName) throws Exception {
		Century c = sectionController.updateCentury(centuryID, centuryName);
		return c.toJSON().toString();
	}

	private String deleteCentury(String centuryID) throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;

		try {
			sectionController.deleteCentury(centuryID);
			success = true;
		} catch (SQLException e) {
			success = false;
		}

		j.put("success", success);
		return j.toString();
	}

	private String getCursuses() throws Exception {
		ArrayList<Cursus> cursuses = sectionController.getCursuses();
		if (cursuses == null) {
			throw new Exception("Could not load cursuses.");
		}

		JSONArray j = new JSONArray();
		for (Cursus c : cursuses) {
			j.put(c.toJSON());
		}

		return j.toString();
	}

	private String createCursus(String cursusID, String cursusName) throws Exception {
		Cursus c = sectionController.createCursus(cursusID, cursusName);
		return c.toJSON().toString();
	}

	private String updateCursus(String cursusID, String cursusName) throws Exception {
		Cursus c = sectionController.updateCursus(cursusID, cursusName);
		return c.toJSON().toString();
	}

	private String deleteCursus(String cursusID) throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;
		try {
			sectionController.deleteCursus(cursusID);
			success = true;
		} catch (SQLException e) {
			success = false;
		}
		
		j.put("success", success);
		return j.toString();
	}

	private String getSourceCompletenesses() throws Exception {
		ArrayList<SourceCompleteness> sc = sectionController.getSourceCompletenesses();
		if (sc == null) {
			throw new Exception("Could not load source completenesses");
		}

		JSONArray j = new JSONArray();
		for (SourceCompleteness s : sc) {
			j.put(s.toJSON());
		}

		return j.toString();
	}

	private String updateSourceCompleteness(String sourceCompletenessID, String sourceCompletenessName)
			throws Exception {
		SourceCompleteness sc = sectionController.updateSourceCompleteness(sourceCompletenessID,
				sourceCompletenessName);
		return sc.toJSON().toString();
	}

	private String createSourceCompleteness(String sourceCompletenessID, String sourceCompletenessName)
			throws Exception {
		SourceCompleteness sc = sectionController.createSourceCompleteness(sourceCompletenessID,
				sourceCompletenessName);
		return sc.toJSON().toString();
	}

	private String deleteSourceCompleteness(String sourceCompletenessID) throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;
		sectionController.deleteSourceCompleteness(sourceCompletenessID);
		success = true;

		j.put("success", success);
		return j.toString();
	}

	private String getProvenances() throws Exception {
		ArrayList<Provenance> prov = sectionController.getProvenances();
		if (prov == null) {
			throw new Exception("Could not load provenance");
		}

		JSONArray j = new JSONArray();
		for (Provenance p : prov) {
			j.put(p.toJSON());
		}

		return j.toString();
	}

	private String updateProvenance(String pID, String pName) throws Exception {
		Provenance p = sectionController.updateProvenance(pID, pName);
		return p.toJSON().toString();
	}

	private String createProvenance(String pID, String pName) throws Exception {
		Provenance p = sectionController.createProvenance(pID, pName);
		return p.toJSON().toString();
	}

	private String deleteProvenance(String provenanceID) throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;

		try {
			sectionController.deleteProvenance(provenanceID);
			success = true;
		} catch (Exception e) {
			success = false;
		}

		j.put("success", success);
		return j.toString();
	}

	private String getNotations() throws Exception {
		ArrayList<Notation> note = sectionController.getNotations();
		if (note == null) {
			throw new Exception("Could not load notation");
		}

		JSONArray j = new JSONArray();
		for (Notation n : note) {
			j.put(n.toJSON());
		}

		return j.toString();
	}

	private String updateNotation(String nID, String nName) throws Exception {
		Notation n = sectionController.updateNotation(nID, nName);
		return n.toJSON().toString();
	}

	private String createNotation(String nID, String nName) throws Exception {
		Notation n = sectionController.createNotation(nID, nName);
		return n.toJSON().toString();
	}

	private String deleteNotation(String notationID) throws Exception {
		JSONObject j = new JSONObject();
		boolean success = false;
		try {
			sectionController.deleteNotation(notationID);
			success = true;
		} catch (Exception e) {
			success = false;
		}

		j.put("success", success);
		return j.toString();
	}
}
