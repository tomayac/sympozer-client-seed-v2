import { Injectable, Component } from '@angular/core';
import { Config } from '../app-config';
import { ManagerRequest } from "./ManagerRequest";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { resolve } from 'url';

@Injectable()
export class AppointmentService {

  notiCount:any;

  constructor(private managerRequest: ManagerRequest,
    private http: Http) {

  }

  setAppointment(id_publi,sender,receivers) {
    return new Promise((resolve, reject) => {
      console.log("Setting an Appointment");
      if (!id_publi || id_publi.length === 0) {
        return reject('Erreur lors de la récupération de l\'identifiant de la ressource');
      }

      // if (!id_track || id_track.length === 0) {
      //   return reject('Erreur lors de la récupération de l\'identifiant de la track');
      // }
      const that = this;
      // We dont have to check for loggin because user can only see the option when login

      // Set body request for later use
      let bodyRequest = {
        id_publi: id_publi,
        id_sender: sender,
        receiver: receivers
      }

      //have to change the link to an existed api which will handle the appointment service
      // that.managerRequest.post_safe("localhost:8080/Server_Symposer/Appointment", bodyRequest)
      //   .then((Response) => {
      //     if (Response && Response._body) {
      //       console.log(Response);
      //     }
      //   });
      console.log("setAppoint.service.ts")
      that.http.post("http://localhost:8080/Symposer_Serveur/Appointment",bodyRequest)
        .toPromise()
        .then((respone)=>{
          console.log(respone);
        });
    });
  }

  fakelogin(id){
    return new Promise((resolve, reject) => {
      console.log("Logging...");
      const that = this;

      console.log("setAppoint.service.ts")
      that.http.get("http://localhost:8080/Symposer_Serveur/FakeLogin?username="+id)
        .toPromise()
        .then((respone)=>{
          console.log(respone);
        });
    });
  }

  addUser(){
    let bodyRequest = {
      email: "example@email.com",
      id: "someurl.com"
    }
    return new Promise((resolve,reject)=>{
      const that=this;
      that.http.post("http://localhost:8080/Symposer_Serveur/AddUser",bodyRequest)
        .toPromise()
        .then((response)=>{
          console.log(response);
        })
      
    })
  }

}
