import React, { Component } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import Config from '../config.json'

class Signup extends Component {
  render(){
    const patterns = {
      mail: /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i,
      phone: /^1[0-9]{10}$/,
      idNum: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    }
    return (
      <div style={{
        marginLeft: "auto",
        marginRight: "auto",
        width: "80%",
        maxWidth: 500
      }}>
        <header style={{
          marginTop: 20
        }}>
          <h1 id="Title">注册</h1>
        </header>
        <div>
          <TextField validateOnFocusOut={true} onGetErrorMessage={content => ((content.length>1 && content.length<=10)|| content.length === 0)?"":"请检查姓名格式"} label="姓名" onChanged={ content => this.props.inputUserAttr("name", content) }></TextField>
          <TextField validateOnFocusOut={true} onGetErrorMessage={content =>  (patterns.mail.test(content) || content.length===0)?"":"请检查邮箱格式"} label="邮箱" onChanged={ content => this.props.inputUserAttr("email", content) }></TextField>
          <TextField type='password' validateOnFocusOut={true} onGetErrorMessage={content => (content.length>=6 || content.length === 0)?"":"密码至少六位"} label="密码" onChanged={ content => this.props.inputUserAttr("password", content) }></TextField>
          <Dropdown
            placeHolder='请选择学校'
            label='学校'
            onChanged={ content => this.props.inputUserAttr("school", content.text) }
            options={
              Config.school.map(item => {return {key: item, text: item}})
            }
          />
          <Dropdown
            placeHolder='请选择意向委员会'
            label='意向委员会'
            onChanged={ content => this.props.inputUserAttr("intendCom", content.text) }
            options={
              Config.com.map(item => {return {key: item, text: item}})
            }
          />
          <TextField validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.phone.test(content))?"":"请检查手机号格式"} label="手机号" onChanged={ content => this.props.inputUserAttr("myTel", content) }></TextField>
          <DatePicker onSelectDate={date => this.props.inputUserAttr("birthday", date)} label="出生日期" placeholder='选择您的出生日期' value={new Date("Sat Jan 1 0:0:0 2001 GMT+0800 (CST)")} />
          <TextField validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.phone.test(content))?"":"请检查手机号格式"} label="紧急电话" onChanged={ content => this.props.inputUserAttr("emerTel", content) }></TextField>
          <TextField validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.idNum.test(content))?"":"请检查身份证号格式"} label="身份证号" onChanged={ content => this.props.inputUserAttr("idNum", content) }></TextField>
          <TextField validateOnFocusOut={true} multiline label="饮食习惯" onChanged={ content => this.props.inputUserAttr("eatingHabit", content) }></TextField>
          <DefaultButton
            text='注册'
            style={{
              marginTop: 20,
              width: "100%"
            }}
            onClick={ this.props.signUp }
          />
        </div>
      </div>
    )
  }
}

export default Signup