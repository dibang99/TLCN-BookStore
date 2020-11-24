  import { Component, OnInit } from '@angular/core';
  import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
  import { Router, ActivatedRoute } from '@angular/router';
  import { BookService } from '../../../../app-services/book-service/book.service';
  import { CategoryService } from '../../../../app-services/category-service/category.service';
  import { AuthorService } from '../../../../app-services/author-service/author.service';
  import { Category } from '../../../../app-services/category-service/category.model';
  import { Author } from '../../../../app-services/author-service/author.model';
  import { Seri } from '../../../../app-services/seri-service/seri.model';
  import { Promotion } from '../../../../app-services/promotion-service/promotion.model';
  import { SeriService } from '../../../../app-services/seri-service/seri.service';
  import { PromotionService } from 'src/app/app-services/promotion-service/promotion.service';
  declare var $: any;
  import Swal from 'sweetalert'
  @Component({
    selector: 'app-update-event',
    templateUrl: './update-event.component.html',
    styleUrls: ['./update-event.component.css']
  })
  export class UpdateEventComponent implements OnInit {
    statusInsert: Boolean = false;
    accountSocial = JSON.parse(localStorage.getItem("accountSocial"));
  
    countryForm: FormGroup;
    // countries = ['USA', 'Canada', 'Uk']
    constructor(private _router: Router, private bookService: BookService, private route: ActivatedRoute,
      private fb: FormBuilder, private categoryService: CategoryService,
      private authorService: AuthorService, private seriService: SeriService, private promotionService: PromotionService) {
      $(function () {
        $(document).ready(function () {
          $("#selectCategory").change(function () {
            var selectedVal = $("#selectCategory option:selected").val();
            alert(selectedVal);
          });
          $("#selectAuthor").change(function () {
            var selectedVal = $("#selectAuthor option:selected").val();
            alert(selectedVal);
          });
        });
      });
    }
    id = this.route.snapshot.paramMap.get('id');
    ngOnInit() {
      
      this.getMinDateTime()
      $(function () {
        $("#scrollToTopButton").click(function () {
          $("html, body").animate({ scrollTop: 0 }, 1000);
        });
  
      });
      this.resetForm();
      this.getPromotionByID(this.id)
  
    }
    getPromotionByID(id){
      this.promotionService.getPromotionById(id).subscribe(promo =>{
        this.promotion = promo as Promotion
        //map show time
        this.valueStart= this.promotion['startDate'].split(" ")[0]
        this.valueEnd=this.promotion['endDate'].split(" ")[0]
        this.minTimeStart= this.promotion['startDate'].split(" ")[1]
        this.minTimeEnd=this.promotion['endDate'].split(" ")[1]
        this.getLinkImgCategory= this.promotion['imgPromotion']
        //map check time
        this.TimeStart = this.minTimeStart
        this.TimeEnd = this.minTimeEnd
        this.DateStart = this.valueStart
        this.DateEnd = this.valueEnd
        if(   this.promotion.isShow=="false"){
          this.promotion.isShow=false
        }else{
          this.promotion.isShow=true
        }
       
        if(this.promotion.listBookIn[0] !="")
        {
          this.IscheckListID=2
          this.promotion.addList=true
          var stringListBookID=""
          for(let index of this.promotion.listBookIn)
          {
            stringListBookID+=index+","
          }
          console.log(stringListBookID.length)
          this.promotion.listBookIn=   stringListBookID.substring(0,stringListBookID.length-1)
          this.checkListID(this.promotion.listBookIn)
        }
      })
    }
    promotion: any
    alertMessage = "";
    alertSucess = false;
    alertFalse = false;
    resetForm(form?: NgForm) {
      if (form)
        form.reset();
      this.promotion = {
        _id: null,
        headerPromotion: "",
        imgPromotion: "",
        detailPromotion: "",
        discount: null,
        ifDiscount: null,
        startDate: "",
        endDate: "",
        listBookIn: null,
        isShow: "",
        addList: "",
      };
    }
    cancel() {
      this._router.navigate(['/manageEvent']);
    }
  
    onSubmit(form: NgForm) {
      Swal({
        text: "Bạn có chắc muốn cập nhật thông tin sự kiện này không ?",
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: {
            value: "OK",
            closeModal: true
          }
        }
      })
        .then((willDelete) => {
          if (willDelete) {
            form.value._id=this.id
      form.value.startDate = this.DateStart + " " + this.TimeStart
      form.value.endDate = this.DateEnd + " " + this.TimeEnd
      if(!form.value.ifDiscount){
      form.value.ifDiscount =""
      }
      if(!form.value.listBookIn){
        form.value.listBookIn =""
        }
        if(!form.value.isShow){
          form.value.isShow ="false"
          }
      if (!this.validate()) {
        this.alertFalse = true;
        setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);

      } else {
        if(form.value.listBookIn!=null){  form.value.listBookIn = form.value.listBookIn.split(",")}
          this.promotionService.putPromotion(form.value).subscribe(
          data => {
            this.promotion = data as Promotion
            this.resetForm()
            this._router.navigate(['/manageEvent']);
          },
          error => console.log(error)
        );
      }
            Swal({
              title: "Đã cập nhật thành công!",
              text: "Thông tin sự kiện đã được cập nhật.",
              icon: 'success'
            });
          }
        });
     
    }
    getLinkImgCategory = "";
    getLinkImg(event: any) {
      this.getLinkImgCategory = event.target.value;
  
    }
  
    logout() {
      localStorage.clear();
      window.location.href = "/homePage";
    }
  
  
    //check validate
    validate() {
      // ifDiscount: null,
      // listBookIn: null,
      // isShow: "",
      // addList:"",
  
      if (this.promotion.headerPromotion == "") {
        this.alertMessage = "Tiêu Đề Không Được Để Trống";
        return false
      }
      if (this.promotion.imgPromotion == "") {
        this.alertMessage = "Hình Ảnh Sự Kiện Không Được Để Trống";
        return false
      }
      if (this.promotion.detailPromotion == "") {
        this.alertMessage = "Thông Tin Sự Kiện Không Được Để Trống";
        return false
      }
      if (this.promotion.discount == null) {
        this.alertMessage = "Mức Giảm Không Được Để Trống";
        return false
      }
      if (this.TimeStart == null) {
        this.alertMessage = "Thời Gian Bắt Đầu Không Được Để Trống";
        return false
      }
      if (this.DateStart == null) {  
        this.alertMessage = "Ngày Bắt Đầu Không Được Để Trống";
        return false
      }
      if (this.TimeEnd == null) {   
        this.alertMessage = "Thời Gian Kết Thúc Không Được Để Trống";
        return false
      }
      if (this.DateEnd == null) {     
        this.alertMessage = "Ngày Kết Thúc Không Được Để Trống";
        return false
      }
      if(this.promotion.ifDiscount=null && this.promotion.listBookIn){
        this.alertMessage = "Điều Kiện Giảm Hoặc Danh Sách Sách Trong Sự Kiện Không Được Để Trống";
        return false
      }
      if(this.IscheckListID!=2 && this.promotion.addList){
        this.alertMessage = "Danh Sách ID Sách Được Áp Dụng Trong Sự Kiện Bị Sai, Nhấn Kiểm Tra Để Xem Lại";
        return false
      }
      if(Date.parse(this.DateStart + " " + this.TimeStart)>=Date.parse(this.DateEnd + " " + this.TimeEnd))
      {
        this.alertMessage = "Thời Gian Bắt Đầu Sự Kiện Phải Nhỏ Hơn Thời Gian Kết Thúc";
        return false
      }
      return true
  
    }
  
  
  
  
    // Xử lý thao tác
    IsSmallImg = true;
    IsBigImg = false;
    IsAveraImg = false;
    radioImgSmall() {
      this.IsSmallImg = true;
      this.IsAveraImg = false;
      this.IsBigImg = false;
    }
    radioImgAvera() {
      this.IsSmallImg = false;
      this.IsAveraImg = true;
      this.IsBigImg = false;
    }
    radioImgBig() {
      this.IsSmallImg = false;
      this.IsAveraImg = false;
      this.IsBigImg = true;
    }
    TimeStart: any
    DateStart: any
    TimeEnd: any
    DateEnd: any
    mindateStart: any
    mindateEnd: any
    minTimeStart: any
    minTimeEnd: any
    valueStart:any
    valueEnd:any
    Listmonth = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" }
    getMinDateTime() {
      var now = new Date();
      var nowSplit = now.toString().split(" ") //hiện tại  
      //min date
      this.mindateStart = nowSplit[3] + '-' + this.Listmonth[nowSplit[1]] + '-' + nowSplit[2]
      if (this.timeStart == null) {
        this.mindateEnd = this.mindateStart
      } else {
        this.mindateEnd = this.DateStart
      }
      //min time
      //   var timeNow=nowSplit[4].split(":")
      //   this.minTimeStart = timeNow[0]+":"+timeNow[1]
      //   if(this.mindateStart==this.DateStart){
      //   this.minTimeStart = timeNow[0]+":"+timeNow[1]
      // }else{
      //   this.minTimeStart="00:00"
      // }
    }
  
    //xử lý date time
    timeStart(event) {
      this.TimeStart = event.target.value
  
    }
    dateStart(event) {
      this.DateStart = event.target.value
      this.getMinDateTime()
    }
    timeEnd(event) {
      this.TimeEnd = event.target.value
    }
    dateEnd(event) {
      this.DateEnd = event.target.value
    }
  
  
  
    //kiểm tra các id sách có đúng ko 
    checkTrueFalseBookID:any
    IscheckListID=0
    dataTrue:any
    dataFalse:any
    arrayListBook:any
    checkListID(event){
      if( event.target.value.trim()==""){
        this.checkTrueFalseBookID=null
        this.IscheckListID=0
        return false
      }
      const listID= event.target.value.split(",")
      this.bookService.CheckExistListBookID(listID).subscribe(data=>{
        this.checkTrueFalseBookID = data 
        this.dataTrue=this.checkTrueFalseBookID["trueData"]
        this.dataFalse=this.checkTrueFalseBookID["falseData"]
        this.arrayListBook=this.checkTrueFalseBookID["array"]
        if(this.checkTrueFalseBookID["falseData"].length!=0){
          this.IscheckListID=1
            return false
        }
        this.IscheckListID=2
        return true
      })
    }
    checkListIDAfterDelete(ListTrue){
      if(ListTrue.trim()==""){
        this.checkTrueFalseBookID=null
        this.IscheckListID=0
        return false
      }
      const listID= ListTrue.split(",")
      this.bookService.CheckExistListBookID(listID).subscribe(data=>{
        this.checkTrueFalseBookID = data 
        this.dataTrue=this.checkTrueFalseBookID["trueData"]
        this.dataFalse=this.checkTrueFalseBookID["falseData"]
        this.arrayListBook=this.checkTrueFalseBookID["array"]
        if(this.checkTrueFalseBookID["falseData"].length!=0){
          this.IscheckListID=1
            return false
        }
        this.IscheckListID=2
        return true
      })
    }
  
    DeleteFalseBookID(){
      var ListTrue=""
      if(this.dataTrue!=null){
      for(let index of this.dataTrue){
        ListTrue=ListTrue.concat(index+",")
      }
    }
    $(function(){
      $('#inputList').val(ListTrue.slice(0, -1));
      console.log( $('#inputList').val())
    })
    this.checkListIDAfterDelete(ListTrue.slice(0, -1))
    }
  }
  