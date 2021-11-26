import { Component, OnInit } from '@angular/core';
import { ConvertUserInfo, ConvertUsers, UserInfo, Users } from "../model/User";
import { RestapiService } from "../restapi.service";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

    activeUser : UserInfo;
    usersList : Users;
    adminAccess : boolean = false;
    activeUserBdayDay : number;
    activeUserBdayMonth : number;
    activeUserBdayYear : number;

    constructor(private service : RestapiService) {}

    ngOnInit() {
        this.service.getUserInfo().subscribe( data => {
            this.activeUser = ConvertUserInfo.toUserInfo(data.toString());

            this.activeUserBdayDay = new Date(this.activeUser.bday.toString()).getDate();
            this.activeUserBdayMonth = new Date(this.activeUser.bday.toString()).getMonth() + 1; //because january - 0-month etc
            this.activeUserBdayYear = new Date(this.activeUser.bday.toString()).getFullYear();

            for(let role of this.activeUser.roles) {
                if(role == "ADMIN") {
                    this.adminAccess = true;
                }
            }

            if(this.adminAccess == true) {
                this.service.getAllUsers().subscribe( data => {
                    this.usersList = ConvertUsers.toUsers(data.toString());
                });
            }

            console.log(this.adminAccess);
        });
    }
}