import {Component, OnInit, DoCheck} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ContactAdminService} from '../contactAdminService/contactAdmin.service';
import {Md5} from 'ts-md5/dist/md5';
// import Chatroom from '../../../assets/NIM_Web_Chatroom_v5.0.0';

@Component({selector: 'contactAdmin-component', templateUrl: './contactAdmin.component.html', styleUrls: ['./contactAdmin.component.less']})

export class ContactAdminComponent implements OnInit, DoCheck {
  dataList = '';
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

  chatListNim:any;
  Nm:any;

  // 当前沟通对象
  chatId = '';

  // 发送的消息
  sendMsg:string = '';

  // 消息记录
  msgList = []


  constructor(
    private service : ContactAdminService,
    private _message : NzMessageService,
    private router : Router) {}

  ngOnInit() {
    var str = window.localStorage.setItem('emio', '');
    this.getNIMConfig();
  }

  ngDoCheck() {
    // var str = window.localStorage.getItem('emio');
    // this.sendMsg = str.toString();
  }

  addFace () {
    $('.emotion').qqFace({
      id : 'facebox',
      assign: 'saytext',
      path: './assets/arclist/'
    });
   }

   replace_em(str){
      str = str.replace(/\</g,'&lt;');

      str = str.replace(/\>/g,'&gt;');

      str = str.replace(/\n/g,'<br/>');

      str = str.replace(/\[em_([0-9]*)\]/g,'<img src="arclist/$1.gif" border="0" />');

      return str;

    }

  getNIMConfig () {
    this.service.getChatData();
    this.service.chatDataSubject.subscribe(
    res => {
      var token = Md5.hashStr(res.result.id.toString());
      var account = res.result.id;
      // 初始化聊天对象account
      this.chatId = account;
      setTimeout( () => {
        this.initChat(account.toString(), token);
      }, 300)
      // this.initChat(account, token);

    })
  }

  /**
   * 初始化聊天室，新建连接   ==================================================================================>
   */
  initChat (account, token) {
    var that = this;
    console.log('account', account);
    console.log('token', token);
    var data = {};
    // 注意这里, 引入的 SDK 文件不一样的话, 你可能需要使用 SDK.NIM.getInstance 来调用接口
    this.Nm = SDK.NIM.getInstance({
      debug: false,
      appKey: "ff5c5a21d8269d4afddfc7b1a2f40027",
      account: account,
      token: token,
      onconnect: function (res) {
        console.log(res)
        console.log('success')
        // debugger
        console.log('连接成功');
      },
      onwillreconnect: function(obj) {
        console.log('obj',obj);
        console.log('即将重连');
        // console.log(obj.retryCount);
        // console.log(obj.duration);
      },
      ondisconnect: function (error) {
        console.log('丢失连接');
        console.log(error);
        // if (error) {
        //   switch (error.code) {
        //     // 账号或者密码错误, 请跳转到登录页面并提示错误
        //     case 302:
        //       break;
        //     // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
        //     case 417:
        //       break;
        //     // 被踢, 请提示错误后跳转到登录页面
        //     case 'kicked':
        //       break;
        //     default:
        //       break;
        //   }
        // }
      },
      onerror: function (error) {
        console.log(error);
      },
      onroamingmsgs: function (obj) {
        console.log('收到漫游消息', obj);
        obj.msgs.map( item => {
          that.pushMsg({
            text: item.text,
            flow: item.flow
          });
        })
      },
      onofflinemsgs: function (obj) {
          console.log('收到离线消息', obj);
          obj.msgs.map( item => {
            that.pushMsg({
              text: item.text,
              flow: item.flow
            });
          })
      },
      onmsg: function onMsg(msg) {
          console.log('收到消息', msg.scene, msg.type, msg);
          that.pushMsg({
            text: msg.text,
            flow: msg.flow
          });
      },
      onsessions: function (sessions) {
          console.log('收到会话列表', sessions);
          // that.dataList = sessions;
          // sessions = this.chatListNim.mergeSessions(sessions, sessions);
          that.updateSessionsUI(sessions);
      },
      onupdatesession: function (session) {
          console.log('会话更新了', session);
          // session = this.chatListNim.mergeSessions(session, session);
          // that.updateSessionsUI();
      }
      // onmsg: function (msg) {
      //   console.log('msg',msg)
      //   // 此处为委托消息事件，消息发送成功后，成功消息也在此处处理
      // }
    });
  }

