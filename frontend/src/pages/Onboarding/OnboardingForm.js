import React from 'react'
import { Field, reduxForm } from 'redux-form'
const renderField = ({ input, label, type, meta: { touched, error } }) => (
    <div>
        {/*<label>{label}</label>*/}
        <div>
            <input {...input} placeholder={label} type={type} className="textInput_Dark"/>
            {touched && error && <span>{error}</span>}
        </div>
    </div>
);

const OnboardingForm = (props) => {
    const { error, handleSubmit, pristine, reset, submitting } = props;
    return (
        <form onSubmit={handleSubmit}>
            <Field name="first_name" type="text" component={renderField} label="First Name"/>
            <Field name="last_name" type="text" component={renderField} label="Last Name"/>
            <Field name="password" type="password" component={renderField} label="Password"/>
            {error && <strong>{error}</strong>}
            <div>
                <button className="btn-primary btn-wide" type="submit" disabled={submitting}>Complete Registration</button>
                <button className="btn-primary btn-wide" type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
            </div>
        </form>
    )
};

export default reduxForm({
    form: 'Onboarding'  // a unique identifier for this form
})(OnboardingForm)