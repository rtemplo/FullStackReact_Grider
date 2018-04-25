import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
  renderField () {
    return formFields.map(
      ({ label, name }, idx) => <Field key={idx} component={SurveyField} type="text" label={label} name={name} />
    );
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)} >
          {this.renderField()}
          <Link to="/surveys" className="btn left red">Cancel</Link>
          <button className="btn right" type="submit">Next <i className="material-icons right">done</i></button>
        </form>
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};
  
  errors.recipients = validateEmails(values.recipients || '');
  
  formFields.forEach((item)=> !values[item.name]?errors[item.name] = item.errorMsg:undefined);

  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);