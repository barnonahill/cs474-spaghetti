package spg.models;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

/**
 * 
 * @author Kyle Tran
 *
 */
public class Leaf {
	private final String libSiglum;
	private final String msSiglum;
	private final int sectionID;
	private final String leafNumber;
	private final int gatheringNum;
	private final int illuminations;
	private final String vellumSurface;
	private final String vellumDefects;
	private final String imageLink;
	
	public Leaf(String libSiglum, String msSiglum, int sectionID, String leafNumber,
			int gatheringNum, int illuminations, String vellumSurface, String vellumDefects,
			String imageLink) {
		this.libSiglum = libSiglum;
		this.msSiglum = msSiglum;
		this.sectionID = sectionID;
		this.leafNumber = leafNumber;
		this.gatheringNum = gatheringNum;
		this.illuminations = illuminations;
		this.vellumSurface = vellumSurface;
		this.vellumDefects = vellumDefects;
		this.imageLink = imageLink;
	}
	
	public Leaf(ResultSet resultSet) throws SQLException {
		this.libSiglum = resultSet.getString("libSiglum");
		this.msSiglum = resultSet.getString("msSiglum");
		this.sectionID = resultSet.getInt("sectionID");
		this.leafNumber = resultSet.getString("leafNumber");
		this.gatheringNum = resultSet.getInt("gatheringNum");
		this.illuminations = resultSet.getInt("illuminations");
		this.vellumSurface = resultSet.getString("vellumSurface");
		this.vellumDefects = resultSet.getString("vellumDefects");
		this.imageLink = resultSet.getString("imageLink");
	}
	
	//Getters
		public String getlibSiglum() {
			return this.libSiglum;
		}
		
		public String getmsSiglum() {
			return this.msSiglum;
		}
		
		public int getSectionID() {
			return this.sectionID;
		}
		
		public String getleafNumber() {
			return this.leafNumber;
		}
		
		public int getGatheringNum() {
			return this.gatheringNum;
		}
		
		public int getIlluminations() {
			return this.illuminations;
		}
		
		public String getVellumSurface() {
			return this.vellumSurface;
		}
		
		public String getVellumDefects() {
			return this.vellumDefects;
		}
		
		public String imageLink() {
			return this.imageLink;
		}
		
		/**
		 * Returns a JSONObject representation of this Leaf.
		 */
		public JSONObject toJSON() {
			JSONObject j = new JSONObject();
			j.put("libSiglum", this.libSiglum);
			j.put("msSiglum", this.msSiglum);
			j.put("sectionID", this.sectionID);
			j.put("leafNumber", this.leafNumber);
			j.put("gatheringNum", this.gatheringNum);
			j.put("illuminations", this.illuminations);
			j.put("vellumSurface", this.vellumSurface);
			j.put("vellumDefects", this.vellumDefects);
			j.put("imageLink", this.imageLink);
			return j;
		}
		
		/**
		 * Returns a JSONObject String representation of this Leaf.
		 */
		public String toString() {
			return this.toJSON().toString();
		}
}
