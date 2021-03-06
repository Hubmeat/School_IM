import { Component, OnInit} from '@angular/core';
import {Input} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

import * as $ from  'jquery';
import * as wangEditor from 'wangEditor';
@Component({
  selector: 'ckeditor-outlet',
  template: `
    <div id="editor"></div>
  `,
})


export class CkeditorComponent implements OnInit {
  article_content: any;
  @Input() fromFatherValue;
  @Output() fromChild = new EventEmitter();
  E = wangEditor;
  editor: any;

  constructor() {}

  ngOnInit() {
    const _this = this;
    this.article_content = this.fromFatherValue;
    this.editor = new this.E('#editor');
    this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    this.editor.customConfig.onchange = function (text) {
      // html 即变化之后的内容
      console.log(text)
      _this.fromChild.emit(text);
    }
    // 或者 var editor = new E( document.getElementById('editor') )
    this.editor.create()
    if (this.article_content) {
      this.editor.txt.text(this.article_content)
    } else {
      this.editor.txt.text('请添加内容')
    }

    // this.editor.txt.placeholder('<p>请添加内容</p>')
    // 初始化 textarea 的值
    this.article_content = this.editor.txt.text();
    console.log(this.article_content);
  }
}
