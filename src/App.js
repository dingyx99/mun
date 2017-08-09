import React, { Component } from 'react';
import AV from 'leancloud-storage';
import {HashRouter, Route} from 'react-keeper';
import Login from './components/Login'
import Signup from './components/Signup'
import Administrator from './components/Administrator'
import User from './components/User'
import './App.css';
import Config from './config.json'

class App extends Component {
  constructor() {
    super()
    this.state = {
      login: false,
      loginError: "",
      signUpError: "",
      updateError: "",
      updateWell: "",
      user: {
        password: '',
        name: '',
        school: '',
        intendCom: '',
        email: '',
        myTel: '',
        birthday: new Date(),
        emerTel: '',
        idNum: '',
        eatingHabit: ''
      }
    }
  }
  fromAVtoState(user) {
    console.log(user.attributes)
    const newUser = {
      name: user.attributes.name,
      school: user.attributes.school,
      intendCom: user.attributes.intendCom,
      myTel: user.attributes.mobilePhoneNumber,
      emerTel: user.attributes.emerTel,
      idNum: user.attributes.idNum,
      birthday: new Date(user.attributes.birthday),
      email: user.attributes.username,
      eatingHabit: user.attributes.eatingHabit
    }
    this.fillUserDetail(newUser)
  }
  login() {
    const username = this.state.user.email;
    const password = this.state.user.password;
    const self = this;
    AV.User.logIn(username, password).then((loginedUser) => {
      self.fromAVtoState(loginedUser)
      if(Config.admins.indexOf(loginedUser.getEmail())!=-1)
        document.location.hash = '/admin'
      else 
        document.location.hash = '/user'
    },function (error) {
      // TODO: Translate Error
      self.setState({
        loginError: error.message
      })
    })
  }
  validUser(user) {
    // TODO: Validation
  }
  signUp() {
    try {
      this.validUser(this.state.user)
      const user = new AV.User()
      user.setUsername(this.state.user.email)
      user.setPassword(this.state.user.password)
      user.setMobilePhoneNumber(this.state.user.myTel)
      user.setEmail(this.state.user.email)
      user.set("name", this.state.user.name)
      user.set("school", this.state.user.school)
      user.set('intendCom', this.state.user.intendCom)
      user.set("emerTel", this.state.user.emerTel)
      user.set("idNum", this.state.user.idNum)
      user.set("birthday", this.state.user.birthday)
      user.set("eatingHabit", this.state.user.eatingHabit)
      const self = this
      user.signUp().then(user => {
        AV.User.logOut().then(_ => window.location.reload())
      }).catch(err => {
        throw new Error("服务器响应错误")
      })
    } catch(err) {
      this.setState({
        signUpError: err.message
      })
    }
  }
  inputUserAttr(attrName, content) {
    const newState = {
      ...this.state
    }
    newState.user[attrName] = content;
    this.setState(newState);
  }
  fillUserDetail(user) {
    this.setState({
      user: user,
      logedOnce: true,
      login: true
    })
  }
  componentWillMount(){
    const self = this;
    if(AV.User.current()) {
      AV.User.current().isAuthenticated().then(authed => {
        if(!authed) {
          AV.User.logOut().then(_ => {
            window.location.hash = '/'
            this.setState({
              login: false
            })
          })
        } else {
          self.fromAVtoState(AV.User.current())
          if(Config.admins.indexOf(AV.User.current().getEmail())!=-1)
            document.location.hash = '/admin'
          else 
            document.location.hash = '/user'
        }
      })
    }
  }
  save(){
    const user = AV.User.current()
    if(this.state.user.password) {
      user.setPassword(this.state.user.password)
    }
    user.setMobilePhoneNumber(this.state.user.myTel)
    user.setEmail(this.state.user.email)
    user.set("name", this.state.user.name)
    user.set("emerTel", this.state.user.emerTel)
    user.set("idNum", this.state.user.idNum)
    user.set("birthday", this.state.user.birthday)
    user.set("eatingHabit", this.state.user.eatingHabit)
    user.save().then(user => {
      this.fromAVtoState(user)
      this.setState({
        updateWell: "成功保存"
      })
      this.componentWillMount()
    }).catch( err => {
      this.setState({
        updateError: err.message
      })
    })
  }
  render() {
    if (this.state.login) {
      window.location.hash = '/user'
    }
    return (
      <HashRouter className="App">
        <div>
          <Route index error={this.state.loginError} login={this.login.bind(this)} inputUserAttr={this.inputUserAttr.bind(this)} component={ Login } path="/login"></Route>
          <Route save={this.save.bind(this)} well={this.state.updateWell} error={this.state.updateError} inputUserAttr={this.inputUserAttr.bind(this)} component={User} path="/user" user={this.state.user}></Route>
          <Route signUp={this.signUp.bind(this)} error={this.state.signUpError} inputUserAttr={this.inputUserAttr.bind(this)} component={Signup} path='/signup'></Route>
          <Route component={Administrator} path="admin" />
        </div>
      </HashRouter>
    );
  }
}

export default App;