  /**
   *  ======================================================================================================================<<<
   */


  /**
   * 切换聊天对象方法
   */

   changeChatObject (item) {
     this.msgList = [];
     var token = Md5.hashStr(item.to.toString());
     var account = item.to.toString();
    //  改变聊天对象account
     this.chatId = account;

      var nim1 = SDK.NIM.getInstance({
        appKey: 'ff5c5a21d8269d4afddfc7b1a2f40027',
        token: token,
        account: account
      })
      // 断开 IM
      nim1.disconnect();
      // 更新 token
      nim1.setOptions({
          token: token
      });
      // 重新连接
      nim1.connect();
  }


   /**
    * 单例消息收发功能
    */

    chatHandler () {
      var that = this;
      this.Nm.getInstance({
        onroamingmsgs: function onRoamingMsgs(obj) {
          console.log('收到漫游消息', obj);
          that.pushMsg(obj.msgs);
        },
        onofflinemsgs: function onOfflineMsgs(obj) {
            console.log('收到离线消息', obj);
            that.pushMsg(obj.msgs);
        },
        onmsg: function onMsg(msg) {
            console.log('收到消息', msg);
            that.pushMsg(msg);
            // switch (msg.type) {
            // case 'custom':
            //     this.onCustomMsg(msg);
            //     break;
            // case 'notification':
            //     // 处理群通知消息
            //     break;
            // // 其它case
            // default:
            //     break;
            // }
        },
        onsessions: function onSessions(sessions) {
            console.log('收到会话列表', sessions);
            // sessions = this.chatListNim.mergeSessions(sessions, sessions);
            // that.updateSessionsUI();
        },
        onupdatesession: function onUpdateSession(session) {
            console.log('会话更新了', session);
            // session = this.chatListNim.mergeSessions(session, session);
            // that.updateSessionsUI();
        }
      });
    }



    pushMsg(msgs) {
      console.log('msgs', msgs)
      this.msgList.push(msgs);
        // if (!Array.isArray(msgs)) { msgs = [msgs]; }
        // var sessionId = msg[0].scene + '-' + msgs[0].account;
        // data.msgs = data.msgs || {};
        // data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
    }

    onCustomMsg(msg) {
        // 处理自定义消息
    }

    /**
     * 发送消息
     */
    sendMessage(info):void {
      console.log('infor', info)
      if (info === '') {
        this._message.warning('不能发送空消息')
        return
      }
      // var str = $("#saytext").val();
      var str = this.replace_em(info)
      var that = this;
      var msg = this.Nm.sendText({
        scene: 'p2p',
        to:  this.chatId,
        text: str,
        done: function sendMsgDone(error, msg) {
          console.log(error);
          console.log(msg);
          console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
          that.pushMsg({
            text: msg.text,
            flow: msg.flow,
            time: msg.userUpdateTime
          });
          that.sendMsg = '';
        }
      });
    }

    /**
     * 获取会话列表
     */
    getChatList () {
      var that = this;
      console.log('conime')
      this.Nm.getInstance({
        onsessions: function onSessions(sessions) {
            console.log('收到会话列表', sessions);
            sessions = this.chatListNim.mergeSessions(sessions, sessions);
            // that.updateSessionsUI();
        },
        onupdatesession: function onUpdateSession(session) {
            console.log('会话更新了', session);
            session = this.chatListNim.mergeSessions(session, session);
            // that.updateSessionsUI();
        }
      });
    }
    updateSessionsUI(res) {
        // 刷新界面
        this.dataList = res;
    }

}
