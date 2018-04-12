import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from 'state';
import { loginAction } from 'state/hero/heroAction';
import './login.css';

interface ILoginProps {
  onLogin: () => void;
  error: string;
}

const component = (props: ILoginProps) => (
  <div className="login">
    <h1 className="text-center">Login / Inscription</h1>
    <h3 className="text-center">
      Penser à vérifier votre boite mail pour valider votre inscription
    </h3>
    <button className="btn btn-sm btn-success" onClick={() => props.onLogin()}>
      Je me connecte
    </button>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(component);

function mapStateToProps(state: AppState) {
  return {
    error: state.heroState.loginErrors
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    onLogin: () => dispatch(loginAction())
  };
}
