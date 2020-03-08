import React from "react";
import postcssPresetEnv from "postcss-preset-env";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "fs";
import { safeLoad } from "js-yaml";

const cssFileContents = readFileSync("./src/styles.css");
const context = safeLoad(readFileSync("resume.yaml"));
const {
  name,
  title,
  jobtitle,
  email,
  github,
  skills,
  jobs,
  interests,
  projects,
  education
} = context;

const resume = css => (
  <html lang="en">
    <head>
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        href="https://fonts.googleapis.com/css?family=Source+Code+Pro:400,600|Source+Sans+Pro:300,400,400i,700,900"
        rel="stylesheet"
      />
      <title>{title}</title>
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </head>
    <body>
      <div className="container">
        <header className="header">
          <h1>{name}</h1>
          <p className="jobtitle">{jobtitle}</p>
        </header>

        <section className="contact">
          <ul>
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <a href={github.href}>{github.a}</a>
            </li>
          </ul>
        </section>

        <section className="experience">
          <h1>Experience</h1>
          <ul className="jobs">
            {jobs.map((job, i) => (
              <li className="job" key={i}>
                <p className="job-title-and-company">
                  <span className="job-title">{job.title}</span> —{" "}
                  <span className="job-company">{job.company}</span>
                </p>
                <p className="job-date">{job.date}</p>
                <ul className="job-description">
                  {job.description.map((desc, i) => (
                    <li className="job-description-item" key={i}>
                      <p dangerouslySetInnerHTML={{ __html: desc }} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <div className="sidebar">
          <section className="education">
            <h1>Education</h1>
            <p className="job-title-and-description">
              <span className="education-university">{education.university}</span>{" "}
            </p>
            <p className="education-date">{education.date}</p>
            <p className="education-degree">{education.degree}</p>
          </section>

          <section className="skills">
            <h1>Skills</h1>
            <p>{skills.join(", ")}</p>
          </section>
        </div>
      </div>
    </body>
  </html>
);

postcssPresetEnv.process(cssFileContents).then(({ css }) => {
  const markup = resume(css);
  console.log(renderToStaticMarkup(markup));
});
