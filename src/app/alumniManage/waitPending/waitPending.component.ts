import { Component, OnInit } from '@angular/core';
import { AMService } from '../alumniMgService/alumniMgService.component';

@Component({
    selector: 'waitPending-component',
    templateUrl: './waitPending.component.html',
    styleUrls: [
        './waitPending.component.less'
    ]
})

export class WaitPendingComponent implements OnInit {
    registerBeginTime = null;
    registeEndrTime = null;
    joinBeginTime = null;
    joinEndrTime = null;

    constructor(
        private alumniMgService: AMService
    ) {
    }

    // 学院选项框
    collegeOptions = [        
        { value: 'a', label: '全部' },
        { value: 'b', label: '继续教育学院' },
        { value: 'c', label: '计算机科学与技术'},
        { value: 'd', label: '电子商务'},
        { value: 'e', label: '信息管理'},
        { value: 'f', label: '电商'}
    ];
    collegeSelected = this.collegeOptions[0];
    // 学院选项框
    majorOptions = [        
        { value: 'one', label: '全部' },
        { value: 'two', label: '计算机应用技术' },
        { value: 'three', label: '电子'},
        { value: 'four', label: '电话'},
        { value: 'five', label: '销售类'},
        { value: 'six', label: '电商'}
    ];
    majorSelected = this.collegeSelected[0];
    // 学历选项框
    educationOptions = [
        { value: 'all', label: '全部' },
        { value: 'z', label: '专科' },
        { value: 'b', label: '本科'},
        { value: 's', label: '硕士'},
        { value: 'b', label: '博士'}
    ];
    educationSelected = this.educationOptions[0];

    // 表格数据
    data = [];
    spinShow:boolean = false;
    borderShow:boolean = false;
    pageSizeValues = [10, 25, 50, 100];
    currentPage = 1;
    pageSize = 10;
    totalPage = 0;

    // 审核model
    isVisible:boolean = false;


    ngOnInit():any {
        // var arr = new Array()
        // for (var i = 0; i < 10; i++) {
        //     var obj = {}
            
        //     obj['time'] = '2017-8-22 18:22:22' +"&" + i
        //     obj['name'] = 'John Brown' +"&" + i
        //     obj['tel'] = '13822345533' +"&" + i
        //     obj['IDNumber'] = '4561231321546465' +"&" + i
        //     obj['sex'] = '男' +"&" + i
        //     obj['joinTime'] = '2018-3-19 18:22:22' +"&" + i
        //     obj['college'] = '计算机科学与技术' +"&" + i
        //     obj['major'] = '电子商务管理' +"&" + i
        //     obj['education'] = '硕士' +"&" + i

        //     arr.push(obj)
        // }
        // this.data = arr;
        this.loadData()
    }

    loadData() {
        this.alumniMgService.getPendingData();
        this.alumniMgService.WaitPendingSubject.subscribe(
            res => {
                console.log('this is 订阅的数据', res)
            }
        )
    }

    
    showModal = () => {
        this.isVisible = true;
    }

    currentPageChange () {

    }

    pageSizeChange () {

    }
}
