import React, {Component} from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import AV from 'leancloud-storage'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Link } from 'office-ui-fabric-react/lib/Link';
import Config from '../config.json'

class Administrator extends Component {
  constructor() {
    super()
    const self = this;
    this._selection = new Selection({
      onSelectionChanged: () => {
        self.setState({
          selectionDetail: self._selection.getSelection()
        })
      }
    });
    this.state = {
      users: [],
      selectionDetail: [],
      showPanel: false,
      user:{},
      updateWell: "",
      columns: [
            {
              key: 'name',
              name: '姓名',
              maxWidth: 200,
              minWidth: 0,
              fieldName: 'name',
              isResizable: true,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'email',
              name: '邮箱',
              minWidth: 0,
              maxWidth: 250,
              fieldName: 'email',
              isResizable: true,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'school',
              name: '学校',
              maxWidth: 400,
              minWidth: 0,
              fieldName: 'school',
              isResizable: true,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'intendCom',
              name: '意愿委员会',
              fieldName: 'intendCom',
              isResizable: true,
              minWidth: 0,
              maxWidth: 300,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'myTel',
              name: '电话',
              fieldName: 'myTel',
              isResizable: true,
              maxWidth: 600,
              minWidth: 0,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'emerTel',
              name: '紧急电话',
              fieldName: 'emerTel',
              isResizable: true,
              maxWidth: 600,
              minWidth: 0,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'idNum',
              name: '身份证号',
              fieldName: 'idNum',
              isResizable: true,
              maxWidth: 150,
              minWidth: 0,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'birthday',
              name: '出生日期',
              fieldName: 'birthday',
              isResizable: true,
              maxWidth: 400,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'eatingHabit',
              name: '饮食习惯',
              fieldName: 'eatingHabit',
              isResizable: true,
              minWidth: 0,
              onColumnClick: this.onColumnClick.bind(this)
            },
            {
              key: 'file',
              name: '学测',
              fieldName: 'file',
              isResizable: true,
              onColumnClick: this.onColumnClick.bind(this)
            }
          ]
    }
  }
  avUsers=[]
  componentWillMount() {
    const query = new AV.Query('_User')
    query.find().then(result => {
      const Users = result.map(user => {
        const birthday = new Date(user.attributes.birthday)
        return {
          name: user.attributes.name,
          school: user.attributes.school,
          intendCom: user.attributes.intendCom,
          myTel: user.attributes.mobilePhoneNumber,
          emerTel: user.attributes.emerTel,
          idNum: user.attributes.idNum,
          birthday: `${birthday.getFullYear()}.${birthday.getMonth()+1}.${birthday.getDate()}`,
          email: user.attributes.username,
          file: user.attributes.file,
          eatingHabit: user.attributes.eatingHabit
        }
      })
      this.setState({
        users: Users
      })
      this.avUsers = result
    }).catch(err => {
      alert(err.message)
    })
  }
  sortItems(items, name, desc) {
    items.sort((a, b) => {
      if(desc)
        return a[name]<b[name]
      else
        return a[name]>b[name]
    })
    return items
  }

  onColumnClick(ev, column) {
    const { columns, users } = this.state;
    let newItems = users.slice();
    let newColumns = columns.slice();
    let currColumn = newColumns.filter((currCol, idx) => {
      return column.key === currCol.key;
    })[0];
    newColumns.forEach((newCol) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    newItems = this.sortItems(newItems, currColumn.fieldName, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      users: newItems
    });
  }

  inputUserAttr(attrName, content) {
    const newState = {
      ...this.state
    }
    newState.user[attrName] = content;
    this.setState(newState);
  }

  findAVUser(email) {
    return this.avUsers.filter(user => user.attributes.username === email)[0]
  }

