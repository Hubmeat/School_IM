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
    this.editor.customConfig.onchange = function (html) {
      // html 即变化之后的内容
      console.log(html)
      _this.fromChild.emit(html);
    }
    // 或者 var editor = new E( document.getElementById('editor') )
    this.editor.create()
    // this.editor.txt.html('<p>请添加内容</p>')
    this.editor.txt.placeholder('<p>请添加内容</p>')
    // 初始化 textarea 的值
    this.article_content = this.editor.txt.html();
    console.log(this.article_content);
  }
}
