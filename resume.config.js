const { resolve } = require("path");
const { execSync } = require("child_process");
const BUILD_DIR = resolve(__dirname, "build");
const RESUME_GENERATOR_SCRIPT = resolve(__dirname, "build", "resume");
const RESUME_YAML = resolve(__dirname, "resume.yaml")
const RESUME_SRC = resolve(__dirname, "src", "resume");
const RESUME_OUT = resolve(__dirname, "docs", "resume.html");
const CSS_SRC = resolve(__dirname, "src", "styles.css")

module.exports = {
    mode: "production",
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
                const externalDependencies = [CSS_SRC, RESUME_YAML]
                compiler.hooks.afterCompile.tap("AfterCompilePlugin", compilation => {
                    if (Array.isArray(compilation.fileDependencies)) {
                        externalDependencies.forEach(file => {
                            if (!compilation.fileDependencies(file)) {
                                compilation.fileDependencies.push(file)
                            }
                        })
                    } else {
                        externalDependencies.forEach(file => {
                            compilation.fileDependencies.add(file)
                        })
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
