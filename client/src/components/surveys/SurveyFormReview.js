import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import formFields from './formFields';
import * as actions from '../../actions';

const SurveyFormReview = (props) => {
  let displayFields = null;

  if (formFields.length) {
    displayFields = formFields.map((item, idx) => (
      <div key={idx}>
        <label>{item.label}</label>
        <div>{props.formValues[item.name]}</div>
      </div>
    ));
  }

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {displayFields}
      <div style={{marginTop: '20px'}}>
        <button className="btn yellow darken-3" onClick={props.onCancel}>Back</button>
        <button className="btn green right" onClick={() => props.submitSurvey(props.formValues, props.history)}>Send Survey <i className="material-icons right">email</i></button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    formValues: state.form.surveyForm.values
  };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
