import React, { Component } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import {
  Checkbox,
  ICheckboxStyles
} from 'office-ui-fabric-react/lib/Checkbox';

class Login extends Component {
  constructor(){
    super()
  }
  render() {
    const emailRegax = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
    return (
      <div style={{
        marginLeft: "auto",
        marginRight: "auto",
        width: "80%",
        maxWidth: 500
      }}>
        <header style={{
          marginTop: 120
        }}>
          <h1 id="Title">登录</h1>
        </header>
        <div>
          {
            this.props.error?<MessageBar id="ErrorBar" messageBarType={ MessageBarType.error } isMultiline={ false } >{this.props.error}</MessageBar>:null
          }
          
          <TextField label="邮箱" onChanged={ content => this.props.inputUserAttr("email", content) }></TextField>
          <TextField type="password" label="密码" onChanged={ content => this.props.inputUserAttr("password", content) }></TextField>
          <Checkbox
            label='记住密码'
          />
          <PrimaryButton
            text='登录'
            style={{
              marginTop: 20,
              width: "100%"
            }}
            onClick={ this.props.login }
          />
          <DefaultButton
            text='注册'
            style={{
              marginTop: 20,
              width: "100%"
            }}
            onClick={ () => document.location.hash='/signup'}
          />
        </div>
      </div>
    )
  }
}

export default Login