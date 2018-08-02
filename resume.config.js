const { resolve } = require("path");
const { execSync } = require("child_process");
const BUILD_DIR = resolve(__dirname, "build");
const RESUME_GENERATOR_SCRIPT = resolve(__dirname, "build", "resume");
const RESUME_SRC = resolve(__dirname, "src", "resume");
const RESUME_OUT = resolve(__dirname, "docs", "resume.html");
const CSS_SRC = resolve(__dirname, "src", "styles.css")

module.exports = {
    mode: "development",
    target: "node",
    entry: {
        resume: RESUME_SRC
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].js"
    },
    devtool: "source-map",
    plugins: [
        // Watch files not compiled by webpack
        {

            apply: compiler => {
                compiler.hooks.afterCompile.tap("AfterCompilePlugin", compilation => {
                    if (Array.isArray(compilation.fileDependencies)) {
                        if (!compilation.fileDependencies(CSS_SRC)) {
                            compilation.fileDependencies.push(CSS_SRC)
                        }
                    } else {
                        compilation.fileDependencies.add(CSS_SRC)
                    }
                })
            }
        },
        // Run the compiled script and save the output to the docs folder
        {
            apply: compiler => {
                compiler.hooks.afterEmit.tap("AfterEmitPlugin", stats => {
                    execSync(`node ${RESUME_GENERATOR_SCRIPT} > ${RESUME_OUT}`)
                })
            }
        }
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["react", "env"]
                    }
                }
            }
        ]
    }
}
