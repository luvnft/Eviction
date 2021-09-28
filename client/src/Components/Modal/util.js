import React from "react";
import { Icon, Button } from "semantic-ui-react";

export default {
  AboutContent: {
    Alert: (content) => (
      <div id="alert" className="about-content-section">
        {content.alert.map((item) => (
          <p>{item}</p>
        ))}
      </div>
    ),
    Mission: (content) => (
      <div className="about-content-section">
        <h2 className="about-content-section-heading">Mission</h2>
        {content.mission.map((item, i) => (
          <p key={`mission-p-${i}`}>{item}</p>
        ))}
      </div>
    ),
    Team: (content) => (
      <div className="about-content-section">
        <h2 className="about-content-section-heading">Team</h2>
        <div id="about-team">
          <div className="team-member-grid-row">
            {content.team.map((member, i) =>
              member.name ? (
                <div key={`member-${i}`} className="about-team-member">
                  <div className="about-team-member-role">{member.role}</div>
                  <div className="about-team-member-name">{member.name}</div>
                  {member.info.map((info, i) => (
                    <div
                      key={`member-info-${i}`}
                      className="about-team-member-info"
                    >
                      {info.title ? (
                        <div className="about-team-member-title">
                          {info.title}
                        </div>
                      ) : null}
                      {info.department ? (
                        <div className="about-team-member-department">
                          {info.department}
                        </div>
                      ) : null}
                      {info.institution ? (
                        <div className="about-team-member-institution">
                          {info.institution}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    ),
    Data: (content) => (
      <div className="about-content-section">
        <h2 className="about-content-section-heading">About The Data</h2>
        {content.aboutdata.map((item, i) => (
          <p key={`about-data-p-${i}`}>{item}</p>
        ))}
      </div>
    ),
    Sources: (sourceProps, content) => (
      <div className="about-content-section">
        <h2 className="about-content-section-heading">
          {sourceProps.type} Sources
        </h2>
        <ul id="about-content-source-list">
          {content.sources
            .filter((source) => source.type === sourceProps.type)
            .map((source, i) => (
              <li
                key={`source-${i}`}
                className={"about-content-section-source"}
              >
                {source.name}
                {source.url ? (
                  <a
                    key={`source-link-${i}`}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon
                      key={`source-link-icon-${i}`}
                      name="external alternate"
                    />
                  </a>
                ) : null}
                {source.note ? (
                  <ul className="about-content-source-note">
                    <li>
                      <em>{source.note}</em>
                    </li>
                  </ul>
                ) : null}
              </li>
            ))}
        </ul>
      </div>
    ),
    Resources: (content) => (
      <div className="about-content-section">
        <h2 className="about-content-section-heading">Resources</h2>
        <ul id="about-content-source-list">
          {content.resources.map((resource, i) => (
            <li
              key={`resource-${i}`}
              className={"about-content-section-source"}
            >
              {resource.name}
              {resource.url ? (
                <a
                  key={`resource-link-${i}`}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    key={`source-link-icon-${i}`}
                    name="external alternate"
                  />
                </a>
              ) : null}
              {resource.note ? (
                <p className="about-content-resource-note">
                  <em>{resource.note}</em>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    ),
    DataRequest: (content) => (
      <div className="about-content-section">
        <h2 className="about-content-section-heading">Data Requests</h2>
        <p>
          If you or your oraganization would like access to data at a level of
          aggregation or format not available via the "Download Data" button on
          the tool, you will need to submit a formal request. Click the button
          below to begin the request process.
        </p>
        <p>
          <a
            key={`data-request-link`}
            href={"https://forms.gle/XUxEp5MgSEcen5Pb9"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
            // basic
            >
              Begin Data Request
            </Button>
          </a>
        </p>
      </div>
    ),
    Citations: (content) => (
      <div className="about-content-section">
        <h2 className="about-content-section-heading">Citation</h2>
        <p>
          Any use of data downloaded from this site or reference to this work
          must be accompanied by one of the following citations.
        </p>
        {content.citations.map((citation, i) => (
          <div className="about-content-citation">
            <h3 className="about-content-citation-type">{citation.type}:</h3>
            <div className="about-content-citation-text">
              <span>{citation.authors} </span>
              <span>
                <em>{citation.title}</em>.{" "}
              </span>
              <span>
                {citation.publisher}, {citation.year},{" "}
              </span>
              <span>{citation.url}.</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
};
