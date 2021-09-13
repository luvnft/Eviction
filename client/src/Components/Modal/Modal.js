import React from "react";
import Loader from "react-loader-spinner";
import { Button } from "semantic-ui-react";
import config from "./config.js";
import util from "./util";
import style from "./style.css";

const Modal = (props) => {
  return (
    <div id="modal">
      <div id="modal-content">
        <div id="modal-heading">
          <div id="welcome">Welcome to the</div>
          <h1>ATLANTA REGION</h1>
          <h1>EVICTION TRACKER</h1>
        </div>

        <div id="modal-body">
          {props.content ? (
            <>
              {props.content.alert
                ? util.AboutContent.Alert(props.content)
                : null}
              {util.AboutContent.Mission(props.content)}
              {util.AboutContent.Data(props.content)}
              {util.AboutContent.Team(props.content)}
              {util.AboutContent.Resources(props.content)}
              {util.AboutContent.Citations(props.content)}
              {util.AboutContent.DataRequest(props.content)}
              {util.AboutContent.Sources("Court Record Data", props.content)}
              {util.AboutContent.Sources("Other Data", props.content)}
            </>
          ) : (
            <div style={config.loaderStyle}>
              <h1>Loading...</h1>
              <Loader
                id="loader-box"
                color={config.loaderStyle.color}
                type={config.loaderStyle.type}
              />
            </div>
          )}
        </div>
        <div id="modal-footer">
          <Button onClick={() => props.setModalStatus(false)}>OK</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
