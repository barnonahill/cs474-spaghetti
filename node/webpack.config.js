const path = require('path');

const config = {
	/*
	 * index.ts represents the entry point to your web application. Webpack will
	 * recursively go through every "require" statement in index.ts and
	 * efficiently build out the application's dependency tree.
	 */
	entry: ['./src/index.tsx'],

	/*
	 * The combination of path and filename tells Webpack what name to give to
	 * the final bundled JavaScript file and where to store this file.
	 */
	output: {
		path: path.join(__dirname, 'bin'),
		filename: 'scripts.js'
	},

	/*
	 * Mode: 'production', 'development', or 'none'
	 * Basically prod. will compress our output file while dev. will not.
	 * Since Norton is not concerned with our front-end code, we will use prod for submission.
	 */
	mode: 'development',

	/*
	 * Use source maps
	 */
	devtool: 'inline-source-maps',

	/*
	 * resolve lets Webpack now in advance what file extensions you plan on
	 * "require"ing into the web application, and allows you to drop them
	 * in your code.
	 */
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"]
	},

	module: {
		/*
		 * Each loader needs an associated Regex test that goes through each
		 * of the files you've included (or in this case, all files but the
		 * ones in the excluded directories) and finds all files that pass
		 * the test. Then it will apply the loader to that file. I haven't
		 * installed ts-loader yet, but will do that shortly.
		 */
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/
		}]
	},

	/* When importing a module whose path matches one of the following, just
	 * assume a corresponding global variable exists and use that instead.
	 * This is important because it allows us to avoid bundling all of our
	 * dependencies, which allows browsers to cache those libraries between builds.
	 */
	externals: {
		"react": "React",
		"react-dom": "ReactDOM"
	}
};

module.exports = config;
