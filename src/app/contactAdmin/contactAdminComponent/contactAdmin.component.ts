import {Component, OnInit, DoCheck} from '@angular/core';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ContactAdminService} from '../contactAdminService/contactAdmin.service';
import {Md5} from 'ts-md5/dist/md5';
// import Chatroom from '../../../assets/NIM_Web_Chatroom_v5.0.0';

@Component({selector: 'contactAdmin-component', templateUrl: './contactAdmin.component.html', styleUrls: ['./contactAdmin.component.less']})

export class ContactAdminComponent implements OnInit,
DoCheck {
  dataList : any;
  schoolName = '';
  isVisible = false;
  isVisible1 = false;
  isEditVisible = false;
  page : number = 1;
  searchParam : string = '';
  editName : '';
  editId : string = ''

  academy_name : string = ''; // 学院名
  msg : string = '';

  chatListNim : any;
  Nm : any;

  // 当前沟通对象
  chatId = '';

  // 发送的消息
  sendMsg : string = '';

  // 消息记录
  msgList = []

  // 文件
  fileList : UploadFile[] = [];
  inputFile : any = '';

  //昵称 头像
  custom : boolean = false;

  constructor(private service : ContactAdminService, private _message : NzMessageService, private router : Router) {}

  ngOnInit() {
    var str = window.localStorage.setItem('emio', '');
    this.getNIMConfig();
  }

  ngDoCheck() {
    // var str = window.localStorage.getItem('emio'); this.sendMsg = str.toString();
  }

  addFace() {
    $('.emotion').qqFace({id: 'facebox', assign: 'saytext', path: './assets/arclist/'});
  }

  replace_em(str) {
    str = str.replace(/\</g, '&lt;');

    str = str.replace(/\>/g, '&gt;');

    str = str.replace(/\n/g, '<br/>');

    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="arclist/$1.gif" border="0" />');

    return str;

  }

  getNIMConfig() {
    this.service.getChatData();
    this.service.chatDataSubject.subscribe(res => {
        var token = Md5.hashStr(res.result.id.toString());
        var account = res.result.id;
        // 初始化聊天对象account
        this.chatId = account;
        this.initChat(account.toString(), token);
      })
  }

  /**
   * 初始化聊天室，新建连接   ==================================================================================>
   */
  initChat(account, token) {
    var that = this;
    var data = {};
    this.Nm = SDK.NIM.getInstance({
        debug: false,
        appKey: "ff5c5a21d8269d4afddfc7b1a2f40027",
        account: account,
        token: token,
        onconnect: function (res) {
          console.log(res)
          console.log('连接成功');
        },
        onwillreconnect: function (obj) {
          console.log('obj', obj);
          console.log('即将重连');
        },
        ondisconnect: function (error) {
          console.log('丢失连接');
          console.log(error);
        },
        onerror: function (error) {
          console.log(error);
        },
        // onroamingmsgs: function (obj) {
        //   console.log('收到漫游消息', obj);
        //   obj
        //     .msgs
        //     .map(item => {
        //       that.pushMsg({text: item.text, flow: item.flow});
        //     })
        // },
        // onofflinemsgs: function (obj) {
        //   console.log('收到离线消息', obj);
        //   obj
        //     .msgs
        //     .map(item => {
        //       that.pushMsg({text: item.text, flow: item.flow});
        //     })
        // },
        onmsg: function onMsg(msg) {
          console.log('收到消息', msg.scene, msg.type, msg);
          that.pushMsg(msg);
          // that.pushMsg({text: msg.text, flow: msg.flow});
        },
        onsessions: function (sessions) {
          console.log('收到会话列表', sessions);
          // that.dataList = sessions; sessions = this.chatListNim.mergeSessions(sessions,
          // sessions);
          that.updateSessionsUI(sessions);
        },
        onupdatesession: function (session) {
          console.log('会话更新了', session);
          that.pushMsg(session)
        }
        // onmsg: function (msg) {   console.log('msg',msg)   //
        // 此处为委托消息事件，消息发送成功后，成功消息也在此处处理 }
      });
  }

  /**
   *  ======================================================================================================================<<<
   */

  /**
   * 切换聊天对象方法
   */

  changeChatObject(item) {
    this.msgList = [];
    var token = Md5.hashStr(item.to.toString());
    var account = item
      .to
      .toString();
    //  改变聊天对象account
    this.chatId = account;

    var nim1 = SDK
      .NIM
      .getInstance({appKey: 'ff5c5a21d8269d4afddfc7b1a2f40027', token: token, account: account})
    // 断开 IM
    nim1.disconnect();
    // 更新 token
    nim1.setOptions({token: token});
    // 重新连接
    nim1.connect();
  }

  pushMsg(msgs) {
    console.log('**** msgs', msgs)
    // if (msgs.lastMsg.) {
      
    // }
    var obj = {};
    obj['type'] = 'text';
    obj['text'] = 'msgs';
    this.msgList.push(obj);
    // if (!Array.isArray(msgs)) { msgs = [msgs]; } var sessionId = msg[0].scene +
    // '-' + msgs[0].account; data.msgs = data.msgs || {}; data.msgs[sessionId] =
    // nim.mergeMsgs(data.msgs[sessionId], msgs);
  }

  /**
     * 发送消息
     */
  sendMessage(info) : void {
    if(this.inputFile != '') {
      this.sendFile();
      return
    } else if (info === '') {
      this
        ._message
        .warning('不能发送空消息')
      return
    }

    var str = this.replace_em(info)
    var that = this;
    var msg = this
      .Nm
      .sendText({
        scene: 'p2p',
        to: this.chatId,
        text: str,
        done: function sendMsgDone(error, msg) {
            // that.pushMsg({text: msg.text, flow: msg.flow, time: msg.userUpdateTime});
          // that.pushMsg(msg);
          that.sendMsg = '';
        }
      });
  }

  private getUpload(e) {
    if (e.target.files[0]) {
      const file = e.target;
      this.inputFile = file;
    }
  }

  sendFile() {
    var that = this;
    this
      .Nm
      .sendFile({
        scene: 'p2p',
        to: this.chatId,
        type: 'file',
        fileInput: that.inputFile,
        beginupload: function (upload) {},
        uploadprogress: function (obj) {
          console.log('文件总大小: ' + obj.total + 'bytes');
          console.log('已经上传的大小: ' + obj.loaded + 'bytes');
          console.log('上传进度: ' + obj.percentage);
          console.log('上传进度文本: ' + obj.percentageText);
        },
        uploaddone: function (error, file) {
          console.log(error);
          console.log(file);
          console.log('上传' + (!error
            ? '成功'
            : '失败'));
        },
        beforesend: function (msg) {
          console.log('正在发送p2p image消息, id=' + msg.idClient);
          that.pushMsg(msg);
        },
        done: function sendMsgDone(error, msg) {
          console.log(error);
          console.log(msg);
          // that.pushMsg({text: msg.name, flow: msg.flow, time: msg.userUpdateTime});
          that.pushMsg(msg);
          that.inputFile = '';
        }
      });
  }

  updateSessionsUI(res) {
    // 刷新界面
    this.dataList = res;
    for (let i in this.dataList) {
      if (this.dataList[i].lastMsg.custom) {
        this.dataList[i].lastMsg.custom = JSON.parse(this.dataList[i].lastMsg.custom);
        this.custom = true;
        console.log(this.dataList[i].lastMsg.custom);
      }
    }
  }
}
