import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ContactAdminService} from '../contactAdminService/contactAdmin.service';
import {Md5} from 'ts-md5/dist/md5';
// import Chatroom from '../../../assets/NIM_Web_Chatroom_v5.0.0';

@Component({selector: 'contactAdmin-component', templateUrl: './contactAdmin.component.html', styleUrls: ['./contactAdmin.component.less']})

export class ContactAdminComponent implements OnInit {
  dataList = [];
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
  Nm:any;


  constructor(
    private service : ContactAdminService,
    private _message : NzMessageService,
    private router : Router) {}
  ngOnInit() {
    this.dataList = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      0
    ];
    this.loadData()
  }
  loadData () {
    this.service.getChatData();
    this.service.chatDataSubject.subscribe(
    res => {
      console.log('res', res)
      var token = Md5.hashStr(res.result.id.toString());
      var account = res.result.id;
      setTimeout( () => {      
        this.initChat(account.toString(), token);
      }, 7000)
      // this.initChat(account, token);

    })
  }

  /**
   * 初始化聊天室，新建连接   ==================================================================================>
   */
  initChat (account, token) {
    console.log('account', account);
    console.log('token', token);
    var data = {};
    // 注意这里, 引入的 SDK 文件不一样的话, 你可能需要使用 SDK.NIM.getInstance 来调用接口
    var nim = NIM.getInstance({
      debug: true,
      appKey: "ff5c5a21d8269d4afddfc7b1a2f40027",
      account: account,
      token: token,
      onconnect: function (res) {
        console.log(res)
        alert('success')
        // debugger
        alert('连接成功');
        return
      },
      onwillreconnect:  function(obj) {
        console.log('obj',obj);
        alert('即将重连');
        // console.log(obj.retryCount);
        // console.log(obj.duration);
      },
      ondisconnect: function (error) {
        alert('丢失连接');
        alert(error);
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
      // onmsg: function (msg) {
      //   console.log('msg',msg)
      //   // 此处为委托消息事件，消息发送成功后，成功消息也在此处处理
      // }
    });
    this.Nm = nim;
    console.log('nim', nim)
    // this.changeChatObject(account, token)
  }

  onConnect() {
    alert('success')
    // this.Nm.connect();
    alert('连接成功');
  }

  onWillReconnect(obj) {
    console.log('obj',obj);
    alert('即将重连');
    // console.log(obj.retryCount);
    // console.log(obj.duration);
  }

  onDisconnect(error) {
    alert('丢失连接');
    alert(error);
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
  }

  onError(error) {
    console.log(error);
  }

  /**
   *  ======================================================================================================================<<<
   */


  /**
   * 切换聊天对象方法
   */

   changeChatObject (account, token) {
      var nim1 = NIM.getInstance({
        appKey: 'ff5c5a21d8269d4afddfc7b1a2f40027',
        token: token,
        account: account
      })
      console.log('nim1', nim1)
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
      var nim = NIM.getInstance({
        onroamingmsgs: this.onRoamingMsgs,
        onofflinemsgs: this.onOfflineMsgs,
        onmsg: this.onMsg
      });
    }

    onRoamingMsgs(obj) {
        console.log('收到漫游消息', obj);
        this.pushMsg(obj.msgs);
    }
    onOfflineMsgs(obj) {
        console.log('收到离线消息', obj);
        this.pushMsg(obj.msgs);
    }
    onMsg(msg) {
        console.log('收到消息', msg.scene, msg.type, msg);
        this.pushMsg(msg);
        switch (msg.type) {
        case 'custom':
            this.onCustomMsg(msg);
            break;
        case 'notification':
            // 处理群通知消息
            break;
        // 其它case
        default:
            break;
        }
    }

    pushMsg(msgs) {
      console.log('msgs', msgs)
        // if (!Array.isArray(msgs)) { msgs = [msgs]; }
        // var sessionId = msg[0].scene + '-' + msgs[0].account;
        // data.msgs = data.msgs || {};
        // data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
    }

    onCustomMsg(msg) {
        // 处理自定义消息
    }
}