  save() {
    const userId = this.currUser.id
    const password = prompt("请输入管理密码")
    fetch("http://mun.leanapp.cn/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: userId,
        password: password,
        newUser: this.state.user
      })
    }).then(user => {
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
    if(this.state.currUser) {
      this.currUser = this.findAVUser(this.state.currUser)
    }
    const patterns = {
      mail: /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i,
      phone: /^1[0-9]{10}$/,
      idNum: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    }
    return (
      <div style={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 20,
        width: "80%",
        maxWidth: 1600
      }}>
        <DetailsList 
          items={this.state.users}
          layoutMode={DetailsListLayoutMode.justified}
          columns={this.state.columns}
          onRenderItemColumn={ _renderItemColumn }
          onItemInvoked={ (item, index) => {
            const user = this.findAVUser(item.email)
            this.setState({
              currUser: item.email,
              user: {
                name: user.attributes.name,
                school: user.attributes.school,
                intendCom: user.attributes.intendCom,
                myTel: user.attributes.mobilePhoneNumber,
                emerTel: user.attributes.emerTel,
                idNum: user.attributes.idNum,
                birthday: user.attributes.birthday,
                email: user.attributes.username,
                eatingHabit: user.attributes.eatingHabit
              },
              showPanel: true,
            })
          } }
          selection={ this._selection }
        />
        <Panel
          isOpen={ this.state.showPanel }
          onDismiss={ () => this.setState({ showPanel: false }) }
          isLightDismiss={ true }
          type={ PanelType.medium }
          headerText='修改'
        >
            <TextField value={this.state.user.name} validateOnFocusOut={true} onGetErrorMessage={content => (content.length>1 || content.length === 0)?"":"请检查姓名格式"} label="姓名" onChanged={ content => this.inputUserAttr("name", content) }></TextField>
            <TextField disabled={true} value={this.state.user.email} validateOnFocusOut={true} onGetErrorMessage={content =>  (content === this.state.user.email)?"":"不能更改邮箱"} label="邮箱"></TextField>  
            <TextField type='password' placeholder="Encrypted Password" validateOnFocusOut={true} onGetErrorMessage={content => (content.length>=6 || content.length === 0)?"":"密码至少六位"} label="密码" onChanged={ content => this.inputUserAttr("password", content) }></TextField> 
            <Dropdown
              placeHolder='请选择学校'
              label='学校'
              defaultSelectedKey={this.state.user.school}
              onChanged={ content => this.inputUserAttr("school", content.text) }
              options={
                Config.school.map(item => {return {key: item, text: item}})
              }
            />
            <Dropdown
              placeHolder='请选择意向委员会'
              label='意向委员会'
              defaultSelectedKey={this.state.user.intendCom}
              onChanged={ content => this.inputUserAttr("intendCom", content.text) }
              options={
                Config.com.map(item => {return {key: item, text: item}})
              }
            />
            <TextField value={this.state.user.myTel} validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.phone.test(content))?"":"请检查手机号格式"} label="手机号" onChanged={ content => this.inputUserAttr("myTel", content) }></TextField>
            <DatePicker onSelectDate={date => this.inputUserAttr("birthday", date)} label="出生日期" placeholder='选择您的出生日期' value={this.state.user.birthday} /> 
            <TextField value={this.state.user.emerTel} validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.phone.test(content))?"":"请检查手机号格式"} label="紧急电话" onChanged={ content => this.inputUserAttr("emerTel", content) }></TextField>
            <TextField value={this.state.user.idNum} validateOnFocusOut={true} onGetErrorMessage={content => (content.length === 0 || patterns.idNum.test(content))?"":"请检查身份证号格式"} label="身份证号" onChanged={ content => this.inputUserAttr("idNum", content) }></TextField>
            <TextField value={this.state.user.eatingHabit} validateOnFocusOut={true} multiline label="饮食习惯" onChanged={ content => this.inputUserAttr("eatingHabit", content) }></TextField>
            {
              this.state.updateWell?<MessageBar messageBarType={ MessageBarType.success } isMultiline={ false } >{this.state.updateWell}</MessageBar>:null
            }
            <PrimaryButton
              text='保存修改'
              style={{
                marginTop: 20,
                width: "100%"
              }}
              onClick={ this.save.bind(this) }
            />
        </Panel>
        <PrimaryButton
          text='退出登录'
          style={{
            marginTop: 20,
            width: "100%",
            background: "#e74c3c"
          }}
          onClick={ _ => {
            AV.User.logOut().then(_ => {
              window.location.reload()
              window.location.hash = "/"
            })
          }}
        />
      </div>
    )
  }
}

export default Administrator;

function _renderItemColumn(item, index, column) {
  let fieldContent = item[column.fieldName];

  switch (column.key) {
    case 'file':
      return fieldContent?<Link download href={fieldContent}>下载学测</Link>:<span>暂未上传</span>;

    default:
      return <span>{ fieldContent }</span>;
  }
}