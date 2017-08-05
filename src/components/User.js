import React, { Component } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import Config from '../config.json'

class Signup extends Component {
  render(){
    const patterns = {
      mail: /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i,
      phone: /^1[0-9]{10}$/,
      idNum: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    }
    const self = this;
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
          <h1 id="Title">信息修改</h1>
        </header>
        <div>
          <TextField value={this.props.user.name} validateOnFocusOut={true} onGetErrorMessage={content => (content.length>1 || content.length === 0)?"":"请检查姓名格式"} label="姓名" onChanged={ content => this.props.inputUserAttr("name", content) }></TextField>
          <TextField value={this.props.user.email} validateOnFocusOut={true} onGetErrorMessage={content =>  (content === this.props.user.email)?"":"不能更改邮箱"} label="邮箱"></TextField>  
          <TextField type='password' placeholder="Encrypted Password" validateOnFocusOut={true} onGetErrorMessage={content => (content.length>=6 || content.length === 0)?"":"密码至少六位"} label="密码" onChanged={ content => this.props.inputUserAttr("password", content) }></TextField> 
          <TextField value={this.props.user.myTel} validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.phone.test(content))?"":"请检查手机号格式"} label="手机号" onChanged={ content => this.props.inputUserAttr("myTel", content) }></TextField>
          <DatePicker onSelectDate={date => this.props.inputUserAttr("birthday", date)} label="出生日期" placeholder='选择您的出生日期' value={this.props.user.birthday} /> 
          <TextField value={this.props.user.emerTel} validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.phone.test(content))?"":"请检查手机号格式"} label="紧急电话" onChanged={ content => this.props.inputUserAttr("emerTel", content) }></TextField>
          <TextField value={this.props.user.idNum} validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.idNum.test(content))?"":"请检查身份证号格式"} label="身份证号" onChanged={ content => this.props.inputUserAttr("idNum", content) }></TextField>
          <TextField value={this.props.user.eatingHabit} validateOnFocusOut={true} multiline label="饮食习惯" onChanged={ content => this.props.inputUserAttr("eatingHabit", content) }></TextField>
          {
            this.props.well?<MessageBar id="ErrorBar" messageBarType={ MessageBarType.success } isMultiline={ false } >{this.props.well}</MessageBar>:null
          }
          <PrimaryButton
            text='保存'
            style={{
              marginTop: 20,
              width: "100%"
            }}
            onClick={ this.props.save }
          />
        </div>
      </div>
    )
  }
}

export default Signup